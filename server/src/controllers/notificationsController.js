import db from '../db/database.js';

export async function getNotifications(req, res) {
  try {
    const notifications = db.prepare('SELECT * FROM notifications ORDER BY id DESC LIMIT 20').all();
    const unreadCount = db.prepare('SELECT COUNT(*) as count FROM notifications WHERE is_read = 0').get().count;

    return res.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    return res.status(500).json({ error: 'Failed to retrieve notifications.' });
  }
}

export async function markAsRead(req, res) {
  try {
    const { id } = req.params;
    db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ?').run(id);
    return res.json({ success: true });
  } catch (error) {
    console.error('Mark notification read error:', error);
    return res.status(500).json({ error: 'Failed to update notification.' });
  }
}

export async function markAllAsRead(req, res) {
  try {
    db.prepare('UPDATE notifications SET is_read = 1 WHERE is_read = 0').run();
    return res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (error) {
    console.error('Mark all read error:', error);
    return res.status(500).json({ error: 'Failed to update notifications.' });
  }
}

export async function clearNotifications(req, res) {
  try {
    db.prepare('DELETE FROM notifications').run();
    return res.json({ success: true, message: 'Notifications cleared.' });
  } catch (error) {
    console.error('Clear notifications error:', error);
    return res.status(500).json({ error: 'Failed to clear notifications.' });
  }
}
