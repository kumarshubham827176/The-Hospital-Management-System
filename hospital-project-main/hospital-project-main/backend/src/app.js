const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { requireDbConnection } = require('./middleware/dbMiddleware');

const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const billingRoutes = require('./routes/billingRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
].filter(Boolean);

const isAllowedLocalhostOrigin = (origin) =>
  /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin || '');

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || isAllowedLocalhostOrigin(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 250,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'hospital-management-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/patients', requireDbConnection, patientRoutes);
app.use('/api/doctors', requireDbConnection, doctorRoutes);
app.use('/api/appointments', requireDbConnection, appointmentRoutes);
app.use('/api/prescriptions', requireDbConnection, prescriptionRoutes);
app.use('/api/inventory', requireDbConnection, inventoryRoutes);
app.use('/api/billing', requireDbConnection, billingRoutes);
app.use('/api/analytics', requireDbConnection, analyticsRoutes);
app.use('/api/users', requireDbConnection, userRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
