var require = require('rekuire');
var express = require('express');
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
        console.log('new user ' + user.username);
        res.status(200).json({ 
            username: user.username, 
            createdTime: user.createdTime 
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

    var username = req.params.username;

    User.findOne({ username: username }, function(err, user) {
        if (err) {
            res.status(500).send({ message: 'db error' });
            return;
        }
        if (!user) {
            res.status(404).json({ message: 'not found' });
            return;
        }
        res.status(200).json({ username: username, createdTime: user.createdTime });
    });
});

router.delete('/users/:username', function(req, res) {
    req.checkParams('username', 'username required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.status(400).send({ message: util.inspect(errors) });
        return;
    }

    var username = req.params.username;

    User.remove({ username: username }, function(err, opResult) {
        if (err) {
            res.status(500).send({ message: 'db error' });
            return;
        }
        if (opResult.result.n === 0) {
            res.status(404).json({ message: 'not found' });
            return;
        }
        res.status(200).json({ message: 'ok' });
    });
});

router.post('/users/:username/sessions', function(req, res) {
    req.checkParams('username', 'username required').notEmpty();
    req.checkBody('password', 'password required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.status(400).send({ message: util.inspect(errors) });
        return;
    }

});

module.exports = router;
