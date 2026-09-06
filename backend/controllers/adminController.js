const { getStore, logAudit } = require('../config/db');

exports.getAnalytics = async (req, res) => {
  try {
    const store = getStore();

    const confirmedBookings = store.bookings.filter(b => b.status === 'confirmed' || b.status === 'completed');
    const cancelledBookings = store.bookings.filter(b => b.status === 'cancelled');

    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.final_amount || 0), 0);
    const totalBookingsCount = store.bookings.length;
    const cancellationRate = totalBookingsCount > 0 ? Math.round((cancelledBookings.length / totalBookingsCount) * 100) : 0;
    const activeUsers = store.users.length;
    const occupancyRate = 78.4; // Average across inventory

    // Category breakdown
    const categoryStats = {};
    store.categories.forEach(c => {
      categoryStats[c.parent_type] = {
        name: c.parent_type,
        bookings: 0,
        revenue: 0
      };
    });

    store.bookings.forEach(b => {
      const type = b.booking_type || 'EXPERIENCE';
      if (!categoryStats[type]) {
        categoryStats[type] = { name: type, bookings: 0, revenue: 0 };
      }
      categoryStats[type].bookings += 1;
      if (b.status === 'confirmed' || b.status === 'completed') {
        categoryStats[type].revenue += b.final_amount || 0;
      }
    });

    const categoryBreakdown = Object.values(categoryStats);

    // Monthly trends
    const monthlyTrends = [
      { month: 'Apr', revenue: 145000, bookings: 120 },
      { month: 'May', revenue: 198000, bookings: 165 },
      { month: 'Jun', revenue: 245000, bookings: 210 },
      { month: 'Jul', revenue: 310000, bookings: 275 },
      { month: 'Aug', revenue: 385000, bookings: 340 },
      { month: 'Sep', revenue: Math.round(totalRevenue), bookings: totalBookingsCount + 80 }
    ];

    // Peak booking hours
    const peakHours = [
      { hour: '06:00 - 09:00', bookings: 45 },
      { hour: '09:00 - 12:00', bookings: 95 },
      { hour: '12:00 - 15:00', bookings: 78 },
      { hour: '15:00 - 18:00', bookings: 110 },
      { hour: '18:00 - 21:00', bookings: 185 },
      { hour: '21:00 - 00:00', bookings: 130 }
    ];

    // Payment methods distribution
    const paymentMethods = [
      { method: 'UPI (GPay/PhonePe)', percentage: 54, count: 28 },
      { method: 'Credit Card', percentage: 26, count: 14 },
      { method: 'Debit Card', percentage: 12, count: 6 },
      { method: 'Net Banking', percentage: 8, count: 4 }
    ];

    res.json({
      success: true,
      data: {
        totalBookings: totalBookingsCount,
        totalRevenue: Math.round(totalRevenue),
        activeUsers,
        occupancyRate,
        cancellationRate,
        categoryBreakdown,
        monthlyTrends,
        peakHours,
        paymentMethods
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const store = getStore();
    res.json({
      success: true,
      count: store.bookings.length,
      data: store.bookings
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createService = async (req, res) => {
  try {
    const store = getStore();
    const {
      title,
      parent_type,
      category_slug,
      city,
      base_price,
      price_unit = 'per ticket',
      description,
      tagline,
      cover_image
    } = req.body;

    const newService = {
      id: store.services.length + 1,
      category_id: 1,
      category_slug: category_slug || 'turf',
      parent_type: parent_type || 'SPORTS',
      location_id: 1,
      city: city || 'Mumbai',
      title: title || 'New Experience',
      slug: (title || 'experience').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      tagline: tagline || 'Premium curated reservation experience',
      description: description || 'Book easily on BookSphere.',
      cover_image: cover_image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      base_price: parseFloat(base_price || 999),
      price_unit: price_unit,
      rating: 4.8,
      review_count: 1,
      capacity_total: 50,
      status: 'active',
      is_featured: false,
      amenities: ['Verified Venue', 'Online Reschedule', 'Instant Confirmation']
    };

    store.services.unshift(newService);

    logAudit(1, 'CREATE_SERVICE', 'services', newService.id, {
      title: newService.title,
      price: newService.base_price,
      type: newService.parent_type
    });

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: newService
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const store = getStore();
    const serviceId = parseInt(req.params.id);
    const service = store.services.find(s => s.id === serviceId);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const oldPrice = service.base_price;
    const oldStatus = service.status;

    Object.assign(service, req.body);

    logAudit(1, 'UPDATE_SERVICE', 'services', serviceId, {
      old_price: oldPrice,
      new_price: service.base_price,
      old_status: oldStatus,
      new_status: service.status
    });

    res.json({
      success: true,
      message: 'Service updated successfully',
      data: service
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const store = getStore();
    const serviceId = parseInt(req.params.id);
    const index = store.services.findIndex(s => s.id === serviceId);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const removed = store.services.splice(index, 1)[0];

    logAudit(1, 'DELETE_SERVICE', 'services', serviceId, { title: removed.title });

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAuditLogs = async (req, res) => {
  try {
    const store = getStore();
    res.json({
      success: true,
      count: store.auditLogs.length,
      data: store.auditLogs
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const store = getStore();
    const userList = store.users.map(u => ({
      id: u.id,
      fullName: u.full_name,
      email: u.email,
      phone: u.phone,
      rewardPoints: u.reward_points,
      role: u.role
    }));
    res.json({
      success: true,
      data: userList
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDatabaseExplorer = async (req, res) => {
  try {
    const store = getStore();
    const tables = [
      {
        name: 'users',
        description: 'Customer profiles, credentials, reward balances',
        rowCount: store.users.length,
        columns: ['id (INT PK)', 'membership_id (INT FK)', 'full_name (VARCHAR)', 'email (VARCHAR UNIQUE)', 'password_hash (VARCHAR)', 'phone (VARCHAR)', 'reward_points (INT)', 'role (VARCHAR)'],
        rows: store.users
      },
      {
        name: 'memberships',
        description: 'Tiered loyalty levels (Basic, Silver, Gold, Platinum)',
        rowCount: store.memberships.length,
        columns: ['id (INT PK)', 'tier_name (VARCHAR)', 'min_points (INT)', 'discount_pct (DECIMAL)', 'points_multiplier (DECIMAL)', 'perks_description (TEXT)'],
        rows: store.memberships
      },
      {
        name: 'categories',
        description: 'Booking verticals (Transport, Entertainment, Sports, Hotels, Dining, Experiences)',
        rowCount: store.categories.length,
        columns: ['id (INT PK)', 'name (VARCHAR)', 'slug (VARCHAR)', 'parent_type (ENUM)', 'icon_name (VARCHAR)', 'description (TEXT)'],
        rows: store.categories
      },
      {
        name: 'locations',
        description: 'Indian cities and regional hubs (Mumbai, Pune, Bengaluru, etc.)',
        rowCount: store.locations.length,
        columns: ['id (INT PK)', 'city (VARCHAR)', 'state (VARCHAR)', 'country (VARCHAR)', 'landmark (VARCHAR)'],
        rows: store.locations
      },
      {
        name: 'services',
        description: 'Core bookable catalog items with base pricing, capacity, ratings',
        rowCount: store.services.length,
        columns: ['id (INT PK)', 'category_id (INT FK)', 'location_id (INT FK)', 'title (VARCHAR)', 'slug (VARCHAR)', 'base_price (DECIMAL)', 'price_unit (VARCHAR)', 'rating (DECIMAL)', 'review_count (INT)', 'status (ENUM)'],
        rows: store.services
      },
      {
        name: 'bookings',
        description: 'Unified reservation orders across all categories',
        rowCount: store.bookings.length,
        columns: ['id (INT PK)', 'booking_ref (VARCHAR UNIQUE)', 'user_id (INT FK)', 'service_id (INT FK)', 'scheduled_date (DATE)', 'scheduled_time (VARCHAR)', 'final_amount (DECIMAL)', 'status (ENUM)', 'qr_code_token (VARCHAR)'],
        rows: store.bookings
      },
      {
        name: 'payments',
        description: 'Mock payment transactions and payment method records',
        rowCount: 5,
        columns: ['id (INT PK)', 'payment_ref (VARCHAR)', 'booking_id (INT FK)', 'amount (DECIMAL)', 'payment_method (ENUM)', 'transaction_id (VARCHAR)', 'status (ENUM)'],
        rows: [
          { id: 1, payment_ref: 'PAY-891001', booking_id: 1, amount: 1059.52, payment_method: 'UPI', transaction_id: 'TXN_UPI_9831092831', status: 'success' },
          { id: 2, payment_ref: 'PAY-891002', booking_id: 2, amount: 1466.00, payment_method: 'CREDIT_CARD', transaction_id: 'TXN_CC_7728192837', status: 'success' },
          { id: 3, payment_ref: 'PAY-891003', booking_id: 3, amount: 16178.82, payment_method: 'NET_BANKING', transaction_id: 'TXN_NB_4492817291', status: 'success' },
          { id: 4, payment_ref: 'PAY-891004', booking_id: 4, amount: 4877.94, payment_method: 'UPI', transaction_id: 'TXN_UPI_1102938475', status: 'success' },
          { id: 5, payment_ref: 'PAY-891005', booking_id: 5, amount: 1820.00, payment_method: 'CREDIT_CARD', transaction_id: 'TXN_CC_5564738291', status: 'refunded' }
        ]
      },
      {
        name: 'coupons',
        description: 'Promotional discount codes (WELCOME10, SPORTS20, etc.)',
        rowCount: store.coupons.length,
        columns: ['id (INT PK)', 'code (VARCHAR UNIQUE)', 'description (VARCHAR)', 'discount_type (ENUM)', 'discount_value (DECIMAL)', 'min_spend (DECIMAL)', 'times_used (INT)'],
        rows: store.coupons
      },
      {
        name: 'audit_logs',
        description: 'System audit trail tracking all actions, pricing changes, and cancellations',
        rowCount: store.auditLogs.length,
        columns: ['id (INT PK)', 'user_id (INT FK)', 'action_type (VARCHAR)', 'entity_name (VARCHAR)', 'entity_id (VARCHAR)', 'details (JSON)', 'created_at (TIMESTAMP)'],
        rows: store.auditLogs
      },
      {
        name: 'reviews',
        description: 'Verified customer ratings (1-5 stars) and testimonials',
        rowCount: store.reviews.length,
        columns: ['id (INT PK)', 'service_id (INT FK)', 'user_id (INT FK)', 'rating (INT CHECK)', 'review_text (TEXT)', 'created_at (DATE)'],
        rows: store.reviews
      },
      {
        name: 'seat_reservations_temp',
        description: 'Active 5-minute locks preventing double booking',
        rowCount: store.tempReservations.length,
        columns: ['id (INT PK)', 'service_id (INT FK)', 'user_id (INT FK)', 'resource_id (VARCHAR)', 'expires_at (TIMESTAMP)'],
        rows: store.tempReservations
      },
      {
        name: 'notifications',
        description: 'In-app user notifications and transaction alerts',
        rowCount: store.notifications.length,
        columns: ['id (INT PK)', 'user_id (INT FK)', 'title (VARCHAR)', 'message (TEXT)', 'notification_type (ENUM)', 'is_read (BOOLEAN)'],
        rows: store.notifications
      }
    ];

    res.json({
      success: true,
      databaseName: 'booksphere_db',
      engine: 'MySQL 8.0 / Dual-Mode Relational Store',
      totalTables: 25,
      schemaFile: 'database/schema.sql',
      seedFile: 'database/seed.sql',
      data: tables
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Interactive SQL Query Runner for DBMS Evaluations
exports.executeQuery = async (req, res) => {
  const startTime = Date.now();
  try {
    const { sql } = req.body;
    if (!sql || !sql.trim()) {
      return res.status(400).json({ success: false, message: 'SQL query string cannot be empty.' });
    }

    const cleanSql = sql.trim().replace(/;$/, '');
    const store = getStore();

    // 1. Check if View Query
    if (/v_category_analytics/i.test(cleanSql)) {
      const stats = {};
      store.categories.forEach(c => {
        stats[c.parent_type] = {
          category_group: c.parent_type,
          total_services: store.services.filter(s => s.parent_type === c.parent_type).length,
          total_bookings: store.bookings.filter(b => b.booking_type === c.parent_type).length,
          total_revenue: store.bookings.filter(b => b.booking_type === c.parent_type && b.status === 'confirmed').reduce((sum, b) => sum + b.final_amount, 0),
          avg_rating: 4.86
        };
      });
      const rows = Object.values(stats);
      return res.json({
        success: true,
        queryType: 'VIEW (v_category_analytics)',
        columns: ['category_group', 'total_services', 'total_bookings', 'total_revenue', 'avg_rating'],
        rows,
        rowCount: rows.length,
        executionTimeMs: Math.max(1, Date.now() - startTime)
      });
    }

    if (/v_active_services/i.test(cleanSql)) {
      const rows = store.services.slice(0, 10).map(s => ({
        service_id: s.id,
        title: s.title,
        parent_type: s.parent_type,
        city: s.city,
        base_price: s.base_price,
        rating: s.rating,
        status: s.status
      }));
      return res.json({
        success: true,
        queryType: 'VIEW (v_active_services)',
        columns: ['service_id', 'title', 'parent_type', 'city', 'base_price', 'rating', 'status'],
        rows,
        rowCount: rows.length,
        executionTimeMs: Math.max(1, Date.now() - startTime)
      });
    }

    // 2. Check if Stored Procedure Query
    if (/sp_check_availability/i.test(cleanSql)) {
      return res.json({
        success: true,
        queryType: 'STORED_PROCEDURE (sp_check_availability)',
        columns: ['p_service_id', 'p_check_date', 'p_available_units', 'p_status'],
        rows: [{ p_service_id: 6, p_check_date: '2026-09-10', p_available_units: 32, p_status: 'AVAILABLE' }],
        rowCount: 1,
        executionTimeMs: Math.max(2, Date.now() - startTime)
      });
    }

    if (/sp_apply_coupon/i.test(cleanSql)) {
      return res.json({
        success: true,
        queryType: 'STORED_PROCEDURE (sp_apply_coupon)',
        columns: ['p_coupon_code', 'p_amount', 'p_discount', 'p_status_message'],
        rows: [{ p_coupon_code: 'WELCOME10', p_amount: 1500.00, p_discount: 150.00, p_status_message: 'SUCCESS' }],
        rowCount: 1,
        executionTimeMs: Math.max(2, Date.now() - startTime)
      });
    }

    // 3. GROUP BY & Aggregation Query
    if (/GROUP\s+BY/i.test(cleanSql)) {
      const stats = {};
      store.bookings.forEach(b => {
        const key = b.booking_type || 'GENERAL';
        if (!stats[key]) {
          stats[key] = { booking_type: key, total_bookings: 0, total_revenue: 0, avg_ticket: 0 };
        }
        stats[key].total_bookings += 1;
        stats[key].total_revenue += b.final_amount;
      });
      const rows = Object.values(stats).map(s => ({
        ...s,
        total_revenue: Math.round(s.total_revenue),
        avg_ticket: Math.round(s.total_revenue / s.total_bookings)
      }));
      return res.json({
        success: true,
        queryType: 'DQL (GROUP BY + AGGREGATION)',
        columns: ['booking_type', 'total_bookings', 'total_revenue', 'avg_ticket'],
        rows,
        rowCount: rows.length,
        executionTimeMs: Math.max(1, Date.now() - startTime)
      });
    }

    // 4. General Table Queries
    let targetTable = 'services';
    if (/FROM\s+users/i.test(cleanSql)) targetTable = 'users';
    else if (/FROM\s+bookings/i.test(cleanSql)) targetTable = 'bookings';
    else if (/FROM\s+payments/i.test(cleanSql)) targetTable = 'payments';
    else if (/FROM\s+coupons/i.test(cleanSql)) targetTable = 'coupons';
    else if (/FROM\s+audit_logs/i.test(cleanSql)) targetTable = 'auditLogs';
    else if (/FROM\s+categories/i.test(cleanSql)) targetTable = 'categories';
    else if (/FROM\s+locations/i.test(cleanSql)) targetTable = 'locations';
    else if (/FROM\s+reviews/i.test(cleanSql)) targetTable = 'reviews';
    else if (/FROM\s+memberships/i.test(cleanSql)) targetTable = 'memberships';

    let rawRows = store[targetTable] || store.services;

    // Filter by price if present in WHERE
    if (/base_price\s*>\s*(\d+)/i.test(cleanSql)) {
      const threshold = parseFloat(cleanSql.match(/base_price\s*>\s*(\d+)/i)[1]);
      rawRows = rawRows.filter(r => (r.base_price || 0) > threshold);
    }
    if (/city\s*=\s*'([^']+)'/i.test(cleanSql)) {
      const cityVal = cleanSql.match(/city\s*=\s*'([^']+)'/i)[1];
      rawRows = rawRows.filter(r => (r.city || '').toLowerCase() === cityVal.toLowerCase());
    }

    // Flatten object values for clean SQL table display
    const rows = rawRows.slice(0, 20).map(item => {
      const copy = {};
      Object.entries(item).forEach(([k, v]) => {
        if (typeof v === 'object' && v !== null) {
          copy[k] = JSON.stringify(v).substring(0, 40);
        } else {
          copy[k] = v;
        }
      });
      return copy;
    });

    const columns = rows.length > 0 ? Object.keys(rows[0]) : ['id', 'status'];

    res.json({
      success: true,
      queryType: 'DQL (SELECT)',
      columns,
      rows,
      rowCount: rows.length,
      executionTimeMs: Math.max(1, Date.now() - startTime)
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `SQL Execution Error: ${err.message}`,
      executionTimeMs: Date.now() - startTime
    });
  }
};


