const Dashboard = require('../models/dashboardModel');

exports.adminDashboard = async (req, res) => {
  try {
    const period = req.query.period || 'month';
    const results = await Dashboard.adminDashboard(period);
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching Dashboard:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
