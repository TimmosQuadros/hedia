'use strict';

/**
 * Module dependencies
 */
var api = require('../controllers/api.server.controller'),
    authServ = require('../services/auth.api.server.service'),
    reqServ  = require('../services/check.request.server.service');

module.exports = function(app) {
  // UserApi Routes
  // test api
  app.route('/api/v1/foo').get(api.userFoo);

  // edit current profile
  app.route('/api/v1/update-user').post([reqServ.checkJsonHeader, authServ.authByToken], api.userUpdate);
  app.route('/api/v1/get-user').get(authServ.authByToken, api.userProfile);

  // auth users
  app.route('/api/v1/register-user').post(reqServ.checkJsonHeader, api.userRegister);
  app.route('/api/v1/login').post(reqServ.checkJsonHeader, api.login);

  app.route('/api/v1/logout').delete(authServ.authByToken, api.logout);
};

