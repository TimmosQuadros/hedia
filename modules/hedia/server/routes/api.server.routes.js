'use strict';

/**
 * Module dependencies
 */
var apiController = require('../controllers/api.server.controller'),
    authServ = require('../services/auth.api.server.service'),
    reqServ  = require('../services/check.request.server.service'),
    fileBuilderService = require('../services/file.builder.api.server.service');

module.exports = function(app) {
  // test api
  app.route('/api/v1/foo').get(apiController.userFoo)
                          .post(fileBuilderService.fileBuilder, apiController.userFoo);

  // edit current profile
  app.route('/api/v1/update-user').post([reqServ.checkJsonHeader, authServ.authByToken, fileBuilderService.fileBuilder], apiController.userUpdate);
  app.route('/api/v1/get-user').get(authServ.authByToken, apiController.userProfile);
  app.route('/api/v1/password-change').post(authServ.authByToken, apiController.changePassword);

  // auth APIs
  app.route('/api/v1/register-user').post([reqServ.checkJsonHeader, fileBuilderService.fileBuilder], apiController.userRegister);

  app.route('/api/v1/login').post(reqServ.checkJsonHeader, apiController.login);
  app.route('/api/v1/login-fb-token').post([reqServ.checkJsonHeader, authServ.checkFBToken], apiController.loginByFBToken);
  app.route('/api/v1/logout').delete(authServ.authByToken, apiController.logout);

  // passwords APIs
  app.route('/api/v1/password-reset').post(reqServ.checkJsonHeader, apiController.passwordReset);
  app.route('/api/v1/password-recovery').post(reqServ.checkJsonHeader, apiController.passwordRecovery);

  // histories
  app.route('/api/v1/post-history').post([reqServ.checkJsonHeader, authServ.authByToken], apiController.postHistory);
  app.route('/api/v1/get-histories').get( authServ.authByToken, apiController.getHistory);
  app.route('/api/v1/remove-history-log/:historyLogId').delete([authServ.authByToken, apiController.historyLogByID], apiController.deleteHistory);
  //upload
  app.route('/api/v1/avatar-upload').post(authServ.authByToken, apiController.uploadImage);

  //food APIs
  app.route('/api/v1/post-food').post([reqServ.checkJsonHeader, authServ.authByToken], apiController.postFood);
};

