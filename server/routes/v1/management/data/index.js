const router = require('express').Router();
const { randomBytes } = require('crypto');
const { param } = require('express-validator');
const mongoose = require('mongoose');
const { requireAuthCreate } = require('../../../../middleware/auth');
const validate = require('../../../../middleware/validate');
const Poll = require('../../../../models/Poll');
const sendMail = require('../../../../config/email');

// Get Data or Start/Finish the Poll
router
    .route('/:id')
    .get(
        // Validations
        requireAuthCreate,
        param('id').exists().isMongoId(),
        validate,

        async (req, res) => {
            try {
                const poll = await Poll.findOne({
                    createdBy: req.user.userId,
                    _id: req.params.id
                });

                if (!poll) return res.sendStatus(400);

                if (poll.state === 0) return res.json({ state: poll.state });

                const divide = poll.type === 0 ? 1 : poll.options.length;

                let count = await mongoose.connection.db
                    .collection('votes')
                    .aggregate([
                        {
                            $match: {
                                poll: mongoose.Types.ObjectId(req.params.id)
                            }
                        },
                        {
                            $addFields: {
                                time: {
                                    $toLong: '$votedAt'
                                }
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    $floor: {
                                        $divide: ['$time', 15000]
                                    }
                                },
                                itemCount: {
                                    $sum: {
                                        $divide: [1, divide]
                                    }
                                }
                            }
                        },
                        {
                            $addFields: {
                                date: {
                                    $convert: {
                                        input: {
                                            $multiply: ['$_id', 15000]
                                        },
                                        to: 'date'
                                    }
                                }
                            }
                        },
                        {
                            $sort: {
                                date: -1
                            }
                        },
                        {
                            $limit: 7
                        },
                        {
                            $sort: {
                                date: 1
                            }
                        }
                    ])
                    .toArray();

                count = count.reduce((state, group) => {
                    const lastGroup = state[state.length - 1];
                    if (!lastGroup) {
                        return [group];
                    }

                    // The amount of 'empty' spaces that need to be filled
                    const needToFill = group._id - lastGroup._id - 1;

                    const fillerContent = [];
                    for (let i = 0; i < needToFill; i++) {
                        // Current time block, subtract 1 to be at previous block
                        // Subtract i to go back 1 block at a time
                        // Multiply by 15000 sec to be a proper timestamp
                        const fillingTimestamp = (group._id - 1 - i) * 15000;

                        fillerContent.unshift({
                            _id: fillingTimestamp,
                            itemCount: 0,
                            date: new Date(fillingTimestamp)
                        });
                    }

                    return [...state, ...fillerContent, group];
                }, []);

                const votes = await mongoose.connection.db
                    .collection('votes')
                    .aggregate([
                        {
                            $match: {
                                poll: mongoose.Types.ObjectId(req.params.id)
                            }
                        },
                        {
                            $lookup: {
                                from: 'options',
                                let: {
                                    ids: '$option'
                                },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $eq: ['$_id', '$$ids']
                                            }
                                        }
                                    },
                                    {
                                        $project: {
                                            _id: 0,
                                            name: 1
                                        }
                                    }
                                ],
                                as: 'opt'
                            }
                        },
                        {
                            $unwind: '$opt'
                        },
                        {
                            $sort: {
                                irpos: 1
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    user: '$user',
                                    publicUnique: '$publicUnique'
                                },
                                votes: {
                                    $push: '$opt'
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                votes: 1
                            }
                        }
                    ])
                    .toArray();

                return res.json({
                    votes,
                    count,
                    code: poll.code,
                    state: poll.state,
                    type: poll.type
                });
            } catch (err) {
                console.log(err);
                return res.sendStatus(400);
            }
        }
    )
    .post(
        // Validations
        requireAuthCreate,
        param('id').exists().isMongoId(),
        validate,

        async (req, res) => {
            const data = await Poll.findOne({
                _id: req.params.id,
                createdBy: req.user.userId
            });

            if (!data || data.state === 2) return res.sendStatus(400);

            if (data.options.length === 0) return res.sendStatus(200);

            if (data.state === 0) {
                data.startedAt = new Date();
            } else {
                data.finishedAt = new Date();
            }

            data.state++;
            data.code =
                data.state === 1 ? randomBytes(2).toString('hex') : null;

            if (data.state === 1 && data.allow.length > 0) {
                sendMail(data.allow.join(', '), data.code);
            }

            try {
                await data.save();
            } catch (err) {
                return res.sendStatus(400);
            }

            return res.sendStatus(200);
        }
    )
    .all((req, res) => res.sendStatus(405));

module.exports = router;
