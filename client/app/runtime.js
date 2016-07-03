/**
 * Created by JohnathanLodder on 16/07/03.
 */

angular.module('ngPlayApp.runtime', [
  'ngPlayApp.config',
  'ngPlayApp.cli',
  'ngPlayApp.info',
])

  // Define the application runtime service
  .service('appRuntime', ['appConfig', 'cliProxy', '$http', '$q', function (config, cliProxy, $http, $q) {
    var _self = this;
    _self.awesomeThings = _self.awesomeThings || [];
    _self.init = function () {
      // Return a promise to initialise
      return $q(function (resolve, reject) {
        //setTimeout(function () {

        // Check for auto discovery
        if (config.api && config.api.things) {
          $http
            .get(config.api.things)
            .success(function (apiResult) {
              // Append results
              if (apiResult && apiResult.length) {
                apiResult.forEach(function(item){
                  item.priority = item.priority || 1;
                  _self.awesomeThings.push(item);
                });
              }

              // Set the result
              resolve({
                status: true,
                result: apiResult
              });
            })
            .catch(reject)
        } else {
          reject(new Error('No configuration was specified.'));
        }

        //}, 2500);
      });
    };
    _self.getAwesomeThings = function () {
      return _self.awesomeThings;
    };
    _self.deleteAwesomeThing = function (thing) {
      $http.delete(config.api.things + '/' + thing._id);
    };
    _self.checkRemote = function () {
      var localUrl = 'https://localhost';
      var localTile = {
        url: localUrl,
        name: 'Target Host (discovering...)',
        desc: 'Connecting to target machine "' + localUrl + '"...',
        active: false,
        featured: false,
        priority: 0,
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
            localTile.name = 'Target Host (offline)';
            localTile.info = 'An error occurred while looking for docker-machine';
            console.error(resp.stderr);
          } else if (resp.stdout) {
            var newHost = resp.stdout.trim();
            var newUrl = 'https://' + newHost;
            localTile.name = newHost;
            localTile.url = newUrl;
            localTile.active = true;
            //localTile.featured = true;

            config.title = newHost;
          }
          return {
            status: true,
            result: {
              host: resp.stdout.trim(),
            },
          };
        });
    };
    _self.checkDockers = function () {
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

                  return {
                    status: true,
                    result: found,
                  };
                }
              })
          }
        })
        .catch(function (err) {
          console.warn(' - REJ:', err);
        })
    };
  }])

  // Set the page configuration
  .run(function($rootScope, appConfig){
    $rootScope.pageInfo = appConfig.page;
  })

  // Bootstrap the application runtime...
  .run(function (appRuntime) {

    // Bootstrap the application runtime
    console.groupCollapsed('Starting application...');
    appRuntime
      .init()
      .then(function (info) {
        // Display host info (async result)
        console.groupCollapsed(' - Target Host Responded:', info.status ? info.result : info.status);
        console.log(' - Full Response:', info);
        console.groupEnd();
        return info;
      })
      .then(function (info) {
        // Check for additional info (async)
        console.groupCollapsed(' - Checking remote host for more info...');
        return appRuntime
          .checkRemote()
          .then(function (res) {
            console.log(' - Host Discovery:', res);
            console.groupEnd();
            return res;
          });
      })
      .then(function (remoteInfo) {
        // Finally check if docker is installed (async)
        console.groupCollapsed(' - Checking remote host for dockers...', remoteInfo.status ? remoteInfo.result : remoteInfo.status);
        return appRuntime
          .checkDockers()
          .then(function (res) {
            console.log(' - Docker Discovery:', res);
            console.groupEnd();
            return res;
          });
      })
      .then(function (dockerInfo) {
        // Display host dockerInfo (async result)
        console.groupCollapsed(' - Target Dockers Responded:', dockerInfo.status ? dockerInfo.result : dockerInfo.status);
        console.log(' - Full Response:', dockerInfo);
        console.groupEnd();
        return dockerInfo;
      })
      .then(function(res){
        appRuntime.awesomeThings.push(
          {
            icon: 'content:add',
            name: 'Create New',
            info: 'Define a new docker-machine environment.',
            state: 'app.new',
            active: false,
          }
        )
        return res;
      })
      .finally(function () {
        console.groupEnd();
      });

  })
