-- =============================================================================
-- BOOKSPHERE — Online Booking & Reservation System
-- Comprehensive Realistic Seed Data for MySQL 8.0+
-- Indian Metros & INR Pricing (Mumbai, Pune, Bangalore, Delhi, Goa, Hyderabad)
-- =============================================================================

USE booksphere_db;

SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1. Memberships
-- -----------------------------------------------------------------------------
INSERT INTO memberships (id, tier_name, min_points, discount_pct, points_multiplier, perks_description) VALUES
(1, 'Basic Explorer', 0, 0.00, 1.0, 'Standard access to all bookings, 1 point per ₹100 spent, standard cancellation.'),
(2, 'Silver Voyager', 250, 5.00, 1.25, '5% flat discount on select bookings, 1.25x reward points, free seat selection.'),
(3, 'Gold Elite', 750, 10.00, 1.5, '10% discount across services, 1.5x points, priority check-in, free cancellation up to 4 hrs.'),
(4, 'Platinum Concierge', 1500, 15.00, 2.0, '15% VIP discount, 2.0x points, 24/7 dedicated support, complimentary upgrades.');

-- -----------------------------------------------------------------------------
-- 2. Users & Admins (Passwords hashed or demo ready)
-- -----------------------------------------------------------------------------
INSERT INTO users (id, membership_id, full_name, email, password_hash, phone, reward_points, avatar_url) VALUES
(1, 4, 'Aarav Sharma (Admin)', 'admin@booksphere.com', '$2b$10$w1B072o.i57.W3M9o5B1/O/wG5Kk5Q84u8yvT2j8Fj3s9Y8v2m9aO', '+91 98201 12345', 2450, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'),
(2, 3, 'Priya Nair', 'priya.nair@example.com', '$2b$10$w1B072o.i57.W3M9o5B1/O/wG5Kk5Q84u8yvT2j8Fj3s9Y8v2m9aO', '+91 98450 67890', 890, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'),
(3, 2, 'Rohan Verma', 'rohan.verma@example.com', '$2b$10$w1B072o.i57.W3M9o5B1/O/wG5Kk5Q84u8yvT2j8Fj3s9Y8v2m9aO', '+91 97110 34567', 410, 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80'),
(4, 1, 'Ananya Deshmukh', 'ananya.d@example.com', '$2b$10$w1B072o.i57.W3M9o5B1/O/wG5Kk5Q84u8yvT2j8Fj3s9Y8v2m9aO', '+91 99300 89123', 180, 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80'),
(5, 3, 'Vikramaditya Rao', 'vikram.rao@example.com', '$2b$10$w1B072o.i57.W3M9o5B1/O/wG5Kk5Q84u8yvT2j8Fj3s9Y8v2m9aO', '+91 96190 45678', 920, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'),
(6, 2, 'Sneha Iyer', 'sneha.iyer@example.com', '$2b$10$w1B072o.i57.W3M9o5B1/O/wG5Kk5Q84u8yvT2j8Fj3s9Y8v2m9aO', '+91 94440 23456', 320, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'),
(7, 1, 'Kabir Mehta', 'kabir.mehta@example.com', '$2b$10$w1B072o.i57.W3M9o5B1/O/wG5Kk5Q84u8yvT2j8Fj3s9Y8v2m9aO', '+91 98212 98765', 75, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'),
(8, 2, 'Tanvi Kulkarni', 'tanvi.k@example.com', '$2b$10$w1B072o.i57.W3M9o5B1/O/wG5Kk5Q84u8yvT2j8Fj3s9Y8v2m9aO', '+91 98670 12890', 290, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'),
(9, 4, 'Siddharth Sen', 'siddharth.sen@example.com', '$2b$10$w1B072o.i57.W3M9o5B1/O/wG5Kk5Q84u8yvT2j8Fj3s9Y8v2m9aO', '+91 98300 77665', 1840, 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80'),
(10, 1, 'Kavya Reddy', 'kavya.reddy@example.com', '$2b$10$w1B072o.i57.W3M9o5B1/O/wG5Kk5Q84u8yvT2j8Fj3s9Y8v2m9aO', '+91 99490 55443', 140, 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80'),
(11, 2, 'Aditya Chawla', 'aditya.c@example.com', '$2b$10$w1B072o.i57.W3M9o5B1/O/wG5Kk5Q84u8yvT2j8Fj3s9Y8v2m9aO', '+91 98101 22334', 360, 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80'),
(12, 1, 'Meera Nambiar', 'meera.n@example.com', '$2b$10$w1B072o.i57.W3M9o5B1/O/wG5Kk5Q84u8yvT2j8Fj3s9Y8v2m9aO', '+91 94470 99887', 50, 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80');

INSERT INTO admins (id, user_id, role, department, permissions) VALUES
(1, 1, 'super_admin', 'Executive & Platform Engineering', '{"all": true, "manage_services": true, "manage_finances": true, "manage_users": true}'),
(2, 5, 'service_manager', 'Sports & Entertainment Verticals', '{"manage_services": true, "view_analytics": true}'),
(3, 9, 'finance_officer', 'Reconciliation & Refunds', '{"manage_refunds": true, "view_payments": true}'),
(4, 3, 'support_lead', 'Customer Support & Dispatches', '{"view_bookings": true, "manage_tickets": true}'),
(5, 2, 'service_manager', 'Hospitality & Luxury Travel', '{"manage_services": true, "edit_promotions": true}');

-- -----------------------------------------------------------------------------
-- 3. Categories & Verticals
-- -----------------------------------------------------------------------------
INSERT INTO categories (id, name, slug, parent_type, icon_name, description) VALUES
(1, 'Express Bus', 'bus', 'TRANSPORT', 'Bus', 'Luxury Sleeper, Volvo Multi-Axle and Intercity express coaches.'),
(2, 'High-Speed Rail', 'train', 'TRANSPORT', 'Train', 'Vande Bharat, Tejas Express and superfast luxury trains.'),
(3, 'Domestic Flights', 'flight', 'TRANSPORT', 'Plane', 'Non-stop premium and economy flights connecting major metro hubs.'),
(4, 'Chauffeur Cab', 'cab', 'TRANSPORT', 'Car', 'Intercity cabs, city rentals, airport transfers with professional drivers.'),
(5, 'Blockbuster Movies', 'movie', 'ENTERTAINMENT', 'Film', 'IMAX 3D, 4DX, Dolby Atmos screenings in luxury recliner auditoriums.'),
(6, 'Standup Comedy', 'comedy', 'ENTERTAINMENT', 'Mic', 'Live standup specials, comedy festivals, and improv nights.'),
(7, 'Live Music & Concerts', 'concert', 'ENTERTAINMENT', 'Music', 'Arena stadium concerts, indie music festivals, acoustic evenings.'),
(8, 'Theatre & Drama', 'theatre', 'ENTERTAINMENT', 'Drama', 'Broadway style drama, classical musicals, and experimental plays.'),
(9, 'Football & Box Turf', 'turf', 'SPORTS', 'Trophy', 'FIFA standard artificial turf for 5v5 / 7v7 football and box cricket.'),
(10, 'Olympic Swimming Pool', 'pool', 'SPORTS', 'Waves', 'Temperature-controlled Olympic lap pools and leisure swimming slots.'),
(11, 'Cricket Grounds', 'ground', 'SPORTS', 'Shield', 'Full-size cricket turf pitches with pavilion, floodlights, and umpire support.'),
(12, 'Badminton & Tennis', 'court', 'SPORTS', 'Activity', 'Indoor wooden/synthetic badminton courts and clay/hard tennis courts.'),
(13, 'Luxury Hotels & Villas', 'hotel', 'HOTEL', 'Building', '5-star boutique hotels, ocean-facing pool villas, and heritage retreats.'),
(14, 'Fine Dining & Rooftops', 'restaurant', 'RESTAURANT', 'Utensils', 'Chef-curated culinary dining, rooftop bistros, and reserved lounges.'),
(15, 'Theme & Amusement Parks', 'themepark', 'EXPERIENCE', 'Sparkles', 'High-adrenaline roller coasters, wave pools, and immersive theme parks.');

-- -----------------------------------------------------------------------------
-- 4. Locations (Major Indian Metros & Destinations)
-- -----------------------------------------------------------------------------
INSERT INTO locations (id, city, state, country, address_line, landmark, pincode, latitude, longitude) VALUES
(1, 'Mumbai', 'Maharashtra', 'India', 'Bandra Kurla Complex & Nariman Point', 'Near Jio World Drive', '400051', 19.0664, 72.8687),
(2, 'Pune', 'Maharashtra', 'India', 'Koregaon Park & Balewadi Sports Complex', 'Near Phoenix Mall Viman Nagar', '411001', 18.5204, 73.8567),
(3, 'Bengaluru', 'Karnataka', 'India', 'Indiranagar & Whitefield Tech Corridor', 'Near MG Road Metro', '560001', 12.9716, 77.5946),
(4, 'Delhi NCR', 'Delhi', 'India', 'Connaught Place & Cyber City Gurugram', 'Near India Gate', '110001', 28.6139, 77.2090),
(5, 'Goa', 'Goa', 'India', 'Calangute, Vagator & Candolim Beachfront', 'Near Aguada Fort', '403515', 15.2993, 74.1240),
(6, 'Hyderabad', 'Telangana', 'India', 'Gachibowli Financial District & Banjara Hills', 'Near HITEC City', '500081', 17.3850, 78.4867),
(7, 'Chennai', 'Tamil Nadu', 'India', 'ECR Beach Road & Nungambakkam', 'Near Marina Promenade', '600006', 13.0827, 80.2707);

-- -----------------------------------------------------------------------------
-- 5. Services (Catalog covering all verticals with INR pricing)
-- -----------------------------------------------------------------------------
INSERT INTO services (id, category_id, location_id, title, slug, tagline, description, cover_image, base_price, price_unit, rating, review_count, capacity_total, status, is_featured) VALUES
-- Transport
(1, 3, 1, 'SkyWings Air — Mumbai to Bengaluru (Direct)', 'skywings-bom-blr', 'Luxury Boeing 787 Dreamliner Experience', 'Non-stop ultra-smooth flight with complimentary gourmet meal, generous 25kg luggage allowance, and Wi-Fi onboard.', 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80', 4499.00, 'per seat', 4.85, 342, 180, 'active', TRUE),
(2, 2, 1, 'Vande Bharat Express — Mumbai to Pune (VistaDome)', 'vande-bharat-bom-pune', 'High Speed Panoramic Western Ghats Journey', 'Experience 160 km/h cruising through scenic Bhor Ghat tunnels with 180-degree rotating plush leather seats and executive dining.', 'https://images.unsplash.com/photo-1532103054090-a3392330ec55?auto=format&fit=crop&w=800&q=80', 780.00, 'per passenger', 4.90, 520, 112, 'active', TRUE),
(3, 1, 2, 'IntrCity SmartBus — Pune to Goa Sleeper', 'intrcity-pune-goa', 'Safe, Sanitized AC Sleeper with Onboard Washroom', 'Private double/single pods with high-density mattress, personal infotainment tablet, charging ports, and certified safety crew.', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80', 1150.00, 'per berth', 4.72, 189, 36, 'active', FALSE),
(4, 4, 1, 'UrbanDrive Premium Intercity Chauffeur Cab', 'urbandrive-cab-mumbai', 'Airport & Outstation Luxury Mercedes/Innova Crysta', 'Chauffeur-driven executive sedans and MPVs with sanitized interiors, live GPS tracking, zero cancellation surcharge.', 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80', 2800.00, 'per trip', 4.80, 145, 20, 'active', FALSE),
(5, 3, 4, 'IndiAura Express — Delhi to Goa Coastal Flight', 'indiaura-del-goa', 'Direct Sunset Flight with Complimentary Beverage', 'Reach the sun-kissed beaches of Goa in just 2.5 hours. Priority boarding and extra legroom options available.', 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80', 5299.00, 'per seat', 4.78, 298, 160, 'active', TRUE),

-- Entertainment
(6, 5, 1, 'PVR INOX IMAX with Laser — Oppenheimer Revival', 'imax-laser-mumbai', 'India’s Premier 1.43:1 Giant Screen with 12-Channel Audio', 'Experience film mastery in grand scale with crystal clear 4K laser projection, dual-motor plush recliners, and in-seat dining.', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80', 480.00, 'per ticket', 4.92, 610, 240, 'active', TRUE),
(7, 6, 3, 'Zakir Khan Live — "Tathastu" Arena Tour Bangalore', 'zakir-khan-live-blr', '2 Hours of Non-stop Heartfelt & Relatable Laughs', 'The Sakht Launda returns to the Silicon City with his hit stadium comedy special filled with nostalgia, laughter, and family anecdotes.', 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=800&q=80', 1299.00, 'per seat', 4.95, 870, 1200, 'active', TRUE),
(8, 7, 1, 'Sunburn Arena — Martin Garrix World Tour Mumbai', 'sunburn-garrix-mumbai', 'Mesmerizing Visuals, Lasers, and High-Energy EDM', 'The biggest dance music spectacle of the season at Mahalaxmi Racecourse with massive LED production, fireworks, and stellar openers.', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80', 2499.00, 'per pass', 4.88, 1420, 5000, 'active', TRUE),
(9, 8, 4, 'Mughal-e-Azam: The Grand Musical Spectacular', 'mughal-e-azam-delhi', 'Feroz Abbas Khan’s Award-Winning Theatre Drama', 'Broadway-scale musical with 350+ cast members, Manish Malhotra costumes, Kathak choreography, and live acoustic singing.', 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80', 1800.00, 'per seat', 4.91, 310, 450, 'active', FALSE),

-- Sports
(10, 9, 1, 'KickOff Pro 7v7 FIFA AstroTurf BKC', 'kickoff-7v7-turf-bkc', 'Floodlit Brazilian AstroTurf with Dugouts & Showers', 'Premium 50mm shock-absorbent artificial grass turf with night floodlights, bibs, tournament-grade footballs, and mineral water.', 'https://images.unsplash.com/photo-1529900244469-990ff95a23f4?auto=format&fit=crop&w=800&q=80', 1400.00, 'per hour', 4.86, 230, 24, 'active', TRUE),
(11, 10, 3, 'Aquatica Olympic Temperature-Controlled Lap Pool', 'aquatica-pool-blr', 'Fina Standard 50m Ozone-Treated Swimming Arena', 'Pristine crystal-clear waters maintained at optimal 26°C with electronic touchpads, trained lifeguards, sauna, and steam lounge.', 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80', 450.00, 'per 90-min slot', 4.79, 175, 30, 'active', FALSE),
(12, 11, 2, 'DY Patil Super Cricket Turf & Pavilion', 'dy-patil-cricket-ground', 'Lush Outfield, Pitch Matting, and Digital Scoreboard', 'Play competitive leather or tennis ball cricket on an expansive ground with full LED floodlight array and comfortable pavilion.', 'https://images.unsplash.com/photo-1531415074868-036b1c57e329?auto=format&fit=crop&w=800&q=80', 3500.00, 'per match slot', 4.88, 118, 22, 'active', TRUE),
(13, 12, 6, 'Gachibowli Badminton Academy — Teakwood Courts', 'gachibowli-badminton-courts', 'BWF Approved 4-Court Badminton Complex with Air Conditioning', 'High-grip Yonex approved wooden courts with glare-free overhead LED lighting, Yonex shuttlecock dispenser, and warm-up track.', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80', 600.00, 'per court/hr', 4.82, 192, 16, 'active', FALSE),

-- Hotel & Stay
(14, 13, 5, 'The Azure Bay Cliffside Pool Villa — North Goa', 'azure-bay-villa-goa', 'Private Infinity Pool Overlooking the Arabian Sea', 'Exclusive 3-bedroom luxury villa perched atop Vagator cliffs with private butler, sunset deck, jacuzzi, and complimentary brunch.', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80', 14999.00, 'per night', 4.96, 215, 8, 'active', TRUE),
(15, 13, 1, 'The Grand Palace Heritage Suite — Colaba Mumbai', 'grand-palace-mumbai', 'Colonial Elegance with 21st Century High-Tech Comforts', 'Spacious royal suites with Italian marble baths, sea-view balcony, 24-hour concierge, and private marina yacht access.', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', 18500.00, 'per night', 4.93, 380, 25, 'active', TRUE),
(16, 13, 3, 'Silicon Woods Eco-Resort & Spa Bangalore', 'silicon-woods-blr', 'Lush Tropical Canopy Cottages with Ayurvedic Spa', 'Retreat into 25 acres of verdant nature just 40 mins from the airport. Plunge pool cottages, organic dining, and birdwatching trails.', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80', 8999.00, 'per night', 4.74, 160, 15, 'active', FALSE),

-- Restaurant & Dining
(17, 14, 1, 'Celeste Sky Lounge & Pan-Asian Bistro Mumbai', 'celeste-sky-lounge-mumbai', '36th Floor Panoramic Marine Drive Views & Signature Cocktails', 'Exquisite artisanal dim sum, robata grills, and molecular mixology set against the glittering backdrop of the Queen’s Necklace.', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', 1500.00, 'table cover deposit', 4.89, 430, 20, 'active', TRUE),
(18, 14, 2, 'The Copper Hearth — Royal Awadhi & Dum Pukht', 'copper-hearth-pune', 'Slow-Cooked Biryanis and Galouti Kebabs in Heritage Courtyard', 'Centuries-old secret spices and slow charcoal embers bring alive regal Awadhi dining with live classical sitar melodies.', 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80', 1000.00, 'table cover deposit', 4.78, 260, 18, 'active', FALSE),

-- Experience
(19, 15, 3, 'Wonderla Amusement & Thrill Water Park', 'wonderla-bangalore', '60+ International Grade High-G Thrill Rides', 'India’s #1 amusement park featuring Recoil reverse roller coaster, massive dual wave pools, high-speed water slides, and laser shows.', 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=800&q=80', 1350.00, 'fast track pass', 4.84, 980, 2000, 'active', TRUE),
(20, 15, 5, 'Grand Island Scuba Diving & Dolphin Cruise Goa', 'scuba-diving-goa', 'PADI Certified Underwater Exploration with HD Video', 'Sail out into turquoise Arabian Sea waters, explore living coral reefs, shipwrecks, and swim alongside wild spinner dolphins.', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80', 3200.00, 'per diver', 4.87, 340, 40, 'active', TRUE);

-- -----------------------------------------------------------------------------
-- 6. Amenities
-- -----------------------------------------------------------------------------
INSERT INTO service_amenities (service_id, amenity_name, icon_name) VALUES
(1, 'In-Flight Wi-Fi', 'Wifi'), (1, 'Gourmet Hot Meals', 'Coffee'), (1, '25kg Baggage', 'Luggage'),
(2, '180° Rotating Seats', 'RotateCw'), (2, 'Executive Breakfast', 'Utensils'), (2, 'Panoramic Windows', 'Eye'),
(6, 'IMAX Laser 4K', 'Film'), (6, 'Dolby Atmos 12-Channel', 'Volume2'), (6, 'Electric Leather Recliner', 'Armchair'),
(10, 'FIFA Pro Turf', 'Shield'), (10, 'Night Floodlights', 'Sun'), (10, 'Locker & Showers', 'Key'),
(14, 'Private Oceanfront Pool', 'Waves'), (14, 'Personal Butler', 'UserCheck'), (14, 'Fast Wi-Fi', 'Wifi'),
(17, '360° Sky View', 'Compass'), (17, 'Valet Parking', 'Car'), (17, 'Live DJ / Acoustic', 'Music');

-- -----------------------------------------------------------------------------
-- 7. Seats (Sample layouts for Cinema #6, Bus #3, Flight #1)
-- -----------------------------------------------------------------------------
-- Movie Hall Seats: Rows A (VIP Recliner), B, C, D (Platinum / Gold)
INSERT INTO seats (service_id, seat_number, row_label, seat_class, price_multiplier) VALUES
-- Cinema Seats (Service 6)
(6, 'A1', 'A', 'VIP_RECLINER', 1.50), (6, 'A2', 'A', 'VIP_RECLINER', 1.50), (6, 'A3', 'A', 'VIP_RECLINER', 1.50), (6, 'A4', 'A', 'VIP_RECLINER', 1.50),
(6, 'A5', 'A', 'VIP_RECLINER', 1.50), (6, 'A6', 'A', 'VIP_RECLINER', 1.50), (6, 'A7', 'A', 'VIP_RECLINER', 1.50), (6, 'A8', 'A', 'VIP_RECLINER', 1.50),
(6, 'B1', 'B', 'PLATINUM', 1.25), (6, 'B2', 'B', 'PLATINUM', 1.25), (6, 'B3', 'B', 'PLATINUM', 1.25), (6, 'B4', 'B', 'PLATINUM', 1.25),
(6, 'B5', 'B', 'PLATINUM', 1.25), (6, 'B6', 'B', 'PLATINUM', 1.25), (6, 'B7', 'B', 'PLATINUM', 1.25), (6, 'B8', 'B', 'PLATINUM', 1.25),
(6, 'C1', 'C', 'GOLD', 1.00), (6, 'C2', 'C', 'GOLD', 1.00), (6, 'C3', 'C', 'GOLD', 1.00), (6, 'C4', 'C', 'GOLD', 1.00),
(6, 'C5', 'C', 'GOLD', 1.00), (6, 'C6', 'C', 'GOLD', 1.00), (6, 'C7', 'C', 'GOLD', 1.00), (6, 'C8', 'C', 'GOLD', 1.00),

-- Bus Sleeper Seats (Service 3)
(3, 'L1', 'L', 'SLEEPER', 1.00), (3, 'L2', 'L', 'SLEEPER', 1.00), (3, 'L3', 'L', 'SLEEPER', 1.00), (3, 'L4', 'L', 'SLEEPER', 1.00),
(3, 'U1', 'U', 'SLEEPER', 1.10), (3, 'U2', 'U', 'SLEEPER', 1.10), (3, 'U3', 'U', 'SLEEPER', 1.10), (3, 'U4', 'U', 'SLEEPER', 1.10),

-- Flight Seats (Service 1)
(1, '1A', '1', 'BUSINESS', 2.20), (1, '1B', '1', 'BUSINESS', 2.20), (1, '1C', '1', 'BUSINESS', 2.20),
(1, '2A', '2', 'BUSINESS', 2.20), (1, '2B', '2', 'BUSINESS', 2.20), (1, '2C', '2', 'BUSINESS', 2.20),
(1, '10A', '10', 'ECONOMY', 1.00), (1, '10B', '10', 'ECONOMY', 1.00), (1, '10C', '10', 'ECONOMY', 1.00),
(1, '11A', '11', 'ECONOMY', 1.00), (1, '11B', '11', 'ECONOMY', 1.00), (1, '11C', '11', 'ECONOMY', 1.00);

-- -----------------------------------------------------------------------------
-- 8. Sports Slots & Restaurant Tables
-- -----------------------------------------------------------------------------
-- Turf hourly slots (Service 10)
INSERT INTO slots (service_id, slot_date, start_time, end_time, capacity, booked_count) VALUES
(10, '2026-09-07', '06:00:00', '07:00:00', 1, 0),
(10, '2026-09-07', '07:00:00', '08:00:00', 1, 1),
(10, '2026-09-07', '08:00:00', '09:00:00', 1, 0),
(10, '2026-09-07', '17:00:00', '18:00:00', 1, 1),
(10, '2026-09-07', '18:00:00', '19:00:00', 1, 0),
(10, '2026-09-07', '19:00:00', '20:00:00', 1, 1),
(10, '2026-09-07', '20:00:00', '21:00:00', 1, 0),
(10, '2026-09-07', '21:00:00', '22:00:00', 1, 0);

-- Restaurant Tables (Service 17)
INSERT INTO restaurant_tables (service_id, table_number, seating_capacity, table_type) VALUES
(17, 'T-01', 2, 'Window View'),
(17, 'T-02', 2, 'Window View'),
(17, 'T-03', 4, 'Cozy Booth'),
(17, 'T-04', 4, 'Cozy Booth'),
(17, 'T-05', 6, 'Outdoor Terrace'),
(17, 'T-06', 8, 'Private Dining');

-- Hotel Rooms (Service 14)
INSERT INTO rooms (service_id, room_type, max_guests, bed_type, price_per_night, total_inventory, available_count, amenities_summary) VALUES
(14, 'Ocean Cliff Villa with Private Plunge Pool', 4, '1 King Bed + 2 Twin Beds', 14999.00, 4, 3, 'Infinity Plunge Pool, Private Deck, Butler, Jacuzzi'),
(14, 'Royal Sunset Suite', 2, '1 King Bed', 9999.00, 6, 5, 'Panoramic Sea View, Italian Marble Bath, Espresso Machine');

-- -----------------------------------------------------------------------------
-- 9. Coupons
-- -----------------------------------------------------------------------------
INSERT INTO coupons (id, code, description, discount_type, discount_value, min_spend, max_discount, usage_limit, times_used, valid_until, is_active) VALUES
(1, 'WELCOME10', 'Get 10% instant discount on your first booking across any category.', 'PERCENTAGE', 10.00, 500.00, 500.00, 5000, 142, '2027-12-31 23:59:59', TRUE),
(2, 'FIRSTBOOK', 'Flat ₹200 off for first-time BookSphere explorers.', 'FIXED_AMOUNT', 200.00, 800.00, 200.00, 2000, 89, '2027-12-31 23:59:59', TRUE),
(3, 'SPORTS20', 'Kickstart your fitness! 20% off on all turfs, courts, and swimming pools.', 'PERCENTAGE', 20.00, 1000.00, 400.00, 1000, 63, '2027-12-31 23:59:59', TRUE),
(4, 'MOVIE50', '50% discount on movie tickets up to ₹150.', 'PERCENTAGE', 50.00, 300.00, 150.00, 3000, 210, '2027-12-31 23:59:59', TRUE),
(5, 'LUXURYSTAY', 'Flat ₹1,500 off on premium villas & 5-star hotel bookings above ₹10,000.', 'FIXED_AMOUNT', 1500.00, 10000.00, 1500.00, 500, 27, '2027-12-31 23:59:59', TRUE);

-- -----------------------------------------------------------------------------
-- 10. Sample Bookings, Payments, and Reviews
-- -----------------------------------------------------------------------------
INSERT INTO bookings (id, booking_ref, user_id, service_id, booking_type, booking_date, scheduled_date, scheduled_time, guest_count, base_amount, discount_amount, tax_amount, service_fee, final_amount, status, qr_code_token, notes) VALUES
(1, 'BK-2026-90112', 2, 6, 'ENTERTAINMENT', '2026-09-01', '2026-09-07', '07:30 PM', 2, 960.00, 96.00, 155.52, 40.00, 1059.52, 'confirmed', 'QR_BK90112_VERIFIED', 'IMAX Laser screening, VIP Recliners A3, A4'),
(2, 'BK-2026-90245', 3, 10, 'SPORTS', '2026-09-02', '2026-09-08', '07:00 PM - 08:00 PM', 10, 1400.00, 200.00, 216.00, 50.00, 1466.00, 'confirmed', 'QR_BK90245_VERIFIED', '7v7 Football match under floodlights'),
(3, 'BK-2026-89801', 5, 14, 'HOTEL', '2026-08-25', '2026-09-12', 'Check-in: 02:00 PM', 2, 14999.00, 1500.00, 2429.82, 250.00, 16178.82, 'confirmed', 'QR_BK89801_VERIFIED', 'Azure Bay Villa Plunge Pool Booking'),
(4, 'BK-2026-88410', 4, 1, 'TRANSPORT', '2026-08-15', '2026-08-20', '09:15 AM', 1, 4499.00, 449.90, 728.84, 100.00, 4877.94, 'completed', 'QR_BK88410_VERIFIED', 'Flight BOM to BLR, Seat 10A'),
(5, 'BK-2026-87905', 6, 17, 'RESTAURANT', '2026-08-10', '2026-08-14', '08:30 PM', 4, 1500.00, 0.00, 270.00, 50.00, 1820.00, 'cancelled', 'QR_BK87905_CANCELLED', 'Table T-01 Window View Table Reservation');

INSERT INTO booking_items (booking_id, item_type, item_ref, item_label, unit_price, quantity) VALUES
(1, 'SEAT', 'A3', 'VIP Recliner A3', 480.00, 1),
(1, 'SEAT', 'A4', 'VIP Recliner A4', 480.00, 1),
(2, 'SLOT', '19:00-20:00', 'BKC AstroTurf 1 Hour Slot', 1400.00, 1),
(3, 'ROOM', 'VILLA-01', 'Azure Bay Cliffside Villa', 14999.00, 1),
(4, 'SEAT', '10A', 'Economy Window 10A', 4499.00, 1),
(5, 'TABLE', 'T-01', 'Window View Table T-01', 1500.00, 1);

INSERT INTO passengers (booking_id, full_name, age, gender, seat_or_ticket_number, contact_phone) VALUES
(1, 'Priya Nair', 28, 'Female', 'A3', '+91 98450 67890'),
(1, 'Siddharth Nair', 30, 'Male', 'A4', '+91 98450 67891'),
(2, 'Rohan Verma', 25, 'Male', 'CAPTAIN', '+91 97110 34567'),
(3, 'Vikramaditya Rao', 34, 'Male', 'GUEST-1', '+91 96190 45678'),
(4, 'Ananya Deshmukh', 26, 'Female', '10A', '+91 99300 89123');

INSERT INTO payments (id, payment_ref, booking_id, user_id, amount, payment_method, transaction_id, status, gateway_response, paid_at) VALUES
(1, 'PAY-891001', 1, 2, 1059.52, 'UPI', 'TXN_UPI_9831092831', 'success', '{"gateway": "MOCK_UPI", "bank_ref": "HDFC00912"}', '2026-09-01 14:32:00'),
(2, 'PAY-891002', 2, 3, 1466.00, 'CREDIT_CARD', 'TXN_CC_7728192837', 'success', '{"gateway": "MOCK_GATEWAY", "card_brand": "VISA"}', '2026-09-02 10:15:00'),
(3, 'PAY-891003', 3, 5, 16178.82, 'NET_BANKING', 'TXN_NB_4492817291', 'success', '{"gateway": "MOCK_NETBANKING", "bank": "ICICI"}', '2026-08-25 18:40:00'),
(4, 'PAY-891004', 4, 4, 4877.94, 'UPI', 'TXN_UPI_1102938475', 'success', '{"gateway": "MOCK_UPI", "vpa": "ananya@oksbi"}', '2026-08-15 08:20:00'),
(5, 'PAY-891005', 5, 6, 1820.00, 'CREDIT_CARD', 'TXN_CC_5564738291', 'refunded', '{"gateway": "MOCK_GATEWAY", "status": "REFUNDED"}', '2026-08-10 19:10:00');

INSERT INTO refunds (id, refund_ref, booking_id, payment_id, original_amount, cancellation_fee, refund_amount, refund_status, refund_reason, processed_at) VALUES
(1, 'RF-900214', 5, 5, 1820.00, 182.00, 1638.00, 'processed', 'Customer sudden change of travel plans', '2026-08-11 11:30:00');

INSERT INTO reviews (service_id, user_id, booking_id, rating, title, review_text, is_verified_booking) VALUES
(6, 2, 1, 5, 'Phenomenal IMAX laser clarity!', 'The audio and picture depth was out of this world. Recliners were exceptionally comfortable.', TRUE),
(10, 3, 2, 5, 'Best turf in BKC Mumbai', 'Excellent grip, soft cushioning, and well-maintained floodlights. Clean change rooms as well.', TRUE),
(1, 4, 4, 5, 'Punctual and spotless Dreamliner', 'SkyWings delivers pure comfort. Departure was on the minute, and meal was delightful.', TRUE);

INSERT INTO notifications (user_id, title, message, notification_type, is_read, action_url) VALUES
(2, 'Booking Confirmed! 🎉', 'Your reservation BK-2026-90112 is confirmed. Tap to view your digital ticket & QR pass.', 'BOOKING', FALSE, '/my-bookings'),
(3, 'Turf Slot Reserved', 'Slot confirmed for 7v7 Football on Sep 8th at 07:00 PM. Have a great match!', 'BOOKING', TRUE, '/my-bookings'),
(6, 'Refund Processed ₹1,638', 'Your refund for Booking BK-2026-87905 has been transferred back to your card account.', 'REFUND', FALSE, '/my-bookings');

INSERT INTO audit_logs (user_id, action_type, entity_name, entity_id, details) VALUES
(1, 'INITIALIZE_SYSTEM', 'system', '0', '{"version": "2.4.0", "engine": "MySQL 8"}'),
(2, 'CONFIRM_BOOKING', 'bookings', '1', '{"amount": 1059.52, "ref": "BK-2026-90112"}'),
(3, 'CONFIRM_BOOKING', 'bookings', '2', '{"amount": 1466.00, "ref": "BK-2026-90245"}'),
(6, 'CANCEL_BOOKING', 'bookings', '5', '{"refund_amount": 1638.00, "fee": 182.00}');

SET FOREIGN_KEY_CHECKS = 1;
