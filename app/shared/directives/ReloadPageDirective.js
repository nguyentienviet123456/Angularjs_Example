app.factory('ReloadPage', ['$window', '$state', '$location', '$timeout', '$document', 'constants', '$cookies', function ($window, $state, $location, $timeout, $document, constants, $cookies) {
    return function (delay, onReload) {
        var reloadPage = function (delay, onReload) {
            var $this = this;
            $this.reloadTime = delay;
            $this.goneReload = function () {
                console.log('gone reload!');
                onReload();
                $state.reload();
                return;
            };
            return {
                cancel: function () {
                    return $timeout.cancel($this.timeout);
                },
                start: function (event) {
                    console.log('start timeout', $this.reloadTime);
                    $this.timeout = $timeout(function () {
                        $this.goneReload();
                    }, $this.reloadTime);
                }
            };
        };
        var $body = angular.element($document);
        var reset = function () {
            reloadTimer.cancel();
            reloadTimer.start();
        };
        var reloadTimer = reloadPage(delay, onReload);
        return {
            active: true,
            cancel: function () {
                reloadTimer.cancel();
            },
            start: function () {
                reloadTimer.start();
            }
        };
    };
}]).directive('reloadPage', ['ReloadPage', 'constants', 'appSettings', '$cookies', function (ReloadPage, constants, appSettings, $cookies) {
    return {
        restrict: 'AC',
        controller: ['$scope', function ($scope) {
            var mode = ($cookies.mode === null || $cookies.mode === undefined) ? constants.autoReloadSetting.mode : $cookies.mode;
            var delay = ($cookies.delay === null || $cookies.delay === undefined) ? constants.autoReloadSetting.delay : $cookies.delay;
            $scope.delay = delay;
            $scope.isShow = mode;
            $('#reloadMode').prop('checked', (mode === true));
            $('input[name="reloadMode"]').change(function () {
                if (this.checked === true) {
                    $scope.isShow = true;
                    $cookies.mode = true;
                } else {
                    $scope.isShow = false;
                    $cookies.mode = false;
                }
            });
            // 
            $scope.timerReload = null;
            $scope.startReload = function (timer) {
                console.log('start!');
                $scope.timerReload = new ReloadPage($scope.delay * 1000, $scope.cancelReload);
                $scope.timerReload.start();
            };
            $scope.cancelReload = function () {
                console.log('cancel!');
                $scope.timerReload.cancel();
            };
            // session
            $scope.setDelay = function () {
                $scope.delay = $('#delay').val();
                $cookies.delay = $scope.delay;
            };
        }],
        link: function ($scope, $el, $attrs) {
            $scope.startReload();
        }
    };
}]);
