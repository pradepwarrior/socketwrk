var app = angular.module('app', [])
    .controller('appCtrl', function ($scope) {
        $scope.click = function () {
            var socket = io.connect('http://127.0.0.1:8085');
            socket.emit('input', {
                message: $scope.value
            });
        }

        socket.on('chat', function (data) {
              console.log(data)////
              });
    })