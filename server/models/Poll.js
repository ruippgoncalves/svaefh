const mongoose = require('mongoose');

const PollSchema = new mongoose.Schema({
    name: { type: String, required: true, default: 'Votação' },
    internal: { type: Boolean, required: true, default: true },
    createdBy: { type: String, required: true },
    type: { type: Number, required: true, default: 0 },
    code: {
        type: String,
        index: {
            unique: true,
            partialFilterExpression: {
                code: { $type: 'string' }
            }
        },
        default: null
    },
    state: { type: Number, default: 0 },
    createdAt: { type: Date, required: true, default: new Date() },
    startedAt: { type: Date, required: false },
    finishedAt: { type: Date, required: false },
    options: [
        {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'option'
        }
    ],
    allow: [
        {
            type: String,
            required: true,
            trim: true
        }
    ]
});

module.exports = mongoose.model('poll', PollSchema);
