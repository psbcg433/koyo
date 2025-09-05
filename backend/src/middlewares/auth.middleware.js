import { verifyToken } from "../utils/helper.js";
import { APIError } from "../utils/helperClasses.js";

export const auth = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  
  if (!authHeader) {
    throw new APIError("Authorization header missing", 401);
  }

  
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    throw new APIError("Authorization header must be in the format: Bearer <token>", 401);
  }

  const token = parts[1];
  if (!token) {
    throw new APIError("Bearer token missing", 401);
  }

  try {
    const decoded = await verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    throw new APIError("Invalid or expired access token", 403);
  }
};
