-- =============================================================================
-- BOOKSPHERE — Online Booking & Reservation System
-- Database Schema for MySQL 8.0+
-- Comprehensive Relational Design (3NF Normalized, 25 Tables)
-- Demonstrates DDL, DML, DQL, DCL, TCL, Triggers, Views & Stored Procedures
-- =============================================================================

CREATE DATABASE IF NOT EXISTS booksphere_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE booksphere_db;

-- -----------------------------------------------------------------------------
-- Drop Existing Objects (in reverse dependency order)
-- -----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_after_booking_confirmed;
DROP TRIGGER IF EXISTS trg_after_booking_cancelled;
DROP TRIGGER IF EXISTS trg_audit_service_update;
DROP PROCEDURE IF EXISTS sp_create_booking;
DROP PROCEDURE IF EXISTS sp_cancel_booking;
DROP PROCEDURE IF EXISTS sp_apply_coupon;
DROP PROCEDURE IF EXISTS sp_check_availability;
DROP PROCEDURE IF EXISTS sp_redeem_rewards;
DROP VIEW IF EXISTS v_active_services;
DROP VIEW IF EXISTS v_booking_summary;
DROP VIEW IF EXISTS v_category_analytics;

DROP TABLE IF EXISTS waiting_list;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS reward_points_ledger;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS booking_coupons;
DROP TABLE IF EXISTS coupons;
DROP TABLE IF EXISTS refunds;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS seat_reservations_temp;
DROP TABLE IF EXISTS passengers;
DROP TABLE IF EXISTS booking_items;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS restaurant_tables;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS slots;
DROP TABLE IF EXISTS seats;
DROP TABLE IF EXISTS schedules;
DROP TABLE IF EXISTS service_amenities;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS memberships;

-- =============================================================================
-- 1. USER & AUTHENTICATION SUBSYSTEM
-- =============================================================================

-- Table: memberships (Tiered Loyalty System)
CREATE TABLE memberships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tier_name VARCHAR(50) NOT NULL UNIQUE,
    min_points INT NOT NULL DEFAULT 0,
    discount_pct DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    points_multiplier DECIMAL(3, 1) NOT NULL DEFAULT 1.0,
    perks_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Table: users (Customers)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    membership_id INT NOT NULL DEFAULT 1,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    reward_points INT NOT NULL DEFAULT 150,
    avatar_url VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_membership FOREIGN KEY (membership_id) 
        REFERENCES memberships(id) ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Table: admins (Platform Administrators)
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    role ENUM('super_admin', 'service_manager', 'support_lead', 'finance_officer') NOT NULL DEFAULT 'service_manager',
    department VARCHAR(80) NOT NULL DEFAULT 'Operations',
    permissions JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_admins_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =============================================================================
-- 2. CORE CATALOG & INVENTORY SUBSYSTEM
-- =============================================================================

-- Table: categories (Major Booking Verticals)
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE,
    slug VARCHAR(80) NOT NULL UNIQUE,
    parent_type ENUM('TRANSPORT', 'ENTERTAINMENT', 'SPORTS', 'HOTEL', 'RESTAURANT', 'EXPERIENCE') NOT NULL,
    icon_name VARCHAR(50) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Table: locations (Cities, Venues & Hubs)
CREATE TABLE locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city VARCHAR(80) NOT NULL,
    state VARCHAR(80) NOT NULL,
    country VARCHAR(80) NOT NULL DEFAULT 'India',
    address_line TEXT,
    landmark VARCHAR(120),
    pincode VARCHAR(20),
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Table: services (The Central Entity: Flights, Turfs, Movies, Hotels, Dining)
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    location_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    slug VARCHAR(160) NOT NULL UNIQUE,
    tagline VARCHAR(200),
    description TEXT,
    cover_image VARCHAR(500),
    base_price DECIMAL(10, 2) NOT NULL CHECK (base_price >= 0),
    price_unit VARCHAR(50) NOT NULL DEFAULT 'per ticket',
    rating DECIMAL(3, 2) NOT NULL DEFAULT 4.50 CHECK (rating >= 1.0 AND rating <= 5.0),
    review_count INT NOT NULL DEFAULT 0 CHECK (review_count >= 0),
    capacity_total INT NOT NULL DEFAULT 50,
    status ENUM('active', 'maintenance', 'sold_out', 'inactive') NOT NULL DEFAULT 'active',
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_services_category FOREIGN KEY (category_id) 
        REFERENCES categories(id) ON UPDATE CASCADE,
    CONSTRAINT fk_services_location FOREIGN KEY (location_id) 
        REFERENCES locations(id) ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Table: service_amenities (Tags & Key Features)
CREATE TABLE service_amenities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_id INT NOT NULL,
    amenity_name VARCHAR(80) NOT NULL,
    icon_name VARCHAR(50),
    CONSTRAINT fk_amenities_service FOREIGN KEY (service_id) 
        REFERENCES services(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Table: schedules (Timetables for Transport & Scheduled Events)
CREATE TABLE schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_id INT NOT NULL,
    origin_city VARCHAR(80),
    destination_city VARCHAR(80),
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    operating_days VARCHAR(50) NOT NULL DEFAULT 'All Days',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_schedules_service FOREIGN KEY (service_id) 
        REFERENCES services(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =============================================================================
-- 3. GRANULAR INVENTORY: SEATS, SLOTS, ROOMS & TABLES
-- =============================================================================

-- Table: seats (For Flights, Buses, Cinema Halls, Theatres)
CREATE TABLE seats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_id INT NOT NULL,
    seat_number VARCHAR(20) NOT NULL,
    row_label VARCHAR(10) NOT NULL,
    seat_class ENUM('VIP_RECLINER', 'PLATINUM', 'GOLD', 'SILVER', 'BUSINESS', 'ECONOMY', 'SLEEPER', 'SEATER') NOT NULL,
    price_multiplier DECIMAL(4, 2) NOT NULL DEFAULT 1.00,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE KEY uk_service_seat (service_id, seat_number),
    CONSTRAINT fk_seats_service FOREIGN KEY (service_id) 
        REFERENCES services(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Table: slots (For Sports Arenas, Courts, Turf, Swimming Pools)
CREATE TABLE slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_id INT NOT NULL,
    slot_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    capacity INT NOT NULL DEFAULT 1,
    booked_count INT NOT NULL DEFAULT 0,
    price_override DECIMAL(10, 2) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE KEY uk_service_slot (service_id, slot_date, start_time),
    CONSTRAINT fk_slots_service FOREIGN KEY (service_id) 
        REFERENCES services(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Table: rooms (For Hotel & Resort Bookings)
CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_id INT NOT NULL,
    room_type VARCHAR(80) NOT NULL,
    max_guests INT NOT NULL DEFAULT 2,
    bed_type VARCHAR(50) DEFAULT 'King Bed',
    price_per_night DECIMAL(10, 2) NOT NULL,
    total_inventory INT NOT NULL DEFAULT 5,
    available_count INT NOT NULL DEFAULT 5,
    amenities_summary VARCHAR(255),
    CONSTRAINT fk_rooms_service FOREIGN KEY (service_id) 
        REFERENCES services(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Table: restaurant_tables (For Dining Reservations)
CREATE TABLE restaurant_tables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_id INT NOT NULL,
    table_number VARCHAR(20) NOT NULL,
    seating_capacity INT NOT NULL DEFAULT 4,
    table_type ENUM('Window View', 'Cozy Booth', 'Outdoor Terrace', 'Private Dining', 'Standard') NOT NULL DEFAULT 'Standard',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE KEY uk_service_table (service_id, table_number),
    CONSTRAINT fk_tables_service FOREIGN KEY (service_id) 
        REFERENCES services(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =============================================================================
-- 4. BOOKING ENGINE & TEMPORARY LOCKING
-- =============================================================================

-- Table: seat_reservations_temp (5-Minute Hold to Prevent Double Booking)
CREATE TABLE seat_reservations_temp (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_id INT NOT NULL,
    user_id INT NOT NULL,
    resource_type ENUM('SEAT', 'SLOT', 'ROOM', 'TABLE') NOT NULL,
    resource_id VARCHAR(50) NOT NULL,
    reservation_date DATE NOT NULL,
    reserved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    status ENUM('HELD', 'CONFIRMED', 'EXPIRED') NOT NULL DEFAULT 'HELD',
    INDEX idx_temp_expiry (expires_at, status),
    CONSTRAINT fk_temp_service FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    CONSTRAINT fk_temp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table: bookings (Unified Reservation Order)
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_ref VARCHAR(40) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    service_id INT NOT NULL,
    booking_type ENUM('TRANSPORT', 'ENTERTAINMENT', 'SPORTS', 'HOTEL', 'RESTAURANT', 'EXPERIENCE') NOT NULL,
    booking_date DATE NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time VARCHAR(50) NOT NULL,
    guest_count INT NOT NULL DEFAULT 1,
    base_amount DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    tax_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    service_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    final_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled', 'refunded') NOT NULL DEFAULT 'pending',
    qr_code_token VARCHAR(100) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON UPDATE CASCADE,
    CONSTRAINT fk_bookings_service FOREIGN KEY (service_id) 
        REFERENCES services(id) ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Table: booking_items (Granular line items in a booking)
CREATE TABLE booking_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    item_type ENUM('SEAT', 'SLOT', 'ROOM', 'TABLE', 'GENERAL_ADMISSION') NOT NULL,
    item_ref VARCHAR(50) NOT NULL,
    item_label VARCHAR(100) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    CONSTRAINT fk_booking_items FOREIGN KEY (booking_id) 
        REFERENCES bookings(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Table: passengers (Passenger / Attendee / Guest Details)
CREATE TABLE passengers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    age INT,
    gender ENUM('Male', 'Female', 'Other'),
    seat_or_ticket_number VARCHAR(30),
    contact_phone VARCHAR(20),
    CONSTRAINT fk_passengers_booking FOREIGN KEY (booking_id) 
        REFERENCES bookings(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =============================================================================
-- 5. PAYMENT, REFUND & COUPON SUBSYSTEM
-- =============================================================================

-- Table: payments (Payment Gateway Log)
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    payment_ref VARCHAR(50) NOT NULL UNIQUE,
    booking_id INT NOT NULL,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'NET_BANKING', 'WALLET', 'CASH') NOT NULL,
    transaction_id VARCHAR(100) NOT NULL UNIQUE,
    status ENUM('pending', 'processing', 'success', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    gateway_response JSON,
    paid_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payments_booking FOREIGN KEY (booking_id) 
        REFERENCES bookings(id) ON UPDATE CASCADE,
    CONSTRAINT fk_payments_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Table: refunds (Cancellation & Refund Processing)
CREATE TABLE refunds (
    id INT AUTO_INCREMENT PRIMARY KEY,
    refund_ref VARCHAR(50) NOT NULL UNIQUE,
    booking_id INT NOT NULL,
    payment_id INT NOT NULL,
    original_amount DECIMAL(10, 2) NOT NULL,
    cancellation_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    refund_amount DECIMAL(10, 2) NOT NULL,
    refund_status ENUM('pending', 'processed', 'failed') NOT NULL DEFAULT 'pending',
    refund_reason VARCHAR(255),
    processed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_refunds_booking FOREIGN KEY (booking_id) 
        REFERENCES bookings(id) ON UPDATE CASCADE,
    CONSTRAINT fk_refunds_payment FOREIGN KEY (payment_id) 
        REFERENCES payments(id) ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Table: coupons (Promotional Discounts)
CREATE TABLE coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(30) NOT NULL UNIQUE,
    description VARCHAR(200),
    discount_type ENUM('PERCENTAGE', 'FIXED_AMOUNT') NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL CHECK (discount_value > 0),
    min_spend DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    max_discount DECIMAL(10, 2) NULL,
    usage_limit INT NOT NULL DEFAULT 1000,
    times_used INT NOT NULL DEFAULT 0,
    valid_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;

-- Table: booking_coupons (Association Table)
CREATE TABLE booking_coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    coupon_id INT NOT NULL,
    discount_applied DECIMAL(10, 2) NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_booking_coupon (booking_id, coupon_id),
    CONSTRAINT fk_bc_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    CONSTRAINT fk_bc_coupon FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =============================================================================
-- 6. REVIEWS, REWARDS, NOTIFICATIONS & AUDIT TRAILS
-- =============================================================================

-- Table: reviews (User Ratings and Testimonials)
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_id INT NOT NULL,
    user_id INT NOT NULL,
    booking_id INT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(100),
    review_text TEXT NOT NULL,
    is_verified_booking BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reviews_service FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_reviews_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Table: reward_points_ledger (Loyalty Points Tracking)
CREATE TABLE reward_points_ledger (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    booking_id INT NULL,
    points_change INT NOT NULL,
    transaction_type ENUM('EARNED', 'REDEEMED', 'EXPIRED', 'PROMOTIONAL_BONUS') NOT NULL,
    balance_after INT NOT NULL,
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rewards_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_rewards_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Table: notifications (User In-App Notifications)
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(120) NOT NULL,
    message TEXT NOT NULL,
    notification_type ENUM('BOOKING', 'PAYMENT', 'REFUND', 'WAITING_LIST', 'REWARDS', 'PROMOTION') NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    action_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table: audit_logs (Enterprise Action Tracker)
CREATE TABLE audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    action_type VARCHAR(60) NOT NULL,
    entity_name VARCHAR(60) NOT NULL,
    entity_id VARCHAR(60) NOT NULL,
    details JSON,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Table: waiting_list (When Service is Fully Booked)
CREATE TABLE waiting_list (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_id INT NOT NULL,
    user_id INT NOT NULL,
    desired_date DATE NOT NULL,
    desired_slot VARCHAR(50),
    party_size INT NOT NULL DEFAULT 1,
    status ENUM('WAITING', 'NOTIFIED', 'CONVERTED', 'EXPIRED') NOT NULL DEFAULT 'WAITING',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_waiting_service FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    CONSTRAINT fk_waiting_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =============================================================================
-- 7. PERFORMANCE INDEXES
-- =============================================================================
CREATE INDEX idx_services_category_location ON services(category_id, location_id, status);
CREATE INDEX idx_services_featured ON services(is_featured, rating);
CREATE INDEX idx_bookings_user_status ON bookings(user_id, status);
CREATE INDEX idx_bookings_ref ON bookings(booking_ref);
CREATE INDEX idx_payments_booking ON payments(booking_id, status);
CREATE INDEX idx_audit_created ON audit_logs(created_at);

-- =============================================================================
-- 8. DATABASE VIEWS
-- =============================================================================

-- View 1: v_active_services (Enriched catalog view with category and location)
CREATE OR REPLACE VIEW v_active_services AS
SELECT 
    s.id AS service_id,
    s.title,
    s.slug,
    s.tagline,
    s.cover_image,
    s.base_price,
    s.price_unit,
    s.rating,
    s.review_count,
    s.status,
    s.is_featured,
    c.id AS category_id,
    c.name AS category_name,
    c.parent_type,
    c.icon_name AS category_icon,
    l.id AS location_id,
    l.city,
    l.state,
    l.country
FROM services s
JOIN categories c ON s.category_id = c.id
JOIN locations l ON s.location_id = l.id
WHERE s.status = 'active';

-- View 2: v_booking_summary (Detailed booking view for user and admin reporting)
CREATE OR REPLACE VIEW v_booking_summary AS
SELECT 
    b.id AS booking_id,
    b.booking_ref,
    b.user_id,
    u.full_name AS customer_name,
    u.email AS customer_email,
    u.phone AS customer_phone,
    s.id AS service_id,
    s.title AS service_title,
    c.parent_type AS category_group,
    l.city AS service_city,
    b.booking_date,
    b.scheduled_date,
    b.scheduled_time,
    b.guest_count,
    b.final_amount,
    b.status AS booking_status,
    b.qr_code_token,
    p.payment_method,
    p.status AS payment_status,
    p.transaction_id,
    b.created_at
FROM bookings b
JOIN users u ON b.user_id = u.id
JOIN services s ON b.service_id = s.id
JOIN categories c ON s.category_id = c.id
JOIN locations l ON s.location_id = l.id
LEFT JOIN payments p ON b.id = p.booking_id;

-- View 3: v_category_analytics (Category performance aggregate report)
CREATE OR REPLACE VIEW v_category_analytics AS
SELECT 
    c.parent_type AS category_group,
    c.name AS category_name,
    COUNT(DISTINCT s.id) AS total_services,
    COUNT(DISTINCT b.id) AS total_bookings,
    COALESCE(SUM(b.final_amount), 0.00) AS total_revenue,
    COALESCE(AVG(b.final_amount), 0.00) AS avg_booking_value,
    AVG(s.rating) AS avg_rating
FROM categories c
LEFT JOIN services s ON c.id = s.category_id
LEFT JOIN bookings b ON s.id = b.service_id AND b.status IN ('confirmed', 'completed')
GROUP BY c.parent_type, c.name;

-- =============================================================================
-- 9. STORED PROCEDURES
-- =============================================================================

DELIMITER $$

-- Procedure 1: sp_check_availability
CREATE PROCEDURE sp_check_availability(
    IN p_service_id INT,
    IN p_check_date DATE,
    OUT p_available_units INT,
    OUT p_status VARCHAR(30)
)
BEGIN
    DECLARE total_cap INT DEFAULT 0;
    DECLARE active_bookings INT DEFAULT 0;

    SELECT capacity_total INTO total_cap 
    FROM services WHERE id = p_service_id;

    SELECT COUNT(*) INTO active_bookings 
    FROM bookings 
    WHERE service_id = p_service_id 
      AND scheduled_date = p_check_date 
      AND status IN ('pending', 'confirmed');

    SET p_available_units = GREATEST(0, total_cap - active_bookings);

    IF p_available_units > 0 THEN
        SET p_status = 'AVAILABLE';
    ELSE
        SET p_status = 'SOLD_OUT';
    END IF;
END$$

-- Procedure 2: sp_apply_coupon
CREATE PROCEDURE sp_apply_coupon(
    IN p_coupon_code VARCHAR(30),
    IN p_amount DECIMAL(10, 2),
    OUT p_discount DECIMAL(10, 2),
    OUT p_status_message VARCHAR(100)
)
BEGIN
    DECLARE v_id INT;
    DECLARE v_type ENUM('PERCENTAGE', 'FIXED_AMOUNT');
    DECLARE v_val DECIMAL(10, 2);
    DECLARE v_min DECIMAL(10, 2);
    DECLARE v_max DECIMAL(10, 2);
    DECLARE v_limit INT;
    DECLARE v_used INT;
    DECLARE v_until TIMESTAMP;

    SET p_discount = 0.00;

    SELECT id, discount_type, discount_value, min_spend, max_discount, usage_limit, times_used, valid_until
    INTO v_id, v_type, v_val, v_min, v_max, v_limit, v_used, v_until
    FROM coupons 
    WHERE code = p_coupon_code AND is_active = TRUE;

    IF v_id IS NULL THEN
        SET p_status_message = 'INVALID_COUPON';
    ELSEIF NOW() > v_until THEN
        SET p_status_message = 'EXPIRED_COUPON';
    ELSEIF v_used >= v_limit THEN
        SET p_status_message = 'USAGE_LIMIT_EXCEEDED';
    ELSEIF p_amount < v_min THEN
        SET p_status_message = 'MINIMUM_SPEND_NOT_MET';
    ELSE
        IF v_type = 'PERCENTAGE' THEN
            SET p_discount = (p_amount * v_val) / 100.00;
            IF v_max IS NOT NULL AND p_discount > v_max THEN
                SET p_discount = v_max;
            END IF;
        ELSE
            SET p_discount = LEAST(v_val, p_amount);
        END IF;
        SET p_status_message = 'SUCCESS';
    END IF;
END$$

-- Procedure 3: sp_cancel_booking (ACID Transaction Demonstration)
CREATE PROCEDURE sp_cancel_booking(
    IN p_booking_id INT,
    IN p_user_id INT,
    IN p_reason VARCHAR(255),
    OUT p_refund_amount DECIMAL(10, 2),
    OUT p_status_message VARCHAR(100)
)
proc_label: BEGIN
    DECLARE v_final_amt DECIMAL(10, 2);
    DECLARE v_current_status VARCHAR(30);
    DECLARE v_payment_id INT;
    DECLARE v_canc_fee DECIMAL(10, 2);
    DECLARE v_new_refund_ref VARCHAR(50);

    -- Declare rollback handler for ACID guarantee
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_refund_amount = 0.00;
        SET p_status_message = 'TRANSACTION_ERROR_ROLLBACK';
    END;

    START TRANSACTION;

    SELECT final_amount, status INTO v_final_amt, v_current_status
    FROM bookings 
    WHERE id = p_booking_id AND user_id = p_user_id;

    IF v_current_status IS NULL THEN
        SET p_status_message = 'BOOKING_NOT_FOUND';
        ROLLBACK;
        LEAVE proc_label;
    END IF;

    IF v_current_status != 'confirmed' THEN
        SET p_status_message = 'BOOKING_NOT_ELIGIBLE_FOR_CANCELLATION';
        ROLLBACK;
        LEAVE proc_label;
    END IF;

    -- Standard 10% cancellation fee policy
    SET v_canc_fee = ROUND(v_final_amt * 0.10, 2);
    SET p_refund_amount = v_final_amt - v_canc_fee;
    SET v_new_refund_ref = CONCAT('RF-', FLOOR(100000 + (RAND() * 900000)));

    SELECT id INTO v_payment_id FROM payments WHERE booking_id = p_booking_id LIMIT 1;

    -- Update booking status
    UPDATE bookings SET status = 'cancelled' WHERE id = p_booking_id;

    -- Insert refund record
    IF v_payment_id IS NOT NULL THEN
        INSERT INTO refunds (refund_ref, booking_id, payment_id, original_amount, cancellation_fee, refund_amount, refund_status, refund_reason, processed_at)
        VALUES (v_new_refund_ref, p_booking_id, v_payment_id, v_final_amt, v_canc_fee, p_refund_amount, 'processed', p_reason, NOW());
        
        UPDATE payments SET status = 'refunded' WHERE id = v_payment_id;
    END IF;

    -- Log to audit trail
    INSERT INTO audit_logs (user_id, action_type, entity_name, entity_id, details)
    VALUES (p_user_id, 'CANCEL_BOOKING', 'bookings', CAST(p_booking_id AS CHAR), 
            JSON_OBJECT('reason', p_reason, 'refund_amount', p_refund_amount, 'fee', v_canc_fee));

    COMMIT;
    SET p_status_message = 'SUCCESS';
END$$

DELIMITER ;

-- =============================================================================
-- 10. DATABASE TRIGGERS
-- =============================================================================

DELIMITER $$

-- Trigger 1: Automatic notification and loyalty points upon booking confirmation
CREATE TRIGGER trg_after_booking_confirmed
AFTER UPDATE ON bookings
FOR EACH ROW
BEGIN
    DECLARE v_points_earned INT;

    -- If booking transitioned to confirmed
    IF OLD.status != 'confirmed' AND NEW.status = 'confirmed' THEN
        -- Reward 1 point for every 100 INR spent
        SET v_points_earned = FLOOR(NEW.final_amount / 100);

        IF v_points_earned > 0 THEN
            UPDATE users 
            SET reward_points = reward_points + v_points_earned 
            WHERE id = NEW.user_id;

            INSERT INTO reward_points_ledger (user_id, booking_id, points_change, transaction_type, balance_after, description)
            SELECT NEW.user_id, NEW.id, v_points_earned, 'EARNED', reward_points, 
                   CONCAT('Points earned on Booking #', NEW.booking_ref)
            FROM users WHERE id = NEW.user_id;
        END IF;

        -- Create in-app notification
        INSERT INTO notifications (user_id, title, message, notification_type, action_url)
        VALUES (NEW.user_id, 'Booking Confirmed! 🎉', 
                CONCAT('Your reservation ', NEW.booking_ref, ' is confirmed. Tap to view pass & QR ticket.'),
                'BOOKING', CONCAT('/my-bookings?ref=', NEW.booking_ref));

        -- Record in audit log
        INSERT INTO audit_logs (user_id, action_type, entity_name, entity_id, details)
        VALUES (NEW.user_id, 'CONFIRM_BOOKING', 'bookings', CAST(NEW.id AS CHAR),
                JSON_OBJECT('amount', NEW.final_amount, 'ref', NEW.booking_ref));
    END IF;
END$$

-- Trigger 2: Audit log whenever service price or status changes
CREATE TRIGGER trg_audit_service_update
AFTER UPDATE ON services
FOR EACH ROW
BEGIN
    IF OLD.base_price != NEW.base_price OR OLD.status != NEW.status THEN
        INSERT INTO audit_logs (user_id, action_type, entity_name, entity_id, details)
        VALUES (1, 'UPDATE_SERVICE', 'services', CAST(NEW.id AS CHAR),
                JSON_OBJECT('old_price', OLD.base_price, 'new_price', NEW.base_price,
                            'old_status', OLD.status, 'new_status', NEW.status));
    END IF;
END$$

DELIMITER ;
