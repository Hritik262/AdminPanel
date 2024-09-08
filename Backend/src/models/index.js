import Sequelize from 'sequelize';
import User from './user.js';
import Role from './role.js';
import Project from './project.js';
import AuditLog from './auditLog.js';
import sequelize from '../config/database.js';

// Model relationships
Role.hasMany(User);
User.belongsTo(Role);

User.hasMany(Project);
Project.belongsTo(User);

Project.belongsToMany(User, { through: 'ProjectAssignments' });
User.belongsToMany(Project, { through: 'ProjectAssignments' });

export { User, Role, Project, AuditLog };
