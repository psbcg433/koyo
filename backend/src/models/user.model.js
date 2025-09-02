import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    username: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, },
    fullname: { type: String, required: true, trim: true, index: true },
    avatar: { type: String, required: true },
    coverImage: { type: String },
    watchHistory: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Video'
        }], default: []
    },
    password: { type: String, required: [true, 'Password is required'] },
    refreshToken: { type: String, default: null },

},
    {
        timestamps: true

    })


userSchema.statics.generateAccessToken = async function (user) {

    const token = await jwt.sign({ _id: user._id, email: user.email, username: user.username, fullname: user.fullname }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });
    return token;
}

userSchema.statics.generateRefreshToken = async function (user) {

    const token = await jwt.sign({ _id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });
    return token;
}




export const User = mongoose.model("User", userSchema);