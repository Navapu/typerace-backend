import mongoose from "mongoose";

export const validateObjectId = (fieldName, location = "params") => (req, res, next) => {
    const id = location === "params" ? req.params[fieldName] : req.body[fieldName];
    if(!id || !mongoose.Types.ObjectId.isValid(id)){
        res.status(400);
        return next(new Error(`Invalid ${fieldName}`))
    }
    next()
}