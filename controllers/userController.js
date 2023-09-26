
const User = require('../models/Users');
const { Op } = require('sequelize');
const _ = require('lodash');
const UserHistory = require('../models/UserHistory');
const { tryCatch } = require('../utility/common');

exports.getAllUsers = async (req, res, next) =>
  tryCatch(next, async () => {
    const users = await User.findAll();
    res.json(users);
  });

exports.getUserById = async (req, res, next) =>
  tryCatch(next, async () => {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    if (!user) return res.status(404).json({ message: 'user not found' });
    res.json(user);
  });

exports.getUserByEmail = async (req, res, next) =>
  tryCatch(next, async () => {
    const { email } = req.params;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'user not found' });
    res.json(user);
  });

exports.getUsersByRole = async (req, res, next) =>
  tryCatch(next, async () => {
    const { role } = req.params;

    const users = await User.findAll({ where: { role } });
    if (!users.length)
      return res
        .status(404)
        .json({ message: 'users with the specified role not found' });
    res.json(users);
});

exports.getUsersByNameOrEmail = async (req, res, next) =>
  tryCatch(next, async () => {
    const { letters } = req.params;

    const users = await User.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${letters}%` } },
          { email: { [Op.like]: `%${letters}%` } },
        ],
      },
    });
    if (!users.length)
      return res.status(404).json({
        message:
          'No users with the specified letters in their names or email addresses',
      });
    res.json(users);
  });

exports.updateUser = async (req, res, next) =>
  tryCatch(next, async () => {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const updatedFields = {};
    _.keys(req.body).forEach(
      (field) =>
        Model.rawAttributes[field] && (updatedFields[field] = req.body[field])
    );

    await user.update(updatedFields);
    res.json(user);
  });

exports.getArchivedUsers = async (req, res, next) =>
  tryCatch(next, async () => {
    const archivedUsers = await User.findAll({ where: { is_archived: true } });

    if (!archivedUsers)
      return res.status(404).json({ message: 'No archived user found.' });
    res.status(200).json({
      message: 'Archived user(s) retrieved successfully.',
      users: archivedUsers,
    });
  });

exports.archiveUser = async (req, res, next) =>
  tryCatch(next, async () => {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.is_archived = true;
    await user.save();
    res.status(200).json({ message: 'User archived successfully' });
  });

exports.getUserLogsByEmail = async (req, res, next) =>
  tryCatch(next, async () => {
    const { email } = req.params;
    const user = await User.findOne(
      { where: { email } },
      { attributes: { exclude: ['createdAt', 'updatedAt'] } }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    const logs = await UserHistory.findAll({ where: { userId: user.id } });
    res.json(logs);
  });

exports.deleteUser = async (req, res, next) =>
  tryCatch(next, async () => {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    if (!user) return res.status(404).json({ message: 'user not found' });
    await user.destroy();
    res.json({ message: 'user deleted' });
  });
