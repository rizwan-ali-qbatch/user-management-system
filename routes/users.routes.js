const router = require('express').Router();
const userController = require('../controllers/userController');
const joiSchema = require('../validations/userValidation');
const { validator } = require('../utility/common');

// Get all users
router.get('/', userController.getAllUsers);

// Get Archive Users
router.get('/archive', userController.getArchivedUsers);

// Get a specific user by ID
router.get('/:id', userController.getUserById);

// Get a specific user by Email
router.get('/email/:email', userController.getUserByEmail);

// Get users based on Roles
router.get('/role/:role', userController.getUsersByRole);

// Get users based on Search
router.get('/search/:letters', userController.getUsersByNameOrEmail);

// Update a specific user by ID
router.put('/:id', validator(joiSchema.updateUserSchema), userController.updateUser);

// Archive a specific user by ID
router.put('/archive/:id', userController.archiveUser);

// Delete a specific user by ID
router.delete('/:id', userController.deleteUser);

// Get logs for a specific user by email
router.get('/logs/:email', userController.getUserLogsByEmail);

module.exports = router;
