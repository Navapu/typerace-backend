import logger from "../config/logger.js";
import { Game } from "../db/models/index.js";

export const saveGame = async(req, res, next) => {
    try{
        console.log(req.user)
        const userId = req.user.id;
        const textId = req.text.id; 
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
        const charactersWrong = charactersTyped - charactersCorrect;
        const game = await Game.create({
            userId,
            textId,
            rawWPM,
            adjustedWPM,
            accuracy,
            mode,
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