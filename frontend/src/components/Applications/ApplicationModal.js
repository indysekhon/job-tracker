import React, { useState, useEffect } from 'react';
import { createApplication, updateApplication } from '../../services/api';
import './ApplicationModal.css';

const ApplicationModal = ({ application, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    status: 'wishlist',
    salary_min: '',
    salary_max: '',
    job_url: '',
    notes: '',
    applied_date: '',
    follow_up_date: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (application) {
      setFormData({
        company: application.company || '',
        position: application.position || '',
        status: application.status || 'wishlist',
        salary_min: application.salary_min || '',
        salary_max: application.salary_max || '',
        job_url: application.job_url || '',
        notes: application.notes || '',
        applied_date: application.applied_date?.split('T')[0] || '',
        follow_up_date: application.follow_up_date?.split('T')[0] || ''
      });
    }
  }, [application]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
        applied_date: formData.applied_date || null,
        follow_up_date: formData.follow_up_date || null
      };

      if (application) {
        await updateApplication(application.id, dataToSend);
      } else {
        await createApplication(dataToSend);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save application');
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{application ? 'Edit Application' : 'Add New Application'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Company *</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Google, Apple, etc."
                required
              />
            </div>
            <div className="form-group">
              <label>Position *</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="Software Engineer"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="wishlist">📝 Wishlist</option>
                <option value="applied">📤 Applied</option>
                <option value="interview">💬 Interview</option>
                <option value="offer">🎉 Offer</option>
                <option value="rejected">❌ Rejected</option>
              </select>
            </div>
            <div className="form-group">
              <label>Job URL</label>
              <input
                type="url"
                name="job_url"
                value={formData.job_url}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Salary Min ($)</label>
              <input
                type="number"
                name="salary_min"
                value={formData.salary_min}
                onChange={handleChange}
                placeholder="50000"
              />
            </div>
            <div className="form-group">
              <label>Salary Max ($)</label>
              <input
                type="number"
                name="salary_max"
                value={formData.salary_max}
                onChange={handleChange}
                placeholder="80000"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Applied Date</label>
              <input
                type="date"
                name="applied_date"
                value={formData.applied_date}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Follow-up Date</label>
              <input
                type="date"
                name="follow_up_date"
                value={formData.follow_up_date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any notes about this application..."
              rows="3"
            />
          </div>

          {error && <p className="error">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Saving...' : (application ? 'Update' : 'Add Application')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal;