const router = require('express').Router();
const { param, body } = require('express-validator');
const mongoose = require('mongoose');
const { authAvaiable } = require('../../../middleware/auth');
const validate = require('../../../middleware/validate');
const Poll = require('../../../models/Poll');
const Vote = require('../../../models/Vote');

// Get Poll data and Vote
router
    .route('/:code')
    .get(
        // Validations
        authAvaiable,
        param('code').exists().isHexadecimal(),
        validate,

        (req, res) => {
            Poll.findOne({ code: req.params.code.toLowerCase() })
                .populate('options', 'name')
                .select('name internal type options allow')
                .exec(async (err, data) => {
                    if (err) {
                        return res.sendStatus(400);
                    }

                    if (!data) {
                        return res.sendStatus(404);
                    }

                    // Check if we can vote
                    let vote = true;

                    if (data.internal && !req.user) {
                        vote = false;
                    }

                    if (vote && data.internal && data.allow.length > 0) {
                        const mail = req.user.email.toLowerCase();

                        vote = data.allow.includes(mail);
                    }

                    if (vote && req.user) {
                        const alreadyVoted = await Vote.findOne({
                            poll: data._id,
                            user: req.user.userId
                        });

                        vote = !alreadyVoted;
                    }

                    return res.json({
                        name: data.name,
                        type: data.type,
                        options: data.options,
                        vote
                    });
                });
        }
    )
    .post(
        // Validations
        authAvaiable,
        param('code').exists().isHexadecimal(),
        body('vote').isArray({ min: 1 }).toArray(),
        body('vote.*.opt').isMongoId(),
        body('vote.*.ir').optional({ nullable: true }).isInt().toInt(),
        validate,

        (req, res) => {
            Poll.findOne({ code: req.params.code })
                .select('internal state type allow options')
                .exec(async (err, data) => {
                    if (err || !data) {
                        return res.sendStatus(400);
                    }

                    // Checks if User can Vote
                    if (data.state === 2) {
                        return res.sendStatus(400);
                    }

                    if (data.internal && !req.user) {
                        return res.sendStatus(400);
                    }

                    if (data.internal && data.allow.length !== 0) {
                        const found = data.allow.find((mail) =>
                            mail.includes(req.user.email)
                        );

                        if (!found) {
                            return res.sendStatus(400);
                        }
                    }

                    // Check if there is data repeated
                    if ([1, 2].includes(data.type)) {
                        const len = data.options.length;

                        if (req.body.vote.length !== len) {
                            return res.sendStatus(400);
                        }

                        const proceed1 = new Set();
                        const proceed2 = new Set();

                        req.body.vote.forEach((opt) => {
                            proceed1.add(opt.opt);
                            proceed2.add(opt.ir);
                        });

                        if (
                            proceed1.size !== req.body.vote.length ||
                            proceed2.size !== req.body.vote.length
                        )
                            return res.sendStatus(400);

                        for (let i = req.body.vote.length - 1; i > 0; i--) {
                            if (!proceed2.has(i)) return res.sendStatus(401);
                        }
                    }

                    // Cheks if the option selected is in the Poll
                    let proceed = true;
                    req.body.vote.forEach((opt) => {
                        proceed &= ![1, 2].includes(data.type)
                            ? opt.ir === undefined &&
                              data.options.includes(opt.opt)
                            : opt.ir !== undefined &&
                              data.options.some(
                                  (e) => e.toString() === opt.opt
                              );
                    });
                    if (!proceed) return res.sendStatus(400);

                    // Save in DB
                    const publicUnique = !data.internal
                        ? mongoose.Types.ObjectId()
                        : null;

                    const votedAt = new Date();

                    Vote.insertMany(
                        req.body.vote.map((opt) => ({
                            poll: data._id,
                            votacao: req.params.code,
                            option: opt.opt,
                            user: req.user ? req.user.userId : null,
                            irpos: [1, 2].includes(data.type) ? opt.ir : null,
                            publicUnique,
                            votedAt
                        })),
                        (err2, dt) => {
                            if (err2 || !dt) {
                                return res.sendStatus(400);
                            }

                            return res.sendStatus(200);
                        }
                    );

                    return null;
                });
        }
    )
    .all((req, res) => res.sendStatus(405));

module.exports = router;
