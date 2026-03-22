const jwt = require("jsonwebtoken");

exports.requireSignIn = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decode;
        next();
    } catch (error) {
        return res.status(401).send({
            success: false,
            message: "Unauthorized",
        });
    }
};