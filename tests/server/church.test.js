/**
 * Created by Josh Pagley on 3/14/14.
 * Desciption: Tests for the controller church.js file.
 */

var assert = require('assert');
var should = require('should');
var request = require('supertest');
var church = require('../../server/controllers/churchs.js');
//var church = require('../../server/controllers/testChurch.js');
var async = require('async');
var dbHelper = require('../resources/dbHelper.js');

//Models
var Church = require('../../server/models/church.js');

request = request('http://localhost:3000');

describe('Test Framework', function(){
    it('should have mocha installed and running', function(){
        assert.equal(true, true);
    });

    it('should have should library installed and running for fluent testing.', function(){
        true.should.eql(true);
    });
});

describe('Church controller', function(){
    describe.skip('create function', function(){
        var req = {};
        var email = "";
        var password = "";
        var churchObj = {};

        beforeEach(function(done){
            req = {
                body: {
                    email: 'mocha@mocha.com',
                    password: 'church',
                    name: 'Example Church',
                    address: '6312 SE 10th PL',
                    city: 'Ocala',
                    state: 'FL',
                    zip: '34472',
                    phone: '111-222-3333'
                }
            };

            email = req.body.email;
            password = req.body.password;

            church.create(req, email, password, function(error, newChurch){
                console.log('hit church.create callback function.');
                if(error){
                    done(error);
                } else if(!newChurch){
                    done(new Error('No newChurch Object returned.'));
                } else {
                    churchObj = newChurch;
                    done();
                }
            });

            done();
        });

        it('should return new church account object', function(done){

            assert.equal(req.body.email, 'mocha@mocha.com', 'Expected value: mocha@mocha.com ' + 'Actual value: ' + req.body.email);
            assert.equal(email, 'mocha@mocha.com', 'Expected value: mocha@mocha.com ' + 'Actual value: ' + email);
            assert.equal(password, 'church', 'Expected value: church ' + 'Actual value: ' + password);

            done();

        })
    })

    describe.skip('update function', function(){
        it('should return updated church object.', function(done){
            request.post('/api/zionconnect/tests/v1/church')
                .send({
                    "email": "info@church.com",
                    "name": "Example Church Name",
                    "address": '6312 SE 10th PL',
                    "city": "Ocala",
                    "state": "FL",
                    "zip": "34472",
                    "phone": "111-222-3333",
                    "bio": "This is an example bio for the church. We love our members!"
                })
                .expect(200)
                .end(function(error, res){
                    should.not.exist(error);
                    if(error) return done(error);

                    if(res.body.church){
                        var church = res.body.church;

                        church.should.have.property('email', 'info@church.com');
                        church.should.have.property('name', 'Example Church Name');
                        church.should.have.property('phone', '111-222-3333');

                        done();
                    }
                })
        })
    })

    describe('delete function', function(){

        it('should return account deactivation message.', function(done){
            var params = {
                email: "test@testchurch.com",
                password: "church",
                name: "Test Name",
                address: "6312 SE 10th PL",
                city: "Ocala",
                state: "FL",
                zip: "34472",
                phone: "111-222-3333"
            };

            dbHelper.addNewAccount(params, done);
        });
    });
});
