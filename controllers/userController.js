
const User = require('../models/Users');
const { Op } = require('sequelize');
const _ = require('lodash');
const { updateUserSchema } = require('../validations/userValidation');
const UserHistory = require('../models/UserHistory');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'user not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getUserByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'user not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getUsersByRole = async (req, res) => {
  const { role } = req.params;
  try {
    const users = await User.findAll({ where: { role } });
    if (!users.length)
      return res
        .status(404)
        .json({ message: 'users with the specified role not found' });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getUsersByNameOrEmail = async (req, res) => {
  const { letters } = req.params;
  try {
    const users = await User.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${letters}%` } },
          { email: { [Op.like]: `%${letters}%` } },
        ],
      },
    });
    if (users.length === 0)
      return res.status(404).json({
        message:
          'No users with the specified letters in their names or email addresses',
      });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { error, value } = updateUserSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const updatedFields = _.reduce(
      _.keys(req.body),
      (fields, field) => _.merge(...fields, { [field]: req.body[field] }),
      {}
    );
    await user.update(updatedFields);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getArchivedUsers = async (req, res) => {
  try {
    const archivedUsers = await User.findAll({ where: { isArchive: true } });
    if (!archivedUsers)
      return res.status(404).json({ message: 'No archived user found.' });
    res.status(200).json({
      message: 'Archived user(s) retrieved successfully.',
      users: archivedUsers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.archiveUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isArchive = true;
    await user.save();
    res.status(200).json({ message: 'User archived successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getUserLogsByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const logs = await UserHistory.findAll({ where: { userId: user.id } });
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'user not found' });
    await user.destroy();
    res.json({ message: 'user deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
