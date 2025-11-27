import {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI} from './config.js';
import GoogleStrategy from 'passport-google-oauth20';
import passport from 'passport';
import logger from './logger.js';
import { slugFromEmail } from '../utils/helpers.js';


export const callbackFunction = (accessToken, refreshToken, profile, done) => {
    try{
        const userData = {
            googleId: profile.id,
            email: profile.emails[0].value,
            username: slugFromEmail(profile.emails[0].value)
        }
        return done(null, userData);
    }catch(error){
        logger.error(error, "Error in Google Strategy: ")
        done(null, error)
    }
}

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_REDIRECT_URI,
    },
    callbackFunction
));
export default passport;