import { asyncHandler } from '../../utils/helper.js'
import { APIError, APIResponse } from '../../utils/helperClasses.js'
import { User } from '../../models/user.model.js';


class UserController {


    static registerUser = asyncHandler(async (req, res) => {
        try {
            const { username, email, fullname, password } = req.body;
            const avatarFile = req.file;

            const registeredUser = await User.registerUser({
                username,
                email,
                fullname,
                password,
                avatarFile
            });

            const response = new APIResponse(201, registeredUser, "Registration successful");
            return res.status(response.statusCode).json(response);
        } catch (error) {
            throw new APIError(error.message || "Registration failed", 400);
        }
    });



    static loginUser = asyncHandler(
        async (req, res, next) => {
            const { identifier, password } = req.body;
            if (!identifier || !password) {
                throw new APIError("Please provide the required credentials", 401)
            }
        }
    )
}

export default UserController;
