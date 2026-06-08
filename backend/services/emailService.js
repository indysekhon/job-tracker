const nodemailer = require('nodemailer');
const cron = require('node-cron');
const pool = require('../config/db');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendFollowUpReminders = async () => {
  console.log('📧 Checking for follow-up reminders...');
  
  try {
    // Get applications with follow-up date = today
    const result = await pool.query(`
      SELECT a.*, u.email, u.name 
      FROM applications a
      JOIN users u ON a.user_id = u.id
      WHERE a.follow_up_date = CURRENT_DATE
      AND a.status NOT IN ('offer', 'rejected')
    `);

    for (const app of result.rows) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: app.email,
        subject: `🎯 Follow-up Reminder: ${app.company}`,
        html: `
          <h2>Hi ${app.name}! 👋</h2>
          <p>This is a reminder to follow up on your application:</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3>${app.company}</h3>
            <p><strong>Position:</strong> ${app.position}</p>
            <p><strong>Status:</strong> ${app.status}</p>
            ${app.applied_date ? `<p><strong>Applied:</strong> ${new Date(app.applied_date).toLocaleDateString()}</p>` : ''}
          </div>
          <p>Good luck! 🍀</p>
          <p>- Sek Job Tracker</p>
        `
      });
      console.log(`✅ Reminder sent to ${app.email} for ${app.company}`);
    }
  } catch (error) {
    console.error('❌ Error sending reminders:', error);
  }
};

// Run every day at 9 AM
const startReminderCron = () => {
  cron.schedule('0 9 * * *', sendFollowUpReminders);
  console.log('⏰ Follow-up reminder cron job scheduled (9 AM daily)');
};

module.exports = { startReminderCron, sendFollowUpReminders };