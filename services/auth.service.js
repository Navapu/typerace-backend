import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { JWT_SECRET } from '../config/config.js';

export const issueToken = (user) => {
    return jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role
    },
    JWT_SECRET,
    {expiresIn: "15d"}
    );
};


export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

export const comparePassword = async(password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}