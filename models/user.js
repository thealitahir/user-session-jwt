const mongoose = require('mongoose');
const validator = require('mongoose-validator');

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            trim: true,
            unique: true,
            required: [true, 'Email is required'],
            validate: [
                validator({
                    validator: 'isEmail',
                    message: 'Please enter a valid email'
                })
            ]
        },
        password: {
            type: String,
            trim: true,
            minlength: [8, 'Password must be 8 characters or longer'],
            required: [true, 'Password is required']
        },
		last_logged_in_at: {
			type: Date,
			defaultValue: Date.now
		},
        sessions: []
    },
    { timestamps: true }
);

userSchema.methods.toJSON = function () {
    let obj = this.toObject();
    delete obj.password;
    return obj;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
