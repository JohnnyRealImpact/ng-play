/// <reference path="../../imports.d.ts" />
/// <reference path="win/appcmd.exe/certs.ng.ts" />
/// <reference path="win/sqlcmd.exe/module.ng.ts" />

angular.module('ngPlayApp.theme', [
  'ngMaterial',
])
  // App style and theming
  .config(function ($mdIconProvider) {
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
  .config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('grey', {
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
  .config(function ($mdThemingProvider) {
    // Configure a dark theme with primary foreground yellow
    $mdThemingProvider.theme('docs-dark', 'default')
      .primaryPalette('yellow')
      .dark();
  });


