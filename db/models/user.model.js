import mongoose from "mongoose";

const options = {
  collection: "users",
  strict: true,
  collation: {
    locale: "en",
    strength: 1,
  },
};

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    refreshTokens: {
        type: [{
          id: {type: String},
          token: {type: String},
          expiresAt: {type: Date}
        }],
        default: []
    },
    is_oauth: {
      type: Boolean,
      default: false
    },
    oauth_provider: {
      type: String
    },
    oauth_id: {
      type: String
    },
    totalGames: {
        type: Number,
        default: 0
    },
    bestScore: {
        type: Number,
        default: 0
    },
    scoresHistory: {
        type: [Number],
        default: []
    },
    averageScore: {
        type: Number,
        default: 0
    }
  },
  { timestamps: true },
  options
);

export const User = mongoose.model('User', userSchema);
