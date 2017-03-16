var require = require('rekuire');
var config = require('config');
var mongoose = require('mongoose');
var request = require('supertest');
var expect = require('chai').expect;

var SERVER = 'http://localhost:' + config.PORT;
var USER = 'shuaicj';
var PASS = 'pass123';
var USER2 = 'shuaijc';
var PASS2 = 'pass456';

describe('User Module', function() {
    function postUser(body) {
        return request(SERVER).post('/users').send(body);
    }
    function getUser(username) {
        return request(SERVER).get('/users/' + username);
    }
    function putUser(username, body) {
        return request(SERVER).put('/users/' + username).send(body);
    }
    function deleteUser(username) {
        return request(SERVER).delete('/users/' + username);
    }
    function postSession(username, body) {
        return request(SERVER).post('/users/' + username + '/sessions').send(body);
    }
    function deleteSession(username, sessionId) {
        return request(SERVER).delete('/users/' + username + '/sessions/' + sessionId);
    }

    beforeEach('delete the test user in db', function(done) {
        deleteUser(USER).end(done);
    });
    afterEach('delete the test user in db', function(done) {
        deleteUser(USER).end(done);
    });

    describe('POST /users', function() {
        it('no param', function(done) {
            postUser({}).expect(400, done);
        });
        it('username undefined', function(done) {
            postUser({ password: PASS }).expect(400, done);
        });
        it('username empty string', function(done) {
            postUser({ username: '', password: PASS }).expect(400, done);
        });
        it('password undefined', function(done) {
            postUser({ username: USER }).expect(400, done);
        });
        it('password empty string', function(done) {
            postUser({ username: USER, password: '' }).expect(400, done);
        });
        it('success', function(done) {
            postUser({ username: USER, password: PASS }).expect(200, function(err, res) {
                if (err) return done(err);
                expect(res.body.username).to.equal(USER);
                expect(res.body.createdAt).to.exist;
                done();
            });
        });
        it('username duplicated', function(done) {
            postUser({ username: USER, password: PASS }).expect(200, function(err) {
                if (err) return done(err);
                postUser({ username: USER, password: PASS }).expect(400, {
                    message: 'already exists'
                }, done);
            });
        });
    });

    describe('GET /users/:username', function() {
        it('username not exists', function(done) {
            getUser(USER).expect(404, { message: 'not found' }, done);
        });
        it('success', function(done) {
            postUser({ username: USER, password: PASS }).expect(200, function(err) {
                if (err) return done(err);
                getUser(USER).expect(200, function(err, res) {
                    if (err) return done(err);
                    expect(res.body.username).to.equal(USER);
                    expect(res.body.createdAt).to.exist;
                    done();
                });
            });
        });
    });

    describe('PUT /users/:username', function() {
        it('old password undefined', function(done) {
            putUser(USER, { newPassword: PASS2 }).expect(400, done);
        });
        it('old password empty', function(done) {
            putUser(USER, { oldPassword: '', newPassword: PASS2 }).expect(400, done);
        });
        it('new password undefined', function(done) {
            putUser(USER, { oldPassword: PASS }).expect(400, done);
        });
        it('new password empty', function(done) {
            putUser(USER, { oldPassword: PASS, newPassword: '' }).expect(400, done);
        });
        it('username not exists', function(done) {
            putUser(USER, { oldPassword: PASS, newPassword: PASS2 })
                .expect(404, { message: 'not found' }, done);
        });
        it('success', function(done) {
            postUser({ username: USER, password: PASS }).expect(200, function(err) {
                if (err) return done(err);
                putUser(USER, { oldPassword: PASS, newPassword: PASS2 }).expect(200, function(err, res) {
                    if (err) return done(err);
                    expect(res.body.username).to.equal(USER);
                    expect(res.body.updatedAt).to.exist;
                    done();
                });
            });
        });
    });

    describe('DELETE /users/:username', function() {
        it('username not exists', function(done) {
            deleteUser(USER).expect(404, { message: 'not found' }, done);
        });
        it('success', function(done) {
            postUser({ username: USER, password: PASS }).expect(200, function(err) {
                if (err) return done(err);
                deleteUser(USER).expect(200, { message: 'ok' }, done);
            });
        });
    });

    describe('POST /users/:username/sessions', function() {
        it('password undefined', function(done) {
            postSession(USER, {}).expect(400, done);
        });
        it('password empty', function(done) {
            postSession(USER, { password: '' }).expect(400, done);
        });
        it('username not exists', function(done) {
            postSession(USER, { password: PASS })
                .expect(404, { message: 'not found' }, done);
        });
        it('password wrong', function(done) {
            postUser({ username: USER, password: PASS }).expect(200, function(err) {
                if (err) return done(err);
                postSession(USER, { password: PASS2 })
                    .expect(404, { message: 'not found' }, done);
            });
        });
        it('success', function(done) {
            postUser({ username: USER, password: PASS }).expect(200, function(err) {
                if (err) return done(err);
                postSession(USER, { password: PASS }).expect(200, function(err, res1) {
                    if (err) return done(err);
                    expect(res1.body.username).to.equal(USER);
                    expect(res1.body.sessionId).to.exist;
                    expect(res1.body.sessionCreatedAt).to.exist;
                    postSession(USER, { password: PASS }).expect(200, function(err, res2) {
                        if (err) return done(err);
                        expect(res2.body.username).to.equal(USER);
                        expect(res2.body.sessionId).to.exist.not.equal(res1.body.sessionId);
                        expect(res2.body.sessionCreatedAt).to.exist.not.equal(res1.body.sessionCreatedAt);
                        done();
                    });
                });
            });
        });
    });

    describe('DELETE /users/:username/sessions/:sessionId', function() {
        it('username not exists', function(done) {
            postUser({ username: USER, password: PASS }).expect(200, function(err) {
                if (err) return done(err);
                postSession(USER, { password: PASS }).expect(200, function(err, res) {
                    if (err) return done(err);
                    deleteSession(USER2, res.body.sessionId)
                        .expect(404, { message: 'not found' }, done);
                });
            });
        });
        it('sessionId not exists', function(done) {
            postUser({ username: USER, password: PASS }).expect(200, function(err) {
                if (err) return done(err);
                postSession(USER, { password: PASS }).expect(200, function(err, res) {
                    if (err) return done(err);
                    deleteSession(USER, new mongoose.Types.ObjectId())
                        .expect(404, { message: 'not found' }, done);
                });
            });
        });
        it('success', function(done) {
            postUser({ username: USER, password: PASS }).expect(200, function(err) {
                if (err) return done(err);
                postSession(USER, { password: PASS }).expect(200, function(err, res1) {
                    if (err) return done(err);
                    postSession(USER, { password: PASS }).expect(200, function(err, res2) {
                        if (err) return done(err);
                        deleteSession(USER, res1.body.sessionId).expect(200, {
                            message: 'ok'
                        }, function() {
                            deleteSession(USER, res2.body.sessionId).expect(200, {
                                message: 'ok'
                            }, done);
                        });
                    });
                });
            });
        });
    });
});

