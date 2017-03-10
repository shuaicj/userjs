var require = require('rekuire');
var express = require('express');
var util = require('util');
var User = require('entity/User');
var router = express.Router();

router.post('/users', function(req, res) {
    req.checkBody('username', 'username undefined or empty').notEmpty();
    req.checkBody('password', 'password undefined or empty').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.status(400).send(util.inspect(errors));
        return;
    }

    var user = new User({ 
        username: req.body.username, 
        password: req.body.password, 
    });

    user.save(function(err) {
        if (err) { 
            res.status(500).send('db error');
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
    req.checkParams('username', 'username undefined or empty').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.status(400).send(util.inspect(errors));
        return;
    }

    var username = req.params.username;

    User.findOne({ username: username }, function(err, user) {
        if (err) {
            res.status(500).send('db error');
            return;
        }
        if (!user) {
            res.status(200).json({ username: username, existence: false });
            return;
        }
        res.status(200).json({ username: username, existence: true });
    });
});

router.delete('/users/:username', function(req, res) {
    req.checkParams('username', 'username undefined or empty').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.status(400).send(util.inspect(errors));
        return;
    }

    var username = req.params.username;

    User.remove({ username: username }, function(err, opResult) {
        if (err) {
            res.status(500).send('db error');
            return;
        }
        console.log('remove result', opResult);
        if (!opResult && opResult.result.n === 0) {
            res.status(200).json({ username: username, existence: false });
            return;
        }
        res.status(200).json({ username: username, existence: true });
    });
});

module.exports = router;
