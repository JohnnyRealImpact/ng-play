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

  .constant('appConfig', {
    api: {
      things: '/api/things',
    },
    cmd: {
      discoverIp: 'dig +short myip.opendns.com @resolver1.opendns.com',
      dockerMachineVer: 'docker-machine -v | sed -e "s/docker-machine version //g" | sed -e "s/, build .*$//g" | sed -e "s/ //g"',
      dockerMachineList: 'printf "[ " && docker-machine ls --format="{ \\\"name\\\": \\\"{{.Name}}\\\", \\\"state\\\": \\\"{{.State}}\\\", \\\"driver\\\": \\\"{{.DriverName}}\\\", \\\"url\\\": \\\"{{.URL}}\\\" }," && printf " null ]\n" | sed -e "s/\\},\\s*\\]/zzzz/g"',
    }
  })
  .service('appRuntime', ['appConfig', 'cliProxy', '$http', function (config, cliProxy, $http) {
    // Ensure list exists

    var _self = this;
    _self.awesomeThings = _self.awesomeThings || [];
    _self.init = function () {
      // Check for auto discovery
      if (config.api && config.api.things) {
        $http
          .get(config.api.things)
          .success(function (awesomeThings) {
            _self.awesomeThings.concat(awesomeThings);
          })
      }
    };
    _self.getAwesomeThings = function(){
      return _self.awesomeThings;
    };
    _self.deleteAwesomeThing = function (thing) {
      $http.delete(config.api.things + '/' + thing._id);
    };
    _self.checkLocal = function () {
      var localTile = {
        name: 'Remote Host (checking...)',
        desc: 'Remotely installed environment',
        url: 'https://localhost',
        active: false,
        featured: false,
      };
      _self.awesomeThings.push(localTile);

      // Resolve public IP address (via bash on server)
      return cliProxy
        .send({
          input: config.cmd.discoverIp,
        })
        .then(function (resp) {
          if (resp.stderr) {
            // Update placeholder tile
            localTile.name = 'Remote Host (offline)';
            localTile.info = 'An error occurred while looking for docker-machine';
            console.error(resp.stderr);
          } else if (resp.stdout) {
            localTile.name = 'Remote Host';
            localTile.url = 'https://' + resp.stdout;
            localTile.active = true;
          }
        });


      //return $http
      //  .get(localTile.url)
      //  .success(function (data) {
      //    localTile.name = 'localhost (secure)';
      //    localTile.url = 'https://localhost';
      //    localTile.active = true;
      //    _self.awesomeThings.push(localTile);
      //  })
      //  .catch(function (err) {
      //    console.warn('Not found: ' + localTile.url);
      //
      //    localTile.url = 'http://localhost';
      //    localTile.name = 'localhost (insecure)';
      //    localTile.active = false;
      //
      //    return $http
      //      .get(localTile.url)
      //      .success(function (data) {
      //        console.info('Connected: ' + localTile.url);
      //        localTile.active = true;
      //        _self.awesomeThings.push(localTile);
      //      })
      //      .catch(function (err) {
      //        localTile.url = 'http://localhost';
      //        localTile.name = 'localhost (offline)';
      //        localTile.active = false;
      //        localTile.error = err;
      //        console.warn('Not Found: ' + localTile.url, err);
      //      })
      //  })
    };
    _self.checkDockers = function() {
      // Send the command to the remote machine
      var tileDockerMachine = {
        name: 'docker-machine',
        desc: 'Checking if locally installed...',
        active: false,
      };
      _self.awesomeThings.push(tileDockerMachine);


      return cliProxy
        .send({
          input: config.cmd.dockerMachineVer
        })
        .then(function (resp) {
          if (resp.stderr) {
            // Update placeholder tile
            tileDockerMachine.name = 'docker-machine (not found)';
            tileDockerMachine.info = 'An error occurred while looking for docker-machine';
            console.error(resp.stderr);
          } else {
            // Update placeholder tile
            tileDockerMachine.name = 'docker-machine (' + resp.stdout.trim() + ')';
            tileDockerMachine.desc = 'Successfully located docker-machine on the host.';

            return cliProxy
              .send({
                input: config.cmd.dockerMachineList
              })
              .then(function (resp) {
                if (resp.stderr) {
                  // Update placeholder tile
                  tileDockerMachine.error = new Error(resp.stderr);
                  tileDockerMachine.name = 'docker-machine (error)';
                  tileDockerMachine.info = 'An error occurred while looking for docker-machine';

                  console.error(resp.stderr);
                } else {

                  // Remove placeholder tile
                  var index = _self.awesomeThings.indexOf(tileDockerMachine);
                  if (index > -1) {
                    _self.awesomeThings.splice(index, 1);
                  }

                  // { state: Running, driver: virtualbox, name:default, url: tcp://192.168.99.100:2376 }
                  var found = {};
                  var result = JSON.parse(resp.stdout);
                  if (result.length) {
                    result.forEach(function (item) {
                      if (!item) return;
                      found[item.name] = item;

                      console.log(' - Adding:', item);
                      var card = {
                        icon: 'hardware:developer_board',
                        name: item.name,
                        desc: item.driver + ', Url: ' + item.url,
                        info: {},
                        active: true,
                      };
                      _self.awesomeThings.push(card);

                      cliProxy
                        .send({
                          input: 'docker-machine inspect ' + item.name,
                        })
                        .then(function (resp) {
                          if (resp.stderr) {
                            console.warn(resp.stderr);
                          }
                          if (resp.stdout) {
                            card.info = JSON.parse(resp.stdout);
                            card.url = 'https://' + card.info.Driver.IPAddress + '/';
                            //console.log(' - Updated: ', card.info);
                          }
                        });


                    });
                  }

                  _self.awesomeThings.push(
                    {
                      icon: 'content:add',
                      name: 'Create New',
                      info: 'Define a new docker-machine environment.',
                      active: false,
                    }
                  );

                }
              })
          }
        })
        .catch(function (err) {
          console.warn(' - REJ:', err);
        })
    };

  }])

  .filter('fromNow', function() {
    return function(dateString, format) {
      return moment(dateString).fromNow(format);
    };
  })

  .run(function($state, $timeout, appRuntime) {
    console.log('Starting application...');

    appRuntime.init();
    appRuntime.checkLocal()
      .then(function(res) {
        return appRuntime.checkDockers()
      })
      //.finally($rootScope.$applyAsync);

    // Hacky way to set initial state
    if ($state && $state.current && !$state.current.name) {
      $timeout(function () {
        $state.go('app.home');
      }, 0)
    }
  });
