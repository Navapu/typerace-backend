import { Text } from "../db/models/index.js";

export const validateTextId = async(req, res, next) => {
    try{
        const  textId  = req.body?.textId || req.params?.textId || {};

        if(!textId){
            res.status(400);
            return next(new Error("textId is required"));
        }
        const text = await Text.findById(textId);
        
        if (!text) {
            res.status(404);
            return next(new Error("Text not found"));
        }

        req.text = text;
        next();
    }catch(error){
        next(error);
    }
}