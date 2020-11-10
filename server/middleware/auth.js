const jwt = require('jsonwebtoken');
const Token = require('../models/Token');

// TODO: Validar na BD
async function validarDB(token) {
    try {
        let dat = await Token.findOne({ token: token });

        return !Boolean(dat);
    } catch (err) {
        console.log(err);
        return true;
    }
}

function requireAuth(req, res, next) {
    const auth = req.headers['authorization'];
    const token = auth && auth.split(' ')[1];

    if (token == null) res.sendStatus(403);

    jwt.verify(token, process.env.TOKEN, async (err, user) => {
        if (err || await validarDB(token)) return res.sendStatus(403);

        req.user = user.user;
        next();
    });
}

function requireAuthCriar(req, res, next) {
    const auth = req.headers['authorization'];
    const token = auth && auth.split(' ')[1];

    if (token == null) return res.sendStatus(403);

    jwt.verify(token, process.env.TOKEN, async (err, user) => {
        if (err || !user.user.criarVotacao || await validarDB(token)) return res.sendStatus(403);

        req.user = user.user;
        next();
    });
}

function authAvaiable(req, res, next) {
    const auth = req.headers['authorization'];
    const token = auth && auth.split(' ')[1];

    if (token == null) return next();

    jwt.verify(token, process.env.TOKEN, async (err, user) => {
        if (err || await validarDB(token)) return res.sendStatus(403);

        req.user = user.user;
        next();
    });
}

module.exports = {
    requireAuth,
    requireAuthCriar,
    authAvaiable
};
