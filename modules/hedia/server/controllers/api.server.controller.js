'use strict';

var _ = require('lodash');

/**
 * Extend user's controller
 */
module.exports = _.extend(
  require('./api/histories.api.server.controller'),
  require('./api/users.api.server.controller'),
  require('./api/auth.api.server.controller')
);
