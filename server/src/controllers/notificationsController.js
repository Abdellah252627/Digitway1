import db from '../db/database.js';

export async function getNotifications(req, res) {
  try {
    const result = await db.execute({ sql: 'SELECT * FROM notifications ORDER BY id DESC LIMIT 20', args: [] });
    const notifications = result.rows;
    const countResult = await db.execute({ sql: 'SELECT COUNT(*) as count FROM notifications WHERE is_read = 0', args: [] });
    const unreadCount = countResult.rows[0].count;

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
    await db.execute({ sql: 'UPDATE notifications SET is_read = 1 WHERE id = ?', args: [id] });
    return res.json({ success: true });
  } catch (error) {
    console.error('Mark notification read error:', error);
    return res.status(500).json({ error: 'Failed to update notification.' });
  }
}

export async function markAllAsRead(req, res) {
  try {
    await db.execute({ sql: 'UPDATE notifications SET is_read = 1 WHERE is_read = 0', args: [] });
    return res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (error) {
    console.error('Mark all read error:', error);
    return res.status(500).json({ error: 'Failed to update notifications.' });
  }
}

export async function clearNotifications(req, res) {
  try {
    await db.execute({ sql: 'DELETE FROM notifications', args: [] });
    return res.json({ success: true, message: 'Notifications cleared.' });
  } catch (error) {
    console.error('Clear notifications error:', error);
    return res.status(500).json({ error: 'Failed to clear notifications.' });
  }
}
