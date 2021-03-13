const router = require('express').Router();

// Routes
router.use('/management', require('./management'));
router.use('/redirect', require('./redirect'));
router.use('/vote', require('./vote'));

// Info
router
    .route('/')
    .get((req, res) =>
        res.json({
            version: 1.0,
            students: process.env.STUDENTS_EMAIL,
            teachers: process.env.TEACHERS_EMAIL
        })
    )
    .all((req, res) => res.sendStatus(405));

module.exports = router;
