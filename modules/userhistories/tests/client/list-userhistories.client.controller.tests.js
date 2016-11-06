(function () {
  'use strict';

  describe('Userhistories List Controller Tests', function () {
    // Initialize global variables
    var UserhistoriesListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      UserhistoriesService,
      mockUserhistory;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _UserhistoriesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      UserhistoriesService = _UserhistoriesService_;

      // create mock article
      mockUserhistory = new UserhistoriesService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Userhistory Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Userhistories List controller.
      UserhistoriesListController = $controller('UserhistoriesListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockUserhistoryList;

      beforeEach(function () {
        mockUserhistoryList = [mockUserhistory, mockUserhistory];
      });

      it('should send a GET request and return all Userhistories', inject(function (UserhistoriesService) {
        // Set POST response
        $httpBackend.expectGET('api/userhistories').respond(mockUserhistoryList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.userhistories.length).toEqual(2);
        expect($scope.vm.userhistories[0]).toEqual(mockUserhistory);
        expect($scope.vm.userhistories[1]).toEqual(mockUserhistory);

      }));
    });
  });
}());
