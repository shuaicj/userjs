var mongoose = require('mongoose');

var User = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    sessions: [{
        httpUserAgent: { type: String, required: true },
        sessionCreatedAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', User);
