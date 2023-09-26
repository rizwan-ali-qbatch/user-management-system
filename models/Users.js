const bcrypt = require('bcrypt');
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const UserHistory = require('./UserHistory');

const User = sequelize.define('users', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(72),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('Admin', 'Owner', 'Manager'),
    defaultValue: 'Manager',
    allowNull: false,
  },
  is_archived: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
});

User.addHook('beforeSave', async (user) => {
  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  } catch (error) {
    throw new Error('Password hashing failed');
  }
})

User.hasMany(UserHistory, { foreignKey: 'userId' });
module.exports = User;
