import db from '../db/database.js';
import { sendTelegramNotification } from '../services/telegramService.js';

export async function getPublicContent(req, res) {
  try {
    const row = db.prepare('SELECT value FROM site_content WHERE key = ?').get('global_settings');
    if (!row) {
      return res.status(404).json({ error: 'Content not found.' });
    }
    const content = JSON.parse(row.value);
    return res.json({ content });
  } catch (error) {
    console.error('Get content error:', error);
    return res.status(500).json({ error: 'Failed to retrieve site content.' });
  }
}

export async function updateContent(req, res) {
  try {
    const { content } = req.body;
    if (!content || typeof content !== 'object') {
      return res.status(400).json({ error: 'Invalid content data payload.' });
    }

    const valueJson = JSON.stringify(content);
    const existing = db.prepare('SELECT key FROM site_content WHERE key = ?').get('global_settings');

    if (existing) {
      db.prepare('UPDATE site_content SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?').run(
        valueJson,
        'global_settings'
      );
    } else {
      db.prepare('INSERT INTO site_content (key, value) VALUES (?, ?)').run('global_settings', valueJson);
    }

    return res.json({ success: true, message: 'Site content updated successfully.' });
  } catch (error) {
    console.error('Update content error:', error);
    return res.status(500).json({ error: 'Failed to update site content.' });
  }
}

export async function testTelegram(req, res) {
  try {
    const testMessage = `🤖 *Digitway Alert System Test*
━━━━━━━━━━━━━━━━━━━━
✅ Telegram Bot notifications are successfully connected and working!
⏱ *Timestamp:* ${new Date().toLocaleString()}`;

    const result = await sendTelegramNotification(testMessage);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
