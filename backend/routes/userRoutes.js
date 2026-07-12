const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, updateUserRole } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.use(protect, admin);

router.get('/', getUsers);
router.delete('/:id', deleteUser);
router.put('/:id/role', updateUserRole);

module.exports = router;
