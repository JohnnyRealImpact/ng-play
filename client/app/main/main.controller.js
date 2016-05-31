'use strict';

angular.module('ngPlayApp')
  .controller('MainCtrl', function ($rootScope, $scope, $http, cliProxy) {
    $scope.awesomeThings = [];

    $http
      .get('/api/things')
      .success(function (awesomeThings) {
        $scope.awesomeThings.concat(awesomeThings);
      })
      .finally($rootScope.$applyAsync);
    ;

    var localTile = {
      name: 'localhost',
      info: 'Locally installed environment',
      url: 'https://localhost',
      active: false,
      featured: true,
    };
    $scope.awesomeThings.push(localTile);
    $http
      .get(localTile.url)
      .success(function (data) {
        localTile.name = 'localhost (secure)';
        localTile.url = 'https://localhost';
        localTile.active = true;
      })
      .catch(function (err) {
        console.warn('Not found: ' + localTile.url);

        localTile.url = 'http://localhost';
        localTile.name = 'localhost (insecure)';
        localTile.active = false;

        return $http
          .get(localTile.url)
          .success(function (data) {
            console.info('Connected: ' + localTile.url);
            localTile.active = true;
          })
          .catch(function (err) {
            localTile.url = 'http://localhost';
            localTile.name = 'localhost (offline)';
            localTile.active = false;
            localTile.error = err;
            console.warn('Not Found: ' + localTile.url, err);
          })
          .finally($rootScope.$applyAsync);
      })
      .finally($rootScope.$applyAsync);

    // Send the command to the remote machine
    var tileDockerMachine = {
      name: 'docker-machine',
      info: 'Checking if locally installed...',
      active: false,
    };
    $scope.awesomeThings.push(tileDockerMachine);
    cliProxy
      .send({
        input: 'docker-machine -v | sed -e "s/docker-machine version //g" | sed -e "s/, build .*$//g" | sed -e "s/ //g"'
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
          tileDockerMachine.info = 'Successfully located docker-machine on the host.';

          return cliProxy
            .send({
              input: 'printf "[ " && docker-machine ls --format="{ \\\"name\\\": \\\"{{.Name}}\\\", \\\"state\\\": \\\"{{.State}}\\\", \\\"driver\\\": \\\"{{.DriverName}}\\\", \\\"url\\\": \\\"{{.URL}}\\\" }," && printf " null ]\n" | sed -e "s/\\},\\s*\\]/zzzz/g"'
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
                var index = $scope.awesomeThings.indexOf(tileDockerMachine);
                if (index > -1) {
                  $scope.awesomeThings.splice(index, 1);
                }

                // { state: Running, driver: virtualbox, name:default, url: tcp://192.168.99.100:2376 }
                var found = {};
                var result = JSON.parse(resp.stdout);
                if (result.length) {
                  result.forEach(function (item) {
                    if (!item) return;

                    console.log(' - Adding:', item);
                    found[item.name] = item;
                    $scope.awesomeThings.push(
                      {
                        name: item.driver + '://' + item.name,
                        info: 'Registered docker-machine: ' + item.url,
                        active: true,
                      }
                    );
                  });
                }

                [
                  'test',
                  'stage',
                  'live',
                ].forEach(function (ident) {
                    if (!found[ident]) {
                      $scope.awesomeThings.push(
                        {
                          name: 'new://' + ident,
                          info: 'Define the \'' + ident + '\' docker-machine environment.',
                          active: false,
                        }
                      );
                    }
                  })

              }
            })
        }
      })
      .catch(function (err) {
        console.warn(' - REJ:', err);
      })
      .finally($rootScope.$applyAsync);

    $scope.getColor = function ($index) {
      var bg = '';
      var _d = $scope.awesomeThings.length > $index ? $scope.awesomeThings[$index] : null;
      if (_d !== null) {
        if (!_d.active) {
          bg = 'gray';
        } else if (_d.featured) {
          bg = 'green';
        } else {
          bg = 'deepBlue';
        }
      }

      return bg;
    };

    $scope.getSpan = function ($index) {
      var _d = ($scope.awesomeThings.length > $index) ? $scope.awesomeThings[$index] : null;
      if (_d !== null) {
        return _d.featured ? 2 : 1;
      }
    };

    $scope.deleteThing = function (thing) {
      $http.delete('/api/things/' + thing._id);
    };
  });
