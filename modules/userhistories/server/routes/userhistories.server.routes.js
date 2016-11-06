'use strict';

/**
 * Module dependencies
 */
var userhistoriesPolicy = require('../policies/userhistories.server.policy'),
  userhistories = require('../controllers/userhistories.server.controller');

module.exports = function(app) {
  // Userhistories Routes
  app.route('/api/userhistories').all(userhistoriesPolicy.isAllowed)
    .get(userhistories.list)
    .post(userhistories.create);

  app.route('/api/userhistories/:userhistoryId').all(userhistoriesPolicy.isAllowed)
    .get(userhistories.read)
    .put(userhistories.update)
    .delete(userhistories.delete);

  // Finish by binding the Userhistory middleware
  app.param('userhistoryId', userhistories.userhistoryByID);
};
