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
    }
}, { 
    timestamps: { 
        createdAt: 'createdTime',
        updatedAt: 'updatedTime'
    }
});

module.exports = mongoose.model('User', User);