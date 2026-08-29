import db from '../db/database.js';
import { sendTelegramNotification, formatReviewAlert } from '../services/telegramService.js';

export async function getPublicReviews(req, res) {
  try {
    const reviews = db.prepare(`
      SELECT id, client_name, role_company, rating, comment, service_type, is_featured, created_at
      FROM reviews
      WHERE status = 'approved'
      ORDER BY is_featured DESC, id DESC
    `).all();

    return res.json({ reviews });
  } catch (error) {
    console.error('Get public reviews error:', error);
    return res.status(500).json({ error: 'Failed to retrieve reviews.' });
  }
}

export async function submitReview(req, res) {
  try {
    const { client_name, role_company, rating, comment, service_type } = req.body;

    if (!client_name || !comment || !rating) {
      return res.status(400).json({ error: 'Name, Rating (1-5), and Comment are required.' });
    }

    const numRating = parseInt(rating, 10);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ error: 'Rating must be a whole number between 1 and 5.' });
    }

    const insertStmt = db.prepare(`
      INSERT INTO reviews (client_name, role_company, rating, comment, service_type, status, is_featured)
      VALUES (?, ?, ?, ?, ?, 'pending', 0)
    `);

    const result = insertStmt.run(
      client_name.trim(),
      role_company ? role_company.trim() : '',
      numRating,
      comment.trim(),
      service_type ? service_type.trim() : 'General'
    );

    const reviewId = result.lastInsertRowid;
    const newReview = {
      id: reviewId,
      client_name,
      role_company,
      rating: numRating,
      comment,
      service_type,
    };

    // 1. Create In-Panel Notification
    try {
      db.prepare(`
        INSERT INTO notifications (type, title, message, link, is_read)
        VALUES (?, ?, ?, ?, 0)
      `).run(
        'review_submitted',
        'New Review Pending Approval',
        `Client review submitted by ${client_name} (${numRating} Stars)`,
        `/admin/reviews`
      );
    } catch (notifErr) {
      console.warn('Failed to insert notification:', notifErr.message);
    }

    // 2. Telegram Alert
    sendTelegramNotification(formatReviewAlert(newReview)).catch(err =>
      console.error('Telegram review alert error:', err)
    );

    return res.status(201).json({
      success: true,
      message: 'Thank you for your feedback! Your review has been submitted for moderation and will appear publicly once verified.',
      reviewId,
    });
  } catch (error) {
    console.error('Submit review error:', error);
    return res.status(500).json({ error: 'Failed to submit review. Please try again.' });
  }
}

export async function getAllReviews(req, res) {
  try {
    const { status } = req.query;

    let query = 'SELECT * FROM reviews';
    const params = [];

    if (status && status !== 'all') {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY id DESC';

    const reviews = db.prepare(query).all(...params);
    return res.json({ reviews });
  } catch (error) {
    console.error('Get all reviews error:', error);
    return res.status(500).json({ error: 'Failed to retrieve reviews.' });
  }
}

export async function updateReviewStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, is_featured } = req.body;

    const existing = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Review not found.' });
    }

    const newStatus = status !== undefined ? status : existing.status;
    const newFeatured = is_featured !== undefined ? (is_featured ? 1 : 0) : existing.is_featured;

    db.prepare('UPDATE reviews SET status = ?, is_featured = ? WHERE id = ?').run(
      newStatus,
      newFeatured,
      id
    );

    return res.json({
      success: true,
      message: `Review marked as ${newStatus}.`,
    });
  } catch (error) {
    console.error('Update review status error:', error);
    return res.status(500).json({ error: 'Failed to update review status.' });
  }
}

export async function updateReview(req, res) {
  try {
    const { id } = req.params;
    const { client_name, role_company, rating, comment, service_type } = req.body;

    const existing = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Review not found.' });
    }

    db.prepare(`
      UPDATE reviews SET
        client_name = ?,
        role_company = ?,
        rating = ?,
        comment = ?,
        service_type = ?
      WHERE id = ?
    `).run(
      client_name || existing.client_name,
      role_company !== undefined ? role_company : existing.role_company,
      rating !== undefined ? parseInt(rating, 10) : existing.rating,
      comment || existing.comment,
      service_type || existing.service_type,
      id
    );

    return res.json({ success: true, message: 'Review updated successfully.' });
  } catch (error) {
    console.error('Update review error:', error);
    return res.status(500).json({ error: 'Failed to update review.' });
  }
}

export async function deleteReview(req, res) {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM reviews WHERE id = ?').run(id);
    return res.json({ success: true, message: 'Review deleted successfully.' });
  } catch (error) {
    console.error('Delete review error:', error);
    return res.status(500).json({ error: 'Failed to delete review.' });
  }
}
