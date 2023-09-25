const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');
require('dotenv').config();


const BearerAuth = (req, res, next) => {
  const authorizationHeader = req.headers['authorization'];
  if (!authorizationHeader) {
    return res.status(401).json({ message: 'Invalid Token.' });
  }
  const token = authorizationHeader.split(' ')[1];
  try {
    const secretKey = process.env.SECRET_KEY;
    const decodedToken = jwt.verify(token, secretKey);
    return decodedToken && next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Token is invalid.' });
  }
}

module.exports = {
  BearerAuth,
}