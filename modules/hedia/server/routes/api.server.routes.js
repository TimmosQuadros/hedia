'use strict';

/**
 * Module dependencies
 */
var apiController = require('../controllers/api.server.controller'),
    authServ = require('../services/auth.api.server.service'),
    reqServ  = require('../services/check.request.server.service');

module.exports = function(app) {
  // test api
  app.route('/api/v1/foo').get(apiController.userFoo);

  // edit current profile
  app.route('/api/v1/update-user').post([reqServ.checkJsonHeader, authServ.authByToken], apiController.userUpdate);
  app.route('/api/v1/get-user').get(authServ.authByToken, apiController.userProfile);

  // auth APIs
  app.route('/api/v1/register-user').post(reqServ.checkJsonHeader, apiController.userRegister);
  app.route('/api/v1/login').post(reqServ.checkJsonHeader, apiController.login);
  app.route('/api/v1/logout').delete(authServ.authByToken, apiController.logout);

  // passwords APIs
  app.route('/api/v1/password-reset').post(reqServ.checkJsonHeader, apiController.passwordReset);
  app.route('/api/v1/password-update').post(reqServ.checkJsonHeader, apiController.passwordUpdate);

  //upload
  app.route('/api/v1/avatar-upload').post(authServ.authByToken, apiController.uploadImage);
};

