const router = require('express').Router();
const passport = require('passport');
const { requireAuth } = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const Token = require('../models/Token');

// Token
async function genToken(user) {
    const userToken = jwt.sign({ user: user }, process.env.TOKEN);

    const dbUserToken = new Token({ token: userToken });

    await dbUserToken.save();
    return userToken;
}

// Auth with Google
router.get('/google', (req, res, next) => {
    passport.authenticate('google', { scope: ['profile', 'email'], state: req.query.mobile })(req, res, next);
});

// Google Auth Callback
router.get('/google/callback', (req, res) => {
    passport.authenticate('google', async (err, user) => {
        if (err) {
            if (req.query.state == 'true') {
                res.redirect(`${process.env.MOBILE}?error`);
            } else {
                res.redirect(`${process.env.FRONTEND}/redirect?error`);
            }

            return;
        }

        if (req.query.state == 'true') {
            res.redirect(`${process.env.MOBILE}?user=` + await genToken(user));
        } else {
            res.redirect(`${process.env.FRONTEND}/redirect?user=` + await genToken(user));
        }
    })(req, res);
});

// Google Logout
router.delete('/logout', requireAuth, async (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];

    await Token.findOneAndDelete({ token: token });
    res.sendStatus(200);
});

module.exports = router;
