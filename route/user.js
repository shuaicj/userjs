var require = require('rekuire');
var express = require('express');
var logger = require('winston');
var util = require('util');
var User = require('entity/User');
var router = express.Router();

router.post('/users', function(req, res) {
    req.checkBody('username', 'username required').notEmpty();
    req.checkBody('password', 'password required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.status(400).send({ message: util.inspect(errors) });
        return;
    }

    var user = new User({ 
        username: req.body.username, 
        password: req.body.password, 
    });

    user.save(function(err) {
        if (err) { 
            if (err.name === 'MongoError' && err.code === 11000) {
                res.status(400).send({ message: 'already exists' });
            } else {
                res.status(500).send({ message: 'db error' });
            }
            return;
        }
        logger.debug('new user %j', user);
        res.status(200).json({ 
            username: user.username, 
            createdAt: user.createdAt 
        });
    });
});

router.get('/users/:username', function(req, res) {
    req.checkParams('username', 'username required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.status(400).send({ message: util.inspect(errors) });
        return;
    }

    User.findOne({ username: req.params.username }, function(err, user) {
        if (err) {
            res.status(500).send({ message: 'db error' });
            return;
        }
        if (!user) {
            res.status(404).json({ message: 'not found' });
            return;
        }
        logger.debug('get user %j', user);
        res.status(200).json({ 
            username: user.username, 
            createdAt: user.createdAt 
        });
    });
});

router.put('/users/:username', function(req, res) {
    req.checkParams('username', 'username required').notEmpty();
    req.checkBody('password', 'password required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.status(400).send({ message: util.inspect(errors) });
        return;
    }

    var username = req.params.username;
    var password = req.body.password;

    User.findOneAndUpdate({ username: username }, 
            { password: password }, { new: true }, function(err, user) {
        if (err) {
            res.status(500).send({ message: 'db error' });
            return;
        }
        if (!user) {
            res.status(404).json({ message: 'not found' });
            return;
        }
        logger.debug('put user %j', user);
        res.status(200).json({ 
            username: user.username, 
            updatedAt: user.updatedAt 
        });
    });
});

router.delete('/users/:username', function(req, res) {
    req.checkParams('username', 'username required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.status(400).send({ message: util.inspect(errors) });
        return;
    }

    User.findOneAndRemove({ username: req.params.username }, function(err, user) {
        if (err) {
            res.status(500).send({ message: 'db error' });
            return;
        }
        if (!user) {
            res.status(404).json({ message: 'not found' });
            return;
        }
        logger.debug('delete user %j', user);
        res.status(200).json({ message: 'ok' });
    });
});

router.post('/users/:username/sessions', function(req, res) {
    req.checkHeaders('user-agent', 'user-agent required').notEmpty();
    req.checkParams('username', 'username required').notEmpty();
    req.checkBody('password', 'password required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.status(400).send({ message: util.inspect(errors) });
        return;
    }

    var username = req.params.username;
    var password = req.body.password;
    var userAgent = req.headers['user-agent'];

    User.findOneAndUpdate({ username: username, password: password },
            { $push: { sessions: { httpUserAgent: userAgent } } }, 
            { new: true }, function(err, user) {
        if (err) {
            res.status(500).send({ message: 'db error' });
            return;
        }
        if (!user) {
            res.status(404).json({ message: 'not found' });
            return;
        }
        logger.debug('new-session user %j', user);
        res.status(200).json({ 
            username: user.username, 
            sessionId: user.sessions[user.sessions.length - 1]._id,
            sessionCreatedAt: user.sessions[user.sessions.length - 1].sessionCreatedAt
        });
    });
});

router.delete('/users/:username/sessions/:sessionId', function(req, res) {
    req.checkParams('username', 'username required').notEmpty();
    req.checkParams('sessionId', 'sessionId required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.status(400).send({ message: util.inspect(errors) });
        return;
    }

    var username = req.params.username;
    var sessionId = req.params.sessionId;

    User.findOneAndUpdate({ username: username, 'sessions._id': sessionId }, 
            { $pull: { sessions: { _id: sessionId } } }, 
            { new: true }, function(err, user) {
        if (err) {
            res.status(500).send({ message: 'db error' });
            return;
        }
        if (!user) {
            res.status(404).json({ message: 'not found' });
            return;
        }
        logger.debug('delete-session user %j', user);
        res.status(200).json({ message: 'ok' });
    });
});

module.exports = router;
