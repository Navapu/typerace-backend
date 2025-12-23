import logger from "../config/logger.js";
import { User } from "../db/models/index.js";
import crypto from "crypto";
import { INTERNAL_API_KEY } from "../config/config.js";
import {
  hashPassword,
  issueToken,
  comparePassword,
  issueRefreshToken,
  verifyToken,
} from "../services/auth.service.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body || {};
    if (!email?.trim() || !username?.trim() || !password?.trim()) {
      res.status(400);
      return next(new Error("email, username and password are required"));
    }
    const existsUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existsUser) {
      res.status(400);
      return next(new Error("email or username already exists"));
    }

    if (!emailRegex.test(email)) {
      res.status(400);
      return next(new Error("invalid email format"));
    }

    if (username.length < 3 || username.length > 20) {
      res.status(400);
      return next(new Error("username must be between 3 and 20 characters"));
    }

    if (password.length < 6 || password.length > 50) {
      res.status(400);
      return next(new Error("password must be between 6 and 50 characters"));
    }
    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      email,
      username,
      password: hashedPassword,
      role: "user",
    });

    const token = issueToken({
      id: newUser._id,
      email: newUser.email,
      role: newUser.role,
    });

    const refreshToken = issueRefreshToken({
      id: newUser._id,
      email: newUser.email,
      role: newUser.role,
    });
    const id = crypto.randomBytes(16).toString("hex");
    const refreshTokenHashed = await hashPassword(refreshToken);
    newUser.refreshTokens.push({
      id,
      token: refreshTokenHashed,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    await newUser.save();

    return res.status(201).json({
      msg: "Registered user",
      data: {
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
        token,
        refreshToken,
        refreshToken_id: id
      },
      error: false,
    });
  } catch (error) {
    logger.error(error, "register error: ");
    next(error);
  }
};

export const registerAdmin = async (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"];
    if (!apiKey || apiKey !== INTERNAL_API_KEY) {
      res.status(403);
      return next(new Error("invalid_api_key"));
    }
    const { email, username, password, role } = req.body || {};
    if (!email?.trim() || !username?.trim() || !password?.trim()) {
      res.status(400);
      return next(new Error("email, username and password are required"));
    }
    const existsUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existsUser) {
      res.status(400);
      return next(new Error("email or username already exists"));
    }

    if (!emailRegex.test(email)) {
      res.status(400);
      return next(new Error("invalid email format"));
    }

    if (username.length < 3 || username.length > 20) {
      res.status(400);
      return next(new Error("username must be between 3 and 20 characters"));
    }

    if (password.length < 6 || password.length > 50) {
      res.status(400);
      return next(new Error("password must be between 6 and 50 characters"));
    }
    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      email,
      username,
      password: hashedPassword,
      role: role === "admin" ? "admin" : "user",
    });

    const token = issueToken({
      id: newUser._id,
      email: newUser.email,
      role: newUser.role,
    });

    const refreshToken = issueRefreshToken({
      id: newUser._id,
      email: newUser.email,
      role: newUser.role,
    });
    const id = crypto.randomBytes(16).toString("hex");
    const refreshTokenHashed = await hashPassword(refreshToken);
    
    newUser.refreshTokens.push({
      id,
      token: refreshTokenHashed,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    await newUser.save();

    return res.status(201).json({
      msg: "Registered user",
      data: {
        email: newUser.email,
        username: newUser.username,
        role: newUser.role
      },
      error: false,
    });
  } catch (error) {
    logger.error(error, "registerAdmin error: ");
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email?.trim() || !password?.trim()) {
      res.status(400);
      return next(new Error("email and password are required"));
    }
    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(400);
      return next(new Error("invalid email or password"));
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      res.status(400);
      return next(new Error("invalid email or password"));
    }

    const token = issueToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = issueRefreshToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    const refreshTokenHashed = await hashPassword(refreshToken);
    const id = crypto.randomBytes(16).toString("hex");
    user.refreshTokens.push({
      id,
      token: refreshTokenHashed,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    await user.save();

    return res.status(200).json({
      msg: "Correct login",
      data: {
        email: user.email,
        username: user.username,
        role: user.role,
        token,
        refreshToken,
        refreshToken_id: id
      },
      error: false,
    });
  } catch (error) {
    logger.error(error, "login error: ");
    next(error);
  }
};

export const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(401);
      return next(new Error("refresh token required"));
    }

    const decoded = await verifyToken(refreshToken);

    if (!decoded) {
      res.status(401);
      return next(new Error("refresh token invalid"));
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(403);
      return next(new Error("invalid refresh token"));
    }
    const valid = await Promise.any(
      user.refreshTokens.map((rt) => comparePassword(refreshToken, rt.token))
    );

    if (!valid) {
      res.status(403);
      return next(new Error("invalid refresh token"));
    }
    const newAccessToken = issueToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    return res.json({
      msg: "Token refreshed",
      data: {
        accessToken: newAccessToken,
      },
      error: false,
    });
  } catch (error) {
    logger.error(error, "refreshAcessToken error: ");
    next(error);
  }
};

export const oauthLogin = async (req, res, next) => {
  try {
    const { googleId, email, username } = req.user || {};
    const id = crypto.randomBytes(16).toString("hex");
    if (!googleId?.trim() || !email?.trim() || !username?.trim()) {
      res.status(400);
      return next(new Error("email, username and googleId are required"));
    }

    // 1) Buscar usuario OAUTH ya existente
    let user = await User.findOne({
      email,
      is_oauth: true,
      oauth_provider: "google",
    });

    if (user) {
      const token = issueToken({
        id: user._id,
        email: user.email,
        role: user.role,
      });

      const refreshToken = issueRefreshToken({
        id: user._id,
        email: user.email,
        role: user.role,
      });
      user.refreshTokens.push({
        id,
        token: await hashPassword(refreshToken),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });

      await user.save();

      return res.redirect(`http://localhost:5173/auth/login-success?token=${token}&refreshToken=${refreshToken}&refreshToken_id=${id}`);
    }

    // 2) Usuario existente sin OAuth → convertirlo a OAuth
    user = await User.findOne({
      email,
      is_oauth: false,
    });

    if (user) {
      user.is_oauth = true;
      user.oauth_provider = "google";
      user.oauth_id = googleId;

      const token = issueToken({
        id: user._id,
        email: user.email,
        role: user.role,
      });

      const refreshToken = issueRefreshToken({
        id: user._id,
        email: user.email,
        role: user.role,
      });
      user.refreshTokens.push({
        id,
        token: await hashPassword(refreshToken),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });

      await user.save();

      return res.redirect(`http://localhost:5173/auth/login-success?token=${token}&refreshToken=${refreshToken}&refreshToken_id=${id}`);
    }
    const existsUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existsUser) {
      res.status(400);
      return next(new Error("email or username already exists"));
    }
    // 3) Usuario completamente nuevo → crearlo
    const dummyPassword = crypto.randomBytes(16).toString("hex");
    const password_hash = await hashPassword(dummyPassword);

    const userCreated = await User.create({
      email,
      username,
      password: password_hash,
      role: "user",
      is_oauth: true,
      oauth_provider: "google",
      oauth_id: googleId,
    });

    const token = issueToken({
      id: userCreated._id,
      email: userCreated.email,
      role: userCreated.role,
    });

    const refreshToken = issueRefreshToken({
      id: userCreated._id,
      email: userCreated.email,
      role: userCreated.role,
    });
    userCreated.refreshTokens.push({
      id,
      token: await hashPassword(refreshToken),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    await userCreated.save();

    return res.redirect(`http://localhost:5173/auth/login-success?token=${token}&refreshToken=${refreshToken}&refreshToken_id=${id}`);
  } catch (error) {
    logger.error(error, "oauthLogin error:");
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    return res.status(200).json({
      msg: "User obtained",
      data: {
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
      error: false,
    });
  } catch (error) {
    logger.error(error, "getUser error: ");
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { refreshToken_id } = req.body || {};

    if (!refreshToken_id) {
      res.status(400);
      return next(new Error("refreshToken_id required"));
    }

    const user = await User.findById(userId);
    const initialCount  = user.refreshTokens.length;
    const filteredTokens = user.refreshTokens.map((rt) => {
        if(rt.id === refreshToken_id) return false;
        return rt
      });

    if(initialCount  === filteredTokens.filter(Boolean).length){
      res.status(400);
      return next(new Error("invalid refreshToken_id"))
    }
    user.refreshTokens = filteredTokens.filter(Boolean);
    await user.save();

    return res.status(200).json({
      msg: "Completed logout: ",
      data: {refreshToken_id},
      error: false,
    });
  } catch (error) {
    logger.error(error, "logout error: ");
    next(error);
  }
};

export const updateUser = async(req, res, next) => {
  try{
    const userId = req.user.id;
    const { username, email } = req.body || {};

    if(!username?.trim() && !email?.trim()){
      res.status(400);
      return next(new Error("insert email or username"))
    }

    if (email && !emailRegex.test(email)) {
      res.status(400);
      return next(new Error("invalid email format"));
    }

    if (username && (username.length < 3 || username.length > 20)) {
      res.status(400);
      return next(new Error("username must be between 3 and 20 characters"));
    }

    const existsUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existsUser && existsUser._id !== userId) {
      res.status(400);
      return next(new Error("email or username already exists"));
    }

    const user = await User.findByIdAndUpdate(userId, {username: username, email: email}, {new: true});

    return res.status(200).json({
      msg: "Updated user",
      data: {
        email: user.email,
        username: user.username
      }
    });
  }catch(error){
    logger.error(error, "updateUser error: ");
    next(error);
  }
}

export const getUserInformation = async(req, res, next) => {
  try{
    const userId = req.user.id;

    const user = await User.findById(userId).select("email username");


    return res.status(200).json({
      msg: "User information: ",
      data: {
        email: user.email,
        username: user.username
      }
    })
  }catch(error){
    logger.error(error, "getUserInformation")
    next(error);
  }
}