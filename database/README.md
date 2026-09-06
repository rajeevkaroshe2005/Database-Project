# BOOKSPHERE — Database Architecture & Relational Design

This folder contains the complete, enterprise-grade relational database design for **BOOKSPHERE — Online Booking & Reservation System**, modeled for **MySQL 8.0+**.

---

## 1. Relational Normalization (3NF)

The database schema is normalized up to **Third Normal Form (3NF)**:
1. **1NF (First Normal Form)**:
   - All columns hold atomic values.
   - Repeating groups are eliminated by separating into auxiliary tables (e.g. `passengers`, `booking_items`, `service_amenities`, `seats`, `slots`, `rooms`).
2. **2NF (Second Normal Form)**:
   - All tables have explicit primary keys.
   - All non-key attributes are fully functionally dependent on the complete primary key, eliminating partial dependencies in composite-key entities (such as `booking_coupons` and `seat_reservations_temp`).
3. **3NF (Third Normal Form)**:
   - Transitive dependencies are removed.
   - Address and city information is separated into `locations`.
   - User membership perks are abstracted into `memberships`.
   - Pricing tiers, multipliers, and discounts are computed or referenced through relational foreign keys.

---

## 2. Table Catalog (25 Tables)

| Category | Table Name | Purpose |
|---|---|---|
| **Users & Security** | `users` | Customer profiles, credentials, reward points balance |
| | `admins` | Platform administrators, role permissions, departments |
| | `memberships` | Loyalty tiers (Basic, Silver, Gold, Platinum) with perks |
| **Catalog** | `categories` | Booking verticals (Bus, Flight, Movie, Turf, Hotel, etc.) |
| | `locations` | Geographic hubs, cities (Mumbai, Pune, Bangalore, Delhi, Goa) |
| | `services` | Core bookable catalog items with base pricing, rating, capacity |
| | `service_amenities` | Feature tags (Wi-Fi, IMAX, AstroTurf, Ocean View) |
| | `schedules` | Fixed departure/arrival timetables for transport services |
| **Granular Inventory** | `seats` | Cinema auditorium, bus sleeper, flight cabin seat layouts |
| | `slots` | Sports arena and swimming pool hourly time slots |
| | `rooms` | Hotel room categories, capacity, inventory count |
| | `restaurant_tables` | Dining tables, booth types, and seating capacities |
| **Booking Subsystem** | `seat_reservations_temp`| **5-minute lock** to prevent double-booking during checkout |
| | `bookings` | Primary reservation record with status and price breakdown |
| | `booking_items` | Individual line items attached to a booking |
| | `passengers` | Traveler and guest identity records |
| **Financials** | `payments` | Gateway transaction logs (UPI, Cards, NetBanking) |
| | `refunds` | Cancellation records with refund amounts and fees |
| | `coupons` | Promo codes (`WELCOME10`, `SPORTS20`, `FIRSTBOOK`) |
| | `booking_coupons` | Many-to-many relationship tracking coupon usage |
| **Engagement & Audit** | `reviews` | Verified customer ratings (1-5 stars) and feedback |
| | `reward_points_ledger`| Complete transaction ledger for loyalty points |
| | `notifications` | In-app user notifications (booking, payment, refunds) |
| | `audit_logs` | Immutable audit trail of critical administrative and user actions |
| | `waiting_list` | Queue for customers when a venue or slot is fully booked |

---

## 3. DBMS Concepts Demonstrated

### A. DDL (Data Definition Language)
- Strict table definitions with `ENGINE=InnoDB`, `utf8mb4_unicode_ci` charset.
- Constraints: `PRIMARY KEY`, `FOREIGN KEY ... ON DELETE CASCADE / RESTRICT / SET NULL`, `UNIQUE`, `NOT NULL`, `DEFAULT`.
- `CHECK` constraints (e.g., `CHECK (base_price >= 0)`, `CHECK (rating >= 1.0 AND rating <= 5.0)`).
- Performance indexing on frequently queried columns (`category_id`, `location_id`, `booking_ref`, `status`).

### B. DML & DQL (Data Manipulation & Query Language)
- Multi-table `INNER JOIN` and `LEFT JOIN` operations across 5 tables.
- Aggregation with `GROUP BY`, `HAVING`, `SUM()`, `AVG()`, `COUNT()`.
- Nested subqueries and correlated existence checks.

### C. TCL & ACID Transactions
- Atomic booking creation and cancellation inside Stored Procedures.
- `START TRANSACTION`, `COMMIT`, `ROLLBACK` with `EXIT HANDLER FOR SQLEXCEPTION` ensuring consistency even during mid-transaction failures.

### D. Triggers
- `trg_after_booking_confirmed`: Automatically computes reward points (1 point per ₹100 spent), credits the user balance, writes to `reward_points_ledger`, dispatches an in-app notification, and logs an audit record.
- `trg_audit_service_update`: Automatically captures pricing or operational status changes on any service and writes old vs new JSON values to `audit_logs`.

### E. Stored Procedures
- `sp_check_availability(service_id, check_date, OUT available_units, OUT status)`
- `sp_apply_coupon(coupon_code, amount, OUT discount, OUT status_message)`
- `sp_cancel_booking(booking_id, user_id, reason, OUT refund_amount, OUT status_message)`

### F. Views
- `v_active_services`: Joined catalog presentation view for search and listing.
- `v_booking_summary`: Complete unified booking record with user, payment, and service details.
- `v_category_analytics`: Aggregated financial and volume metrics per vertical.

---

## 4. How to Import in MySQL 8.0+

```bash
# 1. Login to MySQL
mysql -u root -p

# 2. Run schema and seed scripts
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```
Or simply open MySQL Workbench, open `database/schema.sql` and click **Execute (⚡)**, followed by `database/seed.sql`.
