import mongoose, { Schema } from "mongoose";
import validator from "validator";
import { genrateToken, verifyToken, uploadToCloudinary, comparePassword } from "../utils/helper.js";
import { APIError } from "../utils/helperClasses.js";

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


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    if (!validator.isStrongPassword(this.password)) {
        throw new Error('Please provide a stronger password (at least 6 characters, including uppercase, lowercase, number, and symbol)');
    }
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
});


userSchema.statics.generateAccessToken = async function (user) {
    const payload = {
        _id: user._id,
        username: user.username,
        email: user.email
    };

    const accessToken = await genrateToken(payload, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_EXPIRY)
    return accessToken;
}

userSchema.statics.generateRefreshToken = async function (user) {
    const payload = {
        _id: user._id,
        username: user.username,
        email: user.email
    };
    const refreshToken = await genrateToken(payload, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_EXPIRY)
    return refreshToken;
}

// userSchema.statics.isUserExists = async function (username, email) {
//     const user = await this.findOne({ $or: [{ username }, { email }] });
//     return !!user;
// }


userSchema.statics.registerUser = async function ({ username, email, fullname, password, avatarFile }) {
    if (!username || !email || !fullname || !password || !avatarFile) {
        throw new APIError("All fields are required", 400);
    }

    const isUserExists = await this.findOne({
        $or: [{ username }, { email }]
    });

    if (isUserExists) {
        throw new APIError("Email or Username already in use", 409);
    }

    let avatarUrl;

    try {
        const { secure_url } = await uploadToCloudinary(avatarFile.path, 'avatars');
        avatarUrl = secure_url;
    } catch (err) {
        throw new APIError("Avatar upload failed", 500);
    }

    const user = new this({
        username,
        email,
        fullname,
        password,
        avatar: avatarUrl
    });

    await user.save();

    const savedUser = await this.findById(user._id);

    if (!savedUser) {
        throw new APIError("Registration failed", 500);
    }

    return true;
};


userSchema.statics.loginUser = async function (identifier, password) {
    if (!identifier || !password) {
        throw new APIError("All fields are required")
    }
    const user = await this.findOne(
        {
            $or: [{ username: identifier }, { email: identifier }]
        }
    )
    if (!user) {
        throw new APIError("Incorrect Credentials", 404)
    }
    const isPasswordCorrect = await comparePassword(password, user.password)
    if (!isPasswordCorrect) {
        throw new APIError("Incorrect Credentials", 401)
    }
    const fetchedUser = user.select("-password -__v -createdAt -updatedAt")
    const accessToken = this.generateAccessToken(fetchedUser)
    const refreshToken = this.generateAccessToken(fetchedUser._id)
    if (!accessToken || !refreshToken) {
        throw new APIError("Token generation failed", 500)

    }
    user.refreshToken = refreshToken
    await user.save()


    return {
        user: fetchedUser,
        accessToken,
        refreshToken
    }


}


export const User = mongoose.model("User", userSchema);
