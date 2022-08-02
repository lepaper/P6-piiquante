const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const password = require("../middleware/password")
const {limiter} = require("../middleware/ratelimite")

router.post('/signup', password, userCtrl.signup);
router.post('/login',limiter, userCtrl.login);

module.exports = router;