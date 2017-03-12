var require = require('rekuire');
var config = require('config');
var express = require('express');
var validator = require('express-validator');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var User = require('entity/User');

var app = express();

app.use(bodyParser.json());
app.use(validator());

console.log('conn', process.env.MONGODB_URI || config.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI || config.MONGODB_URI);
var db = mongoose.connection;
db.on('error', function() {
    console.error('Mongodb connection error! Is it running?');
});
db.once('open', function() {
    console.log('Mongodb connection ok.');
});

app.use('/', require('route/user.js'));

var server = app.listen(config.PORT, function() {
    console.log('Server up! Listening at port %s.', config.PORT);
});
