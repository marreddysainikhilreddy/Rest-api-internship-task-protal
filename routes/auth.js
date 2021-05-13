const express = require('express');
const router = express.Router();
const authController = require('../controller/auth');
const User = require('../models/user');

const { body } = require('express-validator/check');


router.put('/signup', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        // .custom((value, { req }) => {
        //     return User.findOne({ email: value}).then(userDoc => {
        //         if(userDoc){
        //             // return Promise.reject('Email already exists!');
        //             return res.status(409).json({ message: "email already exists"});
        //         }
        //     })
        // })
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({ min: 5}),
    body('name')
        .trim()
        .not()
        .isEmpty()
], authController.signup);

router.post('/login', authController.login);

module.exports = router;