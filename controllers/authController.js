const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserHistory = require('../models/UserHistory');
const User = require('../models/Users');
const { signupSchema, loginSchema } = require('../validations/userValidation');
require('dotenv').config();

exports.signup = async (req, res) => {
  const { name, password, email, role } = req.body;
  const { error } = signupSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  try {
    const existingUser = await User.findOne({ where: { email } });
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

    res.status(201).json({ message: `${name} registered successfully!` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  try {
    const loginUser = await User.findOne({ where: { email } });
    if (!loginUser)
      return res
        .status(401)
        .json({ message: 'Authentication failed. User not found.' });

    const passwordMatch = bcrypt.compareSync(password, loginUser.password);
    const secretKey = process.env.SECRET_KEY;
    if (passwordMatch) {
      const token = jwt.sign(
        { userId: loginUser.id, email: loginUser.email },
        secretKey,
        { expiresIn: '1h' }
      );

      await UserHistory.create({
        userId: loginUser.id,
        eventType: 'login',
      });

      return res.status(200).json({ token });
    }

    res
      .status(401)
      .json({ message: 'Authentication failed. Invalid password.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.logout = async (req, res) => {
  const authorizationHeader = req.headers['authorization'];
  if (!authorizationHeader)
    return res.status(401).json({ message: 'Invalid Token.' });
  const token = authorizationHeader.split(' ')[1];
  try {
    const secretKey = process.env.SECRET_KEY;
    const decodedToken = jwt.verify(token, secretKey);
    const userId = decodedToken.userId;
    await UserHistory.create({
      userId,
      eventType: 'logout',
    });
    return res.status(200).json({ message: 'Logout successful.' });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Token is invalid.' });
  }
}





