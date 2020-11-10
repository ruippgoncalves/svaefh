const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    votacao: { type: mongoose.Types.ObjectId, required: true, ref: 'Votacao' }
});

module.exports = mongoose.model('Option', OptionSchema);
