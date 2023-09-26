const router = require('express').Router();
const authController = require('../controllers/authController');
const { BearerAuth } = require('../middleware/auth');
const { validator } = require('../utility/common');
const joiSchema = require('../validations/userValidation');

// sign up
router.post('/sign_up', validator(joiSchema.signupSchema), authController.signup);

// login
router.post('/login', validator(joiSchema.loginSchema), authController.login);

// logout
router.post('/logout', BearerAuth, authController.logout);

module.exports = router;
