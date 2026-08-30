import db from '../db/database.js';

export async function getAllProjects(req, res) {
  try {
    const { status, search } = req.query;

    let query = 'SELECT * FROM projects';
    const params = [];
    const conditions = [];

    if (status && status !== 'all') {
      conditions.push('status = ?');
      params.push(status);
    }

    if (search) {
      conditions.push('(title LIKE ? OR client_name LIKE ? OR contact_email LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY id DESC';

    const result = await db.execute({ sql: query, args: params });
    const projects = result.rows;
    return res.json({ projects });
  } catch (error) {
    console.error('Get projects error:', error);
    return res.status(500).json({ error: 'Failed to retrieve projects.' });
  }
}

export async function getProjectById(req, res) {
  try {
    const { id } = req.params;
    const result = await db.execute({ sql: 'SELECT * FROM projects WHERE id = ?', args: [id] });
    const project = result.rows[0];

    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    return res.json({ project });
  } catch (error) {
    console.error('Get project error:', error);
    return res.status(500).json({ error: 'Failed to retrieve project details.' });
  }
}

export async function createProject(req, res) {
  try {
    const {
      title,
      client_name,
      service_type,
      status = 'in_discussion',
      start_date,
      target_delivery,
      budget,
      contact_email,
      contact_phone,
      notes,
      progress_percentage = 0,
    } = req.body;

    if (!title || !client_name || !service_type) {
      return res.status(400).json({ error: 'Title, Client Name, and Service Type are required.' });
    }

    const result = await db.execute({
      sql: `
        INSERT INTO projects (
          title, client_name, service_type, status,
          start_date, target_delivery, budget,
          contact_email, contact_phone, notes, progress_percentage,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `,
      args: [
        title.trim(),
        client_name.trim(),
        service_type.trim(),
        status,
        start_date || new Date().toISOString().split('T')[0],
        target_delivery || '',
        budget || '',
        contact_email || '',
        contact_phone || '',
        notes || '',
        parseInt(progress_percentage || '0', 10),
      ],
    });

    return res.status(201).json({
      success: true,
      message: 'Project created successfully.',
      projectId: Number(result.lastInsertRowid),
    });
  } catch (error) {
    console.error('Create project error:', error);
    return res.status(500).json({ error: 'Failed to create project.' });
  }
}

export async function updateProject(req, res) {
  try {
    const { id } = req.params;
    const {
      title,
      client_name,
      service_type,
      status,
      start_date,
      target_delivery,
      budget,
      contact_email,
      contact_phone,
      notes,
      progress_percentage,
    } = req.body;

    const existingResult = await db.execute({ sql: 'SELECT * FROM projects WHERE id = ?', args: [id] });
    const existing = existingResult.rows[0];
    if (!existing) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    await db.execute({
      sql: `
        UPDATE projects SET
          title = ?,
          client_name = ?,
          service_type = ?,
          status = ?,
          start_date = ?,
          target_delivery = ?,
          budget = ?,
          contact_email = ?,
          contact_phone = ?,
          notes = ?,
          progress_percentage = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      args: [
        title !== undefined ? title : existing.title,
        client_name !== undefined ? client_name : existing.client_name,
        service_type !== undefined ? service_type : existing.service_type,
        status !== undefined ? status : existing.status,
        start_date !== undefined ? start_date : existing.start_date,
        target_delivery !== undefined ? target_delivery : existing.target_delivery,
        budget !== undefined ? budget : existing.budget,
        contact_email !== undefined ? contact_email : existing.contact_email,
        contact_phone !== undefined ? contact_phone : existing.contact_phone,
        notes !== undefined ? notes : existing.notes,
        progress_percentage !== undefined ? parseInt(progress_percentage, 10) : existing.progress_percentage,
        id,
      ],
    });

    return res.json({ success: true, message: 'Project updated successfully.' });
  } catch (error) {
    console.error('Update project error:', error);
    return res.status(500).json({ error: 'Failed to update project.' });
  }
}

export async function deleteProject(req, res) {
  try {
    const { id } = req.params;
    await db.execute({ sql: 'DELETE FROM projects WHERE id = ?', args: [id] });
    return res.json({ success: true, message: 'Project deleted successfully.' });
  } catch (error) {
    console.error('Delete project error:', error);
    return res.status(500).json({ error: 'Failed to delete project.' });
  }
}

export async function getDashboardOverview(req, res) {
  try {
    const totalProjectsResult = await db.execute({ sql: 'SELECT COUNT(*) as count FROM projects', args: [] });
    const totalProjects = Number(totalProjectsResult.rows[0].count);
    const activeProjectsResult = await db.execute({ sql: "SELECT COUNT(*) as count FROM projects WHERE status IN ('in_discussion', 'in_progress')", args: [] });
    const activeProjects = Number(activeProjectsResult.rows[0].count);
    const completedProjectsResult = await db.execute({ sql: "SELECT COUNT(*) as count FROM projects WHERE status = 'completed'", args: [] });
    const completedProjects = Number(completedProjectsResult.rows[0].count);

    const totalQuotesResult = await db.execute({ sql: 'SELECT COUNT(*) as count FROM quotes', args: [] });
    const totalQuotes = Number(totalQuotesResult.rows[0].count);
    const newQuotesResult = await db.execute({ sql: "SELECT COUNT(*) as count FROM quotes WHERE status = 'new'", args: [] });
    const newQuotes = Number(newQuotesResult.rows[0].count);

    const pendingReviewsResult = await db.execute({ sql: "SELECT COUNT(*) as count FROM reviews WHERE status = 'pending'", args: [] });
    const pendingReviews = Number(pendingReviewsResult.rows[0].count);
    const approvedReviewsResult = await db.execute({ sql: "SELECT COUNT(*) as count FROM reviews WHERE status = 'approved'", args: [] });
    const approvedReviews = Number(approvedReviewsResult.rows[0].count);

    const recentProjectsResult = await db.execute({ sql: 'SELECT * FROM projects ORDER BY id DESC LIMIT 5', args: [] });
    const recentProjects = recentProjectsResult.rows;
    const recentQuotesResult = await db.execute({ sql: 'SELECT * FROM quotes ORDER BY id DESC LIMIT 5', args: [] });
    const recentQuotes = recentQuotesResult.rows;

    return res.json({
      stats: {
        totalProjects,
        activeProjects,
        completedProjects,
        totalQuotes,
        newQuotes,
        pendingReviews,
        approvedReviews,
      },
      recentProjects,
      recentQuotes,
    });
  } catch (error) {
    console.error('Get overview error:', error);
    return res.status(500).json({ error: 'Failed to retrieve dashboard overview.' });
  }
}
