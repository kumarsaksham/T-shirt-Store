const express = require('express');
const router = express.Router();

const { isSignedIn, isAuthenticated } = require('../controllers/auth');
const { getToken, processPayment } = require('../controllers/paymentBT');
const { getUserById } = require('../controllers/user');

// param
router.param("userId", getUserById);

// actual route
router.get('/payment/gettoken/:userId', isSignedIn, isAuthenticated, getToken);
router.post('/payment/braintree/:userId', isSignedIn, isAuthenticated, processPayment);

module.exports = router;