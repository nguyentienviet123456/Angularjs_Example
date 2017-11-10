app.controller('asmNewController',
    ['$rootScope', '$window', '$state', '$stateParams', '$scope', '$location', 'authService', 'appSettings', 'constants', 'asmNewServices', 'serviceHelper', 'asmWorkflowServices',
function ($rootScope, $window, $state, $stateParams, $scope, $location, authService, appSettings, constants, asmNewServices, serviceHelper, asmWorkflowServices) {

    //#region Form definition
    // Get current logged-in user profile
    $scope.userProfile = $rootScope.$app.userProfile;
    // Model
    $scope.model = {
        radio: null,
        areaId: null,
        unitId: null,
        tagNo: null,
        otherTagNo: null,
        equipmentNo: null,
        alarmClass: null,
        type: null,
        otherType: null,
        description: null,
        reviewerId: null,
        parentAlarm: null,
        isSubmitAction: null,
        mobileNo: $scope.userProfile.mobileNo == null ? '' : $scope.userProfile.mobileNo
    };

    //Common field value
    $scope.selectedArea = "";
    $scope.selectedAlarmClass = "";
    $scope.selectedUnitNo = "";
    $scope.selectedTagNo = "";
    $scope.selectedType = "";
    $scope.selectedReviewer = "";

    // Common info dialog
    $scope.dialogOption = {
        id: "dialogInfo",
        title: "",
        lableClose: "CLOSE",
        content: "",
        width: 300
    };

    var onLoad = function () {
        $rootScope.bigModuleTitle = "Alarm Shelving Application (ASM)";
    };
    onLoad();
    // Pop up internal kendo 
    $scope.confirmDialog = function (title, content) {
        return $("<div></div>").kendoConfirm({
            title: title,
            content: content
        }).data("kendoConfirm").open().result;
    };

    //#endregion

    //#region Business function

    // Get reviewer data
    var getReviewer = function (options, keyWord) {
        asmNewServices.getAsmReviewers(keyWord).then(function (response) {
            if (response.data != null) {
                options.success(response.data);
            } else {
                options.success([]);
            }
        }, function (error) {
            options.error([]);
            utils.error.showErrorGet(error);
        });
    }

    // Get Area data
    var getArea = function (options) {
        asmNewServices.getAreas().then(function (response) {
            if (response.data != null) {
                options.success(response.data);
            } else {
                options.success([]);
            }
        }, function (error) {
            options.error([]);
            utils.error.showErrorGet(error);
        });
    }

    // Get UnitNo. data
    var getUnitNoByAreaId = function (options, keyWord) {
        asmNewServices.getUnitByArea(keyWord).then(function (response) {
            if (response.data != null) {
                options.success(response.data);
            } else {
                options.success([]);
            }
        }, function (error) {
            options.error([]);
            utils.error.showErrorGet(error);
        });
    }

    // Get TagNo. data
    var getTagNoByUnitId = function (options, keyWord) {
        asmNewServices.getTagNoByUnit(keyWord).then(function (response) {
            if (response.data != null) {
                options.success(response.data);
            } else {
                options.success([]);
            }
        }, function (error) {
            options.error([]);
            utils.error.showErrorGet(error);
        });
    }

    // Get Alarm Type data
    var getType = function (options) {
        asmNewServices.getAlarmTypes().then(function (response) {
            if (response.data != null) {
                options.success(response.data);
            } else {
                options.success([]);
            }
        }, function (error) {
            options.error([]);
            utils.error.showErrorGet(error);
        });
    }

    var bindPreData = function () {

        // On Open Area
        var countAreaClick = 0;
        $scope.onAreaOpen = function () {
            if (countAreaClick == 0) {
                $scope.areasDataSource = {
                    transport: {
                        read: function (options) {
                            getArea(options);

                        }
                    }
                };
                countAreaClick = countAreaClick + 1;
            }
        };

        // On selected Area changed
        $scope.onAreaChange = function () {
            if ($("#asmArea").val() !== "") {
                $scope.unitDataSource = {
                    transport: {
                        read: function (options) {
                            getUnitNoByAreaId(options, $("#asmArea").val());
                        }
                    }
                };
                $scope.tagNoDataSource = null;
            } else {
                $scope.unitDataSource = null;
                $scope.tagNoDataSource = null;
            }
        };

        // On selected Unit changed
        $scope.onUnitChange = function () {
            if ($("#UnitNo").val() !== "") {
                $scope.tagNoDataSource = {
                    transport: {
                        read: function (options) {
                            getTagNoByUnitId(options, $("#UnitNo").val());
                        }
                    },
                    schema: {
                        model: {
                            fields: {
                                lookupTagId: { type: "string" },
                                description: { type: "string" }
                            }
                        },
                        data: function (response) {
                            response.push({ lookupTagId: "0", description: "Others" });
                            return response;
                        }
                    }
                };
            } else {
                $scope.tagNoDataSource = null;
            }
        };

        // Bind data to Alarm Classes radio button
        $scope.AlarmClassesDataSource = null;
        asmNewServices.getAlarmClasses().then(function (response) {
            $scope.AlarmClassesDataSource = response.data;
        }, function (error) {
            utils.error.showErrorGet(error);
        });

        // On open type
        $scope.onTypeOpen = function () {
            $scope.alarmTypesDataSource = {
                transport: {
                    read: function (options) {
                        getType(options);
                    }
                },
                schema: {
                    model: {
                        fields: {
                            lookupId: { type: "string" },
                            description: { type: "string" }
                        }
                    },
                    data: function (response) {
                        response.push({ lookupId: "0", description: "Others" });
                        return response;
                    }
                }
            };
        }

        // On selected alarm type changed
        $scope.onSelectedAlarmTypeChange = function () {
            if ($scope.selectedType === "0") {
                $("#otherType").val("");
            }
        };

        // bind data to drop_down list reviewer
        $scope.reviewerSearchText = "";
        $scope.reviewerOptions = {
            autoBind: false,
            optionLabel: "Select Reviewer",
            height: 300,
            filter: "contains",
            filtering: function (e) {
                $scope.reviewerSearchText = e.filter == null ? "" : e.filter.value;
            },
            dataSource: {
                serverFiltering: true,
                transport: {
                    read: function (options) {
                        getReviewer(options, $scope.reviewerSearchText);
                    }
                }
            },
            dataTextField: "userName",
            dataValueField: "userProfileId",
            valueTemplate: function (dataItem) {
                if (!dataItem.hasOwnProperty('image')) {
                    dataItem.image = $scope.selectedReviewer.image;
                }
                return '<span class="selected-value" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span><span>{{dataItem.userName}}</span>';
            },
            template: '<div class="custom-dropdown"><span class="k-state-default" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span>' +
                '<span class="k-state-default"><h3>{{dataItem.userName}}</h3></span></div>'
        };
    };


    // Bind detail data to form
    var bindAsmDetail = function (alarmId) {
        asmNewServices.getAsmDetail(alarmId).then(function (response) {
            if (response.data != null) {
                // Bind area data source
                $scope.areasDataSource = {
                    transport: {
                        read: function (options) {
                            getArea(options);
                        }
                    }
                };

                // On selected Area changed
                $scope.onAreaChange = function () {

                    if ($("#asmArea").val() !== "") {
                        $scope.unitDataSource = {
                            transport: {
                                read: function (options) {
                                    getUnitNoByAreaId(options, $("#asmArea").val());
                                }
                            }
                        };
                        $scope.tagNoDataSource = null;
                    } else {
                        $scope.unitDataSource = null;
                        $scope.tagNoDataSource = null;
                    }
                };

                // Bind unit data source
                $scope.unitDataSource = {
                    transport: {
                        read: function (options) {
                            getUnitNoByAreaId(options, response.data.asmDetail.areaId);
                        }
                    }
                };

                // On selected Unit changed
                $scope.onUnitChange = function () {
                    if ($("#UnitNo").val() !== "") {
                        $scope.tagNoDataSource = {
                            transport: {
                                read: function (options) {
                                    getTagNoByUnitId(options, $("#UnitNo").val());
                                }
                            },
                            schema: {
                                model: {
                                    fields: {
                                        lookupTagId: { type: "string" },
                                        description: { type: "string" }
                                    }
                                },
                                data: function (response) {
                                    response.push({ lookupTagId: "0", description: "Others" });
                                    return response;
                                }
                            }
                        };
                    } else {
                        $scope.tagNoDataSource = null;
                    }
                };

                // Bind tagNo data source
                $scope.tagNoDataSource = {
                    transport: {
                        read: function (options) {
                            getTagNoByUnitId(options, response.data.asmDetail.unitId);
                        }
                    },
                    schema: {
                        model: {
                            fields: {
                                lookupTagId: { type: "string" },
                                description: { type: "string" }
                            }
                        },
                        data: function (response) {
                            response.push({ lookupTagId: "0", description: "Others" });
                            return response;
                        }
                    }
                };

                // Bind data to Alarm Classes radio button
                $scope.AlarmClassesDataSource = null;
                asmNewServices.getAlarmClasses().then(function (response) {
                    $scope.AlarmClassesDataSource = response.data;
                }, function (error) {
                    utils.error.showErrorGet(error);
                });

                // Bind data to alarm type
                $scope.alarmTypesDataSource = {
                    transport: {
                        read: function (options) {
                            getType(options);
                        }
                    },
                    schema: {
                        model: {
                            fields: {
                                lookupId: { type: "string" },
                                description: { type: "string" }
                            }
                        },
                        data: function (response) {
                            response.push({ lookupId: "0", description: "Others" });
                            return response;
                        }
                    }
                };

                // bind data to drop_down list reviewer
                $scope.reviewerSearchText = "";
                $scope.reviewerOptions = {
                    autoBind: false,
                    optionLabel: "Select Reviewer",
                    height: 300,
                    filter: "contains",
                    filtering: function (e) {
                        $scope.reviewerSearchText = e.filter == null ? "" : e.filter.value;
                    },
                    dataSource: {
                        serverFiltering: true,
                        transport: {
                            read: function (options) {
                                getReviewer(options, $scope.reviewerSearchText);
                            }
                        }
                    },
                    index: 0,

                    dataTextField: "userName",
                    dataValueField: "userProfileId",
                    valueTemplate: function (dataItem) {
                        if (!dataItem.hasOwnProperty('image')) {
                            dataItem.image = $scope.selectedReviewer.image;
                        }
                        return '<span class="selected-value" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span><span>{{dataItem.userName}}</span>';
                    },
                    template: '<div class="custom-dropdown"><span class="k-state-default" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span>' +
                                '<span class="k-state-default"><h3>{{dataItem.userName}}</h3></span></div>'
                };

                $scope.selectedArea = response.data.asmDetail.areaId;
                $scope.selectedAlarmClass = response.data.asmDetail.alarmClassId;
                $scope.selectedUnitNo = response.data.asmDetail.unitId;
                $scope.selectedTagNo = response.data.asmDetail.tagId == null ? "0" : response.data.asmDetail.tagId;
                $scope.selectedType = response.data.asmDetail.typeId == null ? "0" : response.data.asmDetail.typeId;
                $scope.selectedReviewer = response.data.reviewer == null ? "" : response.data.reviewer.userProfileId;
                $scope.model.otherTagNo = response.data.asmDetail.tagId !== null ? "" : response.data.asmDetail.tagNo;
                $scope.model.radio = response.data.asmDetail.radio;
                $scope.model.equipmentNo = response.data.asmDetail.equipmentNo;
                $scope.model.description = response.data.asmDetail.description;
                $scope.model.otherType = response.data.asmDetail.typeId !== null ? "" : response.data.asmDetail.type;
            }
        }, function (err) {
            utils.error.showErrorGet(err);
        });
    }

    //#endregion

    //#region Form event handler

    //#region Redirection

    var goToListPage = function (event) {
        event.preventDefault();
        $state.go(constants.state.asmlist);
    };

    //#endregion

    //#region Validation form

    // Validate form data
    var isValidFormData = function (isSubmit) {
        var isValid;
        if (isSubmit) {
            // Custom validations
            isValid = $(".asm-form").kendoValidator({
                rules: {
                    otherTagNo: function (input) {
                        if (input.is("[name=tagNo]")) {
                            var retVal = true;
                            if ($scope.selectedTagNo === '' || $scope.selectedTagNo == null) {
                                return false;
                            } else if ($scope.selectedTagNo === '0') {
                                retVal = $scope.model.otherTagNo != null & $scope.model.otherTagNo != "";
                            }
                            if (retVal) {
                                $("#TagNo").removeClass("k-invalid");
                            } else {
                                $("#TagNo").addClass("k-invalid");
                                $("#otherTagNo").addClass("k-invalid");
                            }
                            return retVal;
                        }
                        return true;
                    },
                    otherType: function (input) {
                        if (input.is("[name=TypeofAlarm]")) {
                            var retVal = true;
                            if ($scope.selectedType === '' || $scope.selectedType == null) {
                                return false;
                            } else if ($scope.selectedType === '0') {
                                retVal = $scope.model.otherType != null & $scope.model.otherType != "";
                            }
                            if (retVal) {
                                $("#Type").removeClass("k-invalid");
                            } else {
                                $("#Type").addClass("k-invalid");
                                $("#otherType").addClass("k-invalid");
                            }
                            return retVal;
                        }
                        return true;
                    }
                },
                messages: {
                    otherTagNo: "Tag No. is required",
                    otherType: "Type is required"
                }
            }).data("kendoValidator").validate();
        } else {
            isValid = $(".asm-form").kendoValidator({
                rules: {
                    required: serviceHelper.requiredRule,
                    otherTagNo: function (input) {
                        if (input.is("[name=tagNo]")) {
                            var retVal = true;
                            if ($scope.selectedTagNo === '' || $scope.selectedTagNo == null) {
                                return false;
                            } else if ($scope.selectedTagNo === '0') {
                                retVal = $scope.model.otherTagNo != null & $scope.model.otherTagNo != "";
                            }
                            if (retVal) {
                                $("#TagNo").removeClass("k-invalid");
                            } else {
                                $("#TagNo").addClass("k-invalid");
                                $("#otherTagNo").addClass("k-invalid");
                            }
                            return retVal;
                        }
                        return true;
                    }
                },
                messages: {
                    otherTagNo: "Tag No. is required"
                }
            }).data("kendoValidator").validate();
        }

        return isValid;
    }

    //#endregionselectedAlarmClassId

    //#region SaveData action

    // prevent multi click
    $scope.inProgress = false;

    var saveData = function (event, actionType) {
        //prevent multi click
        $scope.inProgress = true;
        event.preventDefault();
        event.stopImmediatePropagation();

        // show loading
        $rootScope.isLoading = true;

        try {
            if (isValidFormData(actionType)) {
                // Get submitted data
                $scope.model.isSubmitAction = actionType;
                $scope.model.areaId = $scope.selectedArea;
                $scope.model.unitId = $scope.selectedUnitNo;
                $scope.model.tagNo = $scope.selectedTagNo === '0' ? '' : $scope.selectedTagNo;
                $scope.model.alarmClass = $scope.selectedAlarmClass;
                $scope.model.type = $scope.selectedType === '0' ? '' : $scope.selectedType;
                $scope.model.reviewerId = $scope.selectedReviewer == null ? null : $scope.selectedReviewer;

                // Send submitted data to server
                switch ($state.current.name) {
                    case constants.state.asmNewState:
                    case constants.state.asmCopy:
                        asmNewServices.creatAsm($scope.model).then(function (response) {
                            $scope.inProgress = false;
                            $rootScope.isLoading = false;
                            if (response.data == true) {
                                $scope.userProfile.mobileNo = $scope.model.mobileNo;
                                $rootScope.$app.userProfile.mobileNo = $scope.model.mobileNo;
                                if (!actionType) {
                                    $scope.dialogOption.title = "Save ASM as Draft";
                                    $scope.dialogOption.content = "This ASM is saved as draft";
                                    utils.dialog.showDialog($scope.dialogOption, function () {
                                        $state.go(constants.state.asmlist);
                                    });
                                } else {
                                    $scope.dialogOption.title = "Create ASM";
                                    $scope.dialogOption.content = "This ASM is submitted and <strong>pending review</strong>";
                                    utils.dialog.showDialog($scope.dialogOption, function () {
                                        $state.go(constants.state.asmlist);
                                    });
                                }
                            }
                        }, function (error) {
                            $scope.inProgress = false;
                            $rootScope.isLoading = false;

                            if (!actionType) {
                                $scope.dialogOption.title = "Save ASM as Draft";
                                $scope.dialogOption.content = error.message;
                                utils.dialog.showDialog($scope.dialogOption);
                            } else {
                                $scope.dialogOption.title = "Create ASM";
                                $scope.dialogOption.content = error.message;
                                utils.dialog.showDialog($scope.dialogOption);
                            }
                        });
                        break;
                    case constants.state.asmEditDraft:
                        asmNewServices.editAsm($stateParams.alarmId, $scope.model).then(function () {
                            $scope.inProgress = false;
                            $rootScope.isLoading = false;
                            $scope.userProfile.mobileNo = $scope.model.mobileNo;
                            $rootScope.$app.userProfile.mobileNo = $scope.model.mobileNo;
                            if (actionType) {
                                $scope.dialogOption.title = "Submit ASM";
                                $scope.dialogOption.content = "This ASM is submitted and <strong>pending review</strong>";
                            }
                            else {
                                $scope.dialogOption.title = "Save ASM as Draft";
                                $scope.dialogOption.content = "This ASM is saved";
                            }
                            utils.dialog.showDialog($scope.dialogOption, function () {
                                $state.go(constants.state.asmlist);
                            });
                        }, function (error) {
                            $scope.inProgress = false;
                            $rootScope.isLoading = false;

                            $scope.dialogOption.title = "Save ASM as Draft";
                            $scope.dialogOption.content = error.message;
                            utils.dialog.showDialog($scope.dialogOption);

                        });

                        break;

                    default:
                        break;
                }
            } else {
                $scope.inProgress = false;
                $rootScope.isLoading = false;
            }
        } catch (error) {
            utils.error.showErrorGet(error);
            $scope.inProgress = false;
            $rootScope.isLoading = false;
        }
    };

    //#endregion

    //#region cancel alarm

    // prevent multi click
    $scope.inProgress = false;
    var cancelAlarm = function (event) {
        //prevent multi click
        $scope.inProgress = true;
        event.preventDefault();
        event.stopImmediatePropagation();

        try {
            $scope.confirmDialog("Alarm Shelving Cancel", "Are you sure you want to cancel this Alarm Shelving?").then(function () {
                // show loading
                $rootScope.isLoading = true;

                asmWorkflowServices.cancelAsm($stateParams.alarmId).then(function (response) {
                    $scope.inProgress = false;
                    $rootScope.isLoading = false;

                    $scope.dialogOption.title = "Alarm Shelving Canceled";
                    $scope.dialogOption.content = "Alarm Shelving has been canceled successfully";
                    utils.dialog.showDialog($scope.dialogOption, function () {
                        $state.go(constants.state.asmlist);
                    });
                }, function (error) {
                    $scope.inProgress = false;
                    $rootScope.isLoading = false;
                    $scope.dialogOption.title = "Alarm Shelving Cancel Failed";
                    $scope.dialogOption.content = error.message;
                    utils.dialog.showDialog($scope.dialogOption);
                });
            }, function () {
                $scope.inProgress = false;
            });
        }
        catch (err) {
            utils.error.showErrorGet(err);
            $scope.inProgress = false;
            $rootScope.isLoading = false;
        }

        $scope.inProgress = false;
    };
    //#endregion cancel
    //#endregion Form event handler

    //#region Form initializing

    // Get current logged-in user profile
    $scope.userProfile = $rootScope.$app.userProfile;
    $scope.isAdmin = $scope.userProfile.isAdmin;
    $scope.hasApplicantRole = ("," + $rootScope.$app.userProfile.rolesKeyString + ",").indexOf(",21,") >= 0;

    var onInitializing = function () {
        $rootScope.bigModule = {
            SCE: false,
            ASM: true
        };
        $rootScope.$app.title = constants.titlePage.asmNew;

        switch ($state.current.name) {
            case constants.state.asmNewState:
                bindPreData();
                $scope.saveFormData = function (event, actionType) {
                    saveData(event, actionType);
                }
                $scope.cancelForm = function (event) {
                    goToListPage(event);
                }
                break;
            case constants.state.asmEditDraft:
                bindAsmDetail($stateParams.alarmId);

                $scope.saveFormData = function (event, actionType) {
                    saveData(event, actionType);
                }
                $scope.cancelForm = function (event) {
                    cancelAlarm(event);
                }
                break;
            case constants.state.asmCopy:
                bindAsmDetail($stateParams.alarmId);

                $scope.saveFormData = function (event, actionType) {
                    saveData(event, actionType);
                }
                $scope.cancelForm = function (event) {
                    goToListPage(event);
                }
                break;
            default:
                break;
        }
    }
    // Calling form initializing
    onInitializing();

    //#endregion

}]);