const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { validationResult } = require('express-validator/check');

exports.signup = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = new Error('validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    try{
        const storedUser = await User.findOne({ email: email});
        if(storedUser) {
            return res.status(409).json({ message: 'Email already exists. Choose a different email.'});
        }
        const hashedPw = await bcrypt.hash(password, 12);
        const user = new User({
            email: email,
            password: hashedPw,
            name: name
        });
        const result = await user.save();
        res.status(201).json({ message: 'User created Successfully!', userId: result._id });
    }
    catch(err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loggedUser;
    try{
        const user = await User.findOne({ email: email });
        if(!user) {
            const error = new Error('A user with this email could not be found!');
            error.statusCode = 401;
            throw error;
        }
        loggedUser = user;
        const isEqual = bcrypt.compare(password, user.password);
        if(!isEqual) {
            const error = new Error('Incorrect password');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign(
            {
                email: loggedUser.email,
                userId: loggedUser._id.toString()
            },
            'secretkeyone',
            { expiresIn: '1h'}
        );

        res.status(200).json({ message: "Logged In successfully",token: token, userId: loggedUser._id.toString() });
        
    } catch(err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
};