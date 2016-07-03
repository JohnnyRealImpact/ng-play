/**
 * Created by JohnathanLodder on 16/07/03.
 */

angular.module('ngPlayApp.router', [
  'ui.router',
])

  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider
      .when('', '/')
      .when('/', '/home')
      .otherwise('/home');

    $stateProvider
      .state('app', {
        url: '',
        abstract: true,
        //templateUrl: 'components/dashboard/dashboard.html',
        views: {
          'left@': {templateUrl: 'components/sidenav/leftNav.html'},
          'main@': {templateUrl: 'components/dashboard/dashboard.html'},
        }
      })
      .state('app.home', {
        url: 'home',
        views: {
          'left@': {templateUrl: 'components/sidenav/leftNav.html'},
          'main@': {
            templateUrl: 'app/main/main.html',
            controller: 'MainCtrl'
          },
        }
      });
  })

  .run(function ($state, $timeout) {

    // Hacky way to set initial state
    $timeout(function () {
      if ($state && $state.current && !$state.current.name) {
        $state.go('app.home');
      }
    }, 0)

  });
