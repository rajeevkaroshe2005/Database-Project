const { getStore } = require('../config/db');

exports.getServices = async (req, res) => {
  try {
    const store = getStore();
    const { category, type, city, search, featured, minPrice, maxPrice, sort } = req.query;

    let list = [...store.services];

    if (category) {
      list = list.filter(s => s.category_slug === category);
    }
    if (type) {
      list = list.filter(s => s.parent_type === type.toUpperCase());
    }
    if (city && city !== 'All Cities') {
      list = list.filter(s => s.city.toLowerCase() === city.toLowerCase());
    }
    if (featured === 'true') {
      list = list.filter(s => s.is_featured);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.tagline.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.parent_type.toLowerCase().includes(q)
      );
    }
    if (minPrice) {
      list = list.filter(s => s.base_price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      list = list.filter(s => s.base_price <= parseFloat(maxPrice));
    }

    if (sort === 'price_asc') {
      list.sort((a, b) => a.base_price - b.base_price);
    } else if (sort === 'price_desc') {
      list.sort((a, b) => b.base_price - a.base_price);
    } else if (sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    res.json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const store = getStore();
    const serviceId = parseInt(req.params.id);
    const service = store.services.find(s => s.id === serviceId);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const reviews = store.reviews.filter(r => r.service_id === serviceId);
    const location = store.locations.find(l => l.id === service.location_id) || store.locations[0];
    const category = store.categories.find(c => c.id === service.category_id) || store.categories[0];

    res.json({
      success: true,
      data: {
        ...service,
        location,
        category,
        reviews
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const store = getStore();
    res.json({
      success: true,
      data: store.categories
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getLocations = async (req, res) => {
  try {
    const store = getStore();
    res.json({
      success: true,
      data: store.locations
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Returns granular inventory (seats, slots, rooms, tables) with real-time availability
exports.getServiceInventory = async (req, res) => {
  try {
    const serviceId = parseInt(req.params.id);
    const date = req.query.date || new Date().toISOString().split('T')[0];
    const store = getStore();
    const service = store.services.find(s => s.id === serviceId);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const now = Date.now();
    // Get temporary held seats for this service
    const activeHolds = store.tempReservations
      .filter(r => r.service_id === serviceId && r.expires_at > now)
      .map(r => r.resource_id);

    // Get booked items from confirmed bookings on this date
    const bookedItems = [];
    store.bookings
      .filter(b => b.service_id === serviceId && b.scheduled_date === date && b.status === 'confirmed')
      .forEach(b => {
        if (b.selected_seats) {
          b.selected_seats.forEach(s => bookedItems.push(s));
        }
      });

    // Build category-specific layouts
    let inventory = {};

    if (service.parent_type === 'ENTERTAINMENT') {
      if (service.category_slug === 'concert') {
        // Stadium Concert / Music Festival Tiered Passes
        const passes = [
          {
            id: 'VIP_LOUNGE',
            name: 'VIP Elevated Lounge Deck',
            description: 'Complimentary Drinks, Lounge Seating, Dedicated Bar & Fast-Track Entry',
            perks: ['Free Premium Drinks', 'Fast Track Entry', 'Elevated Stage View', 'Private Lounge Bar'],
            price: 6999,
            available: 40
          },
          {
            id: 'FAN_PIT',
            name: 'Fan Pit / Front of Stage',
            description: 'Closest View to Artist Stage, Dedicated Pit Entry & Official Tour Lanyard',
            perks: ['Front Stage Access', 'Tour Lanyard Pass', 'Dedicated Food & Bar Lane'],
            price: 4499,
            available: 110
          },
          {
            id: 'GA_PHASE1',
            name: 'General Admission (Phase 1)',
            description: 'Full Arena & Festival Village Access, LED Mainstage Audio-Visuals',
            perks: ['Arena Access', 'Festival Village Entry', 'Food Courts Access'],
            price: 2499,
            available: 350
          },
          {
            id: 'EARLY_BIRD',
            name: 'Early Bird Arena Access',
            description: 'Standard General Admission, Entry Strictly Before 5:00 PM',
            perks: ['Entry Before 5 PM', 'Arena Access'],
            price: 1999,
            available: 65
          }
        ].map(p => {
          const isHeld = activeHolds.includes(p.id);
          const isBooked = bookedItems.includes(p.id);
          return {
            ...p,
            status: isBooked ? 'booked' : (isHeld ? 'held' : 'available')
          };
        });
        inventory = { type: 'EVENT_PASSES', passes, eventType: 'CONCERT', venue: 'Mahalaxmi Racecourse Arena' };
      } else if (service.category_slug === 'comedy') {
        // Comedy Arena / Auditorium Passes
        const passes = [
          {
            id: 'VIP_FRONT',
            name: 'Front Row Royal Lounge',
            description: 'Front Stage Row + Exclusive Post-Show Meet & Greet with Zakir Khan',
            perks: ['Front Row Center', 'Post-Show Meet & Greet', 'Priority Seating Lane'],
            price: 2999,
            available: 20
          },
          {
            id: 'PLATINUM',
            name: 'Platinum Center Arena',
            description: 'Prime Center Stage Clear Line of Sight, High-Definition Audio Zone',
            perks: ['Prime Center View', 'Plush Recliner Chairs', 'Acoustic Sweet Spot'],
            price: 1899,
            available: 75
          },
          {
            id: 'GOLD',
            name: 'Gold Reserved Tier',
            description: 'Elevated Stalls Acoustic Zone, Unobstructed Sightline to Stage',
            perks: ['Elevated Tier View', 'Reserved Seating'],
            price: 1499,
            available: 140
          },
          {
            id: 'SILVER',
            name: 'Silver Balcony Tier',
            description: 'Standard Balcony Seating with Clear Sound Acoustics',
            perks: ['Balcony View', 'Acoustic Clarity'],
            price: 999,
            available: 95
          }
        ].map(p => {
          const isHeld = activeHolds.includes(p.id);
          const isBooked = bookedItems.includes(p.id);
          return {
            ...p,
            status: isBooked ? 'booked' : (isHeld ? 'held' : 'available')
          };
        });
        inventory = { type: 'EVENT_PASSES', passes, eventType: 'COMEDY', venue: 'Koramangala Indoor Stadium' };
      } else {
        // Movie / Cinema Theater Seat Map
        const rows = ['A', 'B', 'C', 'D'];
        const seats = [];
        rows.forEach(row => {
          for (let i = 1; i <= 8; i++) {
            const seatId = `${row}${i}`;
            let seatClass = 'GOLD';
            let price = service.base_price;

            if (row === 'A') {
              seatClass = 'VIP_RECLINER';
              price = Math.round(service.base_price * 1.5);
            } else if (row === 'B') {
              seatClass = 'PLATINUM';
              price = Math.round(service.base_price * 1.25);
            }

            const isBooked = bookedItems.includes(seatId) || (seatId === 'A1' || seatId === 'B5'); // seed booked
            const isHeld = activeHolds.includes(seatId);

            seats.push({
              id: seatId,
              row,
              number: i,
              seatClass,
              price,
              status: isBooked ? 'booked' : (isHeld ? 'held' : 'available')
            });
          }
        });
        inventory = { type: 'SEAT_GRID', seats, screenOrientation: 'TOP' };
      }
    } else if (service.parent_type === 'TRANSPORT') {
      if (service.category_slug === 'flight') {
        // Flight layout: Business (Row 1-2), Economy (Row 10-12)
        const seats = [];
        ['1A', '1B', '1C', '2A', '2B', '2C'].forEach(s => {
          const isBooked = bookedItems.includes(s) || s === '1B';
          const isHeld = activeHolds.includes(s);
          seats.push({ id: s, seatClass: 'BUSINESS', price: Math.round(service.base_price * 2.2), status: isBooked ? 'booked' : (isHeld ? 'held' : 'available') });
        });
        ['10A', '10B', '10C', '11A', '11B', '11C', '12A', '12B', '12C'].forEach(s => {
          const isBooked = bookedItems.includes(s) || s === '10A';
          const isHeld = activeHolds.includes(s);
          seats.push({ id: s, seatClass: 'ECONOMY', price: service.base_price, status: isBooked ? 'booked' : (isHeld ? 'held' : 'available') });
        });
        inventory = { type: 'FLIGHT_CABIN', seats };
      } else if (service.category_slug === 'bus') {
        // Sleeper Bus: Lower & Upper Berths
        const berths = [];
        ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'U1', 'U2', 'U3', 'U4', 'U5', 'U6'].forEach(b => {
          const isBooked = bookedItems.includes(b) || b === 'L2';
          const isHeld = activeHolds.includes(b);
          berths.push({ id: b, tier: b.startsWith('L') ? 'Lower Berth' : 'Upper Berth', price: service.base_price, status: isBooked ? 'booked' : (isHeld ? 'held' : 'available') });
        });
        inventory = { type: 'BUS_BERTHS', berths };
      } else if (service.category_slug === 'cab') {
        // Cab Fleet Options
        const vehicles = [
          {
            id: 'SEDAN',
            name: 'UrbanDrive Executive Sedan',
            model: 'Honda City / Maruti Ciaz',
            capacity: 4,
            luggage: 2,
            perks: ['Uniformed Chauffeur', 'Bottled Mineral Water', 'Live GPS Tracking', 'Zero Cancellation Fee'],
            price: service.base_price,
            available: 8
          },
          {
            id: 'SUV',
            name: 'UrbanDrive Prime SUV',
            model: 'Toyota Innova Crysta',
            capacity: 6,
            luggage: 4,
            perks: ['Spacious 6-Seater', 'Reclining Captain Seats', 'Extra Boot Space', 'Chilled Water & Wi-Fi'],
            price: Math.round(service.base_price * 1.35),
            available: 5
          },
          {
            id: 'LUXURY',
            name: 'UrbanDrive First-Class',
            model: 'Mercedes-Benz E-Class / BMW 5',
            capacity: 4,
            luggage: 3,
            perks: ['Chauffeur in Tuxedo', 'Nappa Leather Comfort', 'High-Speed 5G Wi-Fi', 'Priority Airport Meet'],
            price: Math.round(service.base_price * 2.2),
            available: 3
          },
          {
            id: 'EV',
            name: 'UrbanDrive Eco Green EV',
            model: 'BYD Atto 3 / Hyundai Ioniq 5',
            capacity: 4,
            luggage: 3,
            perks: ['100% Electric Green Ride', 'Ultra-Silent Cabin', 'USB Fast Chargers'],
            price: Math.round(service.base_price * 1.1),
            available: 6
          }
        ].map(v => {
          const isHeld = activeHolds.includes(v.id);
          const isBooked = bookedItems.includes(v.id);
          return {
            ...v,
            status: isBooked ? 'booked' : (isHeld ? 'held' : 'available')
          };
        });
        inventory = { type: 'CAB_FLEET', vehicles };
      } else {
        inventory = { type: 'GENERAL_SEATS', capacity: service.capacity_total, available: Math.max(0, service.capacity_total - bookedItems.length) };
      }
    } else if (service.parent_type === 'SPORTS') {
      // Hourly Time Slots
      const slotTimes = [
        '06:00 AM - 07:00 AM',
        '07:00 AM - 08:00 AM',
        '08:00 AM - 09:00 AM',
        '09:00 AM - 10:00 AM',
        '05:00 PM - 06:00 PM',
        '06:00 PM - 07:00 PM',
        '07:00 PM - 08:00 PM',
        '08:00 PM - 09:00 PM',
        '09:00 PM - 10:00 PM'
      ];
      const slots = slotTimes.map(time => {
        const isBooked = bookedItems.includes(time) || time === '07:00 PM - 08:00 PM';
        const isHeld = activeHolds.includes(time);
        return {
          id: time,
          time,
          price: service.base_price,
          status: isBooked ? 'booked' : (isHeld ? 'held' : 'available')
        };
      });
      inventory = { type: 'TIME_SLOTS', slots };
    } else if (service.parent_type === 'HOTEL') {
      // Hotel Rooms
      inventory = {
        type: 'ROOM_TIERS',
        rooms: [
          { id: 'ROOM-DLX', name: 'Deluxe Oceanfront Suite', maxGuests: 2, bed: '1 King Bed', price: service.base_price, available: 3 },
          { id: 'ROOM-VILLA', name: 'Royal Private Plunge Pool Villa', maxGuests: 4, bed: '2 King Beds', price: Math.round(service.base_price * 1.6), available: 1 }
        ]
      };
    } else if (service.parent_type === 'RESTAURANT') {
      // Restaurant Tables
      const tables = [
        { id: 'T-01', label: 'Table 1 — Window Skyline View (2 Guests)', capacity: 2, type: 'Window' },
        { id: 'T-02', label: 'Table 2 — Romantic Window Booth (2 Guests)', capacity: 2, type: 'Window' },
        { id: 'T-03', label: 'Table 3 — Velvet Dining Booth (4 Guests)', capacity: 4, type: 'Booth' },
        { id: 'T-04', label: 'Table 4 — Terrace Open Deck (4 Guests)', capacity: 4, type: 'Terrace' },
        { id: 'T-05', label: 'Table 5 — Grand Family Table (6 Guests)', capacity: 6, type: 'Family' },
        { id: 'T-06', label: 'Table 6 — VIP Private Dining Lounge (8 Guests)', capacity: 8, type: 'VIP Lounge' }
      ].map(t => {
        const isBooked = bookedItems.includes(t.id);
        const isHeld = activeHolds.includes(t.id);
        return {
          ...t,
          price: service.base_price,
          status: isBooked ? 'booked' : (isHeld ? 'held' : 'available')
        };
      });
      inventory = { type: 'RESTAURANT_TABLES', tables };
    } else {
      inventory = { type: 'GENERAL_ADMISSION', availableTickets: service.capacity_total - bookedItems.length, price: service.base_price };
    }

    res.json({
      success: true,
      serviceId,
      date,
      inventory
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
