app.controller('messageAdminController', ['$rootScope', '$scope', '$state', '$stateParams', '$element', '$sce', '$timeout', 'constants', 'messageService', function ($rootScope, $scope, $state, $stateParams, $element, $sce, $timeout, constants, messageService) {

    $rootScope.$app.title = constants.titlePage.adminMessage;
    $scope.userProfile = $rootScope.$app.userProfile;

    $scope.showNameMe = "Me";

    $scope.countSelect = 0;

    $scope.hideContent = true;

    $scope.noItem = false;

    $scope.hideMessageWrapper = true;

    $scope.hideEditMessage = true;

    $scope.model = {
        areaId: '',
        moduleName: '',
        moduleId: '',
        message: '',
        messageSearch: ''
    };

    $scope.listOfArea = [];

    $scope.listOfAreaExpand = {};

    $scope.listMessage = [];

    $scope.messageBox = {
        areaName: "",
        timeLine: ""
    };

    $scope.search = function (keyEvent) {
        if (keyEvent.which === 13)
            $scope.searchClick();
    };

    $scope.searchClick = function () {
        var data = {
            moduleId: $scope.model.moduleId,
            areaId: $scope.model.areaId,
            messageId: '',
            keyWord: $scope.model.messageSearch
        };
        $rootScope.isLoading = true;
        messageService.getListMessageAdmin(data).then(function (response) {
            $scope.listMessage = [];
            var index = 1;
            _.each(response.data, function (item) {
                $scope.listMessage.push({
                    messageId: item.messageId,
                    image: item.image,
                    userName: item.userName,
                    description: $sce.trustAsHtml(utils.urlify(item.description)),
                    createdDateTime: item.createdDateTime,
                    time: new Date(item.createdDateTime).getTime(),
                    class: index % 2 === 0 ? "even" : "odd"
                });
                index++;
            });

            if ($scope.listMessage.length > 0) {
                $scope.messageBox.timeLine = "Last message " + $scope.getTimeLine($scope.listMessage[0].createdDateTime);
                var sorted = _.chain($scope.listMessage).sortBy('time').value();
                $scope.listMessage = sorted;
            }
            $scope.scrollBottom();
            $rootScope.isLoading = false;
        }, function (err) {
            $rootScope.isLoading = false;
        });
    };

    var onload = function () {
        $rootScope.isLoading = true;
        messageService.getListOfArea().then(function (response) {
            if (response.data !== null && response.data !== undefined && response.data.length > 0) {
                $scope.hideContent = false;
                var index = 1;
                _.each(response.data, function (item) {
                    if (index === 1) {
                        $scope.hideEditMessage = false;
                        item.class = "active";
                        item.areaView[0].class = "active";
                        if (item.areaView !== null && item.areaView !== undefined && item.areaView.length > 0) {
                            var data = {
                                moduleId: item.moduleId,
                                moduleName: $scope.moduleName,
                                areaId: item.areaView[0].areaId,
                                messageId: '',
                                keyWord: ''
                            };

                            $rootScope.isLoading = true;
                            messageService.getListMessageAdmin(data).then(function (response) {
                                $scope.hideMessageWrapper = false;
                                $scope.listMessage = [];
                                var index = 1;
                                _.each(response.data, function (item) {
                                    $scope.listMessage.push({
                                        messageId: item.messageId,
                                        image: item.image,
                                        userName: item.userName,
                                        description: $sce.trustAsHtml(utils.urlify(item.description)),
                                        createdDateTime: item.createdDateTime,
                                        time: new Date(item.createdDateTime).getTime(),
                                        class: index % 2 === 0 ? "even" : "odd"
                                    });
                                    index++;
                                });

                                if ($scope.listMessage.length > 0) {
                                    $scope.model.moduleId = item.moduleId;
                                    $scope.model.moduleName = item.moduleName;
                                    $scope.model.areaId = item.areaView[0].areaId;
                                    $scope.messageBox.areaName = item.areaView[0].areaName;
                                    $scope.messageBox.timeLine = "Last message " + $scope.getTimeLine(item.areaView[0].createdDateTime);

                                    var sorted = _.chain($scope.listMessage).sortBy('time').value();
                                    $scope.listMessage = sorted;
                                }
                                $scope.scrollBottom();
                                $rootScope.isLoading = false;
                            }, function (err) {
                                $rootScope.isLoading = false;
                            });
                        }
                    }

                    if (item.areaView !== null && item.areaView !== undefined && item.areaView.length > 0) {
                        _.each(item.areaView, function (area) {
                            area.message = $sce.trustAsHtml(utils.urlify(area.message));
                        });
                    }

                    $scope.listOfArea.push(item);
                    index++;
                });
            }
            else {
                $scope.hideContent = true;
                $scope.noItem = true;
            }
            $rootScope.isLoading = false;
        }, function (err) {
            utils.error.showErrorGet(err);
            $rootScope.isLoading = false;
            $scope.hideContent = true;
            $scope.noItem = true;
        });
    };
    onload();

    $scope.selectArea = function (e, moduleItem, areaId) {
        e.preventDefault();

        $scope.countSelect = 0;
        $scope.hideEditMessage = false;
        $scope.model.moduleId = moduleItem.moduleId;
        $scope.model.areaId = areaId;
        $scope.model.moduleName = moduleItem.areaName;
        $scope.model.message = '';

        _.each($scope.listOfArea, function (item) {

            if (item.moduleId === moduleItem.moduleId) {
                item.class = "active";
                _.each(item.areaView, function (area) {
                    if (area.areaId === areaId) {
                        area.class = "active";
                        $scope.messageBox.areaName = area.areaName;
                        $scope.messageBox.timeLine = "Last message " + $scope.getTimeLine(area.createdDateTime);
                    }
                    else {
                        area.class = "";
                    }
                });
            }
            else {
                item.class = "";
                _.each(item.areaView, function (area) {
                    area.class = "";
                });
            }
        });

        var data = {
            moduleId: moduleItem.moduleId,
            moduleName: moduleItem.areaName,
            areaId: areaId,
            messageId: '',
            keyWord: $scope.model.messageSearch
        };
        $rootScope.isLoading = true;
        messageService.getListMessageAdmin(data).then(function (response) {
            $scope.listMessage = [];
            var index = 1;
            _.each(response.data, function (item) {
                $scope.listMessage.push({
                    messageId: item.messageId,
                    image: item.image,
                    userName: item.userName,
                    description: $sce.trustAsHtml(utils.urlify(item.description)),
                    createdDateTime: item.createdDateTime,
                    time: new Date(item.createdDateTime).getTime(),
                    class: index % 2 === 0 ? "even" : "odd"
                });
                index++;
            });

            if ($scope.listMessage.length > 0) {
                var sorted = _.chain($scope.listMessage).sortBy('time').value();
                $scope.listMessage = sorted;
                $scope.messageBox.timeLine = "Last message " + $scope.getTimeLine($scope.listMessage[$scope.listMessage.length - 1].createdDateTime);
            }
            $scope.scrollBottom();
            $rootScope.isLoading = false;
        }, function (err) {
            $rootScope.isLoading = false;
        });
    };

    $scope.sendMessage = function () {
        var data = {
            moduleName: $scope.model.moduleName,
            areaId: $scope.model.areaId,
            description: $scope.model.message            
        };
        $rootScope.isLoading = true;
        messageService.sendMessage(data).then(function (response) {
            var date = new Date();
            $scope.listMessage.push({
                messageId: response.data,
                image: $scope.userProfile.image,
                userName: $scope.showNameMe,
                description: $sce.trustAsHtml(utils.urlify($scope.model.message)),
                createdDateTime: date,
                class: ($scope.listMessage.length + 1) % 2 === 0 ? 'even' : 'odd'
            });
            _.each($scope.listOfArea, function (item) {
                if (item.moduleId === $scope.model.moduleId) {
                    _.each(item.areaView, function (area) {
                        if (area.areaId === $scope.model.areaId) {
                            area.userName = $scope.showNameMe;
                            area.message = $sce.trustAsHtml(utils.urlify($scope.model.message));
                            area.createdDateTime = date;
                        }
                    });
                }
            });

            $scope.messageBox.timeLine = "Last message just now";

            $scope.model.message = '';
            $scope.scrollBottom();
            $rootScope.isLoading = false;
        }, function (err) {
            $rootScope.isLoading = false;
            utils.error.showErrorGet(err);
            var option = {
                id: "dialogError",
                title: "Send Message",
                lableClose: "CLOSE",
                content: err.message,
                width: 300
            };
            utils.dialog.showDialog(option);
        });
    };

    $scope.editMessage = function (e) {
        e.preventDefault();
        $scope.hideEditMessage = true;
    };

    $scope.cancelDelete = function (e) {
        e.preventDefault();
        $scope.hideEditMessage = false;

        _.each($scope.listMessage, function (message) {
            message.checked = false;
        });
    };

    $scope.changeCheckBox = function () {
        $scope.countSelect = 0;
        _.each($scope.listMessage, function (message) {
            if (message.checked === true) {
                $scope.countSelect++;
            }
        });
    };

    $scope.deleteMessage = function (e) {
        e.preventDefault();
        var option = {};
        if ($scope.countSelect < 1) {
            option = {
                id: "dialogError",
                title: "Delete message",
                lableClose: "CLOSE",
                content: "You have not selected any record.",
                width: 300
            };
            utils.dialog.showDialog(option);
        }
        else {

            option = {
                id: "dialogInfor",
                title: "Delete " + $scope.countSelect + " message",
                lableClose: "CANCEL",
                lableOk: "DELETE",
                content: "Delete message selected. Proceed?",
                width: 380
            };
            utils.dialog.showConfirm(option, function () {

                var arrayMessageId = [];
                _.each($scope.listMessage, function (message) {
                    if (message.checked === true) {
                        arrayMessageId.push(message.messageId);
                    }
                });

                $rootScope.isLoading = true;
                messageService.deleteMessages(arrayMessageId).then(function (response) {
                    $rootScope.isLoading = false;
                    var option = {
                        id: "dialogError",
                        title: "Delete message",
                        lableClose: "CLOSE",
                        content: "Delete messages successful.",
                        width: 300
                    };

                    utils.dialog.showDialog(option, function () {
                        $scope.hideEditMessage = false;
                        $rootScope.isLoading = true;
                        var data = {
                            moduleId: $scope.model.moduleId,
                            areaId: $scope.model.areaId,
                            messageId: '',
                            keyWord: $scope.model.messageSearch
                        };
                        messageService.getListMessageAdmin(data).then(function (response) {
                            $scope.listMessage = [];
                            var index = 1;
                            _.each(response.data, function (item) {
                                $scope.listMessage.push({
                                    messageId: item.messageId,
                                    image: item.image,
                                    userName: item.userName,
                                    description: $sce.trustAsHtml(utils.urlify(item.description)),
                                    createdDateTime: item.createdDateTime,
                                    time: new Date(item.createdDateTime).getTime(),
                                    class: index % 2 === 0 ? "even" : "odd"
                                });
                                index++;
                            });

                            if ($scope.listMessage.length > 0) {
                                var sorted = _.chain($scope.listMessage).sortBy('time').value();
                                $scope.listMessage = sorted;
                                $scope.messageBox.timeLine = "Last message " + $scope.getTimeLine($scope.listMessage[$scope.listMessage.length - 1].createdDateTime);
                            }
                            $scope.scrollBottom();
                            $rootScope.isLoading = false;
                        }, function (err) {
                            $rootScope.isLoading = false;
                        });
                    });
                }, function (err) {
                    utils.error.showErrorGet(err);
                    var option = {
                        id: "dialogError",
                        title: "Delete message",
                        lableClose: "CLOSE",
                        content: err.message,
                        width: 300
                    };
                    utils.dialog.showDialog(option);
                    $rootScope.isLoading = false;
                });

            });
        }
    };

    $scope.triggerEventScroll = true;

    $scope.scrollBottom = function () {
        $scope.triggerEventScroll = false;
        $timeout(function () {
            var scroll = $($element).find("[data-control='scroll']");
            if ($(scroll).length > 0) {
                var height = scroll[0].scrollHeight - $(scroll).height();
                $(scroll).stop().animate({ scrollTop: height }, "slow", function () {
                    $timeout(function () {
                        $scope.triggerEventScroll = true;
                    }, 10);
                });
            }
        }, 100);
    };

    $scope.getTimeLine = function (datetime) {
        return utils.timeLine(datetime);
    };

    var scroll = $($element).find("[data-control='scroll']");

    if ($(scroll).length > 0) {
        angular.element(scroll).bind("scroll", function () {
            var data = {};
            if ($scope.triggerEventScroll === true) {
                if (this.scrollTop === 0) {
                    $scope.triggerEventScroll = false;
                    data = {
                        moduleId: $scope.model.moduleId,
                        areaId: $scope.model.areaId,
                        messageId: $scope.listMessage.length > 0 ? $scope.listMessage[0].messageId : '',
                        scroll: "up",
                        keyWord: $scope.model.messageSearch
                    };
                    messageService.getListMessageAdmin(data).then(function (response) {
                        var index = 1;
                        _.each(response.data, function (item) {
                            $scope.listMessage.push({
                                messageId: item.messageId,
                                image: item.image,
                                userName: item.userName,
                                description: $sce.trustAsHtml(utils.urlify(item.description)),
                                createdDateTime: item.createdDateTime,
                                time: new Date(item.createdDateTime).getTime(),
                                class: index % 2 === 0 ? "even" : "odd"
                            });
                            index++;
                        });

                        if ($scope.listMessage.length > 0) {
                            var sorted = _.chain($scope.listMessage).sortBy('time').value();
                            $scope.listMessage = sorted;
                            $scope.messageBox.timeLine = "Last message " + $scope.getTimeLine($scope.listMessage[$scope.listMessage.length - 1].createdDateTime);

                            _.each($scope.listOfArea, function (item) {

                                _.each(item.areaView, function (area) {
                                    if (area.areaId === $scope.model.areaId && area.moduleId === $scope.model.moduleId) {
                                        var itemMessageLast = $scope.listMessage[$scope.listMessage.length - 1];
                                        area.userName = itemMessageLast.userName;
                                        area.createdDateTime = itemMessageLast.createdDateTime;
                                        area.message = itemMessageLast.createdDateTime;
                                    }
                                });

                            });
                        }
                        $scope.triggerEventScroll = true;

                    }, function (err) {
                        utils.error.showErrorGet(err);
                    });
                }
                if (this.scrollTop + this.offsetHeight >= this.scrollHeight) {
                    $scope.triggerEventScroll = false;
                    data = {
                        moduleId: $scope.model.moduleId,
                        areaId: $scope.model.areaId,
                        messageId: $scope.listMessage.length > 0 ? $scope.listMessage[$scope.listMessage.length - 1].messageId : '',
                        scroll: "down",
                        keyWord: $scope.model.messageSearch
                    };

                    messageService.getListMessageAdmin(data).then(function (response) {
                        var index = 1;
                        _.each(response.data, function (item) {
                            $scope.listMessage.push({
                                messageId: item.messageId,
                                image: item.image,
                                userName: item.userName,
                                description: $sce.trustAsHtml(utils.urlify(item.description)),
                                createdDateTime: item.createdDateTime,
                                time: new Date(item.createdDateTime).getTime(),
                                class: index % 2 === 0 ? "even" : "odd"
                            });
                            index++;
                        });

                        if ($scope.listMessage.length > 0) {
                            var sorted = _.chain($scope.listMessage).sortBy('time').value();
                            $scope.listMessage = sorted;
                            $scope.messageBox.timeLine = "Last message " + $scope.getTimeLine($scope.listMessage[$scope.listMessage.length - 1].createdDateTime);

                            _.each($scope.listOfArea, function (item) {

                                _.each(item.areaView, function (area) {
                                    if (area.areaId === $scope.model.areaId && area.moduleId === $scope.model.moduleId) {
                                        var itemMessageLast = $scope.listMessage[$scope.listMessage.length - 1];
                                        area.userName = itemMessageLast.userName;
                                        area.createdDateTime = itemMessageLast.createdDateTime;
                                        area.message = itemMessageLast.createdDateTime;
                                    }
                                });

                            });
                        }
                        $scope.scrollBottom();

                    }, function (err) {
                        utils.error.showErrorGet(err);
                    });
                }
            }
        });
    }

}]);