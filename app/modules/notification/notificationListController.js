app.controller('notificationListController',
    ['$rootScope', '$scope', '$window', '$state', '$stateParams', '$timeout', 'constants', 'notificationService',
    function ($rootScope, $scope, $window, $state, $stateParams, $timeout, constants, notificationService) {

        $scope.getTimeLine = function (datetime) {
            return utils.timeLine(datetime);
        };

        $scope.mainGridOptions = {
            dataSource: $scope.allDataSource,
            scrollable: false,
            pageable: {
                pageSizes: true,
                buttonCount: 5
            },
            columns: [{
                field: "notificationId",
                title: "",
                width: "100%",
                template: function (dataItem) {
                    var temp = "<div class=\"notification-group-items\">" +
                        "<div class=\"" + (dataItem.isRead == false ? "notification-unread" : "notification-read") + " " + (dataItem.hasAction == true ? "notification-require-action" : "notification-unrequire-action") + "\">" +
                            "<div>" +
                                "<a class=\"notification-title\" href=\"" + dataItem.url + "\" data-ng-click=\"markAsReadNotification('" + dataItem.notificationId + "', '" + dataItem.url + "');\"><span>" + dataItem.messages + "</span></a>" +
                                "<span class=\"notification-date\">" + $scope.getTimeLine(dataItem.createdDateTime) + "</span>" +
                            "</div>" +
                        "</div>" +
                    "</div>";
                    return temp;
                }
            }, {
                hidden: true,
                field: "groupField",
                title: "",
                groupHeaderTemplate: function (dataItem) {
                    var temp = "<div class=\"notification-group-title\">" +
                            "<span>" + dataItem.value.replace(/\d_/i, "") + "</span>" +
                        "</div>";
                    return temp;
                }
            }],
            noRecords: true,
            messages: {
                noRecords: "There is no data on current page"
            },
            selectable: "row",
            change: function (e) {
                e.preventDefault();
                var dataItem = this.dataItem(this.select());
                markAsReadNotification(dataItem.notificationId, dataItem.url);
            }
        };

        $scope.allDataSource = new kendo.data.DataSource({
            transport: {
                read: function (options) {
                    $rootScope.isLoading = true;
                    notificationService.getListNotification({
                        skip: (options.data.page - 1) * options.data.pageSize,
                        take: options.data.take
                    }).then(function (response) {
                        if (response.data !== null && response.data !== undefined) {
                            options.success(response.data);
                        } else {
                            options.success([]);
                        }
                        $rootScope.isLoading = false;
                    }, function (error) {
                        options.error([]);
                        utils.error.showErrorGet(error);
                        $rootScope.isLoading = false;
                    });
                }
            },
            schema: {
                model: {
                    fields: {
                        notificationId: { type: "string" },
                        groupField: { type: "string" }
                    }
                },
                total: function (response) {
                    return response === null || response === undefined || response.length === 0 ? 0 : response[0].total;
                }
            },
            pageSize: 20,
            serverPaging: true,
            group: {
                field: "groupField",
                dir: "asc"
            }
        });

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

        var markAsReadNotification = function (notificationId, url) {
            notificationService.markAsReadNotification(notificationId).then(function (respone) {
                if (respone.data != -1) {
                    var temp = url.split("/");
                    if (temp[0].indexOf("sce") == 0) {
                        $rootScope.countUnreadNotification -= (respone.data == 1 ? 1 : 0);
                        $state.go(constants.state.scedetail, { sceId: temp[1] });
                    } else if (temp[0].indexOf("ra") == 0) {
                        $rootScope.countUnreadNotification -= (respone.data == 1 ? 1 : 0);
                        $state.go(constants.state.raDetail, { sceId: temp[1], raId: temp[2] });
                    } else if (temp[0].indexOf("asm") == 0) {
                        $rootScope.countUnreadNotification -= (respone.data == 1 ? 1 : 0);
                        $state.go(constants.state.asmDetail, { alarmId: temp[1] });
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