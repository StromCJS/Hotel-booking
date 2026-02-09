import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false,
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ SQLite connection established successfully.');
    await sequelize.sync({ force: true });
  } catch (error) {
    console.error('❌ Unable to connect to SQLite:', error);
    throw error;
  }
};

export default sequelize;
