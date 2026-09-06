const { getStore, logAudit } = require('../config/db');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const store = getStore();
    const user = store.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // For demo simplicity, match password or accept standard 'password123' or 'admin123'
    if (password !== user.password && password !== 'password123' && password !== 'admin123') {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const membership = store.memberships.find(m => m.id === user.membership_id) || store.memberships[0];

    logAudit(user.id, 'USER_LOGIN', 'users', user.id, { email: user.email });

    res.json({
      success: true,
      token: 'jwt_token_booksphere_' + user.id,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role || (user.id === 1 ? 'super_admin' : 'user'),
        rewardPoints: user.reward_points,
        avatarUrl: user.avatar_url,
        membership: {
          tierName: membership.tier_name,
          discountPct: membership.discount_pct,
          multiplier: membership.points_multiplier,
          perks: membership.perks_description
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;
    const store = getStore();

    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    if (store.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const newUser = {
      id: store.users.length + 1,
      membership_id: 1, // Basic Explorer
      full_name: fullName,
      email,
      password: password || 'password123',
      phone: phone || '+91 99999 00000',
      reward_points: 150, // Welcome bonus points
      avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
      role: 'user'
    };

    store.users.push(newUser);
    logAudit(newUser.id, 'USER_REGISTER', 'users', newUser.id, { email });

    res.status(201).json({
      success: true,
      token: 'jwt_token_booksphere_' + newUser.id,
      user: {
        id: newUser.id,
        fullName: newUser.full_name,
        email: newUser.email,
        phone: newUser.phone,
        role: 'user',
        rewardPoints: newUser.reward_points,
        avatarUrl: newUser.avatar_url,
        membership: {
          tierName: 'Basic Explorer',
          discountPct: 0,
          multiplier: 1.0,
          perks: 'Standard access, 1 pt per ₹100'
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = parseInt(req.query.userId || '2');
    const store = getStore();
    const user = store.users.find(u => u.id === userId) || store.users[1];
    const membership = store.memberships.find(m => m.id === user.membership_id) || store.memberships[0];

    res.json({
      success: true,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        rewardPoints: user.reward_points,
        avatarUrl: user.avatar_url,
        membership: {
          tierName: membership.tier_name,
          discountPct: membership.discount_pct,
          multiplier: membership.points_multiplier,
          perks: membership.perks_description
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Switch active demo persona (Admin or Customer)
exports.switchDemoUser = async (req, res) => {
  try {
    const { role } = req.body;
    const store = getStore();
    let target = store.users.find(u => role === 'admin' ? (u.role === 'super_admin' || u.role === 'admin') : (u.role === 'user'));
    if (!target) target = store.users[0];

    const membership = store.memberships.find(m => m.id === target.membership_id) || store.memberships[0];

    res.json({
      success: true,
      token: 'jwt_token_booksphere_' + target.id,
      user: {
        id: target.id,
        fullName: target.full_name,
        email: target.email,
        phone: target.phone,
        role: target.role,
        rewardPoints: target.reward_points,
        avatarUrl: target.avatar_url,
        membership: {
          tierName: membership.tier_name,
          discountPct: membership.discount_pct,
          multiplier: membership.points_multiplier,
          perks: membership.perks_description
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
