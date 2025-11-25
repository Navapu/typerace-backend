import logger from '../config/logger.js';
import { User } from '../db/models/index.js';
import { hashPassword, issueToken, comparePassword } from '../services/auth.service.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const register = async(req, res, next) => {
    try{
        const {email, username, password} = req.body || {};
        if(!email?.trim() || !username?.trim() || !password?.trim()){
            res.status(400);
            return next(new Error("email, username and password are required"));
        }
        const existsUser = await User.findOne({ $or: [{ email }, { username }] })
        
        if(existsUser){
            res.status(400);
            return next(new Error("email or username already exists"))
        }

        if(!emailRegex.test(email)) {
            res.status(400);
            return next(new Error("invalid email format"));
        }

        if(username.length < 3 || username.length > 20) {
            res.status(400);
            return next(new Error("username must be between 3 and 20 characters"));
        }

        if(password.length < 6 || password.length > 50) {
            res.status(400);
            return next(new Error("password must be between 6 and 50 characters"));
        }

        const hashedPassword = await hashPassword(password);
        const newUser = await User.create({
            email,
            username,
            password: hashedPassword,
            role: "user"
        });
        const token = issueToken({
            id: newUser._id,
            email: newUser.email,
            role: newUser.role
        });
        return res.status(200).json({
            msg: 'Registered user',
            data: {
                id: newUser._id,
                email: newUser.email,
                username: newUser.username,
                token
            },
            error: false
        })
    }catch(error){
        logger.error(error, "register error: ");
        next(error);
    }
}

export const login = async(req, res, next) => {
    try{
        const {email, password} = req.body || {};

        if(!email?.trim() || !password?.trim()){
            res.status(400);
            return next(new Error("email and password are required"));
        }
        const user = await User.findOne({email: email});

        if(!user){
            res.status(401);
            return next(new Error("invalid email or password"))
        }

        const isMatch = await comparePassword(password, user.password);

        if(!isMatch){
            res.status(401);
            return next(new Error("invalid email or password"));
        }

        const token = issueToken({
            id: user._id,
            email: user.email,
            role: user.role
        })

        return res.status(200).json({
            msg: 'Correct login',
            data: {
                id: user._id,
                email: user.email,
                username: user.username,
                token
            },
            error: false
        });
    }catch(error){
        logger.error(error, "login error: ")
        next(error);
    }
}