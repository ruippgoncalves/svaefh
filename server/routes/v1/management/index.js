const router = require('express').Router();
const { requireAuthCreate } = require('../../../middleware/auth');
const Poll = require('../../../models/Poll');

// Routes
router.use('/settings', require('./settings'));
router.use('/data', require('./data'));

// Get Polls or Create one
router
    .route('/')
    .get(requireAuthCreate, (req, res) => {
        Poll.find(
            { createdBy: req.user.userId },
            { _id: 1, name: 1, state: 1, createdAt: 1 }
        )
            .sort({ createdAt: -1 })
            .limit(50)
            .exec((err, data) => {
                if (err) {
                    console.error(err);
                    return res.sendStatus(400);
                }

                return res.json({ data });
            });
    })
    .post(requireAuthCreate, (req, res) => {
        const poll = new Poll({ createdBy: req.user.userId });

        poll.save((err, data) => {
            if (err) {
                console.error(err);
                return res.sendStatus(400);
            }

            return res.json({ _id: data._id });
        });
    })
    .all((req, res) => res.sendStatus(405));

module.exports = router;
