const jwt = require("jsonwebtoken");

exports.requireSignIn = async (req, res, next) => {
    // ✅ Skip auth for CORS preflight
    if (req.method === 'OPTIONS') {
        return next();
    }

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "Invalid or missing Authorization header",
            });
        }

        const token = authHeader.split(" ")[1];
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }
};
