const { getDbStatus } = require('../config/db');

const requireDbConnection = (req, res, next) => {
  if (getDbStatus()) {
    return next();
  }

  return res.status(503).json({
    message: 'Database is currently unavailable. Please try again shortly.',
  });
};

module.exports = { requireDbConnection };
