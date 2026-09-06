const { getStore } = require('../config/db');

exports.getNotifications = async (req, res) => {
  try {
    const userId = parseInt(req.query.userId || '2');
    const store = getStore();
    const userNotifs = store.notifications.filter(n => n.user_id === userId);

    res.json({
      success: true,
      unreadCount: userNotifs.filter(n => !n.is_read).length,
      data: userNotifs
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.markRead = async (req, res) => {
  try {
    const notifId = parseInt(req.params.id);
    const store = getStore();
    const notif = store.notifications.find(n => n.id === notifId);

    if (notif) {
      notif.is_read = true;
    }

    res.json({ success: true, message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.markAllRead = async (req, res) => {
  try {
    const userId = parseInt(req.body.userId || '2');
    const store = getStore();
    store.notifications
      .filter(n => n.user_id === userId)
      .forEach(n => { n.is_read = true; });

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
