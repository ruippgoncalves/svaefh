const { OAuth2Client } = require('google-auth-library');

const clientId = [
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_ID_MOBILE
];

const client = new OAuth2Client(clientId);

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: clientId
    });

    const payload = ticket.getPayload();
    const userId = payload.sub;
    const { email } = payload;

    return { userId, email };
}

function requireAuthCreate(req, res, next) {
    const auth = req.headers.authorization;
    const token = auth && auth.split(' ')[1];

    if (token == null) {
        res.sendStatus(403);
    } else {
        verify(token)
            .then((user) => {
                if (user.email.split('@')[1] !== process.env.TEACHERS_EMAIL) {
                    res.sendStatus(403);
                } else {
                    req.user = user;
                    next();
                }
            })
            .catch(() => res.sendStatus(403));
    }
}

function authAvaiable(req, res, next) {
    const auth = req.headers.authorization;
    const token = auth && auth.split(' ')[1];

    if (token === '') {
        next();
    } else {
        verify(token)
            .then((user) => {
                const domain = user.email.split('@')[1];

                if (
                    domain !== process.env.STUDENTS_EMAIL &&
                    domain !== process.env.TEACHERS_EMAIL
                ) {
                    res.sendStatus(403);
                } else {
                    req.user = user;
                    next();
                }
            })
            .catch(() => res.sendStatus(403));
    }
}

module.exports = {
    requireAuthCreate,
    authAvaiable
};
