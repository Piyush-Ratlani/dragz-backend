const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/user/signup', authController.userSignup_post);
router.post('/user/signin', authController.userSignin_post);

module.exports = router;
