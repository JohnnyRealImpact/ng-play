'use strict';

angular.module('ngPlayApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngAnimate',
  'ngMessages',
  'ui.router',
  'ngMaterial',
  'ngMoment',
  'ngPlayApp.cli'
  ])
  .config(function($mdIconProvider) {
    $mdIconProvider
      .iconSet('action', '../assets/iconsets/action-icons.svg', 24)
      .iconSet('alert', '../assets/iconsets/alert-icons.svg', 24)
      .iconSet('av', '../assets/iconsets/av-icons.svg', 24)
      .iconSet('communication', '../assets/iconsets/communication-icons.svg', 24)
      .iconSet('content', '../assets/iconsets/content-icons.svg', 24)
      .iconSet('device', '../assets/iconsets/device-icons.svg', 24)
      .iconSet('editor', '../assets/iconsets/editor-icons.svg', 24)
      .iconSet('file', '../assets/iconsets/file-icons.svg', 24)
      .iconSet('hardware', '../assets/iconsets/hardware-icons.svg', 24)
      .iconSet('icons', '../assets/iconsets/icons-icons.svg', 24)
      .iconSet('image', '../assets/iconsets/image-icons.svg', 24)
      .iconSet('maps', '../assets/iconsets/maps-icons.svg', 24)
      .iconSet('navigation', '../assets/iconsets/navigation-icons.svg', 24)
      .iconSet('notification', '../assets/iconsets/notification-icons.svg', 24)
      .iconSet('social', '../assets/iconsets/social-icons.svg', 24)
      .iconSet('toggle', '../assets/iconsets/toggle-icons.svg', 24)
      .iconSet('avatar', '../assets/iconsets/avatar-icons.svg', 128);
  })
  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('blue-grey', {
        'default': '900',
        'hue-1': '900',
        'hue-2': '600',
        'hue-3': '200'
      })
      .accentPalette('orange', {
        'default': '400',
        'hue-1': '900',
        'hue-2': '600',
        'hue-3': '400'
      })
      //.dark();
  })
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider
      .when ('/','')
      .otherwise('');

    $stateProvider
      .state('app', {
        url: '',
        abstract: true,
        //templateUrl: 'components/dashboard/dashboard.html',
        views: {
          'left@': { templateUrl: 'components/sidenav/leftNav.html' },
          'main@': { templateUrl: 'components/dashboard/dashboard.html' },
        }
      })
      .state('app.home', {
        url: 'home',
        views: {
          'left@': { templateUrl: 'components/sidenav/leftNav.html' },
          'main@': {
            templateUrl: 'app/main/main.html',
            controller: 'MainCtrl'
          },
        }
      });
  })

  .filter('fromNow', function() {
    return function(dateString, format) {
      return moment(dateString).fromNow(format);
    };
  })

  .run(function($state, $timeout) {
    console.log('Starting application...');

    // Hacky way to set initial state
    if ($state && $state.current && !$state.current.name) {
      $timeout(function () {
        $state.go('app.home');
      }, 0)
    }
  });
