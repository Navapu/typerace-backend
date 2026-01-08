import { Text, Game } from "../db/models/index.js";
import logger from "../config/logger.js";
import mongoose from "mongoose";


export const insertText = async(req, res, next) => {
    try{
        const {content, difficulty, language, title } = req.body || {};
        
        if(!content?.trim() || !difficulty?.trim() || !language?.trim() || !title?.trim()){
            res.status(400);
            return next(new Error("content, title,  difficulty and language are required"));
        }
        const difficultylower = difficulty.toLowerCase();
        const languagelower = language.toLowerCase();
        if(content.length < 170){
            res.status(400);
            return next(new Error("the text must be at least 170 characters long."));
        }

        if(difficultylower !== "easy" && difficultylower !== "medium" && difficultylower !== "hard"){
            res.status(400);
            return next(new Error("the difficulty has to be easy, medium or hard"));
        }
        if(languagelower !== "es" && languagelower !== "en"){
            res.status(400);
            return next(new Error("the language has to be 'es' or 'en'"));
        }
        const newText = await Text.create({
            content,
            title,
            difficulty: difficultylower,
            language: languagelower
        });

        return res.status(201).json({
            msg: "New text created",
            data: newText,
            error: false
        });
    }catch(error){
        logger.error(error, "insertText error: ");
        next(error);
    }
}

export const editText = async(req, res, next) => {
    try{
        const textId = req.text.id;
        const {title, content, language, difficulty} = req.body;

        const difficultylower = difficulty && difficulty.toLowerCase();
        const languagelower = language && language.toLowerCase();

        if(content && content.length < 170){
            res.status(400);
            return next(new Error("the text must be at least 170 characters long."));
        }

        if(difficultylower && (difficultylower !== "easy" && difficultylower !== "medium" && difficultylower !== "hard")){
            res.status(400);
            return next(new Error("the difficulty has to be easy, medium or hard"));
        }
        
        if(languagelower && (languagelower !== "es" && languagelower !== "en")){
            res.status(400);
            return next(new Error("the language has to be 'es' or 'en'"));
        }

        const updatedText = await Text.findByIdAndUpdate(textId, {
            title,
            content,
            difficulty: difficultylower,
            language: languagelower
        }, {new: true, runValidators: true} );

        if(!updatedText){
            res.status(404);
            return next(new Error("Text not found"))
        }
        return res.status(200).json({
            msg: "Updated text",
            data: updatedText,
            error: false
        });


    }catch(error){
        logger.error(error, "editText error: ");
        next(error);
    }
}

export const softDeleteText = async(req, res, next) => {
    try{
        const textId = req.text.id;

        const text = await Text.findOneAndUpdate({ _id: textId, isActive: true },{ isActive: false },{ new: true });

        if(!text){
            res.status(409);
            return next(new Error("Text already soft deleted"));
        }

        return res.status(200).json({
            msg: "Text soft deleted",
            data: text,
            error: false
        });
    }catch(error){
        logger.error(error, "softDeleteText error: ");
        next(error);
    }
}

export const permanentDeleteText = async(req, res, next) => {
    try{
        const textId = req.text.id;
        const text = await Text.findOneAndDelete({_id: textId, isActive: false})
        
        if(!text){
            res.status(409);
            return next(new Error("Text has to be soft deleted"))
        }

        const deletedGames = await Game.deleteMany({textId: textId});
        return res.status(200).json({
            msg: "Text permanently deleted",
            data: {text, deletedGames: deletedGames.deletedCount},
            error: false
        });
    }catch(error){
        logger.error(error, "permanentDeleteText error: ");
        next(error);
    }
}

export const getAllTexts = async(req, res, next) => {
    try{
        const filter = {isActive: true};
        const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
        const page = Math.max(Number(req.query.page) || 1, 1);
        const skip = (page - 1) * limit;
        
        if(req.query.difficulty) filter.difficulty = req.query.difficulty
        
        if(req.query.language) filter.language = req.query.language

        const totalTexts = await Text.countDocuments(filter);

        const texts = await Text.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);

        if(texts.length === 0){
            res.status(404);
            return next(new Error("not have found texts"))
        }
        const totalPages = Math.ceil(totalTexts / limit);
        return res.status(200).json({
            msg: "Obtained texts",
            data: {
                totalTexts,
                limit,
                page,
                skip,
                totalPages,
                texts
            },
            error: false
        })
    }catch(error){
        logger.error(error, "getAllTexts error: ");
        next(error);
    }
}

export const getRandomText = async(req, res, next) => {
    try{
        const filter = {isActive: true};
        filter.difficulty = req.query.difficulty || "medium";
        filter.language = req.query.language || "en";
        if(req.query.tags) filter.tags = { $in: req.query.tags.split(",") };
        
        const texts = await Text.find(filter);

        if(texts.length === 0){
            res.status(404);
            return next(new Error("not have found texts"))
        }
        
        const randomText = Math.floor(Math.random() * texts.length);

        return res.status(200).json({
            msg: "Random Text obtained",
            data: texts[randomText],
            error: false
        })
    }catch(error){
        logger.error(error, "getRandomText error: ");
        next(error);
    }
}
export const getMetricsText = async(req, res, next) => {
    try {
        const textId = req.text.id;
        const text = await Text.findById(textId);
        if (!text) {
            res.status(404);
            return next(new Error("Text not found"));
        }

        const metrics = await Game.aggregate([
            { $match: { textId: new mongoose.Types.ObjectId(textId) } },
            { $sort: { adjustedWPM: 1 } },
            {
                $group: {
                    _id: null,
                    bestWPM: { $max: "$adjustedWPM" },
                    avgWPM: { $avg: "$adjustedWPM" },
                    avgAccuracy: { $avg: "$accuracy" },
                    wpms: { $push: "$adjustedWPM" }
                }
            }
        ]);

        if (!metrics.length || !metrics[0].wpms.length) {
            res.status(404);
            return next(new Error("no metrics found for this text"));
        }
        const wpms = metrics[0].wpms;
        const len = wpms.length;
        let medianWPM;
        if (len % 2 === 0) {
            medianWPM = (wpms[len / 2 - 1] + wpms[len / 2]) / 2;
        } else {
            medianWPM = wpms[Math.floor(len / 2)];
        }

        res.status(200).json({
            msg: "Obtained text metrics",
            data: {
                textContent: text.content,
                bestWPM: metrics[0].bestWPM,
                avgWPM: metrics[0].avgWPM,
                medianWPM,
                avgAccuracy: metrics[0].avgAccuracy
            },
            error: false
        });
    } catch (error) {
        logger.error(error, "getMetricsText error: ");
        next(error);
    }
}