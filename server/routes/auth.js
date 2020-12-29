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
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google Auth Callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: `${process.env.BACKEND}/auth/error` }), async (req, res) => {
    if (/Android|iPhone|iPad/i.test(req.headers["user-agent"])) {
        res.redirect(`${process.env.MOBILE}?user=` + await genToken(req.user));
    } else {
        res.redirect(`${process.env.FRONTEND}?user=` + await genToken(req.user));
    }
});

// Google Error
router.get('/error', (req, res) => {
    if (/Android|iPhone|iPad/i.test(req.headers["user-agent"])) {
        res.redirect(`${process.env.MOBILE}?error`);
    } else {
        res.redirect(`${process.env.FRONTEND}?error`);
    }
});

// Google Logout
router.delete('/logout', requireAuth, async (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];

    await Token.findOneAndDelete({ token: token });
    res.sendStatus(200);
});

module.exports = router;
