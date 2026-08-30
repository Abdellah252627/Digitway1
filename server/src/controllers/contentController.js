import db from '../db/database.js';
import { sendTelegramNotification } from '../services/telegramService.js';

export async function getPublicContent(req, res) {
  try {
    const result = await db.execute({ sql: 'SELECT value FROM site_content WHERE key = ?', args: ['global_settings'] });
    const row = result.rows[0];
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
    const existingResult = await db.execute({ sql: 'SELECT key FROM site_content WHERE key = ?', args: ['global_settings'] });
    const existing = existingResult.rows[0];

    if (existing) {
      await db.execute({
        sql: 'UPDATE site_content SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?',
        args: [valueJson, 'global_settings'],
      });
    } else {
      await db.execute({
        sql: 'INSERT INTO site_content (key, value) VALUES (?, ?)',
        args: ['global_settings', valueJson],
      });
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
━━━━━━━━━━━━━━━━━━━━━
✅ Telegram Bot notifications are successfully connected and working!
⏱ *Timestamp:* ${new Date().toLocaleString()}`;

    const result = await sendTelegramNotification(testMessage);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
