'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Hedium = mongoose.model('Hedium'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  hedium;

/**
 * Hedium routes tests
 */
describe('Hedium CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Hedium
    user.save(function () {
      hedium = {
        name: 'Hedium name'
      };

      done();
    });
  });

  it('should be able to save a Hedium if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Hedium
        agent.post('/api/hedia')
          .send(hedium)
          .expect(200)
          .end(function (hediumSaveErr, hediumSaveRes) {
            // Handle Hedium save error
            if (hediumSaveErr) {
              return done(hediumSaveErr);
            }

            // Get a list of Hedia
            agent.get('/api/hedia')
              .end(function (hediaGetErr, hediaGetRes) {
                // Handle Hedia save error
                if (hediaGetErr) {
                  return done(hediaGetErr);
                }

                // Get Hedia list
                var hedia = hediaGetRes.body;

                // Set assertions
                (hedia[0].user._id).should.equal(userId);
                (hedia[0].name).should.match('Hedium name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Hedium if not logged in', function (done) {
    agent.post('/api/hedia')
      .send(hedium)
      .expect(403)
      .end(function (hediumSaveErr, hediumSaveRes) {
        // Call the assertion callback
        done(hediumSaveErr);
      });
  });

  it('should not be able to save an Hedium if no name is provided', function (done) {
    // Invalidate name field
    hedium.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Hedium
        agent.post('/api/hedia')
          .send(hedium)
          .expect(400)
          .end(function (hediumSaveErr, hediumSaveRes) {
            // Set message assertion
            (hediumSaveRes.body.message).should.match('Please fill Hedium name');

            // Handle Hedium save error
            done(hediumSaveErr);
          });
      });
  });

  it('should be able to update an Hedium if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Hedium
        agent.post('/api/hedia')
          .send(hedium)
          .expect(200)
          .end(function (hediumSaveErr, hediumSaveRes) {
            // Handle Hedium save error
            if (hediumSaveErr) {
              return done(hediumSaveErr);
            }

            // Update Hedium name
            hedium.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Hedium
            agent.put('/api/hedia/' + hediumSaveRes.body._id)
              .send(hedium)
              .expect(200)
              .end(function (hediumUpdateErr, hediumUpdateRes) {
                // Handle Hedium update error
                if (hediumUpdateErr) {
                  return done(hediumUpdateErr);
                }

                // Set assertions
                (hediumUpdateRes.body._id).should.equal(hediumSaveRes.body._id);
                (hediumUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Hedia if not signed in', function (done) {
    // Create new Hedium model instance
    var hediumObj = new Hedium(hedium);

    // Save the hedium
    hediumObj.save(function () {
      // Request Hedia
      request(app).get('/api/hedia')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Hedium if not signed in', function (done) {
    // Create new Hedium model instance
    var hediumObj = new Hedium(hedium);

    // Save the Hedium
    hediumObj.save(function () {
      request(app).get('/api/hedia/' + hediumObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', hedium.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Hedium with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/hedia/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Hedium is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Hedium which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Hedium
    request(app).get('/api/hedia/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Hedium with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Hedium if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Hedium
        agent.post('/api/hedia')
          .send(hedium)
          .expect(200)
          .end(function (hediumSaveErr, hediumSaveRes) {
            // Handle Hedium save error
            if (hediumSaveErr) {
              return done(hediumSaveErr);
            }

            // Delete an existing Hedium
            agent.delete('/api/hedia/' + hediumSaveRes.body._id)
              .send(hedium)
              .expect(200)
              .end(function (hediumDeleteErr, hediumDeleteRes) {
                // Handle hedium error error
                if (hediumDeleteErr) {
                  return done(hediumDeleteErr);
                }

                // Set assertions
                (hediumDeleteRes.body._id).should.equal(hediumSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Hedium if not signed in', function (done) {
    // Set Hedium user
    hedium.user = user;

    // Create new Hedium model instance
    var hediumObj = new Hedium(hedium);

    // Save the Hedium
    hediumObj.save(function () {
      // Try deleting Hedium
      request(app).delete('/api/hedia/' + hediumObj._id)
        .expect(403)
        .end(function (hediumDeleteErr, hediumDeleteRes) {
          // Set message assertion
          (hediumDeleteRes.body.message).should.match('User is not authorized');

          // Handle Hedium error error
          done(hediumDeleteErr);
        });

    });
  });

  it('should be able to get a single Hedium that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Hedium
          agent.post('/api/hedia')
            .send(hedium)
            .expect(200)
            .end(function (hediumSaveErr, hediumSaveRes) {
              // Handle Hedium save error
              if (hediumSaveErr) {
                return done(hediumSaveErr);
              }

              // Set assertions on new Hedium
              (hediumSaveRes.body.name).should.equal(hedium.name);
              should.exist(hediumSaveRes.body.user);
              should.equal(hediumSaveRes.body.user._id, orphanId);

              // force the Hedium to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Hedium
                    agent.get('/api/hedia/' + hediumSaveRes.body._id)
                      .expect(200)
                      .end(function (hediumInfoErr, hediumInfoRes) {
                        // Handle Hedium error
                        if (hediumInfoErr) {
                          return done(hediumInfoErr);
                        }

                        // Set assertions
                        (hediumInfoRes.body._id).should.equal(hediumSaveRes.body._id);
                        (hediumInfoRes.body.name).should.equal(hedium.name);
                        should.equal(hediumInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Hedium.remove().exec(done);
    });
  });
});
