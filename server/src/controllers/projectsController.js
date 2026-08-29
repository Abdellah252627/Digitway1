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

    const projects = db.prepare(query).all(...params);
    return res.json({ projects });
  } catch (error) {
    console.error('Get projects error:', error);
    return res.status(500).json({ error: 'Failed to retrieve projects.' });
  }
}

export async function getProjectById(req, res) {
  try {
    const { id } = req.params;
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);

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

    const insertStmt = db.prepare(`
      INSERT INTO projects (
        title, client_name, service_type, status,
        start_date, target_delivery, budget,
        contact_email, contact_phone, notes, progress_percentage,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);

    const result = insertStmt.run(
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
      parseInt(progress_percentage || '0', 10)
    );

    return res.status(201).json({
      success: true,
      message: 'Project created successfully.',
      projectId: result.lastInsertRowid,
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

    const existing = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    const updateStmt = db.prepare(`
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
    `);

    updateStmt.run(
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
      id
    );

    return res.json({ success: true, message: 'Project updated successfully.' });
  } catch (error) {
    console.error('Update project error:', error);
    return res.status(500).json({ error: 'Failed to update project.' });
  }
}

export async function deleteProject(req, res) {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM projects WHERE id = ?').run(id);
    return res.json({ success: true, message: 'Project deleted successfully.' });
  } catch (error) {
    console.error('Delete project error:', error);
    return res.status(500).json({ error: 'Failed to delete project.' });
  }
}

export async function getDashboardOverview(req, res) {
  try {
    // 1. Projects stats
    const totalProjects = db.prepare('SELECT COUNT(*) as count FROM projects').get().count;
    const activeProjects = db.prepare("SELECT COUNT(*) as count FROM projects WHERE status IN ('in_discussion', 'in_progress')").get().count;
    const completedProjects = db.prepare("SELECT COUNT(*) as count FROM projects WHERE status = 'completed'").get().count;

    // 2. Quotes stats
    const totalQuotes = db.prepare('SELECT COUNT(*) as count FROM quotes').get().count;
    const newQuotes = db.prepare("SELECT COUNT(*) as count FROM quotes WHERE status = 'new'").get().count;

    // 3. Reviews stats
    const pendingReviews = db.prepare("SELECT COUNT(*) as count FROM reviews WHERE status = 'pending'").get().count;
    const approvedReviews = db.prepare("SELECT COUNT(*) as count FROM reviews WHERE status = 'approved'").get().count;

    // 4. Recent projects
    const recentProjects = db.prepare('SELECT * FROM projects ORDER BY id DESC LIMIT 5').all();

    // 5. Recent quotes
    const recentQuotes = db.prepare('SELECT * FROM quotes ORDER BY id DESC LIMIT 5').all();

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
