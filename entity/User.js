var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var User = new Schema({
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
        id: ObjectId,
        httpUserAgent: String,
        createdTime: Date
    }]
}, { 
    timestamps: { 
        createdAt: 'createdTime',
        updatedAt: 'updatedTime'
    }
});

module.exports = mongoose.model('User', User);
