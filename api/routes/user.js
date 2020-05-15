const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const checkAuth = require('../../middleware/check-auth');

const UserController = require('../controller/user');

const User = require('../models/user');
router.post('/signup', UserController.user_signup);


router.post('/login', UserController.user_login )

router.delete('/:userId', checkAuth, UserController.user_delete);
module.exports = router;