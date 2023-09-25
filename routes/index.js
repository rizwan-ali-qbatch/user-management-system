const router = require('express').Router();
const usersRoutes = require('./users.routes.js')
const authRoutes = require('./auth.routes.js');
const { BearerAuth } = require('../middleware/auth.js');

router.use('/users', BearerAuth, usersRoutes)
router.use('/auth', authRoutes)

module.exports = router;