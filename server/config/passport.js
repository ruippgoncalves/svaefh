const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

const emails = [process.env.STUDENTS_EMAIL, process.env.TEACHERS_EMAIL];

module.exports = passport => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.BACKEND + '/auth/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await User.findOne({ googleID: profile.id });

            // If user exists athenticate him
            if (user) {
                return done(null, user);
            }

            // Check if this email can be used to register
            const email = profile.emails[0].value.split('@');
            if (!(email[1] == emails[0] || email[1] == emails[1])) {
                return done(null);
            }

            // Create an user
            const newUser = new User({
                googleID: profile.id,
                email: email[0].toUpperCase(),
                criarVotacao: email[1] === emails[1] ? true : false
            });

            // Store in DB
            await User.create(newUser);
            done(null, newUser);
        } catch (err) {
            console.error(err);
        }
    }));

    // Passport required
    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user), { _id: 1, googleID: 1, email: 1, criarVotacao: 1 });
    });
}
