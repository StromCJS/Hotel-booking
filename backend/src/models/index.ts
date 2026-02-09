// Export all models
export { default as User } from './User';
export { default as Room } from './Room';
export { default as Booking } from './Booking';

// Export database connection
export { default as mongoose, initializeDatabase } from '../config/database';
