const router = require('express').Router();
const authController = require('../controllers/authController');
const { BearerAuth } = require('../middleware/auth');

// sign up
router.post('/sign_up', authController.signup);

// login
router.post('/login', authController.login);

// logout
router.post('/logout', BearerAuth, authController.logout);

module.exports = router;
