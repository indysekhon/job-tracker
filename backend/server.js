const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();



// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://job-tracker-bf9dp5ixj-indysekhons-projects.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/applications', require('./routes/applications'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);

});