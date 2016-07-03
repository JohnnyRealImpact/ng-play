/// <reference path="../../imports.d.ts" />
/// <reference path="win/appcmd.exe/certs.ng.ts" />
/// <reference path="win/sqlcmd.exe/module.ng.ts" />

angular.module('ngPlayApp.info', [
  'ui.router',
])

  .config(['$stateProvider', function ($stateProvider) {

    $stateProvider
      .state('app.new', {
        url: '/new',
        views: {
          'left@': {templateUrl: 'app/info/left.html'},
          'main@': {
            templateUrl: 'app/info/new.html',
            controller: 'itemNewController'
          },
        },
      })
      .state('app.info', {
        url: '/info',
        views: {
          'left@': {templateUrl: 'app/info/left.html'},
          'main@': {
            templateUrl: 'app/info/main.html',
            controller: 'itemViewController'
          },
        },
        params: {
          url: null,
          name: null,
          desc: null,
          active: false,
          featured: false,
        }
      })

  }])

  .controller('itemNewController', ['$rootScope', '$scope', '$state', '$http', function ($rootScope, $scope, $state, $http) {
    $scope.info = {
      name: null,
      desc: null,
      url: null,
      active: true,
      featured: false,
    };

    $scope.createLink = function (item) {
      console.log(' - Create:', item);
      $http
        .post('/api/things', item)
        .success(function(res){
          console.log(' - Post Result:', res);
          $state.go('app.info', item);
        })
        .catch(function(err){
          console.error(err);
        })
    }
  }])

  .controller('itemViewController', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {
    $scope.runtime = {};

    console.log('Thing Selection...', $state.current.params);

    $scope.info = {
      name: 'Remote Host',
      desc: 'Targets a selected remote host.',
      url: 'https://localhost',
      active: true,
      featured: false,
    };

  }])

