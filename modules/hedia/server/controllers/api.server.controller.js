'use strict';

var _ = require('lodash');

/**
 * Extend user's controller
 */
module.exports = _.extend(
  require('./api/histories.api.server.controller'),
  require('./api/users.api.server.controller'),
  require('./api/auth.api.server.controller'),
  require('./api/password.api.server.controller'),
  require('./api/upload.api.server.controller'),
  require('./api/userhistory.api.server.controller'),
  require('./api/food.api.server.controller'),
  require('./api/categories.api.server.controller')
);
