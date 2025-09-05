import { verifyToken } from "../utils/helper.js";
import { APIError } from "../utils/helperClasses.js";

export const auth = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        throw new APIError("Bearer Token Missing", 401)
    }
    try {
        const decoded = await verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded; 
        next();
    } catch (err) {
        throw new APIError("Invalid or expired access token", 403);
    }
}