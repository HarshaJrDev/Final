import jwt from 'jsonwebtoken';
import User from '../Schema/User.js';

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        if (!token) return res.status(401).json({ message: 'Access denied, no token provided' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user || user.activeToken !== token) {
            return res.status(403).json({ message: 'Session expired, please log in again' });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

export default authMiddleware;
