import logger from "../config/logger.js";
import { Game, Text } from "../db/models/index.js";
export const saveGame = async(req, res, next) => {
    try{
        console.log(req.user)
        const userId = req.user.id;
        const textId = req.text.id;
        const difficulty = req.text.difficulty; 
        const { rawWPM, adjustedWPM, accuracy, mode, charactersTyped, charactersCorrect, duration, startedAt, finishedAt } = req.body || {};
        const requiredFields = {
            rawWPM,
            adjustedWPM,
            accuracy,
            charactersTyped,
            charactersCorrect,
            duration,
            startedAt,
            finishedAt
        };
        for (const [key, value] of Object.entries(requiredFields)) {
            if (value === undefined || value === null) {
                res.status(400);
                return next(new Error(`Missing field: ${key}`));
            }
        }
        if (typeof rawWPM !== "number" || typeof adjustedWPM !== "number" || typeof accuracy !== "number") {
            res.status(400);
            return next(new Error("WPM and accuracy must be numbers"));
        }

        // Validate mode
        const allowedModes = ["normal", "time-attack", "zen"];
        if (!allowedModes.includes(mode)) {
            res.status(400);
            return next(new Error("Invalid mode"));
        }
        const text = await Text.findById(textId);
        const charactersWrong = charactersTyped - charactersCorrect;
        const game = await Game.create({
            userId,
            textId,
            rawWPM,
            adjustedWPM,
            accuracy,
            mode,
            difficulty,
            charactersTyped,
            charactersCorrect,
            charactersWrong,
            duration,
            startedAt,
            finishedAt
        })

        return res.status(200).json({
            msg: "Game saved",
            data: game,
            error:false
        });
        
    }catch(error){
        logger.error(error, "saveGame error: ");
        next(error)
    }
}

export const getUserGameHistory = async(req, res, next) =>{
    try{
        const userId = req.user.id;
        const gameFilter = {userId};
        
        const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
        const page = Math.max(Number(req.query.page) || 1, 1);
        const skip = (page - 1) * limit;

        if(req.query.difficulty) gameFilter.difficulty = req.query.difficulty;
        if(req.query.mode) gameFilter.mode = req.query.mode;

        const totalGames = await Game.countDocuments(gameFilter);


        const games = await Game.find(gameFilter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate({
            path: "textId",
            select: "content"
        })
        const totalPages = Math.ceil(totalGames / limit);
        
        res.status(200).json({
            msg: "Games history :",
            data: {
                totalGames,
                limit,
                page,
                skip,
                totalPages,
                games
            },
            error: false
        })
    }catch(error){
        logger.error(error, "getUserGameHistory error: ");
        next(error);
    }
}