import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false
  },
  performedBy: {
    type: DataTypes.STRING, 
    allowNull: false
  },
  performedAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  targetResource: {
    type: DataTypes.STRING, // Assuming this is a resource ID, adjust type if necessary
    allowNull: false
  }
}, {
  timestamps: false // Assuming `performedAt` will be manually set
});

export { AuditLog }; // Named export
