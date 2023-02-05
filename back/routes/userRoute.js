const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');
const validatePassword = require('../middlewares/validate_password');

router.post('/signup', validatePassword, userCtrl.signup);

module.exports = router;
