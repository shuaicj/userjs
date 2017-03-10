var require = require('rekuire');
var request = require('supertest');
var expect = require('chai').expect;

var SERVER = 'http://localhost:8080';
var USER = 'shuaicj';
var PASS = 'pass123';

// function testSignUp(param, done, status, code) {
//     request(config.server).post('/signup').send(param).expect(status).end(function(err, res) {
//         if (err) return done(err);
//         if (code) expect(res.body.code).to.equal(code);
//         done();
//     });
// }

// function testSignIn(param, done, status, code) {
//     request(config.server).post('/signin').send(param).expect(status).end(function(err, res) {
//         if (err) return done(err);
//         if (code) expect(res.body.code).to.equal(code);
//         done();
//     });
// }

// function testCheckEmail(param, done, status, exist) {
//     request(config.server).post('/checkemail').send(param).expect(status).end(function(err, res) {
//         if (err) return done(err);
//         if (typeof(exist) != 'undefined') expect(res.body.exist).to.equal(exist);
//         done();
//     });
// }

describe('User Module', function() {
    describe('POST /users', function() {
        afterEach('delete the test user in db', function(done) {
            request(SERVER).delete('/users/:' + USER).end(done);
        });

        function test(param, done, status) {
            request(SERVER).post('/users').send(param).expect(status).end(function(err, res) {
                if (err) return done(err);
                if (param.username) expect(res.body.username).to.equal(param.username);
                done();
            });
        }

        it('check param: no param', function(done) {
            request(SERVER).post('/users')
            testSignUp({}, done, 400);
        });
        it('check param: email undefined', function(done) {
            testSignUp({ password: config.password }, done, 400);
        });
        it('check param: email empty string', function(done) {
            testSignUp({ email: '', password: config.password }, done, 400);
        });
        it('check param: password undefined', function(done) {
            testSignUp({ email: config.user }, done, 400);
        });
        it('check param: password empty string', function(done) {
            testSignUp({ email: config.user, password: '' }, done, 400);
        });
        it('sign up successfully', function(done) {
            testSignUp({ email: config.user, password: config.password }, done, 200, 0);
        });
        it('duplicated email', function(done) {
            testSignUp({ email: config.user, password: config.password }, done, 500);
        });
    });

    describe('POST /signin', function() {
        it('check param: no param', function(done) {
            testSignIn({}, done, 400);
        });
        it('check param: email undefined', function(done) {
            testSignIn({ password: config.password }, done, 400);
        });
        it('check param: password undefined', function(done) {
            testSignIn({ email: config.user }, done, 400);
        });
        it('email not exist', function(done) {
            testSignIn({ email: config.impossibleUser, password: config.password }, done, 200, 2);
        });
        it('wrong password', function(done) {
            testSignIn({ email: config.user, password: 'wrongpass' }, done, 200, 1);
        });
        it('sign in successfully', function(done) {
            testSignIn({ email: config.user, password: config.password }, done, 200, 0);
        });
    });

    describe('POST /checkemail', function() {
        it('check param: email undefined', function(done) {
            testCheckEmail({}, done, 400);
        });
        it('email exist', function(done) {
            testCheckEmail({ email: config.user }, done, 200, true);
        });
        it('email not exist', function(done) {
            testCheckEmail({ email: config.impossibleUser }, done, 200, false);
        });
    });
});

