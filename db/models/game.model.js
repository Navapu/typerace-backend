import mongoose from "mongoose";

const options = {
  collection: "games",
  strict: true,
  collation: {
    locale: "en",
    strength: 1,
  },
};

const gameSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    textId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Text',
        required: true
    },
    rawWPM: {
        type: Number,
        required: true
    },
    adjustedWPM: {
        type: Number,
        required: true
    },
    accuracy: {
        type: Number,
        required: true
    },
    mode: {
        type: String,
        enum: ["normal", "time-attack", "zen"],
        default: "normal",
        required: true
    },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        required: true
    },
    charactersTyped: {
        type: Number,
        required: true
    },
    charactersCorrect: {
        type: Number,
        required: true
    },
    charactersWrong: {
        type: Number,
        default: 0
    },
    duration: {
        type: Number,
        required: true 
    },
    startedAt: {
        type: Date,
        required: true 
    },
    finishedAt: {
        type: Date,
        required: true
    },
}, { timestamps: true } , options)

export const Game = mongoose.model('Game', gameSchema);