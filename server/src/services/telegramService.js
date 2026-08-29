import { config } from '../config/env.js';

export async function sendTelegramNotification(message) {
  const { botToken, chatId } = config.telegram;

  if (!botToken || !chatId) {
    console.log('📢 [Telegram Bot Notification (Simulated/Dev Mode)]:\n' + message);
    return { success: true, simulated: true };
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    const data = await response.json();
    if (!data.ok) {
      console.warn('⚠️ Telegram API returned error:', data.description);
      return { success: false, error: data.description };
    }

    console.log('🚀 Telegram alert dispatched successfully!');
    return { success: true, simulated: false };
  } catch (error) {
    console.error('⚠️ Failed to send Telegram alert:', error.message);
    return { success: false, error: error.message };
  }
}

export function formatQuoteAlert(quote) {
  return `🚀 *Digitway Alert: New Quote Request!*
━━━━━━━━━━━━━━━━━━━━
📌 *Project:* ${quote.project_name}
🛠 *Service:* ${quote.service_type}
💰 *Budget:* ${quote.budget}
👤 *Email:* \`${quote.email}\`
📞 *Phone:* \`${quote.phone || 'N/A'}\`
⏱ *Timeline:* ${quote.timeline || 'Flexible'}

📝 *Brief:*
_${quote.description}_

🔗 *Admin Panel:* [Open Digitway Quotes](http://localhost:5173/admin/quotes)`;
}

export function formatReviewAlert(review) {
  const stars = '⭐'.repeat(review.rating);
  return `⭐ *Digitway Alert: New Review Pending Approval!*
━━━━━━━━━━━━━━━━━━━━
👤 *Client:* ${review.client_name} (${review.role_company || 'Client'})
🏆 *Rating:* ${stars} (${review.rating}/5)
🛠 *Service:* ${review.service_type || 'General'}

💬 *Comment:*
_${review.comment}_

🔗 *Moderate Review:* [Open Digitway Moderation](http://localhost:5173/admin/reviews)`;
}
