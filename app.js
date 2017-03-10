var require = require('rekuire');
var express = require('express');
var validator = require('express-validator');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var User = require('entity/User');

var app = express();

app.use(bodyParser.json());
app.use(validator());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hellouserjs');
var db = mongoose.connection;
db.on('error', function() {
    console.error('Mongodb connection error! Is it running?');
});
db.once('open', function() {
    console.log('Mongodb connection ok.');
});

app.use('/', require('route/user.js'));

var server = app.listen(8080, function() {
    var port = server.address().port;
    console.log('Server up! Listening at port %s.', port);
});
