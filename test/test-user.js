var require = require('rekuire');
var config = require('config');
var request = require('supertest');
var expect = require('chai').expect;

var SERVER = 'http://localhost:' + config.PORT;
var USER = 'shuaicj';
var PASS = 'pass123';

describe('User Module', function() {
    function postUser(param) {
        return request(SERVER).post('/users').send(param);
    }
    function getUser(username) {
        return request(SERVER).get('/users/' + USER);
    }
    function deleteUser(username) {
        return request(SERVER).delete('/users/' + USER);
    }

    describe('POST /users', function() {
        before('delete the test user in db', function(done) {
            deleteUser(USER).end(done);
        });
        after('delete the test user in db', function(done) {
            deleteUser(USER).end(done);
        });
        it('check param: no param', function(done) {
            postUser({}).expect(400, done);
        });
        it('check param: username undefined', function(done) {
            postUser({ password: PASS }).expect(400, done);
        });
        it('check param: username empty string', function(done) {
            postUser({ username: '', password: PASS }).expect(400, done);
        });
        it('check param: password undefined', function(done) {
            postUser({ username: USER }).expect(400, done);
        });
        it('check param: password empty string', function(done) {
            postUser({ username: USER, password: '' }).expect(400, done);
        });
        it('success', function(done) {
            postUser({ username: USER, password: PASS }).expect(200, function(err, res) {
                if (err) return done(err);
                expect(res.body.username).to.equal(USER);
                expect(res.body.createdTime).to.exist;
                done();
            });
        });
        it('duplicated username', function(done) {
            postUser({ username: USER, password: PASS }).expect(400, {
                message: 'already exists'
            }, done);
        });
    });

    describe('GET /users/:username', function() {
        before('delete the test user in db', function(done) {
            deleteUser(USER).end(done);
        });
        after('delete the test user in db', function(done) {
            deleteUser(USER).end(done);
        });
        it('username not exists', function(done) {
            getUser(USER).expect(404, { message: 'not found' }, done);
        });
        it('success', function(done) {
            postUser({ username: USER, password: PASS }).expect(200, function(err) {
                if (err) return done(err);
                getUser(USER).expect(200, function(err, res) {
                    if (err) return done(err);
                    expect(res.body.username).to.equal(USER);
                    expect(res.body.createdTime).to.exist;
                    done();
                });
            });
        });
    });

    describe('DELETE /users/:username', function() {
        before('delete the test user in db', function(done) {
            deleteUser(USER).end(done);
        });
        after('delete the test user in db', function(done) {
            deleteUser(USER).end(done);
        });
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
});

