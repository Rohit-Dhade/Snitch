import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import UserModel from '../models/user.model.js';

export const authenticateSeller = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized request" });
    }
    try {

        const decodedToken = jwt.verify(token, config.JWT_SECRET);
        const user = await UserModel.findById(decodedToken.id).select("-password");
        if (!user) {
            return res.status(401).json({ error: "Unauthorized request" });
        }

        if (user.role !== "seller") {
            return res.status(403).json({ error: "Forbidden" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: error.message || "Invalid access token" });
    }
};


export const authenticateUser = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized request" });
    }
    try {

        const decodedToken = jwt.verify(token, config.JWT_SECRET);
        const user = await UserModel.findById(decodedToken.id).select("-password");
        if (!user) {
            return res.status(401).json({ error: "Unauthorized request" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: error.message || "Invalid access token" });
    }
}
