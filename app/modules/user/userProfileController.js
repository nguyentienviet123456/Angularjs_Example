app.controller('userProfileController', ['$rootScope', '$window', '$scope', '$location', '$state', '$stateParams', 'constants', 'userService', 'roleService', 'areaService', function ($rootScope, $window, $scope, $location, $state, $stateParams, constants, userService, roleService, areaService) {

    var isProcessTriggerClick = true;

    $scope.model = {
        userId: "",
        userName: "",
        staffNo: "",
        email: "",
        image: "",
        dept: "",
        areaId: null,
        areaName: "",
        division: "",
        position: "",
        contactNo: "",
        mobileNo: "",
        areas: [],
        roles: [],
        enableEmailNotification: false
    };
    $scope.errorMessage = "";
    $scope.listArea = [];
    $scope.listRolesView = [];
    $scope.areaOption = {
        dataTextField: 'description',
        dataValueField: 'lookupAreaId',
        optionLabel: "Select Area",
        dataSource: {
            transport: {
                read: function (options) {
                    var arrayLookupArea = [];
                    _.each($scope.listArea, function (area) {
                        arrayLookupArea.push({ lookupAreaId: area.lookupAreaId, description: area.description });
                    });
                    options.success(arrayLookupArea);
                }
            }
        }
    };
    $scope.onAreaChange = function () {
        _.each($scope.listArea, function (area) {
            if (area.lookupAreaId === $scope.model.areaId) {
                area.checked = true;
                area.disabled = true;
            }
            else {
                area.disabled = false;
            }
        });
    };

    // Binding data to form
    var onLoad = function (routeName) {
        $rootScope.bigModuleTitle = "HOME";
        switch (routeName) {
            case constants.state.myProfile:
                $rootScope.$app.title = constants.titlePage.myProfile;
                $rootScope.isLoading = true;
                var isAreaLoadDone = false;
                var isRoleLoadDone = false;

                userService.getMyProfile().then(function (response) {
                    $scope.model.userId = response.data.userId;
                    $scope.model.userName = response.data.userName;
                    $scope.model.staffNo = response.data.staffNo;
                    $scope.model.email = response.data.email;
                    $scope.model.image = response.data.image;
                    $scope.model.dept = response.data.dept;
                    $scope.model.areaId = response.data.areaId;
                    $scope.model.areaName = response.data.areaName;
                    $scope.model.division = response.data.division;
                    $scope.model.contactNo = response.data.contactNo;
                    $scope.model.mobileNo = response.data.mobileNo;
                    $scope.model.position = response.data.position;
                    $scope.model.enableEmailNotification = response.data.enableEmailNotification;
                    var areas = response.data.areas;
                    var roles = response.data.roles;
                    areaService.getAllAreaIsActive().then(function (response) {
                        $scope.listArea = response.data;
                        _.each($scope.listArea, function (area) {
                            var lookupArea = _.filter(areas, function (item) { return item.lookupAreaId === area.lookupAreaId; });
                            area.checked = lookupArea.length > 0;
                            if (area.lookupAreaId === $scope.model.areaId) {
                                area.disabled = true;
                            }
                        });
                        isAreaLoadDone = true;
                        var dropDown = $("#area").data("kendoDropDownList");
                        dropDown.dataSource.read();
                        dropDown.value($scope.model.areaId);
                        dropDown.trigger("change");
                        if (isRoleLoadDone)
                            $rootScope.isLoading = false;
                    }, function (err) {
                        $scope.listArea = [];
                        isAreaLoadDone = true;
                        if (isRoleLoadDone)
                            $rootScope.isLoading = false;
                    });

                    roleService.getRolesIncludeModule().then(function (response) {
                        var groupByModuleName = _.chain(response.data).groupBy('moduleName').map(function (value, key) {
                            _.each(value, function (role) {
                                var roleChecked = _.filter(roles, function (item) { return item.roleId === role.roleId; });
                                role.checked = roleChecked.length > 0;
                                if (role.checked) {
                                    $scope.listRolesView.push({ moduleName: key, description: role.description });
                                }
                            });
                            return {
                                moduleName: key,
                                roles: value
                            };
                        }).value();

                        if ($scope.listRolesView !== null && $scope.listRolesView !== undefined) {
                            var sorted = _.chain($scope.listRolesView).sortBy('moduleName').sortBy('description').value();
                            $scope.listRolesView = sorted;
                        }

                        isRoleLoadDone = true;
                        if (isAreaLoadDone)
                            $rootScope.isLoading = false;
                    }, function (err) {
                        isRoleLoadDone = true;
                        if (isAreaLoadDone)
                            $rootScope.isLoading = false;
                    });
                },
                function (err) {
                    $rootScope.isLoading = false;
                });
                break;
            case constants.state.profile:
                $rootScope.$app.title = constants.titlePage.profile;
                $rootScope.isLoading = true;
                var id = $stateParams.id;
                userService.getProfile(id).then(function (response) {
                    $scope.model.userId = response.data.userId;
                    $scope.model.userName = response.data.userName;
                    $scope.model.staffNo = response.data.staffNo;
                    $scope.model.email = response.data.email;
                    $scope.model.image = response.data.image;
                    $scope.model.dept = response.data.dept;
                    $scope.model.areaId = response.data.areaId;
                    $scope.model.areaName = response.data.areaName;
                    $scope.model.division = response.data.division;
                    $scope.model.contactNo = response.data.contactNo;
                    $scope.model.mobileNo = response.data.mobileNo;
                    $scope.model.position = response.data.position;
                    $scope.listArea = response.data.areas;
                    $rootScope.isLoading = false;
                },
                function (err) {
                    $scope.errorMessage = err.message;
                    $rootScope.isLoading = false;
                });
                break;
        }
    };
    onLoad($state.current.name);

    $scope.updateData = function (e) {
        if (!isProcessTriggerClick) {
            return false;
        }
        isProcessTriggerClick = false;

        e.stopPropagation();
        e.preventDefault();

        var isValid = $scope.userProfileValid.validate();

        if (!isValid) {
            return false;
        }

        var modelEdit = {
            mobileNo: $scope.model.mobileNo,
            areaDefaultId: $scope.model.areaId,
            enableEmailNotification: $scope.model.enableEmailNotification
        };
        var areaIds = [];
        _.each($scope.listArea, function (area) {
            if (area.checked === true) {
                areaIds.push(area.lookupAreaId);
            }
        });
        modelEdit.areas = areaIds;

        $rootScope.isLoading = true;
        isProcessTriggerClick = true;

        userService.updateMyProfile(modelEdit).then(function () {
            $rootScope.isLoading = false;
            var option = {
                id: "dialogInfo",
                title: "Update User Profile",
                lableClose: "CLOSE",
                content: "Update User Profile Successful.",
                width: 300
            };
            utils.dialog.showDialog(option, function () {
                $state.go(constants.state.landing);
            });
        }, function (err) {
            $rootScope.isLoading = false;
            var option = {
                id: "dialogError",
                title: "Update User",
                lableClose: "CLOSE",
                content: err.message,
                width: 300
            };
            utils.dialog.showDialog(option);
        });
    };

    $scope.discard = function (e) {
        e.preventDefault();
        $state.go(constants.state.landing);
    };
}]);