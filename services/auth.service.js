import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { JWT_SECRET } from '../config/config.js';
import { User } from '../db/models/index.js';
import logger from '../config/logger.js';

export const issueToken = (user) => {
    return jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role
    },
    JWT_SECRET,
    {expiresIn: "15m"}
    );
};

export const issueRefreshToken = (user) => {
    return jwt.sign({
        id: user.id,
    },
    JWT_SECRET,
    {expiresIn: "30d"}
    );
}

export const verifyToken = async(token) => {
    try{
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.id);

        if(!user){
            return null;
        }
        
    return decoded;
    }catch(error){
        return null;
    }

}

export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

export const comparePassword = async(password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}