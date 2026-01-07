import mongoose from "mongoose";

const options = {
    collection :"texts",
    strict: true,
    collation: {
        locale: "en",
        strength: 1,
  },
};

const textSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        required: true
    },
    language: {
        type: String,
        enum: ["es", "en"],
        default: "es"
    },
    tags: {
        type: [String],
        enum: ["coding", "random", "punctuations", "numbers"],
        default: []
    },
    timesPlayed: {
        type: Number,
        default: 0
    }
}, {timestamps: true}, options)

export const Text = mongoose.model('Text', textSchema);