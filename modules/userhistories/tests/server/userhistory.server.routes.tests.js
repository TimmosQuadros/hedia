'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Userhistory = mongoose.model('Userhistory'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  userhistory;

/**
 * Userhistory routes tests
 */
describe('Userhistory CRUD tests', function () {

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

    // Save a user to the test db and create new Userhistory
    user.save(function () {
      userhistory = {
        name: 'Userhistory name'
      };

      done();
    });
  });

  it('should be able to save a Userhistory if logged in', function (done) {
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

        // Save a new Userhistory
        agent.post('/api/userhistories')
          .send(userhistory)
          .expect(200)
          .end(function (userhistorySaveErr, userhistorySaveRes) {
            // Handle Userhistory save error
            if (userhistorySaveErr) {
              return done(userhistorySaveErr);
            }

            // Get a list of Userhistories
            agent.get('/api/userhistories')
              .end(function (userhistoriesGetErr, userhistoriesGetRes) {
                // Handle Userhistories save error
                if (userhistoriesGetErr) {
                  return done(userhistoriesGetErr);
                }

                // Get Userhistories list
                var userhistories = userhistoriesGetRes.body;

                // Set assertions
                (userhistories[0].user._id).should.equal(userId);
                (userhistories[0].name).should.match('Userhistory name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Userhistory if not logged in', function (done) {
    agent.post('/api/userhistories')
      .send(userhistory)
      .expect(403)
      .end(function (userhistorySaveErr, userhistorySaveRes) {
        // Call the assertion callback
        done(userhistorySaveErr);
      });
  });

  it('should not be able to save an Userhistory if no name is provided', function (done) {
    // Invalidate name field
    userhistory.name = '';

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

        // Save a new Userhistory
        agent.post('/api/userhistories')
          .send(userhistory)
          .expect(400)
          .end(function (userhistorySaveErr, userhistorySaveRes) {
            // Set message assertion
            (userhistorySaveRes.body.message).should.match('Please fill Userhistory name');

            // Handle Userhistory save error
            done(userhistorySaveErr);
          });
      });
  });

  it('should be able to update an Userhistory if signed in', function (done) {
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

        // Save a new Userhistory
        agent.post('/api/userhistories')
          .send(userhistory)
          .expect(200)
          .end(function (userhistorySaveErr, userhistorySaveRes) {
            // Handle Userhistory save error
            if (userhistorySaveErr) {
              return done(userhistorySaveErr);
            }

            // Update Userhistory name
            userhistory.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Userhistory
            agent.put('/api/userhistories/' + userhistorySaveRes.body._id)
              .send(userhistory)
              .expect(200)
              .end(function (userhistoryUpdateErr, userhistoryUpdateRes) {
                // Handle Userhistory update error
                if (userhistoryUpdateErr) {
                  return done(userhistoryUpdateErr);
                }

                // Set assertions
                (userhistoryUpdateRes.body._id).should.equal(userhistorySaveRes.body._id);
                (userhistoryUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Userhistories if not signed in', function (done) {
    // Create new Userhistory model instance
    var userhistoryObj = new Userhistory(userhistory);

    // Save the userhistory
    userhistoryObj.save(function () {
      // Request Userhistories
      request(app).get('/api/userhistories')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Userhistory if not signed in', function (done) {
    // Create new Userhistory model instance
    var userhistoryObj = new Userhistory(userhistory);

    // Save the Userhistory
    userhistoryObj.save(function () {
      request(app).get('/api/userhistories/' + userhistoryObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', userhistory.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Userhistory with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/userhistories/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Userhistory is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Userhistory which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Userhistory
    request(app).get('/api/userhistories/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Userhistory with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Userhistory if signed in', function (done) {
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

        // Save a new Userhistory
        agent.post('/api/userhistories')
          .send(userhistory)
          .expect(200)
          .end(function (userhistorySaveErr, userhistorySaveRes) {
            // Handle Userhistory save error
            if (userhistorySaveErr) {
              return done(userhistorySaveErr);
            }

            // Delete an existing Userhistory
            agent.delete('/api/userhistories/' + userhistorySaveRes.body._id)
              .send(userhistory)
              .expect(200)
              .end(function (userhistoryDeleteErr, userhistoryDeleteRes) {
                // Handle userhistory error error
                if (userhistoryDeleteErr) {
                  return done(userhistoryDeleteErr);
                }

                // Set assertions
                (userhistoryDeleteRes.body._id).should.equal(userhistorySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Userhistory if not signed in', function (done) {
    // Set Userhistory user
    userhistory.user = user;

    // Create new Userhistory model instance
    var userhistoryObj = new Userhistory(userhistory);

    // Save the Userhistory
    userhistoryObj.save(function () {
      // Try deleting Userhistory
      request(app).delete('/api/userhistories/' + userhistoryObj._id)
        .expect(403)
        .end(function (userhistoryDeleteErr, userhistoryDeleteRes) {
          // Set message assertion
          (userhistoryDeleteRes.body.message).should.match('User is not authorized');

          // Handle Userhistory error error
          done(userhistoryDeleteErr);
        });

    });
  });

  it('should be able to get a single Userhistory that has an orphaned user reference', function (done) {
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

          // Save a new Userhistory
          agent.post('/api/userhistories')
            .send(userhistory)
            .expect(200)
            .end(function (userhistorySaveErr, userhistorySaveRes) {
              // Handle Userhistory save error
              if (userhistorySaveErr) {
                return done(userhistorySaveErr);
              }

              // Set assertions on new Userhistory
              (userhistorySaveRes.body.name).should.equal(userhistory.name);
              should.exist(userhistorySaveRes.body.user);
              should.equal(userhistorySaveRes.body.user._id, orphanId);

              // force the Userhistory to have an orphaned user reference
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

                    // Get the Userhistory
                    agent.get('/api/userhistories/' + userhistorySaveRes.body._id)
                      .expect(200)
                      .end(function (userhistoryInfoErr, userhistoryInfoRes) {
                        // Handle Userhistory error
                        if (userhistoryInfoErr) {
                          return done(userhistoryInfoErr);
                        }

                        // Set assertions
                        (userhistoryInfoRes.body._id).should.equal(userhistorySaveRes.body._id);
                        (userhistoryInfoRes.body.name).should.equal(userhistory.name);
                        should.equal(userhistoryInfoRes.body.user, undefined);

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
      Userhistory.remove().exec(done);
    });
  });
});
