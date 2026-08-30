import db from '../db/database.js';
import { sendTelegramNotification, formatQuoteAlert } from '../services/telegramService.js';

export async function submitQuote(req, res) {
  try {
    const { client_name, project_name, service_type, description, budget, email, phone, timeline } = req.body;

    if (!client_name || !project_name || !service_type || !description || !budget || !email) {
      return res.status(400).json({
        error: 'Please fill in all required fields: Client Name, Project Name, Service Type, Description, Budget, and Email.',
      });
    }

    if (client_name.trim().length > 100) {
      return res.status(400).json({ error: 'Client name must be 100 characters or less.' });
    }

    const insertResult = await db.execute({
      sql: `
        INSERT INTO quotes (client_name, project_name, service_type, description, budget, email, phone, timeline, status, is_read)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', 0)
      `,
      args: [
        client_name.trim(),
        project_name.trim(),
        service_type.trim(),
        description.trim(),
        budget.trim(),
        email.trim().toLowerCase(),
        phone ? phone.trim() : '',
        timeline ? timeline.trim() : 'Flexible',
      ],
    });

    const quoteId = insertResult.lastInsertRowid;
    const newQuote = {
      id: quoteId,
      client_name,
      project_name,
      service_type,
      description,
      budget,
      email,
      phone,
      timeline,
    };

    try {
      await db.execute({
        sql: `
          INSERT INTO notifications (type, title, message, link, is_read)
          VALUES (?, ?, ?, ?, 0)
        `,
        args: [
          'quote_received',
          'New Quote Request',
          `New request received for "${project_name}" (${budget}) from ${client_name} (${email})`,
          `/admin/quotes`,
        ],
      });
    } catch (notifErr) {
      console.warn('Failed to insert notification:', notifErr.message);
    }

    sendTelegramNotification(formatQuoteAlert(newQuote)).catch(err =>
      console.error('Telegram alert dispatch error:', err)
    );

    return res.status(201).json({
      success: true,
      message: 'Your quote request has been received! Abdellah will review your requirements and reach out within 24 hours.',
      quoteId,
    });
  } catch (error) {
    console.error('Submit quote error:', error);
    return res.status(500).json({ error: 'Failed to submit quote request. Please try again or use direct contact links.' });
  }
}

export async function getAllQuotes(req, res) {
  try {
    const { status, search } = req.query;

    let query = 'SELECT * FROM quotes';
    const params = [];
    const conditions = [];

    if (status && status !== 'all') {
      conditions.push('status = ?');
      params.push(status);
    }

    if (search) {
      conditions.push('(project_name LIKE ? OR email LIKE ? OR description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY id DESC';

    const result = await db.execute({ sql: query, args: params });
    const quotes = result.rows;
    return res.json({ quotes });
  } catch (error) {
    console.error('Get quotes error:', error);
    return res.status(500).json({ error: 'Failed to retrieve quote requests.' });
  }
}

export async function updateQuoteStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, is_read } = req.body;

    const existingResult = await db.execute({ sql: 'SELECT * FROM quotes WHERE id = ?', args: [id] });
    const existing = existingResult.rows[0];
    if (!existing) {
      return res.status(404).json({ error: 'Quote request not found.' });
    }

    const newStatus = status !== undefined ? status : existing.status;
    const newIsRead = is_read !== undefined ? (is_read ? 1 : 0) : existing.is_read;

    await db.execute({
      sql: 'UPDATE quotes SET status = ?, is_read = ? WHERE id = ?',
      args: [newStatus, newIsRead, id],
    });

    return res.json({ success: true, message: 'Quote updated successfully.' });
  } catch (error) {
    console.error('Update quote error:', error);
    return res.status(500).json({ error: 'Failed to update quote.' });
  }
}

export async function deleteQuote(req, res) {
  try {
    const { id } = req.params;
    await db.execute({ sql: 'DELETE FROM quotes WHERE id = ?', args: [id] });
    return res.json({ success: true, message: 'Quote deleted successfully.' });
  } catch (error) {
    console.error('Delete quote error:', error);
    return res.status(500).json({ error: 'Failed to delete quote.' });
  }
}

export async function convertQuoteToProject(req, res) {
  try {
    const { id } = req.params;
    const { client_name, target_delivery, notes } = req.body;

    const quoteResult = await db.execute({ sql: 'SELECT * FROM quotes WHERE id = ?', args: [id] });
    const quote = quoteResult.rows[0];
    if (!quote) {
      return res.status(404).json({ error: 'Quote not found.' });
    }

    const startDate = new Date().toISOString().split('T')[0];
    const finalClientName = client_name || quote.client_name || quote.email.split('@')[0];
    const finalNotes = notes || `Converted from Quote #${quote.id}:\n${quote.description}`;

    const projectResult = await db.execute({
      sql: `
        INSERT INTO projects (title, client_name, service_type, status, start_date, target_delivery, budget, contact_email, contact_phone, notes, progress_percentage)
        VALUES (?, ?, ?, 'in_discussion', ?, ?, ?, ?, ?, ?, 10)
      `,
      args: [
        quote.project_name,
        finalClientName,
        quote.service_type,
        startDate,
        target_delivery || '',
        quote.budget,
        quote.email,
        quote.phone || '',
        finalNotes,
      ],
    });

    await db.execute({
      sql: 'UPDATE quotes SET status = ?, is_read = 1 WHERE id = ?',
      args: ['converted', id],
    });

    return res.json({
      success: true,
      message: 'Quote converted to active Project successfully!',
      projectId: projectResult.lastInsertRowid,
    });
  } catch (error) {
    console.error('Convert quote error:', error);
    return res.status(500).json({ error: 'Failed to convert quote to project.' });
  }
}
