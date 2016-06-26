/// <reference path="../../imports.d.ts" />
/// <reference path="win/appcmd.exe/certs.ng.ts" />
/// <reference path="win/sqlcmd.exe/module.ng.ts" />

angular.module('ngPlayApp.cli', [
  'ui.router',
])
  .config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('app.cmd', {
      url: '/cmd',
      views: {
        'left@': {templateUrl: 'components/sidenav/leftNav.html'},
        'main@': {
          templateUrl: 'app/cmd/main.html',
          controller: 'systemCmdViewController'
        },
      }
    })
  }])

  .service('cliProxy', ['$q', '$http', function ($q, $http) {
    this.queue = [];
    this.isBusy = false;

    this.info = function() {
      return $http.get('/api/cli');
    }

    this.send = function (req) {
      var _self = this;
      var defer = $q.defer();

      // Create envelope for command
      if (typeof req === 'string') {
        req = { input: req }
      }

      // Set additional params
      req.created = Date.now();
      req.deferred = defer;

      // Check if already sending
      if (!_self.isBusy) {
        // Send the request to the API
        _self.isBusy = true;

        $http
          .post('/api/cli', req)
          .success(function (resp) {
            // Resolve promise
            if (req.deferred) {
              req.deferred.resolve(resp);
            }

            // Check for more items in the queue
            _self.isBusy = false;
            if (_self.queue.length > 0) {
              var qreq = _self.queue[0];
              _self.queue = _self.queue.slice(1);
              _self.send(qreq);
            }
          })
          .catch(function (err) {
            // Reject promise
            if (req.deferred) {
              req.deferred.reject(err);
            }
          });

      } else {
        // Queue for later...
        _self.queue.push(req);
      }

      // Send back a delayed promise
      return defer.promise
        .then(function(res){
          req.ended = Date.now();
          return res;
        })
        .catch(function(err) {
          req.ended = Date.now();
          req.error = err;
        })
        .finally(function(res) {
          delete req.deferred;
          return res;
        });
    };

  }])

  .controller('systemCmdViewController', ['$rootScope', '$scope', '$state', '$window', '$location', '$timeout', 'cliProxy', function ($rootScope, $scope, $state, $window, $location, $timeout, cliProxy) {
    $scope.input = '';
    $scope.output = [];
    $scope.remoteHost = {};

    $scope.getDescription = function() {
      if ($scope.remoteHost.cwd) return $scope.remoteHost.cwd;
      return this.isBusy ? 'Executing command on remote host...' : 'Enter bash command to run on remote host';
    }

    $scope.execCommand = function (input) {
      var req = { input: input };
      try {
        if (input == '') return;

        // Update UI & state
        $scope.output.push(req);
        $rootScope.$applyAsync(function () {
          $scope.input = '';
        });

        // Send the command to the remote machine
        cliProxy
          .send(req)
          .then(function (resp) {
            // Update the response
            console.log(' - CLI: ', resp);
            angular.extend(req, resp);
          })
          .catch(function (err){
            console.warn(' - REJ:', err);
          })
          .finally($rootScope.$applyAsync);
      } catch (ex) {
        console.error(ex);
      }
    }

    // Get the remote host info
    cliProxy
      .info()
      .success(function (info) {
        // Set the current remote host info
        $scope.remoteHost = info;
      })
      .catch(function (err){
        console.warn('Warning: Failed to load initial data.', err);
      })
      .finally($rootScope.$applyAsync);

    setInterval($rootScope.$applyAsync, 5 * 60);

    /*
    // Define the model
    var context = $scope.cmd = {
      busy: true,
      result: null,
      utils: {
        icon: function (path, file) {
          var css = '';
          if (file) {
            css = 'glyphicon-file';
            if (/(.*)?.exe$/i.test(file)) css = 'glyphicon-open'
            if (/(.*)?.cmd$/i.test(file)) css = 'glyphicon-cog'
            if (/(.*)?.cer$/i.test(file)) css = 'glyphicon-certificate'
            if (/(.*)?.pem$/i.test(file)) css = 'glyphicon-certificate'
            if (/(.*)?.htm.*$/i.test(file)) css = 'glyphicon-globe'
          } else {
            var target = $scope.cmd.target;
            if (target && (path == target.path)) {
              css += 'glyphicon-folder-open glow-blue';
            } else {
              css += 'glyphicon-folder-open glow-orange';
            }
          }

          return css;
        },
        call: function (path, file) {
          if (/(sqlcmd\.exe)/i.test(file)) {
            var params = {path: path, file: file};
            $state.transitionTo('sqlcmd.connect', params);
          }
        },
        list: function (path, callback) {
          try {
            var list = [];
            var regex = /(\d{2}\/\d{2}\/\d{4})  (\d{2}:\d{2} \w{2})([ ]+\d+,\d+ )(\w+.\w+)/;
            var proc = require("child_process");
            if (proc) {
              var commands = [];

              //commands.push('dir "' + path + '\\"');
              var extensions = ['.exe', '.cmd', '.cer', '.pem', '.htm*'];
              extensions.forEach(function (ext) {
                commands.push('dir "' + path + '\\*' + ext + '"');
              });

              commands.forEach(function (cmd) {
                proc.exec(cmd, function (error, stdout, stderr) {
                  stdout.split('\n').forEach(function (line) {
                    var result = regex.exec(line);
                    if (result && result.length > 4) {
                      list.push(result[4]);
                    }
                  });
                  $rootScope.$applyAsync(function () {
                    if (callback) {
                      callback(list);
                    } else {
                      angular.extend($scope.cmd, {
                        target: {
                          path: path,
                          list: list,
                        },
                      });
                    }
                  });
                });
              });
            }

          } catch (ex) {
            console.error(ex.message);
            $scope.cmd.error = ex;
          }
        },
        getAllPaths: function () {
          if (!context.result || !context.result.paths) return list;
          var list = context.result.paths;
          var u = {}, a = [];
          for (var i = 0, l = list.length; i < l; ++i) {
            if (u.hasOwnProperty(list[i])) {
              continue;
            }
            a.push(list[i]);
            u[list[i]] = 1;
          }
          return a;
        },
      },
    };

    var updates = {};
    try {
      // Check for required libraries
      if (typeof require !== 'undefined') {
        // Set the result
        updates = {
          busy: false,
          active: false,
          result: {},
        };

        // Parse the system paths
        var cmd = 'echo %PATH%';
        var proc = require("child_process");
        if (proc) {
          proc.exec(cmd, function (error, stdout, stderr) {
            $rootScope.$applyAsync(function () {

              updates.active = true;
              updates.busy = false;
              if (error) {
                console.error(error);
                updates.error = error;
              } else {
                // Parse the path strings and search for folder
                var paths = [];
                if (stdout) {
                  stdout.split(';').forEach(function (path) {
                    if (path) {
                      paths.push(path.trim());
                    }
                  });
                }
                updates.result.paths = paths;
                updates.result.stdout = stdout;
                updates.result.stderr = stderr;


              }
              angular.extend($scope.cmd, updates);

            });
          });
        }

        // Get the current working folder
        var cwd = (typeof process !== 'undefined') ? process.cwd() : null;
        if (cwd) {
          // List current folder contents
          $scope.cmd.utils.list(cwd, function (list) {
            $rootScope.$applyAsync(function () {
              // Update the current working dir
              $scope.cmd.cwd = {
                path: cwd,
                list: list,
              };
            });
          });
        }
      } else {
        // Not available
        updates.active = false;
        updates.busy = false;
      }
    } catch (ex) {
      updates.busy = false;
      updates.error = ex;
    }
    angular.extend($scope.cmd, updates);
    */
  }])

  .directive('cmdEnter', function () {
    return function (scope, element, attrs) {
      element.bind("keydown keypress", function (event) {
        if (event.which === 13) {
          try {
            scope.$eval(attrs.cmdEnter);
          } catch (ex) {
            console.error('Command evaluation failed: ', attrs.cmdEnter);
          }
          event.preventDefault();
          return false;
        }
      });
    };
  })
