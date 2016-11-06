(function () {
  'use strict';

  angular
    .module('userhistories')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'User History Logs',
      state: 'userhistories',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'userhistories', {
      title: 'List User History Logs',
      state: 'userhistories.list'
    });

    // Add the dropdown create item
    // menuService.addSubMenuItem('topbar', 'userhistories', {
    //   title: 'Create User History',
    //   state: 'userhistories.create',
    //   roles: ['user']
    // });
  }
}());
