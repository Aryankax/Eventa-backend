const express = require('express');
const router = express.Router();

const userControllers = require('../controllers/userRegistrationController');

const eventsControllers = require('../controllers/eventsController');

router.post('/signup', userControllers.SignUp);

router.post('/login', userControllers.login);

router.get('/getUserData', userControllers.userData);

router.post('/createEvent', eventsControllers.createEvent);

router.get('/getAllEvents', eventsControllers.getAllEvents);

router.post('/joinEvent/:eventId', eventsControllers.joinEvent);

module.exports = router;