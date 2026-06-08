const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// @route   GET /api/applications
// @desc    Get all applications for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const applications = await pool.query(
      `SELECT * FROM applications 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json(applications.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/stats
// @desc    Get application statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = await pool.query(
      `SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'wishlist' THEN 1 END) as wishlist,
        COUNT(CASE WHEN status = 'applied' THEN 1 END) as applied,
        COUNT(CASE WHEN status = 'interview' THEN 1 END) as interview,
        COUNT(CASE WHEN status = 'offer' THEN 1 END) as offer,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected,
        COUNT(CASE WHEN response_date IS NOT NULL THEN 1 END) as responses,
        AVG(CASE WHEN response_date IS NOT NULL 
            THEN response_date - applied_date END) as avg_response_days
       FROM applications 
       WHERE user_id = $1`,
      [req.user.id]
    );

    res.json(stats.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/:id
// @desc    Get single application
router.get('/:id', auth, async (req, res) => {
  try {
    const application = await pool.query(
      'SELECT * FROM applications WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (application.rows.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/applications
// @desc    Create new application
router.post('/', auth, async (req, res) => {
  const {
    company,
    position,
    status,
    salary_min,
    salary_max,
    job_url,
    notes,
    applied_date,
    follow_up_date
  } = req.body;

  try {
    const newApp = await pool.query(
      `INSERT INTO applications 
       (user_id, company, position, status, salary_min, salary_max, job_url, notes, applied_date, follow_up_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [req.user.id, company, position, status || 'wishlist', salary_min, salary_max, job_url, notes, applied_date, follow_up_date]
    );

    res.status(201).json(newApp.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/applications/:id
// @desc    Update application
router.put('/:id', auth, async (req, res) => {
  const {
    company,
    position,
    status,
    salary_min,
    salary_max,
    job_url,
    notes,
    applied_date,
    response_date,
    follow_up_date
  } = req.body;

  try {
    // Check if application belongs to user
    const appCheck = await pool.query(
      'SELECT * FROM applications WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (appCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const updatedApp = await pool.query(
      `UPDATE applications SET
       company = COALESCE($1, company),
       position = COALESCE($2, position),
       status = COALESCE($3, status),
       salary_min = $4,
       salary_max = $5,
       job_url = $6,
       notes = $7,
       applied_date = $8,
       response_date = $9,
       follow_up_date = $10,
       updated_at = CURRENT_TIMESTAMP
       WHERE id = $11 AND user_id = $12
       RETURNING *`,
      [company, position, status, salary_min, salary_max, job_url, notes, applied_date, response_date, follow_up_date, req.params.id, req.user.id]
    );

    res.json(updatedApp.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH /api/applications/:id/status
// @desc    Update just the status (for drag & drop)
router.patch('/:id/status', auth, async (req, res) => {
  const { status } = req.body;

  try {
    const updatedApp = await pool.query(
      `UPDATE applications SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
      [status, req.params.id, req.user.id]
    );

    if (updatedApp.rows.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(updatedApp.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/applications/:id
// @desc    Delete application
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await pool.query(
      'DELETE FROM applications WHERE id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, req.user.id]
    );

    if (deleted.rows.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({ message: 'Application deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;