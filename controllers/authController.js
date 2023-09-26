const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserHistory = require('../models/UserHistory');
const User = require('../models/Users');
const { tryCatch } = require('../utility/common');
require('dotenv').config();

exports.signup = (req, res, next) =>
  tryCatch(next, async () => {
    const { name, password, email, role } = req.body;
    const existingUser = await User.findOne(
      { where: { email } },
      { attributes: { exclude: ['createdAt', 'updatedAt'] } }
    );
    if (existingUser)
      return res
        .status(400)
        .json({ message: 'User with this email already exists.' });

    const newUser = await User.create({
      name,
      email,
      password,
      role,
    });

    await UserHistory.create({
      userId: newUser.id,
      eventType: 'signup',
    });

    res.status(201).json({ message: `${name} registered successfully!` });
  });

exports.login = async (req, res, next) =>
  tryCatch(next, async () => {
    const { email, password } = req.body;
    // const { error } = loginSchema.validate(req.body);
    // if (error)
    //   return res.status(400).json({ message: error.details[0].message });

    const loginUser = await User.findOne(
      { where: { email } },
      { attributes: { exclude: ['createdAt', 'updatedAt'] } }
    );
    if (!loginUser)
      return res
        .status(401)
        .json({ message: 'Authentication failed. User not found.' });

    const passwordMatch = bcrypt.compareSync(password, loginUser.password);
    const secretKey = process.env.SECRET_KEY;
    if (!passwordMatch)
      return res
        .status(401)
        .json({ message: 'Authentication failed. Invalid password.' });

    const token = jwt.sign(
      { userId: loginUser.id, email: loginUser.email },
      secretKey,
      { expiresIn: '1h' }
    );

    await UserHistory.create({
      userId: loginUser.id,
      eventType: 'login',
    });

    return res.json({ token });
  });

exports.logout = async (req, res, next) =>
  tryCatch(next, async () => {
    const userId = req.decoded_token?.userId;

    await UserHistory.create({
      userId,
      eventType: 'logout',
    });

    return res.json({ message: 'Logout successful.' });
  });
