const mongoose = require('mongoose');

const VotacaoSchema = new mongoose.Schema({
    name: { type: String, required: true, default: 'Votação' },
    internal: { type: Boolean, required: true, default: true },
    createdBy: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    ir: { type: Boolean, required: true, default: false },
    code: {
        type: String, index: {
            unique: true,
            partialFilterExpression: {
                code: { $type: 'string' }
            }
        }
    },
    over: { type: Boolean, default: false },
    createdAt: { type: Date, required: true, default: new Date() },
    startedAt: { type: Date, required: false },
    finishedAt: { type: Date, required: false },
    options: [{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Option'
    }],
    allow: [{
        type: String,
        required: true,
        trim: true
    }]
});

module.exports = mongoose.model('Votacao', VotacaoSchema);
