const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('../models/user');

exports.signup = async (req, res) => {
    try {
        //get user fields from req.body
        const { email, password } = req.body;
        let errors = [];

        if (!email) {
            errors.push('Email is required');
        }
        if (!password) {
            errors.push('Password is required');
        }
        if (errors.length > 0) {
            errors = errors.join(',');
            return res.status(400).json({
                status: false,
                errorMessage: 'Bad Request',
                errorDetails: errors
            });
        }
        //check if email already exists
        const alreadyExistEmail = await User.findOne({ email: req.body.email });
        if (alreadyExistEmail) {
            return res.status(403).json({
                status: false,
                errorMessage: 'User already exists'
            })
        }
        //creating new user
        let newUser = await User.create({
            email,
            password
        });
        let salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);

        await newUser.save();
        //assign json web 
        const payload = {
            user: {
                id: newUser.id
            }
        };
        return res.status(201).json({
            status: true,
            data: newUser
        });
    } catch (err) {
        return res.status(400).json({
            status: false,
            message: err
        });
    }

};

exports.login = async (req, res) => {
    try {
        //get user fields from req.body
        const { email, password } = req.body;
        let errors = [];

        if (!email) {
            errors.push('Email is required');
        }
        if (!password) {
            errors.push('Password is required');
        }
        if (errors.length > 0) {
            errors = errors.join(',');
            return res.status(400).json({
                status: false,
                errorMessage: 'Bad Request',
                errorDetails: errors
            });
        }
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(403).json({
                status: false,
                errorMessage: 'User does not exists!'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(403).json({
                status: false,
                errorMessage: 'Incorrect Password!'
            });
        }
        //update session
        const updateUserSession = await User.findOneAndUpdate(email, {
            $set:{
                last_logged_in_at: Date.now()
            }
        });
        //assign json web 
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn: 360000
            },
            (err, token, next) => {
                if (err) throw err;

                return res.status(201).json({
                    status: true,
                    token: token,
                    data: user
                });
            }
        );
    } catch (err) {
        return res.status(400).json({
            status: false,
            message: err
        });
    }

};

exports.logout = async (req, res) => {

    const user = await User.findOne({email: req.body.email});
    const logged_in_time = user.last_logged_in_at;
    const logged_out_time = new Date();
    const session = {
        logged_in_time: logged_in_time,
        logged_out_time: logged_out_time,
        duration: logged_out_time-logged_in_time
    }
    const userSession = await User.updateOne({email: req.body.email},{
        $push: {
            sessions:session
        }
    })
    return res.status(201).json({
        status: true,
        message:"User logged out."
    });
}