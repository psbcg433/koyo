import { asyncHandler } from '../../utils/helper.js'
import { APIError, APIResponse } from '../../utils/helperClasses.js'
import { User } from '../../models/user.model.js';


class UserController {


    static registerUser = asyncHandler(async (req, res) => {
        try {
            const { username, email, fullname, password } = req.body;
            const avatarFile = req.file;

            await User.registerUser({
                username,
                email,
                fullname,
                password,
                avatarFile
            });

            const response = new APIResponse(201, message = "Registration successful");
            return res.status(response.statusCode).json(response);
        } catch (error) {
            throw new APIError(error.message || "Registration failed", 400);
        }
    });

    static loginUser = asyncHandler(
        async (req, res, next) => {
            const { identifier, password } = req.body;

            const { user, accessToken, refreshToken } = await User.loginUser(identifier, password);

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                // secure: process.env.NODE_ENV === 'production',
                // sameSite: 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });


            const response = new APIResponse(200, {
                user,
                accessToken,
                refreshToken
            }, "Login successful");

            return res.status(response.statusCode).json(response);
        }
    )

    static refreshAccessToken = asyncHandler(
        async (req, res, next) => {
            const token = req.cookies?.refreshToken
            const { accessToken, refreshToken } = await User.refreshAccessToken(token)

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                // secure: process.env.NODE_ENV === 'production',
                // sameSite: 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            const response = new APIResponse(200, { accessToken }, "Token refreshed");
            return res.status(response.statusCode).json(response);
        }
    )

    static logoutUser = asyncHandler(async (req, res) => {
        await User.logoutUser(req.user._id);   

        res.clearCookie("refreshToken");
        return res
            .status(200)
            .json(new APIResponse(200, null, "Logged out successfully"));
    });
}

export default UserController;
