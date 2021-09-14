const express = require('express');
const router = express.Router();

const authToken = require('../utils/authToken');
const { signup, login, logout } = require('../controllers/auth');

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/logout').put(authToken,logout);


module.exports = router;
