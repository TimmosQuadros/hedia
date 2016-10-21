'use strict';

/**
 * Module dependencies
 */
var hediaPolicy = require('../policies/hedia.server.policy'),
  hedia = require('../controllers/hedia.server.controller');

module.exports = function(app) {
  // Hedia Routes
  app.route('/api/hedia').all(hediaPolicy.isAllowed)
    .get(hedia.list)
    .post(hedia.create);

  app.route('/api/hedia/:hediumId').all(hediaPolicy.isAllowed)
    .get(hedia.read)
    .put(hedia.update)
    .delete(hedia.delete);

  // Finish by binding the Hedium middleware
  app.param('hediumId', hedia.hediumByID);
};
