app.controller('messageBoxController', ['$rootScope', '$scope', '$element', '$state', '$stateParams', '$timeout', '$sce', 'constants', 'areaService', 'messageService', function ($rootScope, $scope, $element, $state, $stateParams, $timeout, $sce, constants, areaService, messageService) {

    $scope.userProfile = $rootScope.$app.userProfile;

    $scope.moduleName = $($element).attr("data-module");

    $scope.showNameMe = "Me";

    $scope.model = {
        areaId: '',
        moduleName: $scope.moduleName,
        message: ''
    };

    $scope.listMessage = [];

    $scope.areaOption = {
        dataTextField: 'description',
        dataValueField: 'lookupAreaId',
        dataSource: {
            transport: {
                read: function (options) {
                    var arrayLookupArea = [{ lookupAreaId: "", description: "All" }];
                    areaService.getAreaByUserSubscription($scope.userProfile.userProfileId).then(function (response) {

                        _.each(response.data, function (item) {
                            arrayLookupArea.push({ lookupAreaId: item.lookupAreaId, description: item.description });
                        });

                        options.success(arrayLookupArea);

                    }, function (err) {
                        options.success(arrayLookupArea);
                        utils.error.showErrorGet(err);
                    });
                }
            }
        }
    };

    $scope.onAreaChange = function () {
        $scope.triggerEventScroll = false;
        $scope.listMessage = [];
        var data = {
            moduleName: $scope.model.moduleName,
            areaId: $scope.model.areaId,
            messageId: ''
        };
        $scope.isProcess = true;
        messageService.getListMessageDashBoard(data).then(function (response) {
            var index = 1;
            _.each(response.data, function (item) {
                $scope.listMessage.push({
                    messageId: item.messageId,
                    image: item.image,
                    userName: item.userName,
                    description: $sce.trustAsHtml(utils.urlify(item.description)),
                    createdDateTime: item.createdDateTime,
                    time: new Date(item.createdDateTime).getTime(),
                    class: index % 2 === 0 ? 'even' : 'odd'
                });
                index++;
            });

            if ($scope.listMessage.length > 0) {
                var sorted = _.chain($scope.listMessage).sortBy('time').value();
                $scope.listMessage = sorted;
            }
            $scope.scrollBottom();
            $scope.isProcess = false;
        }, function (err) {
            $scope.isProcess = false;
        });
    };

    $scope.isProcess = false;

    var onload = function () {

        var data = {
            moduleName: $scope.model.moduleName,
            areaId: '',
            messageId: ''
        };
        $scope.isProcess = true;
        messageService.getListMessageDashBoard(data).then(function (response) {
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
            }
            $scope.scrollBottom();
            $scope.isProcess = false;
        }, function (err) {
            $scope.isProcess = false;
        });
    };
    onload();

    $scope.sendMessage = function () {
        var data = {
            moduleName: $scope.model.moduleName,
            areaId: $scope.model.areaId,
            description: $scope.model.message
        };
        $scope.isProcess = true;
        messageService.sendMessage(data).then(function (response) {
            $scope.listMessage.push({
                messageId: response.data,
                image: $scope.userProfile.image,
                userName: $scope.showNameMe,
                description: $sce.trustAsHtml(utils.urlify($scope.model.message)),
                createdDateTime: new Date(),
                class: ($scope.listMessage.length + 1) % 2 === 0 ? 'even' : 'odd'
            });
            $scope.model.message = '';
            $scope.scrollBottom();
            $scope.isProcess = false;
        }, function (err) {
            $scope.isProcess = false;
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

    $scope.getTimeLine = function (datetime) {
        return utils.timeLine(datetime);
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

    var scroll = $($element).find("[data-control='scroll']");

    if ($(scroll).length > 0) {
        angular.element(scroll).bind("scroll", function () {
            var data = {};
            if ($scope.triggerEventScroll === true) {
                if (this.scrollTop === 0) {
                    $scope.triggerEventScroll = false;
                    data = {
                        moduleName: $scope.model.moduleName,
                        areaId: $scope.model.areaId,
                        messageId: $scope.listMessage.length > 0 ? $scope.listMessage[0].messageId : '',
                        scroll: "up"
                    };
                    $scope.isProcess = true;
                    messageService.getListMessageDashBoard(data).then(function (response) {
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
                        }
                        $scope.triggerEventScroll = true;
                        $scope.isProcess = false;
                    }, function (err) {
                        $scope.isProcess = false;
                        utils.error.showErrorGet(err);
                    });
                }
                if (this.scrollTop + this.offsetHeight >= this.scrollHeight) {
                    $scope.triggerEventScroll = false;
                    data = {
                        moduleName: $scope.model.moduleName,
                        areaId: $scope.model.areaId,
                        messageId: $scope.listMessage.length > 0 ? $scope.listMessage[$scope.listMessage.length - 1].messageId : '',
                        scroll: "down"
                    };
                    $scope.isProcess = true;
                    messageService.getListMessageDashBoard(data).then(function (response) {
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
                        }
                        $scope.scrollBottom();
                        $scope.isProcess = false;
                    }, function (err) {
                        $scope.isProcess = false;
                        utils.error.showErrorGet(err);
                    });
                }
            }
        });
    }
}]);