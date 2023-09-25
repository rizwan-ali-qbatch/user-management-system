const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  username: 'root',
  password: null,
  database: 'practice',
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
