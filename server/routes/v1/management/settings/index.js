const router = require('express').Router();
const { param, body } = require('express-validator');
const mongoose = require('mongoose');
const { requireAuthCreate } = require('../../../../middleware/auth');
const validate = require('../../../../middleware/validate');
const Poll = require('../../../../models/Poll');
const Option = require('../../../../models/Option');
const Vote = require('../../../../models/Vote');

// Get, Update or Delete a Poll
router
    .route('/:id')
    .get(
        // Validations
        requireAuthCreate,
        param('id').exists().isMongoId(),
        validate,

        (req, res) => {
            Poll.findOne({ _id: req.params.id, createdBy: req.user.userId })
                .populate('options', 'name')
                .select('name internal type options allow')
                .exec((err, data) => {
                    if (err) {
                        console.error(err);
                        return res.sendStatus(400);
                    }
                    return res.json(data);
                });
        }
    )
    .patch(
        // Validations
        requireAuthCreate,

        param('id').exists().isMongoId(),

        body('name').exists().isString().isLength({ min: 1, max: 30 }),
        body('internal').isBoolean().toBoolean(),
        body('type').isInt({ min: 0, max: 2 }),
        body('options').exists().isArray({ max: 31 }).toArray(),
        body('options.*')
            .optional({ nullable: true })
            .isString()
            .isLength({ min: 1, max: 30 }),
        body('allow').exists().isArray().toArray(),
        body('allow.*').optional({ nullable: true }).isEmail(),

        validate,

        async (req, res) => {
            const session = await mongoose.startSession();
            session.startTransaction();
            const update = req.body;

            try {
                // Update Poll
                const poll = await Poll.findOne({
                    createdBy: req.user.userId,
                    _id: req.params.id
                });

                if (!poll || poll.status >= 1) return res.sendStatus(400);

                // Update Options
                await Option.deleteMany({ poll: req.params.id }).session(
                    session
                );

                update.options = await update.options.map((option) => {
                    const opt = new Option({
                        name: option,
                        poll: req.params.id
                    });

                    opt.save({ session });

                    return opt._id;
                });

                // Update allow
                update.allow = await update.allow.map((key) =>
                    key.toLowerCase()
                );

                // Update Poll
                poll.name = update.name;
                poll.internal = update.internal;
                poll.type = update.type;
                poll.options = update.options;
                poll.allow = update.allow;

                await poll.save({ session });

                await session.commitTransaction();
                session.endSession();

                return res.sendStatus(200);
            } catch (err) {
                await session.abortTransaction();
                session.endSession();

                return res.status(400).json({ err });
            }
        }
    )
    .delete(
        // Validations
        requireAuthCreate,
        param('id').exists().isMongoId(),
        validate,

        async (req, res) => {
            const session = await mongoose.startSession();
            session.startTransaction();

            try {
                const poll = await Poll.findOneAndRemove(
                    {
                        _id: req.params.id,
                        createdBy: req.user.userId
                    },
                    { session }
                );

                if (!poll) throw Error();

                await Option.removeMany({ poll: req.params.id })
                    .session(session)
                    .exec();
                await Vote.removeMany({ poll: req.params.id })
                    .session(session)
                    .exec();

                await session.commitTransaction();
                session.endSession();

                return res.sendStatus(200);
            } catch {
                await session.abortTransaction();
                session.endSession();

                return res.sendStatus(400);
            }
        }
    )
    .all((req, res) => res.sendStatus(405));

module.exports = router;
