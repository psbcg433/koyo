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