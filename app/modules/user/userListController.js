app.controller('userListController', ['$rootScope', '$window', '$scope', '$location', '$state', '$timeout', 'constants', 'userService', 'roleService', function ($rootScope, $window, $scope, $location, $state, $timeout, constants, userService, roleService) {

    $rootScope.$app.title = constants.titlePage.manageUser;
    $scope.userProfile = $rootScope.$app.userProfile;

    $scope.listChecked = [];

    $scope.model = {
        rolId: "",
        userId: "",
        filter: [],
        sort: [],
        skip: 0,
        take: 0,
        isExport: false
    };

    $scope.status = [{
        value: "Active"
    },
    {
        value: "Deactivated"
    }];

    $scope.role = "";

    $scope.roles = {
        dataTextField: "description",
        dataValueField: "roleId",
        dataSource: {
            transport: {
                read: function (options) {
                    roleService.getAllRoleIncludeNumberUser().then(function (response) {
                        options.success(response.data);
                        if (response.data !== null && response.data !== undefined && response.data !== undefined && response.data.length > 0) {
                            $scope.role = response.data[0].roleId;
                        }
                    }, function (err) {
                        options.error([]);
                        utils.showErrorGet(err);
                    });
                }
            }
        }
    };

    $scope.listModule = [];
    $scope.listAction = [{ 'actionName': 'Add', 'actionValue': 0 }, { 'actionName': 'Remove', 'actionValue': 1 }];

    $scope.listManageRole = [];

    $scope.userProfileIdSelected = "";

    $scope.selectModule = {};
    $scope.selectAction = 0;

    $scope.moduleOption = {
        dataTextField: 'moduleName',
        dataValueField: 'moduleName',
        dataSource: {
            transport: {
                read: function (options) {
                    options.success($scope.listModule);
                }
            }
        }
    };
    $scope.actionOption = {
        dataTextField: 'actionName',
        dataValueField: 'actionValue',
        dataSource: {
            transport: {
                read: function (options) {
                    options.success($scope.listAction);
                }
            }
        }
    }

    $scope.onRolesChange = function (e) {
        $scope.searchByUserIdClick();
    };

    $scope.searchByUserId = function (keyEvent) {
        if (keyEvent.which === 13)
            $scope.searchByUserIdClick();
    };

    $scope.searchByUserIdClick = function () {
        var grid = $(".user-list").data("kendoGrid");
        // clear filter
        grid.dataSource.sort({});
        grid.dataSource.filter({});
        grid.setDataSource($scope.allDataSource);
    };

    $scope.index = 0;

    $scope.initData = function (options) {

        kendo.ui.progress($('.user-list'), false);
        // reset input data
        $scope.model.roleId = $scope.role;
        $scope.model.status = "";
        $scope.model.filter = [];
        $scope.model.sort = [];
        $scope.model.skip = 0;
        $scope.model.take = 20;
        $scope.model.isExport = "";

        var optionfilters = [];
        var filters = [];
        if (options.data.filter !== null && options.data.filter !== undefined) {

            _.each(options.data.filter.filters, function (o) {
                var listFilterOut = [];
                utils.getfilter(o, listFilterOut);
                Array.prototype.push.apply(optionfilters, listFilterOut);
            });

            if (optionfilters !== null && optionfilters !== undefined) {

                var statusFilter = {};

                _.each(optionfilters, function (m) {

                    if (m.field === "status") {
                        statusFilter.field = m.field;
                        statusFilter.valueString = statusFilter.valueString + "," + m.value;
                        statusFilter.isActive = true;
                    }
                    else {
                        var filter = {
                            field: m.field,
                            valueString: m.value,
                            isActive: true
                        };

                        filters.push(filter);
                    }
                });
            }

            if (statusFilter.field !== null && statusFilter.field !== undefined) {
                filters.push(statusFilter);
            }
            $scope.model.filter = filters;
        }
        if (options.data.sort !== null && options.data.sort !== undefined) {
            _.each(options.data.sort, function (o) {
                $scope.model.sort.push({
                    field: o.field,
                    asc: o.dir === 'asc',
                    isActive: true
                });
            });
        }
        $scope.model.take = options.data.take;
        $scope.model.skip = (options.data.page - 1) * options.data.pageSize;
    };

    $scope.allDataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                $scope.index = 0;
                $scope.initData(options);
                $rootScope.isLoading = true;
                $scope.model.view = "All";
                userService.getListUser($scope.model).then(function (response) {
                    $scope.listChecked = [];
                    if (response.data !== null && response.data !== undefined) {
                        _.each(response.data, function (item) {
                            $scope.listChecked.push({ userProfileId: item.userProfileId, checked: false });
                        });
                        options.success(response.data);
                    }
                    else {
                        $scope.listChecked = [];
                        options.success([]);
                    }
                    $rootScope.isLoading = false;
                }, function (error) {
                    $rootScope.isLoading = false;
                    options.error([]);
                    utils.showErrorGet(error);
                });
            }
        },
        schema: {
            model: {
                fields: {
                    area: { type: "string" },
                    userId: { type: "string" },
                    name: { type: "string" },
                    jobDesignation: { type: "string" },
                    mobileNo: { type: "string" },
                    status: { type: "string" }
                }
            },
            total: function (response) {
                return response === null || response === undefined || response.length === 0 ? 0 : response[0].total;
            }
        },
        pageSize: 20,
        serverPaging: true,
        serverFiltering: true,
        serverSorting: true
    });

    $scope.userListGridOptions = {
        dataSource: $scope.allDataSource,
        scrollable: false,
        filterable: {
            extra: false,
            operators: {
                string: {
                    operator: "contains"
                }
            }
        },
        filterMenuInit: function (e) {
            utils.filterMenuInit(e);
        },
        sortable: {
            mode: "multiple",
            allowUnsort: true
        },
        pageable: {
            pageSizes: true,
            buttonCount: 5
        },
        columns: [{
            field: "checkbox",
            title: "&nbsp;",
            width: "50px",
            attributes: {
                "class": "cell_checkbox"
            },
            filterable: false,
            template: function (dataItem) {
                return "<label class='cb-lbl-grid'><input type='checkbox' class='checkbox' data-ng-model='listChecked[" + $scope.index + "].checked' data-user-profile-id='" + dataItem.userProfileId + "' /><span>&nbsp;</span></label>";
            }
        }, {
            field: "userId",
            title: "User ID",
            width: "180px",
            attributes: {
                "class": "cell_user_id"
            },
            filterable: false,
            template: function (dataItem) {
                return dataItem.userId;
            }
        }, {
            field: "name",
            title: "Name",
            attributes: {
                "class": "cell_name"
            },
            filterable: true
        }, {
            field: "area",
            title: "Area",
            attributes: {
                "class": "cell_area"
            },
            filterable: true
        }, {
            field: "jobDesignation",
            title: "Job Designation",
            width: "260px",
            attributes: {
                "class": "cell_job_designation"
            },
            filterable: true
        }, {
            field: "mobileNo",
            title: "Mobile No.",
            width: "240px",
            attributes: {
                "class": "cell_mobile_no"
            },
            filterable: true
        }, {
            field: "status",
            title: "Status",
            width: "330px",
            attributes: {
                "class": "cell_live"
            },
            filterable: {
                multi: true,
                extra: true,
                dataSource: $scope.status,
                itemTemplate: function (e) {
                    if (e.field === "all") {
                        return "<li class=\"select_all\"><label><input type='checkbox' /> <span>#= all#</span></label></li>";
                    } else {
                        return "<li><label><input type='checkbox' name='" + e.field + "' value='#=data.value#'/> <span>#= data.value #</span></label></li>";
                    }
                }
            },
            template: function (dataItem) {
                $scope.index = $scope.index + 1;
                var outPut = dataItem.status;
                return "<button class=\"btn-grid-item-menu\" type=\"button\" data-ng-click=\"openItemMenu($event)\"><i class=\"icon-dot-3 icon-btn-grid-item-menu\"></i></button>" +
                        outPut +
                        "<ul class=\"grid-item-menu\" data-user-profile-id='" + dataItem.userProfileId + "' style=\"display: none; background-color: #fff; border: 1px solid #ccc;\" >" +
                            "<li><a href=\"javascript:void(0)\" data-ng-click=\"editUser('" + dataItem.userProfileId + "')\">Edit User</a></li>" +
                            "<li><a href=\"javascript:void(0)\" data-ng-click=\"manageRole('" + dataItem.userProfileId + "')\">Manage Role</a></li>" + (dataItem.userProfileId === $scope.userProfile.userProfileId ? "" :
                          dataItem.status === "Active" ? "<li><a href=\"javascript:void(0)\" data-ng-click=\"deactivateUser('" + dataItem.userProfileId + "')\">Deactivate User</a></li>" :
                            "<li><a href=\"javascript:void(0)\" data-ng-click=\"activeUser('" + dataItem.userProfileId + "')\">Active User</a></li>"
                          ) +
                        "</ul>";
            }
        }],
        noRecords: true,
        messages: {
            noRecords: "There is no data on current page"
        },
        toolbar: [{
            template: "<div class='toolbar-button'>" +
                            "<span class='btn add-new-user' data-ng-click='addNew($event)'><i class='icon-plus'></i> Add New User</span>" +
                            "<div class='dd_block'><span class='btn bulk-edit' data-ng-click='bulkEdit($event)'><i class='icon-pencil'></i> Bulk Edit...</span>" +
                            "<ul class='ul-bulk-edit dropdown_menu' style='display: none;'>" +
                                "<li data-ng-click='manageRoles($event)'><a href=\"javascript:void(0)\" >Manage Roles...</a></li>" +
                                "<li data-ng-click='deactivateUsers($event)'><a href=\"javascript:void(0)\" >Deactivate Users</a></li>" +
                            "</ul></div>" +
                      "</div>" +
                      "<div class='toolbar-tab'>" +
                         "<div class=\"k-state-active btn view-all\">All User</div>" +
                          "<div class='role' id='Roles' ><strong>Roles: </strong><select kendo-drop-down-list k-on-change='onRolesChange(kendoEvent)' k-options='roles' k-ng-model='role' k-value-primitive='true'></select></div>" +
                      "</div>"
        }]
    };

    $scope.openItemMenu = function (e) {
        e.preventDefault();
        var itemMenu = $(e.target).closest("td").find(".grid-item-menu");
        _.each($('.grid-item-menu'), function (item) {
            if ($(item).attr("data-user-profile-id") !== $(itemMenu).attr("data-user-profile-id")) {
                $(item).hide();
            }
            else {
                $(itemMenu).slideToggle();
            }
        });
    };

    $scope.addNew = function (e) {
        e.preventDefault();
        $state.go(constants.state.newUser);
    };

    $scope.editUser = function (userProfileId) {
        $state.go(constants.state.editUser, { id: userProfileId });
    };

    $scope.deactivateUser = function (userProfileId) {
        var option = {
            id: "dialogInfo",
            title: "Deactivate User",
            lableClose: "CANCEL",
            lableOk: "DEACTIVATE",
            content: "Deactivate user will no longer be able to access the module but their SCE and RA assignments will remain until changed. Proceed?",
            width: 400
        };
        utils.dialog.showConfirm(option, function () {
            userService.deactivateUser(userProfileId).then(function () {
                var grid = $(".user-list").data("kendoGrid");
                var tr = $(".user-list tr input[data-user-profile-id='" + userProfileId + "']").closest("tr");
                var dataItem = grid.dataItem(tr);
                if (dataItem !== null && dataItem !== undefined) {
                    dataItem.set("status", "Deactivate");
                }
                var option = {
                    id: "dialogInfo",
                    title: "Deactivate User",
                    lableClose: "CLOSE",
                    content: "Deactivate User Successful.",
                    width: 300
                };
                utils.dialog.showDialog(option);

            }, function (err) {
                var option = {
                    id: "dialogError",
                    title: "Deactivate User",
                    lableClose: "CLOSE",
                    content: err.message,
                    width: 300
                };
                utils.dialog.showDialog(option);
            });
        });
    };

    $scope.activeUser = function (userProfileId) {
        var option = {
            id: "dialogInfo",
            title: "Active User",
            lableClose: "CANCEL",
            lableOk: "Active",
            content: "Active user will no longer be able to access the module but their SCE and RA assignments will remain until changed. Proceed?",
            width: 400
        };
        utils.dialog.showConfirm(option, function (wnd) {
            userService.activeUser(userProfileId).then(function () {
                var grid = $(".user-list").data("kendoGrid");
                var tr = $(".user-list tr input[data-user-profile-id='" + userProfileId + "']").closest("tr");
                var dataItem = grid.dataItem(tr);
                if (dataItem !== null && dataItem !== undefined) {
                    dataItem.set("status", "Active");
                }
                var option = {
                    id: "dialogError",
                    title: "Active User",
                    lableClose: "CLOSE",
                    content: " Active User Successful.",
                    width: 300
                };
                utils.dialog.showDialog(option);
            }, function (err) {
                var option = {
                    id: "dialogError",
                    title: "Active User",
                    lableClose: "CLOSE",
                    content: err.message,
                    width: 300
                };
                utils.dialog.showDialog(option);
            });
        });
    };

    $scope.bulkEdit = function (e) {
        e.preventDefault();
        $('.ul-bulk-edit').slideToggle();
    };

    $scope.manageRolesActions = [{
        text: 'CANCEL',
        action: function () {
            $scope.searchByUserIdClick();
        }
    },
    {
        text: "UPDATE",
        action: function () {
            return $scope.manageRolesPopupUpdate();
        },
        primary: true
    }];

    $scope.manageRoles = function (e) {
        e.preventDefault();
        $('.ul-bulk-edit').hide();
        var checked = _.filter($scope.listChecked, function (item) { return item.checked === true; });
        if (checked.length === 0) {
            var option = {
                id: "dialogError",
                title: "Manage Roles",
                lableClose: "CLOSE",
                content: "You have not selected any record.",
                width: 300
            };
            utils.dialog.showDialog(option);
        } else {
            utils.clearValid();
            $rootScope.isLoading = true;
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
                $rootScope.isLoading = false;
                $scope.listModule = groupByModuleName;

                var dropDown = $("#module").data("kendoDropDownList");
                dropDown.dataSource.read();
                $scope.selectModule = groupByModuleName[0];

                $($scope.manageRolesPopup.element).parent().find(".k-dialog-title").text("Bulk Edit: Assign Roles to " + checked.length + " Users");
                $scope.manageRolesPopup.center();
                $scope.manageRolesPopup.open();

            }, function (err) {
                $rootScope.isLoading = false;
                var option = {
                    id: "dialogError",
                    title: "Assign Roles To User",
                    lableClose: "CLOSE",
                    content: err.message,
                    width: 300
                };
                utils.error.showErrorGet(err);
                utils.dialog.showDialog(option);
            });
        }
    };

    $scope.manageRolesPopupUpdate = function () {

        var listUserProfileId = [];
        var listRoleId = [];
        var action = $scope.roleManagementActions.value();

        _.each($scope.listChecked, function (item) {
            if (item.checked === true) {
                listUserProfileId.push(item.userProfileId);
            }
        });

        _.each($scope.selectModule.roles, function (item) {
            if (item.checked === true) {
                listRoleId.push(item.roleId);
            }
        });

        var model = {
            listUserProfileId: listUserProfileId,
            listRoleId: listRoleId,
            action: action
        };

        var isValid = $scope.manageRolesPopupValid.validate();

        if (listRoleId === null || listRoleId === undefined || listRoleId.length === 0 && !isValid) {
            return false;
        }
        else {

            $rootScope.isLoading = true;
            userService.manageRoles(model).then(function (response) {
                $rootScope.isLoading = false;
                $scope.manageRolesPopup.close();
                var option = {
                    id: "dialogInfo",
                    title: "Assign Roles",
                    lableClose: "CLOSE",
                    content: "Assign Roles Successful.",
                    width: 300
                };
                utils.dialog.showDialog(option);
                $scope.searchByUserIdClick();
                return true;

            }, function (err) {
                $rootScope.isLoading = false;
                $scope.manageRolesPopup.close();
                var option = {
                    id: "dialogError",
                    title: "Assign Roles",
                    lableClose: "CLOSE",
                    content: err.message,
                    width: 300
                };
                utils.error.showErrorGet(err);
                utils.dialog.showDialog(option);
                return true;
            });
        }
    };

    $scope.manageRoleActions = [
        {
            text: 'CANCEL',
            action: function () {
                return true;
            }
        },
        {
            text: "UPDATE",
            action: function () {
                return $scope.manageRolePopupUpdate();
            },
            primary: true
        }];

    $scope.manageRolePopupUpdate = function () {
        var listRoles = [];
        _.each($scope.listManageRole, function (module) {
            _.each(module.roles, function (role) {
                if (role.checked) {
                    listRoles.push(role.roleId);
                }
            });
        });

        if (listRoles === null || listRoles === undefined || listRoles.length === 0) {
            return false;
        }

        $rootScope.isLoading = true;
        userService.manageRole($scope.userProfileIdSelected, listRoles).then(function () {
            $rootScope.isLoading = false;
            $scope.manageRolePopup.close();
            var option = {
                id: "dialogInfo",
                title: "Assign Roles to User",
                lableClose: "CLOSE",
                content: "Assign Roles to User Successful.",
                width: 300
            };
            utils.dialog.showDialog(option);
            return true;
        }, function (err) {
            $rootScope.isLoading = false;
            $scope.manageRolePopup.close();
            var option = {
                id: "dialogError",
                title: "Assign Roles To User",
                lableClose: "CLOSE",
                content: err.message,
                width: 300
            };
            utils.error.showErrorGet(err);
            utils.dialog.showDialog(option);
            return true;
        });
    };

    $scope.manageRole = function (userProfileId) {

        utils.clearValid();
        $scope.userProfileIdSelected = userProfileId;

        $rootScope.isLoading = true;
        userService.getRoleEdit(userProfileId).then(function (response) {
            $rootScope.isLoading = false;
            var groupByModuleName = _.chain(response.data).groupBy('moduleName').map(function (value, key) {

                var sorted = _.chain(value).sortBy('description').value();

                return {
                    moduleName: key,
                    roles: sorted
                };
            }).value();

            $scope.listManageRole = groupByModuleName;

            $scope.manageRolePopup.center();
            $scope.manageRolePopup.open();
            utils.fixDialogCenter($scope.manageRolePopup.element);

        }, function (err) {
            $rootScope.isLoading = false;
            var option = {
                id: "dialogError",
                title: "Assign Roles To User",
                lableClose: "CLOSE",
                content: err.message,
                width: 300
            };
            utils.error.showErrorGet(err);
            utils.dialog.showDialog(option);
        });
    };

    $scope.deactivateUsers = function (e) {
        e.preventDefault();
        $('.ul-bulk-edit').hide();
        var checked = _.filter($scope.listChecked, function (item) { return item.checked === true; });
        var option = {};
        if (checked.length === 0) {
            option = {
                id: "dialogError",
                title: "Deactivate Users",
                lableClose: "CLOSE",
                content: "You have not selected any record.",
                width: 300
            };
            utils.dialog.showDialog(option);
        }
        else {
            option = {
                id: "dialogInfo",
                title: "Bulk Edit: Deactivate " + checked.length + " Users",
                lableOk: "DEACTIVATE ALL",
                lableClose: "CANCEL",
                content: "Deactivate users will no longer be able to access the module. Their SCE and RA assignments will remain until changed. Proceed?",
                width: 400
            };
            utils.dialog.showConfirm(option, function () {
                $rootScope.isLoading = true;
                var listUserId = [];
                _.each($scope.listChecked, function (item) {
                    if (item.checked === true) {
                        listUserId.push(item.userProfileId);
                    }
                });

                userService.deactivateListUser(listUserId).then(function () {
                    $rootScope.isLoading = false;
                    var option = {
                        id: "dialogInfo",
                        title: "Deactivate Users",
                        lableClose: "CLOSE",
                        content: "Deactivate Users Successful.",
                        width: 300
                    };
                    utils.dialog.showDialog(option);
                    $scope.searchByUserIdClick();
                }, function (err) {
                    $rootScope.isLoading = false;
                    var option = {
                        id: "dialogError",
                        title: "Bulk Edit: Deactivate " + checked.length + " Users",
                        lableClose: "CLOSE",
                        content: err.message,
                        width: 300
                    };
                    utils.dialog.showDialog(option);
                });

            }, function () {
                $scope.searchByUserIdClick();
            });
        }
    };

}]);