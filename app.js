var require = require('rekuire');
var config = require('config');
var express = require('express');
var validator = require('express-validator');
var mongoose = require('mongoose');
var logger = require('winston');
var bodyParser = require('body-parser');
var User = require('entity/User');

logger.level = config.LOG_LEVEL;

var app = express();

app.use(bodyParser.json());
app.use(validator());

mongoose.connect(config.MONGODB_URI);
mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('error', function() {
    logger.error('Mongodb connection error! Is it running?');
});
db.once('open', function() {
    logger.info('Mongodb connection ok.');
});

app.use('/', require('route/user.js'));

var server = app.listen(config.PORT, function() {
    logger.info('Server up! Listening at port %s.', config.PORT);
});
