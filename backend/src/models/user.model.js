import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import validator from "validator";

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
        minlength: [3, 'Username must be at least 3 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: 'Please provide a valid email address',
        },
    },
    fullname: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        index: true,
        minlength: [3, 'Full name must be at least 3 characters'],
    },
    avatar: {
        type: String,
        required: [true, 'Avatar URL is required'],
        validate: {
            validator: validator.isURL,
            message: 'Please provide a valid URL for the avatar',
        },
    },
    coverImage: {
        type: String,
        validate: {
            validator: function (v) {
                return v ? validator.isURL(v) : true; // Allow empty or valid URL
            },
            message: 'Please provide a valid URL for the cover image',
        },
    },
    watchHistory: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Video'
        }],
        default: []
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        validate: {
            validator: validator.isStrongPassword,
            message: 'Please provide a stronger password (at least 6 characters, including uppercase, lowercase, number, and symbol)'
        },
    },
    refreshToken: {
        type: String,
        default: null
    }
},
    {
        timestamps: true
    }
);

// Token generation static methods
userSchema.statics.generateAccessToken = async function (user) {
    const token = await jwt.sign(
        {
            _id: user._id,
            email: user.email,
            username: user.username,
            fullname: user.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
    return token;
};

userSchema.statics.generateRefreshToken = async function (user) {
    const token = await jwt.sign(
        { _id: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
    return token;
};

export const User = mongoose.model("User", userSchema);
