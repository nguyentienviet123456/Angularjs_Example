app.controller('userController', ['$rootScope', '$window', '$scope', '$location', '$state', '$stateParams', 'constants', 'userService', 'roleService', 'areaService', function ($rootScope, $window, $scope, $location, $state, $stateParams, constants, userService, roleService, areaService) {

    var isProcessTriggerClick = true;

    $scope.listArea = [];
    $scope.listRolesView = [];
    $scope.listRolesIncludeModule = [];
    $scope.model = {
        userId: "",
        userName: "",
        staffNo: "",
        email: "",
        image: "",
        dept: "",
        area: "",
        division: "",
        position: "",
        contactNo: "",
        mobileNo: "",
        areas: [],
        roles: []
    };
    $scope.userSearchText = "";
    $scope.userSelect = {};
    $scope.userSearch = {
        filter: "startswith",
        filtering: function (e) {
            $scope.userSearchText = e.filter === null || e.filter === undefined ? "" : e.filter.value;
        },
        autoBind: true,
        optionLabel: "Search User",
        dataTextField: 'userName',
        dataValueField: 'userId',
        valueTemplate: '<span class="selected-value" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span><span>{{dataItem.userName}}</span>',
        template: '<div class="custom-dropdown"><span class="k-state-default" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span>' +
            '<span class="k-state-default"><h3>{{dataItem.userName}}</h3></span></div>',
        dataSource: {
            serverFiltering: true,
            transport: {
                read: function (options) {

                    userService.adFindUser($scope.userSearchText).then(function (response) {
                        if (response.data !== null && response.data !== undefined) {
                            options.success(response.data);
                        }
                        else {
                            options.success([]);
                        }
                    }, function (error) {
                        options.error([]);
                        utils.error.showErrorGet(error);
                    });

                }
            }
        }
    };
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

    // Function
    $scope.onUserIdChange = function () {
        $scope.model.dept = $scope.userSelect.dept;
        $scope.model.division = $scope.userSelect.division;
        $scope.model.officeTelephone = $scope.userSelect.officeTelephone;
        $scope.model.tel = $scope.userSelect.tel;
        $scope.model.mobileNo = $scope.userSelect.mobileNo;
        $scope.model.userName = $scope.userSelect.userName;
        $scope.model.userId = $scope.userSelect.userId;
        $scope.model.staffNo = $scope.userSelect.staffNo;
        $scope.model.email = $scope.userSelect.email;
        $scope.model.image = $scope.userSelect.image;
    };

    $scope.onAreaChange = function () {
        _.each($scope.listArea, function (area) {
            if (area.lookupAreaId === $scope.model.area) {
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

        $rootScope.isLoading = true;
        var isAreaLoadDone = false;
        var isRoleLoadDone = false;

        switch (routeName) {
            case constants.state.newUser:
                $rootScope.$app.title = constants.titlePage.newUser;
                areaService.getAllAreaIsActive().then(function (response) {
                    $scope.listArea = response.data;
                    _.each($scope.listArea, function (area) {
                        area.checked = false;
                    });
                    isAreaLoadDone = true;
                    var dropDown = $("#area").data("kendoDropDownList");
                    dropDown.dataSource.read();
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
                            role.checked = false;
                        });

                        var sorted = _.chain(value).sortBy('description').value();

                        return {
                            moduleName: key,
                            roles: sorted
                        };
                    }).value();

                    $scope.listRolesIncludeModule = groupByModuleName;
                    isRoleLoadDone = true;
                    if (isAreaLoadDone)
                        $rootScope.isLoading = false;
                }, function (err) {
                    $scope.listRolesIncludeModule = [];
                    isRoleLoadDone = true;
                    if (isAreaLoadDone)
                        $rootScope.isLoading = false;
                });

                break;
            case constants.state.editUser:
                $rootScope.$app.title = constants.titlePage.editUser;

                userService.getDetail($stateParams.id).then(function (response) {
                    $scope.model.userId = response.data.userId;
                    $scope.model.userName = response.data.userName;
                    $scope.model.staffNo = response.data.staffNo;
                    $scope.model.email = response.data.email;
                    $scope.model.image = response.data.image;
                    $scope.model.dept = response.data.dept;
                    $scope.model.area = response.data.area;
                    $scope.model.division = response.data.division;
                    $scope.model.contactNo = response.data.contactNo;
                    $scope.model.mobileNo = response.data.mobileNo;
                    $scope.model.position = response.data.position;
                    var areas = response.data.areas;
                    var roles = response.data.roles;
                    areaService.getAllAreaIsActive().then(function (response) {
                        $scope.listArea = response.data;
                        _.each($scope.listArea, function (area) {
                            var lookupArea = _.filter(areas, function (item) { return item.lookupAreaId === area.lookupAreaId; });
                            area.checked = lookupArea.length > 0;
                        });
                        isAreaLoadDone = true;
                        var dropDown = $("#area").data("kendoDropDownList");
                        dropDown.dataSource.read();
                        dropDown.value($scope.model.area);
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
                            var sorted = _.chain(value).sortBy('description').value();
                            return {
                                moduleName: key,
                                roles: sorted
                            };
                        }).value();

                        if ($scope.listRolesView !== null && $scope.listRolesView !== undefined) {
                            var sorted = _.chain($scope.listRolesView).sortBy('moduleName').sortBy('description').value();
                            $scope.listRolesView = sorted;
                        }

                        $scope.listRolesIncludeModule = groupByModuleName;
                        isRoleLoadDone = true;
                        if (isAreaLoadDone)
                            $rootScope.isLoading = false;
                    }, function (err) {
                        $scope.listRolesIncludeModule = [];
                        isRoleLoadDone = true;
                        if (isAreaLoadDone)
                            $rootScope.isLoading = false;
                    });
                },
                function (err) {
                    $rootScope.isLoading = false;
                });
                break;
            case constants.state.notification:
                $rootScope.$app.title = constants.titlePage.notification;
                $rootScope.isLoading = false;
                break;
        }
    };
    onLoad($state.current.name);

    // Action
    $scope.saveData = function (e) {
        if (!isProcessTriggerClick) {
            return false;
        }
        isProcessTriggerClick = false;

        e.preventDefault();
        e.stopPropagation();

        var isValid = $scope.userFormValid.validate();

        var areaIds = [];
        _.each($scope.listArea, function (area) {
            if (area.checked === true) {
                areaIds.push(area.lookupAreaId);
            }
        });
        $scope.model.areas = areaIds;

        var roleIds = [];
        _.each($scope.listRolesIncludeModule, function (item) {
            _.each(item.roles, function (role) {
                if (role.checked === true) {
                    roleIds.push(role.roleId);
                }
            });

        });
        $scope.model.roles = roleIds;

        if ($scope.model.areas === null || $scope.model.areas === undefined || $scope.model.areas.length === 0) {
            isValid = false;
        }

        if ($scope.model.roles === null || $scope.model.roles === undefined || $scope.model.roles.length === 0) {
            isValid = false;
        }

        if (!isValid) {
            isProcessTriggerClick = true;
            return false;
        }

        $rootScope.isLoading = true;
        isProcessTriggerClick = true;

        userService.create($scope.model).then(function () {
            $rootScope.isLoading = false;
            var option = {
                id: "dialogInfo",
                title: "New User",
                lableClose: "CLOSE",
                content: "New user added successfully.",
                width: 300
            };
            utils.dialog.showDialog(option, function () {
                $state.go(constants.state.manageUser);
            });
        }, function (err) {
            $rootScope.isLoading = false;
            var option = {
                id: "dialogError",
                title: "New User",
                lableClose: "CLOSE",
                content: err.message,
                width: 300
            };
            utils.dialog.showDialog(option);
        });
    };

    $scope.updateData = function (e) {
        if (!isProcessTriggerClick) {
            return false;
        }
        isProcessTriggerClick = false;

        e.preventDefault();
        e.stopPropagation();

        var isValid = $scope.userFormValid.validate();

        var modelEdit = {
            mobileNo: $scope.model.mobileNo,
            position: $scope.model.position,
            area: $scope.model.area
        };
        var areaIds = [];
        _.each($scope.listArea, function (area) {
            if (area.checked === true) {
                areaIds.push(area.lookupAreaId);
            }
        });
        modelEdit.areas = areaIds;

        var roleIds = [];
        _.each($scope.listRolesIncludeModule, function (item) {
            _.each(item.roles, function (role) {
                if (role.checked === true) {
                    roleIds.push(role.roleId);
                }
            });

        });
        modelEdit.roles = roleIds;

        if (modelEdit.areas === null || modelEdit.areas === undefined || modelEdit.areas.length === 0) {
            isValid = false;
        }

        if (modelEdit.roles === null || modelEdit.roles === undefined || modelEdit.roles.length === 0) {
            isValid = false;
        }

        if (!isValid) {
            isProcessTriggerClick = true;
            return false;
        }

        $rootScope.isLoading = true;
        userService.edit($stateParams.id, modelEdit).then(function () {
            $rootScope.isLoading = false;
            var option = {
                id: "dialogInfo",
                title: "Update User",
                lableClose: "CLOSE",
                content: "user updated successful.",
                width: 300
            };
            utils.dialog.showDialog(option, function () {
                $state.go(constants.state.manageUser);
            });
        }, function (err) {
            $rootScope.isLoading = false;
            var option = {
                id: "dialogError",
                title: "New User",
                lableClose: "CLOSE",
                content: err.message,
                width: 300
            };
            utils.dialog.showDialog(option);
        });
    };

    $scope.discard = function (e) {
        e.preventDefault();
        $state.go(constants.state.manageUser);
    };
}]);