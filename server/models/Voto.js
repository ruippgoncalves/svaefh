const mongoose = require('mongoose');

const VotoSchema = new mongoose.Schema({
    votacao: { type: mongoose.Types.ObjectId, required: true, ref: 'Votacao' },
    option: { type: mongoose.Types.ObjectId, required: true, ref: 'Option' },
    user: { type: mongoose.Types.ObjectId, ref: 'User', required: false },
    irpos: { type: Number, required: false },
    publicUnique: { type: mongoose.Types.ObjectId, required: false },
    votedAt: { type: Date, required: true, default: new Date() }
});

VotoSchema.index({ votacao: 1, user: 1, irpos: 1, publicUnique: 1 }, { unique: true });

module.exports = mongoose.model('Voto', VotoSchema);
