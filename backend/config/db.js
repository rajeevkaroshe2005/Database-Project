// Smart Dual-Mode Database Adapter
// Connects to MySQL 8 pool if available; gracefully falls back to an embedded relational store.

const mysql = require('mysql2/promise');
const initialData = require('./seedData');

let mysqlPool = null;
let useMySQL = false;

// Embedded relational storage state initialized with complete seed data
const store = {
  memberships: [...initialData.memberships],
  users: [...initialData.users],
  categories: [...initialData.categories],
  locations: [...initialData.locations],
  services: [...initialData.services],
  coupons: [...initialData.coupons],
  bookings: [...initialData.bookings],
  auditLogs: [...initialData.auditLogs],
  reviews: [...initialData.reviews],
  notifications: [...initialData.notifications],
  tempReservations: [] // 5-minute seat locks: { service_id, user_id, seat_id, expires_at }
};

// Auto-clean expired temporary reservations every 30 seconds
setInterval(() => {
  const now = Date.now();
  store.tempReservations = store.tempReservations.filter(r => r.expires_at > now);
}, 30000);

async function initDatabase() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'booksphere_db';
  const port = process.env.DB_PORT || 3306;

  try {
    const testPool = mysql.createPool({
      host,
      user,
      password,
      database,
      port,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 2000
    });

    // Test connection
    const connection = await testPool.getConnection();
    connection.release();
    mysqlPool = testPool;
    useMySQL = true;
    console.log(`[BOOKSPHERE DB] Connected to native MySQL 8 database at ${host}:${port}/${database}`);
  } catch (err) {
    useMySQL = false;
    console.log(`[BOOKSPHERE DB INFO] MySQL connection skipped/unavailable (${err.message}).`);
    console.log(`[BOOKSPHERE DB] Embedded Relational Store ACTIVATED with 100% full seed data & feature support.`);
  }
}

module.exports = {
  initDatabase,
  isUsingMySQL: () => useMySQL,
  getStore: () => store,
  getPool: () => mysqlPool,
  
  // Helper to record audit events (demonstrates Trigger / Audit log emulation)
  logAudit: (userId, actionType, entityName, entityId, details) => {
    const newLog = {
      id: store.auditLogs.length + 1,
      user_id: userId,
      action_type: actionType,
      entity_name: entityName,
      entity_id: String(entityId),
      details: typeof details === 'object' ? details : { info: details },
      created_at: new Date().toISOString()
    };
    store.auditLogs.unshift(newLog);
    return newLog;
  },

  // Helper to add user notifications (demonstrates Triggers)
  addNotification: (userId, title, message, type = 'BOOKING', actionUrl = '/my-bookings') => {
    const newNotif = {
      id: store.notifications.length + 1,
      user_id: userId,
      title,
      message,
      notification_type: type,
      is_read: false,
      action_url: actionUrl,
      created_at: new Date().toISOString()
    };
    store.notifications.unshift(newNotif);
    return newNotif;
  }
};
