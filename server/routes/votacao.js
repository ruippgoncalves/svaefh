const router = require('express').Router();
const { requireAuthCriar, authAvaiable } = require('../middleware/auth');
const { query, body, validationResult } = require('express-validator');
const { randomBytes } = require('crypto');
const mongoose = require('mongoose');
const qrcode = require('qrcode');
const Votacao = require('../models/Votacao');
const Option = require('../models/Option');
const Voto = require('../models/Voto');
const email = require('../config/email');

// Get Votacoes
router.get('/obter', requireAuthCriar, (req, res) => {
    Votacao.find({ createdBy: req.user._id }, { name: 1 }).sort({ _id: -1 }).exec((err, data) => {
        if (err) {
            console.error(err);
            return res.sendStatus(400);
        }

        res.json(data);
    });
});

router.get('/mais', requireAuthCriar, [
    query('votacao', 'Código de Votação Inválido ou Inexistente!').isMongoId()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    Votacao.findOne({ createdBy: req.user._id, _id: req.query.votacao }, { _id: 0, internal: 1, ir: 1, options: 1, allow: 1, over: 1, code: 1 }, async (err, data) => {
        if (err) {
            console.error(err);
            return res.sendStatus(400);
        }

        let opts = [];
        if (typeof (data.options) != 'undefined')
            for (key of data.options) opts.push((await Option.findOne({ _id: key }, { title: 1 })).title);

        res.json({ internal: data.internal, ir: data.ir, options: opts, allow: data.allow || [], running: Boolean(data.over || data.code), code: data.code });
    });
});

// Create Votacao
router.post('/novo', requireAuthCriar, (req, res) => {
    let votacao = new Votacao({ createdBy: req.user._id });

    votacao.save((err, data) => {
        if (err) {
            console.error(err);
            return res.sendStatus(400);
        }

        delete (data.createdAt);
        delete (data.startedAt);
        delete (data.finishedAt);

        res.json(data);
    });
});

// Change Votacao's options
router.patch('/alterar', requireAuthCriar, [
    body('votacao', 'Código de Votação Inválido ou Inexistente!').isMongoId().escape(),
    body('update.internal', 'internal: Boolean').optional({ nullable: true }).isBoolean().toBoolean(),
    body('update.ir', 'ir: Boolean').optional({ nullable: true }).isBoolean().toBoolean(),
    body('update.options', 'options: Array').isArray().toArray(),
    body('update.options.*', 'options.*: String').optional({ nullable: true }).isString(),
    body('update.allow', 'allow: Array').isArray().toArray(),
    body('update.allow.*', 'allow.*: String').optional({ nullable: true }).isEmail()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let update = req.body.update;

    // Prevent updates over the createdBy code over _v and _id
    if (update.running != undefined) delete update.running;
    if (update.createdBy != undefined) delete update.createdBy;
    if (update.code != undefined) delete update.code;
    if (update.over != undefined) delete update.over;
    if (update._v != undefined) delete update._v;
    if (update._id != undefined) delete update._id;

    // Update Options
    if (update.options.length != 0) {
        await Option.deleteMany({ votacao: req.body.votacao }, err => err ? console.log(err) : null);

        await update.options.map(async (option, i) => {
            let opt = new Option({ title: option, votacao: req.body.votacao });
            await opt.save(err => err ? console.log(err) : null);

            update.options[i] = opt._id;
        });
    }

    // Update allow
    if (update.allow.length != 0) {
        update.allow.map((key, i) => update.allow[i] = key.toUpperCase());
    }

    // Update Votacao
    await Votacao.findOne({ createdBy: req.user._id, _id: req.body.votacao }, async (err, data) => {
        if (err) {
            return res.sendStatus(400);
        }

        if (data.code || data.over) return res.sendStatus(400);

        await Votacao.findOneAndUpdate({ createdBy: req.user._id, _id: req.body.votacao }, update, (err, data) => {
            if (err) {
                return res.sendStatus(400);
            }

            res.sendStatus(data ? 200 : 400);
        });
    });
});

// Start Votacao
router.post('/iniciar', requireAuthCriar, [
    body('votacao', 'Código de Votação Inválido ou Inexistente!').isMongoId()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    Votacao.findOne({ createdBy: req.user._id, _id: req.body.votacao }, { code: 1, over: 1, _id: 0 }, (err, data) => {
        if (err) {
            return res.sendStatus(400);
        }

        if (!data) return res.json({});

        if (data.over || data.code || data.options.length === 0) return res.sendStatus(400);

        // Update
        Votacao.findOneAndUpdate({ createdBy: req.user._id, _id: req.body.votacao }, { code: randomBytes(2).toString('hex').toUpperCase(), startedAt: new Date() }, { new: true }, (err, data) => {
            if (err) console.log(err);

            res.json({ code: data.code });

            if (data.allow.length !== 0)
                email(data.allow, data.code, 'Caros(as) alunos(as) e/ou professores(as),<br>Está a ser convidado para uma votação, use o código acima para poder votar.');
        });
    });
});

// Terminate Votacao
router.delete('/terminar', requireAuthCriar, [
    body('votacao', 'Código de Votação Inválido ou Inexistente!').isMongoId(),
    body('winner').isString()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    Votacao.findOneAndUpdate({ createdBy: req.user._id, _id: req.body.votacao }, { code: null, over: true, finishedAt: new Date() }, (err, data) => {
        if (err) {
            console.log(err)
            return res.sendStatus(400);
        }

        res.sendStatus(data ? 200 : 400);

        email(req.user.email + '@' + process.env.TEACHERS_EMAIL, 'Votação terminada!', 'A opção vencedora é: ' + req.body.winner);
    });
});

// Generate a QR Code for the code
router.get('/qrcode', requireAuthCriar, [
    query('code', 'Exemplo de Código: AA00').isString().isLength({ min: 4, max: 4 })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    qrcode.toDataURL(req.query.code, { scale: 30 }, (err, uri) => {
        if (err) {
            console.log(err)
            return res.sendStatus(400);
        };

        res.json({ uri: uri });
    });
});

// Get Options
router.get('/options', requireAuthCriar, [
    query('votacao', 'Código de Votação Inválido ou Inexistente!').isMongoId()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Check if the Votacao is from the User
        if (!await Votacao.findOne({ createdBy: req.user._id, _id: req.query.votacao })) return res.sendStatus(400);

        // Send Data
        res.json(await Option.find({ votacao: req.query.votacao }, { title: 1 }));
    } catch (err) {
        console.log(err);

        res.sendStatus(400);
    }
});

// Real Time Data
router.get('/rtdata', requireAuthCriar, [
    query('votacao', 'Código de Votação Inválido ou Inexistente!').isMongoId(),
    query('previous', 'Inválido').optional({ nullable: true }).isMongoId()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Check if the Votacao is from the User
        const votacao = await Votacao.findOne({ createdBy: req.user._id, _id: req.query.votacao });
        if (!votacao) return res.sendStatus(400);

        // Send all Data
        const optimize = req.query.previous ? { votacao: req.query.votacao, _id: { $gt: req.query.previous } } : { votacao: req.query.votacao };

        if (!votacao.ir) return res.json(await Voto.find(optimize, { option: 1, irpos: 1 }));

        const votos = await Voto.find(optimize, { option: 1, irpos: 1, user: 1 });
        if (!votos) return res.json({ votos: [], previous: null });

        let users = Array.from(new Set(votos.map(voto => voto.user.toString())));
        let votosFinais = new Array(users.length);

        for (let i = 0; i < users.length; i++) {
            votosFinais[i] = new Array(votacao.options.length);
        }

        votos.forEach(voto => {
            const pos = users.indexOf(voto.user.toString());

            votosFinais[pos][voto.irpos - 1] = voto.option;
        });

        const previous = votos[votos.length - 1] == undefined ? undefined : votos[votos.length - 1]._id;

        res.json({ votos: votosFinais, previous: previous });
    } catch (err) {
        console.log(err);

        res.sendStatus(400);
    }
});

// Get Votacao's Options
router.get('/votacao', authAvaiable, [
    body('code', 'Exemplo de Código: AA00')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    Votacao.findOne({ code: req.query.code }, { name: 1, internal: 1, over: 1, options: 1, allow: 1, ir: 1 }, async (err, data) => {
        if (err) {
            console.error(err);
            return res.sendStatus(400);
        }

        if (!data) return res.json({});
        if (req.user && await Voto.findOne({ votacao: data._id, user: req.user._id })) return res.json({ voted: true });

        // Get Options
        let opts = [];
        if (((data.internal && (req.user ? (data.allow.length != 0 ? data.allow.find(mail => mail.includes(req.user.email)) : true) : false)) || !data.internal) && typeof (data.options) != 'undefined')
            for (key of data.options) opts.push(await Option.findOne({ _id: key }, { title: 1 }));

        res.json({ _id: data._id, name: data.name, internal: data.internal, ir: data.ir, options: opts });
    });
});

// Vote
router.post('/votar', authAvaiable, [
    body('votacao', 'Código de Votação Inválido ou Inexistente!').isMongoId(),
    body('voto', 'voto: Array').isArray({ min: 1 }).toArray(),
    body('voto.*.opt', 'voto.*.opt: MongoId').isMongoId(),
    body('voto.*.ir', 'voto.*.ir: Int').optional({ nullable: true }).isInt().toInt()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    Votacao.findOne({ _id: req.body.votacao }, { internal: 1, over: 1, ir: 1, allow: 1, options: 1 }, async (err, data) => {
        if (err || !data) {
            return res.sendStatus(400);
        }

        // Checks if User can Vote
        if (data.over || !((data.internal && (req.user ? (data.allow.length != 0 ? data.allow.find(mail => mail.includes(req.user.email)) : true) : false)) || !data.internal)) return res.sendStatus(400);

        // Check if there is data repeated
        if (data.ir) {
            let proceed1 = new Set();
            let proceed2 = new Set();

            for (let opt of req.body.voto) {
                proceed1.add(opt.opt);
                proceed2.add(opt.ir)
            }

            if (proceed1.size != req.body.voto.length || proceed2.size != req.body.voto.length) return res.sendStatus(400);

            for (let i = req.body.voto.length; i > 0; i--) {
                if (!proceed2.has(i)) return res.sendStatus(400);
            }
        }

        // Cheks if the option selected is in the Votacao
        let proceed = true;
        req.body.voto.map(opt => proceed &= data.options.includes(opt.opt) && (!data.ir ? opt.ir == undefined : opt.ir != undefined));
        if (!proceed) return res.sendStatus(400);

        // Save in DB
        try {
            for (let opt of req.body.voto) {
                let voto = new Voto({
                    votacao: req.body.votacao,
                    option: opt.opt,
                    user: req.user ? req.user._id : null,
                    irpos: data.ir ? opt.ir : null,
                    publicUnique: !data.internal ? mongoose.Types.ObjectId() : null
                });

                await voto.save();
            };
        } catch {
            return res.sendStatus(400);
        }

        res.sendStatus(200);
    });
});

module.exports = router;
