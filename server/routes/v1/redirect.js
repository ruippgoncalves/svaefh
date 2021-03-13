const router = require('express').Router();
const { query } = require('express-validator');
const validate = require('../../middleware/validate');
const deeplink = require('../../lib/deeplink');

router
    .route('/')
    .get(
        // Validations
        query('code')
            .exists()
            .isString()
            .isLength({ min: 4, max: 4 })
            .matches(/[0-9a-fA-F]{4}/, 'i'),
        validate,

        // Redirect
        deeplink()
    )
    .all((req, res) => res.sendStatus(405));

module.exports = router;
