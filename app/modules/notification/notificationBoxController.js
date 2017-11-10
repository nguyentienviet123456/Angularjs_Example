app.controller('notificationBoxController',
    ['$rootScope', '$scope', '$window', '$state', '$stateParams', '$timeout', '$sce', 'constants', 'areaService', 'notificationService',
    function ($rootScope, $scope, $window, $state, $stateParams, $timeout, $sce, constants, areaService, notificationService) {
        $scope.listNotification = [];
        $rootScope.countUnreadNotification = 0;
        $rootScope.hasUnread = 'hide-item';
        var isProcessTriggerClick = true;

        $scope.getTimeLine = function (datetime) {
            return utils.timeLine(datetime);
        };

        $scope.getTopNotification = function () {
            if (!isProcessTriggerClick)
                return false;
            isProcessTriggerClick = false;
            $scope.isProcess = true;
            $scope.listNotification = [];
            notificationService.getTopNotification().then(function (response) {
                _.each(response.data, function (item) {
                    $scope.listNotification.push({
                        notificationId: item.notificationId,
                        messages: item.messages,
                        createdDateTime: $scope.getTimeLine(item.createdDateTime),
                        isRead: item.isRead,
                        hasAction: item.hasAction,
                        url: item.url
                    });
                });
                $scope.isProcess = false;
                isProcessTriggerClick = true;
            }, function (err) {
                $scope.isProcess = false;
                isProcessTriggerClick = true;
                $scope.listNotification = [];
            });
        };

        notificationService.countUnreadNotification().then(function (response) {
            $rootScope.countUnreadNotification = response.data;
            if (response.data > 0)
                $rootScope.hasUnread = '';
        }, function (err) {
            $rootScope.countUnreadNotification = 0;
            $rootScope.hasUnread = 'hide-item';
        });

        $scope.goPageNotifications = function () {
            $state.go(constants.state.notificationList);
        };

        // Start action
        $scope.markAsAllReadNotification = function () {
            notificationService.markAsAllReadNotification().then(function (response) {
                if (response.data) {
                    $rootScope.countUnreadNotification = 0;
                    $rootScope.hasUnread = 'hide-item';
                }
                return response.data;
            }, function (err) {
                //
            });
        };

        $scope.markAsReadNotification = function (notificationId, url) {
            notificationService.markAsReadNotification(notificationId).then(function (respone) {
                if (respone.data != -1) {
                    var temp = url.split("/");
                    if (temp[0].indexOf("sce") == 0) {
                        $rootScope.countUnreadNotification -= (respone.data == 1 ? 1 : 0);
                        $state.go(constants.state.scedetail, { sceId: temp[1] });
                        $rootScope.bigModuleTitle = "Safety Critical Equipment (SCE)";
                    } else if (temp[0].indexOf("ra") == 0) {
                        $rootScope.countUnreadNotification -= (respone.data == 1 ? 1 : 0);
                        $state.go(constants.state.raDetail, { sceId: temp[1], raId: temp[2] });
                        $rootScope.bigModuleTitle = "Safety Critical Equipment (SCE)";
                    } else if (temp[0].indexOf("asm") == 0) {
                        $rootScope.countUnreadNotification -= (respone.data == 1 ? 1 : 0);
                        $state.go(constants.state.asmDetail, { alarmId: temp[1] });
                        $rootScope.bigModuleTitle = "Alarm Shelving Application (ASM)";
                    } else {
                        $scope.noticeDialog('Notice', constants.messages.error);
                    }
                    if ($rootScope.countUnreadNotification == 0) {
                        $rootScope.hasUnread = 'hide-item';
                    }
                } else {
                    $scope.noticeDialog('Notice', respone.message);
                }
            }, function (err) {
                $scope.noticeDialog('Notice', constants.messages.error);
            });
        };
        // End action
        $scope.noticeDialog = function (title, content) {
            return $("<div></div>").kendoDialog({
                title: title,
                content: content
            }).data("kendoDialog").open();
        };
    }]);