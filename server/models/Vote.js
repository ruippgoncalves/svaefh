const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
    poll: { type: mongoose.Types.ObjectId, required: true, ref: 'poll' },
    option: { type: mongoose.Types.ObjectId, required: true, ref: 'option' },
    user: { type: String, required: false },
    irpos: { type: Number, required: false },
    publicUnique: { type: mongoose.Types.ObjectId, required: false },
    votedAt: { type: Date, required: true }
});

VoteSchema.index(
    { poll: 1, user: 1, irpos: 1, publicUnique: 1 },
    { unique: true }
);

module.exports = mongoose.model('vote', VoteSchema);
