const express = require('express');
const router = express.Router();

const userControllers = require('../controllers/userRegistrationController');

router.post('/signup', userControllers.SignUp);

router.post('/login', userControllers.login);

router.get('/getUserData', userControllers.userData);

module.exports = router;