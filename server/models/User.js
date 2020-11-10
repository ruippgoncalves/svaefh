const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    googleID: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    criarVotacao: { type: Boolean, required: true },
    createdAt: { type: Date, required: true, default: new Date() }
});

module.exports = mongoose.model('User', UserSchema);
