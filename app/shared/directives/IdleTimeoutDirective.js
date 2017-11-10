app.factory('IdleTimeout', ['$window', '$location', '$timeout', '$document', 'constants', function ($window, $location, $timeout, $document, constants) {
    return function (delay, onIdle, isWarning) {
        var idleTimeout = function (delay, onIdle, isWarning) {
            var $this = this;
            $this.idleTime = delay;
            $this.goneIdle = function () {
                // Remove all information of user logged in
                $window.localStorage.removeItem(constants.localStorage.userProfile);
                $window.localStorage.removeItem(constants.localStorage.userSecret);
                $window.localStorage.setItem(constants.localStorage.logined, false);
                $window.localStorage.setItem(constants.localStorage.accessToken, "");
                onIdle();
                $timeout.cancel($this.timeout);
                // Required user login
                if (($location.path() + '').toLowerCase() !== "/login" && ($location.path() + '').toLowerCase() !== "/download/app") {
                    $window.location.href = "/login?returnUrl=" + $location.path();
                } else {
                    $window.location.href = "/login";
                }
                return;
            };
            $this.warningIdle = function () {
                onIdle();
            };
            return {
                cancel: function () {
                    return $timeout.cancel($this.timeout);
                },
                start: function (event) {
                    if (isWarning === true) {
                        $this.timeout = $timeout(function () {
                            $this.warningIdle();
                        }, $this.idleTime);
                    } else {
                        $this.timeout = $timeout(function () {
                            $this.goneIdle();
                        }, $this.idleTime);
                    }
                }
            };
        };
        var events = ['keydown', 'keyup', 'click', 'mousemove', 'DOMMouseScroll', 'mousewheel', 'mousedown', 'touchstart', 'touchmove', 'scroll', 'focus'];
        var $body = angular.element($document);
        var reset = function () {
            idleTimer.cancel();
            idleTimer.start();
            // Update time old
            var timeNow = new Date().getTime();
            $window.localStorage.setItem(constants.localStorage.timeOld, timeNow);
        };
        var idleTimer = idleTimeout(delay, onIdle, isWarning);
        return {
            active: true,
            cancel: function () {
                idleTimer.cancel();
                angular.forEach(events, function (event) {
                    $body.off(event, reset);
                });
            },
            start: function () {
                idleTimer.start();
                angular.forEach(events, function (event) {
                    $body.on(event, reset);
                });
            }
        };
    };
}]).directive('authenticationTimeout', ['IdleTimeout', 'appSettings', function (IdleTimeout, appSettings) {
    return {
        restrict: 'AC',
        controller: ['$scope', function ($scope) {
            $scope.timer = null;
            $scope.active = false;
            $scope.start = function (timer) {
                $scope.timer = new IdleTimeout((appSettings.timeOut * 60 - 30) * 1000, $scope.warning, true); // Warning before 30 seconds
                $scope.timer.start();
                $scope.active = true;
            };
            $scope.warning = function () {
                var now = new Date();
                $scope.timer = new IdleTimeout(30 * 1000, $scope.cancel, false); // Force logout after 30 seconds and required user login
                $scope.timer.start();
                // Show warning dialog
                option = {
                    id: "warningDialog",
                    title: "Warning",
                    lableClose: "CLOSE",
                    content: 'Your session will expire in 30 seconds starting from ' + $.format.toBrowserTimeZone(now, "hh:mm:ss a"),
                    width: 520
                };
                utils.dialog.showDialog(option, function () {});
            }
            $scope.cancel = function () {
                $scope.timer.cancel();
                $scope.active = false;
            };
        }],
        link: function ($scope, $el, $attrs) {
            $scope.start();
        }
    };
}]);
