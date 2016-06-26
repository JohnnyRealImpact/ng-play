/// <reference path="../../imports.d.ts" />
/// <reference path="win/appcmd.exe/certs.ng.ts" />
/// <reference path="win/sqlcmd.exe/module.ng.ts" />

angular.module('ngPlayApp.info', [
  'ui.router',
])
  .config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('app.info', {
      url: '/info',
      views: {
        'left@': { templateUrl: 'app/info/left.html' },
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
  .controller('itemViewController', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {
    $scope.runtime = {};

    console.log('Thing Selection...', $state.current.params);

  }]);
