import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // This is for SSL connection, change as per your provider's requirements
    },
  },
  logging: false, // Disable Sequelize logging (optional)
});

// Test the database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to PostgreSQL database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

export default sequelize;
