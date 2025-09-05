import bcrypt from 'bcrypt';
import cloudinary from '../config/cloudinary.config.js';
import fs from 'fs';
import jwt from 'jsonwebtoken';
// A utility function to handle async functons in Express routes
export function asyncHandler(fn) {
    return async function (req, res, next) {
        try {
            await fn(req, res, next);
        }
        catch (error) {
            res.status(error.status || 500)
                .json({ suceess: "false", message: error.message || "Internal Server Error" });
        }
    }
}

//function to encrypt password
export async function encryptPassword(password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

//function to compare password
export async function comparePassword(password, hashedPassword) {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
}

// upload file to cloudinary


export async function uploadToCloudinary(filePath, folder = null) {
    if (!filePath) {
        throw new Error('File path is required for upload');
    }

    try {
        const options = {
            resource_type: "auto"
        };

        if (folder) {
            options.folder = folder;
        }

        const response = await cloudinary.uploader.upload(filePath, options);
        return response;

    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Cloudinary upload failed');

    } finally {
        // Clean up the temp file regardless of success/failure
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting local file:', err);
            }
        });
    }
}



// function to generate token
export async function genrateToken(payload, secret, expiresIn = '1h') {
    const token = await jwt.sign(payload, secret, { expiresIn: expiresIn });
    return token;
}

export async function verifyToken(token, secret) {
    try {
        const decoded = await jwt.verify(token, secret);
        return decoded;
    } catch (error) {
        throw new Error('Invalid token');
    }
}