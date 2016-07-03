/**
 * Created by JohnathanLodder on 16/07/03.
 */

angular.module('ngPlayApp.config', [
  'ngCookies',
])

  // Config definitions
  .constant('appConfig', {
    page: {
      title: 'Remote Control',
    },
    api: {
      things: '/api/things',
    },
    cmd: {
      discoverIp: 'dig +short myip.opendns.com @resolver1.opendns.com',
      dockerMachineVer: 'docker-machine -v | sed -e "s/docker-machine version //g" | sed -e "s/, build .*$//g" | sed -e "s/ //g"',
      dockerMachineList: 'printf "[ " && docker-machine ls --format="{ \\\"name\\\": \\\"{{.Name}}\\\", \\\"state\\\": \\\"{{.State}}\\\", \\\"driver\\\": \\\"{{.DriverName}}\\\", \\\"url\\\": \\\"{{.URL}}\\\" }," && printf " null ]\n" | sed -e "s/\\},\\s*\\]/zzzz/g"',
    }
  });
