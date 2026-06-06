import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: parseInt(process.env.PORT, 10) || 8080,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/vendorbridge',

  jwt: {
    secret: process.env.JWT_SECRET || 'vendorbridge-dev-secret-change-in-production',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
  },

  bcryptSaltRounds: 12,

  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  },

  roles: ['admin', 'procurement_officer', 'vendor', 'manager'],
};

export default config;
