const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    poll: { type: mongoose.Types.ObjectId, required: true, ref: 'poll' }
});

OptionSchema.index({ poll: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('option', OptionSchema);
