const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        unique: [true,'Email is unique, already registered'],
        required: [true, "Email is required"],
        trim: true,// space remove korar jonno use kora hoi
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        required: [true, "Age is required"],
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number');
            }
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
        minLength: [7, 'Password must be 7 or more digits'],
        maxLength: [20, 'Password too long...must be 20 or less characters'],
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error('Password must have 8 characters, 1 lowercase, 1 uppercase,1 number, 1 special symbol');
            }
        }
    }
})

userSchema.statics.findByCredentials = async(email, password) =>{
    const user = await User.findOne({email})

    if (!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {         
        throw new Error('Unable to login, password mismatch')
    }
    console.log(user);
    return user;
}

//Hash the plain text password before saving it to the database
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next();
})

const User = mongoose.model('User', userSchema)

module.exports = User