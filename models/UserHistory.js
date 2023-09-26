const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserHistory = sequelize.define('user_history', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  eventType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = UserHistory;
