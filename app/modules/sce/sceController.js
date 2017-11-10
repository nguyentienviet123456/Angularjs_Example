app.controller('sceController', ['$rootScope', '$window', '$state', '$stateParams', '$scope', '$sce', '$location', 'authService', 'appSettings', 'constants', 'sceServices', 'raServices',
function ($rootScope, $window, $state, $stateParams, $scope, $sce, $location, authService, appSettings, constants, sceServices, raServices) {
    //#region common

    // Get current logged-in user profile
    $scope.userProfile = $rootScope.$app.userProfile;
    $scope.isAdmin = $scope.userProfile.isAdmin;
    $scope.hasApplicantRole = ("," + $rootScope.$app.userProfile.rolesKeyString + ",").indexOf(",1,") >= 0;
    $scope.showReApprover = false;


    // Model
    $scope.model = {
        sceNo: "",
        areaId: "",
        radio: "",
        unit: "",
        tagNo: "",
        otherTagNo: "",
        equipmentNo: "",
        othersTypesOfByPass: "",
        categoryId: "",
        estimationDurationForByPass: "",
        safetyIntegrityLvlId: "",
        dateRequired: "",
        expectedDateToNormalize: "",
        reasonForConductingByPass: "",
        othersMethodOfByPass: "",
        precautionsByApplicant: "",
        typeId: "",
        methodId: "",
        reviewerId: "",
        action: "",
        parentSceId: "",
        reviewer: "",
        mobileNo: $scope.userProfile.mobileNo == null ? '' : $scope.userProfile.mobileNo
    };

    $scope.initilizingFiles = null;

    $scope.raInfo = "";

    $scope.showNewRa = false;
    $scope.showCopyRa = false;

    // Bind SCE prerequisite data
    var bindPreData = function () {
        // Bind data to area combo box
        $scope.areasDataSource = {
            transport: {
                read: function (options) {
                    sceServices.getPreData('areas').then(function (response) {
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
            }
        };

        $scope.onAreaChange = function () {
            if ($("#sceArea").val() != "") {
                $scope.unitDataSource = {
                    transport: {
                        read: function (options) {
                            var isUnitActive = true;
                            if ($state.current.name != constants.state.scenew) {
                                isUnitActive = null;
                            }
                            sceServices.getUnitByArea($("#sceArea").val(), isUnitActive).then(function (response) {
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
                    }
                };
                $scope.tagNoDataSource = null;
            } else {
                $scope.unitDataSource = null;
                $scope.tagNoDataSource = null;
            }
        };

        $scope.onUnitChange = function () {
            if ($("#UnitNo").val() != "") {
                $scope.tagNoDataSource = {
                    transport: {
                        read: function (options) {
                            var isTagActive = true;
                            if ($state.current.name != constants.state.scenew) {
                                isUnitActive = null;
                            }
                            sceServices.getTagNoByUnit($("#UnitNo").val(), isTagActive).then(function (response) {
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

        $scope.onTagNoChange = function () {
            if ($scope.selectedTagNo != null && $scope.selectedTagNo != "" && $scope.selectedTagNo != "0") {
                sceServices.getSilIdByTagId($scope.selectedTagNo).then(
                    function (response) {
                        if (response.data != null && response.data != "") {
                            $scope.selectedSILType = response.data;
                        }
                    }, function (err) {
                        options.err([]);
                        utils.err.showErrorGet(err);
                    });
            }
        };

        // Sort the data base on length of description field
        function compare(a, b) {
            if (a.description.length < b.description.length)
                return -1;
            if (a.description.length > b.description.length)
                return 1;
            return 0;
        }

        // Bind data to category radio button
        $scope.categoryDataSource = null;
        sceServices.getPreData('categories').then(function (response) {
            $scope.categoryDataSource = response.data.sort(compare).reverse();
        }, function (error) {
            utils.error.showErrorGet(error);
        });

        // Bind data to parent bypass type
        $scope.bypassTypesDataSource = {
            transport: {
                read: function (options) {
                    sceServices.getPreData('parenttypes').then(function (response) {
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
            },
            schema: {
                model: {
                    fields: {
                        lookupTypeSceBypassId: { type: "string" },
                        description: { type: "string" }
                    }
                },
                data: function (response) {
                    response.push({ lookupTypeSceBypassId: "0", description: "Others" });
                    return response;
                }
            }
        };

        // Bind data type of bypass
        $scope.selectedParentType = "";
        $scope.onSelectedChange = function () {
            var childDropDown = $("#childType").data("kendoDropDownList");
            if ($scope.selectedParentType != "0" && $scope.selectedParentType != "") {
                $scope.bypassChildTypesDataSource = {
                    transport: {
                        read: function (options) {
                            sceServices.getPreData('childtypes', $scope.selectedParentType).then(function (response) {
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
                    },
                    sort: { field: "description", dir: "asc" }
                };
                childDropDown.options.optionLabel = "Select " + $("#parentType option:selected").text().toLowerCase() + " type";
                childDropDown.refresh();
                childDropDown.select(0);
                childDropDown.enable(true);
                $("#childType-list .k-list-optionlabel").text("Select " + $("#parentType option:selected").text().toLowerCase() + " type");
            } else {
                $("#otherType").val("");
                childDropDown.value("");
                childDropDown.enable(false);
                $scope.selectedType = '0';
            }
        };

        // Bind data to SIL combo box
        $scope.silDataSource = {
            transport: {
                read: function (options) {
                    sceServices.getPreData('sils').then(function (response) {
                        if (response.data != null) {
                            options.success(response.data.sort(compare));
                        } else {
                            options.success([]);
                        }
                    }, function (error) {
                        options.error([]);
                        utils.error.showErrorGet(error);
                    });
                }
            }
        };

        // bind data to drop down list MethodOfBypass
        $scope.methodsDataSource = {
            transport: {
                read: function (options) {
                    sceServices.getPreData('methods').then(function (response) {
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
            },
            schema: {
                model: {
                    fields: {
                        lookupMethodOfByPassId: { type: "string" },
                        description: { type: "string" }
                    }
                },
                data: function (response) {
                    response.push({ lookupMethodOfByPassId: "0", description: "Others" });
                    return response;
                }
            }
        };

        $scope.onSelectedMethodChange = function () {
            $("#otherMethod").val("");
        };

        // bind data to drop down list reviewer
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
                        sceServices.getPreData('reviewers', null, $scope.reviewerSearchText).then(function (response) {
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

        // Common field value
        $scope.selectedArea = "";
        $scope.selectedCategory = "";
        $scope.selectedType = "";
        $scope.selectedSILType = "";
        $scope.selectedMethod = "";
        $scope.selectedReviewer = {};
        $scope.selectedUnitNo = "";
        $scope.selectedTagNo = "";
    };

    $scope.panelOperatorRole = "";

    // Gets SCE copy
    var getSceCopied = function () {
        try {
            sceServices.getSceCopied($stateParams.sceId).then(function (response) {
                // mapping response data to model
                $scope.model.areaId = response.data.areaId;
                $scope.model.radio = response.data.radio;
                $scope.model.unit = response.data.unitId;
                $scope.model.tagNo = response.data.tagId;
                $scope.model.otherTagNo = response.data.otherTagNo;
                $scope.model.equipmentNo = response.data.equipmentNo;
                $scope.model.othersTypesOfByPass = response.data.othersTypesOfByPass;
                $scope.model.categoryId = response.data.categoryId;
                $scope.model.estimationDurationForByPass = response.data.estimationDurationForByPass;
                $scope.model.safetyIntegrityLvlId = response.data.safetyIntegrityLvlId;
                $scope.model.dateRequired = response.data.dateRequired;
                $scope.model.expectedDateToNormalize = response.data.expectedDateToNormalize;
                $scope.model.reasonForConductingByPass = response.data.reasonForConductingByPass;
                $scope.model.othersMethodOfByPass = response.data.othersMethodOfByPass;
                $scope.model.precautionsByApplicant = response.data.precautionsByApplicant;
                $scope.model.typeId = response.data.typeOfByPassId;
                $scope.model.methodId = response.data.methodOfByPassId;
                $scope.model.reviewerId = response.data.reviewerId;
                $scope.model.parentSceId = response.data.parentSceId;
                $scope.model.reviewer = response.data.reviewer;

                $scope.selectedArea = $scope.model.areaId;
                $scope.selectedCategory = $scope.model.categoryId;
                $scope.selectedUnitNo = $scope.model.unit;

                $scope.unitDataSource = {
                    transport: {
                        read: function (options) {
                            sceServices.getUnitByArea($scope.model.areaId).then(function (response) {
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
                    }
                };
                $scope.tagNoDataSource = {
                    transport: {
                        read: function (options) {
                            sceServices.getTagNoByUnit($scope.model.unit).then(function (response) {
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

                if ($scope.model.tagNo == null && $scope.model.otherTagNo != null) {
                    $scope.selectedTagNo = '0';
                }
                else if ($scope.model.tagNo != null || $scope.model.tagNo != '') {
                    $scope.selectedTagNo = $scope.model.tagNo;
                }

                if ($scope.model.typeId == null && $scope.model.othersTypesOfByPass != null) {
                    $scope.selectedParentType = '0';
                }
                else if ($scope.model.typeId != null && $scope.model.typeId != '') {
                    $scope.selectedParentType = response.data.parentTypeOfByPassId;
                    $("#childType").data("kendoDropDownList").enable(true);
                    $scope.bypassChildTypesDataSource = {
                        transport: {
                            read: function (options) {
                                sceServices.getPreData('childtypes', response.data.parentTypeOfByPassId).then(function (response) {
                                    if (response.data != null) {
                                        options.success(response.data);
                                    } else {
                                        options.success([]);
                                    }
                                }, function (error) {
                                    options.error([]);
                                    if (error != null && error.status == false) {
                                        console.log(error.message);
                                    } else {
                                        console.log(error);
                                    }
                                });
                            }
                        },
                        sort: { field: "description", dir: "asc" }
                    };
                    $scope.selectedType = $scope.model.typeId;
                }

                $scope.selectedSILType = $scope.model.safetyIntegrityLvlId;

                if ($scope.model.methodId == null && $scope.model.othersMethodOfByPass != null) {
                    $scope.selectedMethod = '0';
                }
                else if ($scope.model.methodId != null && $scope.model.methodId != '') {
                    $scope.selectedMethod = $scope.model.methodId;
                }
                $scope.selectedReviewer = $scope.model.reviewer;

                $rootScope.isLoading = false;
            }, function (error) {
                $rootScope.isLoading = false;
                utils.error.showErrorGet(error);
            });
        } catch (err) {
            utils.error.showErrorGet(err);
            $rootScope.isLoading = false;
        }
    }

    // Get SCE detail
    $scope.visibleReApprovalButton = false;

    var getSceDetailCommon = function () {
        try {
            sceServices.getSceDetail($stateParams.sceId).then(function (response) {
                $scope.sceDetail = response.data;
                $scope.sceDetail.mobileNo = $scope.userProfile.mobileNo == null ? '' : $scope.userProfile.mobileNo;
                switch ($state.current.name) {
                    case constants.state.sceupdaterequire:
                        if ($scope.sceDetail.statusKey != "9") {
                            $state.go(constants.state.accessdenied);
                        }
                        if ($scope.userProfile.userProfileId === $scope.sceDetail.applicant.userProfileId) {
                            $scope.isPic = true;
                        }
                        break;
                    case constants.state.sceedit:
                        if ($scope.sceDetail.statusKey != "1") {
                            $state.go(constants.state.accessdenied);
                        }
                        break;
                    case constants.state.reviewupdaterequire:
                        if ($scope.sceDetail.statusKey != "2" || !$scope.sceDetail.isRequireUpdate) {
                            $state.go(constants.state.accessdenied);
                        }
                        if ($scope.userProfile.userProfileId === $scope.sceDetail.applicant.userProfileId || $scope.userProfile.userProfileId === $scope.sceDetail.reviewer.userProfileId) {
                            $scope.isPic = true;
                        }
                        break;
                    case constants.state.scereview:
                        if ($scope.sceDetail.statusKey != "2") {
                            $state.go(constants.state.accessdenied);
                        }
                        if ($scope.userProfile.userProfileId === $scope.sceDetail.applicant.userProfileId || $scope.userProfile.userProfileId === $scope.sceDetail.reviewer.userProfileId) {
                            $scope.isPic = true;
                        }
                        break;
                    case constants.state.sceendorse:
                        if ($scope.sceDetail.statusKey != "3") {
                            $state.go(constants.state.accessdenied);
                        }
                        if ($scope.userProfile.userProfileId === $scope.sceDetail.applicant.userProfileId || $scope.userProfile.userProfileId === $scope.sceDetail.endorser.userProfileId) {
                            $scope.isPic = true;
                        }
                        break;
                    case constants.state.sceapprove:
                        if ($scope.sceDetail.statusKey != "4") {
                            $state.go(constants.state.accessdenied);
                        }
                        if ($scope.userProfile.userProfileId === $scope.sceDetail.applicant.userProfileId || $scope.userProfile.userProfileId === $scope.sceDetail.approver.userProfileId) {
                            $scope.isPic = true;
                        }
                        break;
                    case constants.state.sceacknowledge:
                        if ($scope.sceDetail.statusKey != "5") {
                            $state.go(constants.state.accessdenied);
                        }
                        if ($scope.userProfile.userProfileId === $scope.sceDetail.applicant.userProfileId || $scope.sceDetail.currentUserRole == "5") {
                            $scope.isPic = true;
                        }
                        break;
                    case constants.state.scelive:
                        if ($scope.sceDetail.statusKey != "7") {
                            $state.go(constants.state.accessdenied);
                        }
                        if ($scope.userProfile.userProfileId === $scope.sceDetail.applicant.userProfileId || $scope.sceDetail.currentUserRole == "5") {
                            $scope.isPic = true;
                        }
                        if ($scope.sceDetail.reApprover != null)
                            $scope.showReApprover = true;
                       
                        if ($scope.sceDetail.reApprover === null) {
                            $scope.visibleReApprovalButton = ($scope.userProfile.userProfileId == $scope.sceDetail.approver.userProfileId) ? true : false;
                            $scope.isPic = ($scope.userProfile.userProfileId == $scope.sceDetail.approver.userProfileId) ? true : false;;
                        } else {
                            $scope.visibleReApprovalButton = ($scope.userProfile.userProfileId == $scope.sceDetail.reApprover.userProfileId) ? true : false;
                            $scope.isPic = ($scope.userProfile.userProfileId == $scope.sceDetail.reApprover.userProfileId) ? true : false;;
                        }
                        break;
                    case constants.state.scenormalized:
                        if ($scope.sceDetail.statusKey != "10") {
                            $state.go(constants.state.accessdenied);
                        }
                        break;
                }

                $scope.isApplicant = $scope.userProfile.userProfileId == $scope.sceDetail.applicant.userProfileId;
                if (parseInt($scope.sceDetail.statusKey) < 10) {
                    if ($scope.isApplicant) {
                        if ($scope.sceDetail.raId == null && $scope.sceDetail.raNo == null) {
                            if (!$scope.hasApplicantRole) {
                                $scope.raInfo = "Pending Request";
                                $scope.showNewRa = true;
                                $scope.showCopyRa = false;
                            } else {

                                if ($scope.sceDetail.parentSceId !== null && $scope.sceDetail.parentSceId !== undefined) {
                                    // is copy ra;
                                    $scope.raInfo = '<a href="/ranew/' + $stateParams.sceId + '" class="k-link">Request New RA</a>';
                                    $scope.showNewRa = false;
                                    $scope.showCopyRa = true;
                                }
                                else {
                                    $scope.raInfo = '<a href="/ranew/' + $stateParams.sceId + '" class="k-button btn-sm btn-sd btn-purple">Request RA</a>';
                                    $scope.showNewRa = true;
                                    $scope.showCopyRa = false;
                                }
                            }
                        } else if ($scope.sceDetail.raId != null && $scope.sceDetail.raNo == null) {
                            $scope.showNewRa = true;
                            $scope.showCopyRa = false;
                            $scope.raInfo = '<a href="/radetail/' + $stateParams.sceId + '/' + $scope.sceDetail.raId + '" class="k-button btn-sm btn-sd btn-purple">RA Draft</a>';
                        } else {
                            $scope.showNewRa = true;
                            $scope.showCopyRa = false;
                            $scope.raInfo = '<a href="/radetail/' + $stateParams.sceId + '/' + $scope.sceDetail.raId + '">' + $scope.sceDetail.raNo + '</a>';
                        }
                    } else {
                        $scope.showNewRa = true;
                        $scope.showCopyRa = false;
                        if ($scope.sceDetail.raId == null || $scope.sceDetail.raNo == null) {
                            $scope.raInfo = "Pending Request";
                        } else {
                            $scope.raInfo = '<a href="/radetail/' + $stateParams.sceId + '/' + $scope.sceDetail.raId + '">' + $scope.sceDetail.raNo + '</a>';
                        }
                    }
                }
                $scope.raInfo = $sce.trustAsHtml($scope.raInfo);

                if ($("#ptwGrid").length) {
                    if (!$scope.isApplicant || $scope.sceDetail.statusKey == "10") {
                        $("#ptwGrid").data("kendoGrid").setOptions({
                            toolbar: null
                        });
                    }
                }
                switch ($scope.sceDetail.statusKey) {
                    case "1":
                        $scope.isHidden = !($scope.userProfile.userProfileId == $scope.sceDetail.applicant.userProfileId && $scope.sceDetail.statusKey == "1");
                        break;
                    case "2":
                        $scope.pendingReview = true;

                        $scope.isHidden = !($scope.userProfile.userProfileId == $scope.sceDetail.reviewer.userProfileId && $scope.sceDetail.statusKey == "2");
                        break;
                    case "3":
                        $scope.pendingEndorse = true;
                        $scope.isHidden = !($scope.userProfile.userProfileId == $scope.sceDetail.endorser.userProfileId && $scope.sceDetail.statusKey == "3");
                        break;
                    case "4":
                        $scope.pendingApprove = true;
                        $scope.isHidden = !($scope.userProfile.userProfileId == $scope.sceDetail.approver.userProfileId && $scope.sceDetail.statusKey == "4");
                        break;
                    case "5":
                        $scope.isHidden = !($scope.sceDetail.currentUserRole == '5' && $scope.sceDetail.statusKey == "5");
                        break;
                    case "7":
                        $scope.isHidden = true;
                        break;
                    case "9":
                        $scope.isHidden = !($scope.userProfile.userProfileId == $scope.sceDetail.applicant.userProfileId && $scope.sceDetail.statusKey == "9");
                        break;
                }

                if ($scope.isPic) {
                    if ($scope.userProfile.userProfileId === $scope.sceDetail.applicant.userProfileId) {
                        $scope.panelOperatorRole = "Applicant";
                    }
                    if ($scope.userProfile.userProfileId === $scope.sceDetail.reviewer.userProfileId) {
                        $scope.panelOperatorRole = "Reviewer";
                    }
                    if ($scope.sceDetail.endorser != null && $scope.userProfile.userProfileId === $scope.sceDetail.endorser.userProfileId) {
                        $scope.panelOperatorRole = "Endorser";
                    }
                    if ($scope.sceDetail.approver != null && $scope.userProfile.userProfileId === $scope.sceDetail.approver.userProfileId) {
                        $scope.panelOperatorRole = "Approver";
                    }
                    if ($scope.sceDetail.currentUserRole == "5") {
                        $scope.panelOperatorRole = "Acknowledger";
                    }
                }

                if ($state.current.name == constants.state.sceedit || $state.current.name == constants.state.sceupdaterequire) {
                    $scope.selectedArea = $scope.sceDetail.areaId;
                    $scope.selectedCategory = $scope.sceDetail.categoryId;
                    $scope.selectedUnitNo = $scope.sceDetail.unitId;

                    $scope.unitDataSource = {
                        transport: {
                            read: function (options) {
                                sceServices.getUnitByArea($scope.sceDetail.areaId).then(function (response) {
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
                        }
                    };
                    $scope.tagNoDataSource = {
                        transport: {
                            read: function (options) {
                                sceServices.getTagNoByUnit($scope.sceDetail.unitId).then(function (response) {
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

                    if ($scope.sceDetail.sceNo != null && $scope.sceDetail.sceNo != "") {
                        $scope.unitDropDownList = $("#UnitNo").data("kendoDropDownList").enable(false);
                        $scope.unitDropDownList = $("#sceArea").data("kendoDropDownList").enable(false);
                    }

                    if ($scope.sceDetail.tagNoId == null && $scope.sceDetail.otherTagNo != null) {
                        $scope.selectedTagNo = '0';
                    }
                    else if ($scope.sceDetail.tagNoId != null || $scope.sceDetail.tagNoId != '') {
                        $scope.selectedTagNo = $scope.sceDetail.tagNoId;
                    }

                    if ($scope.sceDetail.typeId == null && $scope.sceDetail.othersTypesOfByPass != null) {
                        $scope.selectedParentType = '0';
                    }
                    else if ($scope.sceDetail.typeId != null && $scope.sceDetail.typeId != '') {
                        $scope.selectedParentType = $scope.sceDetail.parentTypeId;
                        $("#childType").data("kendoDropDownList").enable(true);
                        $scope.bypassChildTypesDataSource = {
                            transport: {
                                read: function (options) {
                                    sceServices.getPreData('childtypes', $scope.sceDetail.parentTypeId).then(function (response) {
                                        if (response.data != null) {
                                            options.success(response.data);
                                        } else {
                                            options.success([]);
                                        }
                                    }, function (error) {
                                        options.error([]);
                                        if (error != null && error.status == false) {
                                            console.log(error.message);
                                        } else {
                                            console.log(error);
                                        }
                                    });
                                }
                            },
                            sort: { field: "description", dir: "asc" }
                        };
                        $scope.selectedType = $scope.sceDetail.typeId;
                    }

                    $scope.selectedSILType = $scope.sceDetail.safetyIntegrityLvlId;

                    if ($scope.sceDetail.methodId == null && $scope.sceDetail.othersMethodOfByPass != null) {
                        $scope.selectedMethod = '0';
                    }
                    else if ($scope.sceDetail.methodId != null && $scope.sceDetail.methodId != '') {
                        $scope.selectedMethod = $scope.sceDetail.methodId;
                    }
                    $scope.selectedReviewer = $scope.sceDetail.reviewer;
                }
                if ($state.current.name == constants.state.reviewupdaterequire || $state.current.name == constants.state.scereview) {
                    $scope.reviewModel.consequences = $scope.sceDetail.consequences;
                    $scope.reviewModel.precautionsByOperations = $scope.sceDetail.precautionsByOperations;
                    $scope.reviewModel.isTempOperatingProcedureRequired = $scope.sceDetail.isTempOperatingProcedureRequired;
                    $scope.reviewModel.isSpecialSIRequired = $scope.sceDetail.isSpecialSIRequired;
                    $scope.reviewModel.isDetailRARequired = $scope.sceDetail.isDetailRARequired;
                    $scope.reviewModel.endorser = $scope.sceDetail.endorser;
                    $scope.reviewModel.approver = $scope.sceDetail.approver;
                }
               

                if ($state.current.name == constants.state.scelive || $state.current.name == constants.state.scenormalized) {
                    $scope.reApprovalOptions = {
                        dataSource: {
                            transport: {
                                read: function (options) {
                                    sceServices.getSceExtApproval(
                                    {
                                        sceId: $stateParams.sceId,
                                        skip: (options.data.page - 1) * options.data.pageSize,
                                        take: options.data.take
                                    }).then(function (response) {
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
                            },
                            schema: {
                                model: {
                                    fields: {
                                        weekNo: {
                                            type: "string"
                                        },
                                        approvedBy: {
                                            type: "string"
                                        },
                                        approvedTime: {
                                            type: "date"
                                        }
                                    }
                                },
                                total: function (response) {
                                    return response === null || response === undefined || response.length === 0 ? 0 : response[0].total;
                                }
                            },
                            pageSize: 10,
                            serverPaging: true,
                            serverFiltering: false,
                            serverSorting: false
                        },
                        scrollable: false,
                        sortable: false,
                        pageable: {
                            pageSizes: true,
                            buttonCount: 5
                        },
                        columns: [{
                            field: "weekNo",
                            title: "Week",
                            width: "60px"
                        }, {
                            field: "approvedBy", title: "Approved by",
                            template: function (dataItem) {
                                if (dataItem.approvedTime == null && dataItem.isNewest) {
                                    return "<strong class='pending_info pending-reapproval'>Pending Re-approval</strong>";
                                }
                                else {
                                    return "<strong><a href data-ng-click='goToProfile(\"" + dataItem.approvedId + "\")'>" + dataItem.approvedBy + "</a></strong>";
                                }
                            }
                        }, {
                            field: "approvedTime", title: "Time Approved",
                            template: function (dataItem) {
                                if (dataItem.approvedTime == null && dataItem.isNewest) {
                                    if ($scope.visibleReApprovalButton) {
                                        return "<button class='btn-sd btn-sm btn-purple k-button right' data-ng-click='showTransferReApproverDialog()'>Re-approve</button>";
                                    }
                                    return "";
                                } else if (dataItem.approvedTime == null && !dataItem.isNewest) {
                                    return "";
                                } else {
                                    return kendo.toString(kendo.parseDate(dataItem.approvedTime), "dd MMM yyyy at hh:mm tt");
                                }
                            }
                        }],
                        noRecords: true,
                        messages: {
                            noRecords: "There is no data on current page"
                        }
                    };
                    $scope.reAcknowledgementOptions = {
                        dataSource: {
                            transport: {
                                read: function (options) {
                                    sceServices.getAcknowledgeSchedule(
                                    {
                                        sceId: $stateParams.sceId,
                                        skip: (options.data.page - 1) * options.data.pageSize,
                                        take: options.data.take
                                    }).then(function (response) {
                                        if (response.data != null) {
                                            options.success(response.data);
                                            _.each(response.data, function (item) {
                                                if (item.isNewestShift) {
                                                    $scope.newestShift = item.shiftTime;
                                                    $scope.newestShiftNumber = item.shift;
                                                }
                                            });
                                        } else {
                                            options.success([]);
                                        }
                                    }, function (error) {
                                        options.error([]);
                                        utils.error.showErrorGet(error);
                                    });
                                }
                            },
                            schema: {
                                model: {
                                    fields: {
                                        shift: {
                                            type: "string"
                                        },
                                        shiftTime: {
                                            type: "string"
                                        },
                                        acknowledgeBy: {
                                            type: "string"
                                        },
                                        acknowledgeTime: {
                                            type: "date", format: "dd MMM yyyy"
                                        }
                                    }
                                },
                                total: function (response) {
                                    return response === null || response === undefined || response.length === 0 ? 0 : response[0].total;
                                }
                            },
                            pageSize: 10,
                            serverPaging: true,
                            serverFiltering: false,
                            serverSorting: false
                        },
                        scrollable: false,
                        sortable: false,
                        pageable: {
                            pageSizes: true,
                            buttonCount: 5
                        },
                        columns: [{
                            field: "shift",
                            title: "Shift",
                            width: "60px"
                        }, {
                            field: "shiftTime",
                            title: "Date & Time",
                            attributes: {
                                "class": "cell_default"
                            }
                        }, {
                            field: "acknowledgeBy", title: "Acknowledged By",
                            template: function (dataItem) {
                                if (dataItem.isAcknowledged == null && dataItem.isNewestShift) {
                                    return "<strong class='pending_info pending-reacknowledge'>Pending Re-acknowledge</strong>";
                                } else if (dataItem.isAcknowledged == null && !dataItem.isNewestShift) {
                                    return "None";
                                } else {
                                    return "<a href data-ng-click='goToProfile(\"" + dataItem.acknowledgeId + "\")'><strong>" + dataItem.acknowledgeBy + "</strong></a>";
                                }
                            }
                        }, {
                            field: "acknowledgeTime", title: "Time Acknowledged",
                            template: function (dataItem) {
                                if (dataItem.isAcknowledged == null && dataItem.isNewestShift) {
                                    $scope.newestShift = dataItem.shiftTime;
                                    $scope.newestShiftNumber = dataItem.shift;
                                    if ($scope.sceDetail.currentUserRole == "5") {
                                        return "<button class='btn-sd btn-sm btn-purple k-button' data-ng-click='reAcknowledgementDialog.open()'>Re-acknowledge</button>";
                                    }
                                    return "";
                                } else if (dataItem.isAcknowledged == null && !dataItem.isNewestShift) {
                                    return "";
                                } else {
                                    return kendo.toString(kendo.parseDate(dataItem.acknowledgeTime), "dd MMM yyyy at hh:mm tt");
                                }
                            }
                        }],
                        noRecords: true,
                        messages: {
                            noRecords: "There is no data on current page"
                        }
                    };
                }
                $scope.applicantSearchText = "";
                // Bind new applicant to transfer for admin
                $scope.newApplicantOptions = {
                    autoBind: false,
                    optionLabel: "Select New Applicant",
                    filter: "contains",
                    filtering: function (e) {
                        $scope.applicantSearchText = e.filter == null ? "" : e.filter.value;
                    },
                    dataSource: {
                        serverFiltering: true,
                        transport: {
                            read: function (options) {
                                sceServices.getApplicantsForTransfer($scope.applicantSearchText).then(function (response) {
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
                        }
                    },
                    dataTextField: "userName",
                    dataValueField: "userProfileId",
                    valueTemplate: function (dataItem) {
                        if (!dataItem.hasOwnProperty('image')) {
                            dataItem.image = $scope.applicantToTransfer.image;
                        }
                        return '<span class="selected-value" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span><span>{{dataItem.userName}}</span>';
                    },
                    template: '<div class="custom-dropdown"><span class="k-state-default" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span>' +
                        '<span class="k-state-default"><h3>{{dataItem.userName}}</h3></span></div>'
                };

                $scope.applicantTransferSearchText = "";
                // Bind new applicant to transfer for applicant
                $scope.newApplicantTransferOptions = {
                    autoBind: false,
                    optionLabel: "Select New Applicant",
                    filter: "contains",
                    filtering: function (e) {
                        $scope.applicantTransferSearchText = e.filter == null ? "" : e.filter.value;
                    },
                    dataSource: {
                        serverFiltering: true,
                        transport: {
                            read: function (options) {
                                sceServices.getApplicantsForTransferInSameAreas($stateParams.sceId, $scope.applicantTransferSearchText).then(function (response) {
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
                        }
                    },
                    dataTextField: "userName",
                    dataValueField: "userProfileId",
                    valueTemplate: function (dataItem) {
                        if (!dataItem.hasOwnProperty('image')) {
                            dataItem.image = $scope.applicantToTransfer.image;
                        }
                        return '<span class="selected-value" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span><span>{{dataItem.userName}}</span>';
                    },
                    template: '<div class="custom-dropdown"><span class="k-state-default" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span>' +
                        '<span class="k-state-default"><h3>{{dataItem.userName}}</h3></span></div>'
                };

                // Get list file upload
                if ($state.current.name !== constants.state.scenew || $state.current.name !== constants.state.sceedit || $state.current.name !== constants.state.sceupdaterequire) {
                    sceServices.getUploadedFiles($stateParams.sceId).then(function (response) {
                        $scope.fileModel = response.data;
                    }, function (err) {
                        $rootScope.isLoading = false;
                        utils.error.showErrorGet(err);
                    });
                }

            }, function (error) {
                $rootScope.isLoading = false;
                utils.error.showErrorGet(error);
            });

            $rootScope.isLoading = false;

        }
        catch (err) {
            utils.error.showErrorGet(err);
            $rootScope.isLoading = false;
        }
    };

    $scope.copyExitstingRa = function () {

        $rootScope.isLoading = true;

        if ($('#menuRequestRa .k-animation-container').length > 0) {
            $('#menuRequestRa .k-animation-container').css('display', 'none');
        }

        raServices.checkRaCopy($stateParams.sceId).then(function (response) {
            debugger;
            $rootScope.isLoading = false;
            var option;
            if (response.data == false) {
                option = {
                    id: "dialogInfo",
                    title: "RA Copy Confirmation",
                    //lableOk: "COPY",
                    lableClose: "CLOSE",
                    content: response.message,
                    width: 500
                };
            } else {
                option = {
                    id: "dialogInfo",
                    title: "RA Copy Confirmation",
                    lableOk: "COPY",
                    lableClose: "CANCEL",
                    content: response.message,
                    width: 500
                };
            }

            utils.dialog.showConfirm(option, function () {
                $state.go(constants.state.raCopy, { sceId: $stateParams.sceId });
            });

        }, function (error) {

            $rootScope.isLoading = false;
        });
    }

    $scope.goToProfile = function (userId) {
        $state.go(constants.state.profile, { id: userId });
    };

    $scope.scePrint = function () {
        window.open('/print/sce/' + $stateParams.sceId, '_blank');
    };

    $scope.statusLog = function () {
        $state.go(constants.state.sceStatusLog, { sceId: $stateParams.sceId });
    }

    $scope.showNormalizeDialog = function () {
        if ($("#ptwGrid").data("kendoGrid").dataSource.data().length == 0 || $("#ptwGrid").data("kendoGrid").dataSource.data().length == 1 && $("#ptwGrid").data("kendoGrid").dataSource.data()[0].id == "") {
            $("#validatePTWDialog").data("kendoDialog").open();
        } else {
            $("#normalizeDialog").data("kendoDialog").open();
        }
    };

    // Open/Close Custom Drop down (Vertical Dot)
    $(".dropdown_toggle").click(function (e) {
        $(this).parent().toggleClass("dd_open");
        e.stopPropagation();
    });

    // Close drop down on click outside div
    $(document).on("click", function (e) {
        if ($(e.target).is(".dropdown_menu") === false) {
            $(".dd_block").removeClass("dd_open");
        }
    });

    // Request RA
    $scope.requestRa = function () {
        // do something
        $state.go(constants.state.raNew, { sceId: $stateParams.sceId });
    };

    $scope.sceCopyDialog = function (title, content) {
        return $("<div></div>").kendoConfirm({
            title: title,
            content: content,
            actions: [{ text: "COPY", primary: true },
                { text: "CANCEL" }]
        }).data("kendoConfirm").open().result;
    };

    $scope.copySCE = function () {
        $scope.sceCopyDialog("SCE Copy Confirmation", "Existing SCE No. <strong>" + $scope.sceDetail.sceNo + "</strong> information will be copied into new SCE request. Are you sure to proceed?").then(function () {
            $state.go(constants.state.scecopynew, { sceId: $stateParams.sceId });
        }, function () {
            // Chooses cancel, do nothing
        });
    }
    // prevent multi click
    $scope.inProgress = false;

    $scope.customValidationOptions = {
        rules: {
            otherTagNo: function (input) {
                if (input.is("[name=tagNo]")) {
                    var retVal = true;
                    if ($scope.selectedTagNo == '') {
                        return false;
                    } else if ($scope.selectedTagNo == '0') {
                        retVal = $scope.model.otherTagNo != '';
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
    };

    $scope.updateForm_CustomValidationOptions = {
        rules: {
            otherTagNo: function (input) {
                if (input.is("[name=tagNo]")) {
                    var retVal = true;
                    if ($scope.selectedTagNo == '') {
                        return false;
                    } else if ($scope.selectedTagNo == '0') {
                        retVal = $scope.sceDetail.otherTagNo != '';
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
    };

    $scope.dialogOption = {
        id: "dialogInfo",
        title: "",
        lableClose: "CLOSE",
        content: "",
        width: 300
    };
    //#endregion

    //#region Initializing

    // Initializing numeric text box options
    $scope.numberTextbox = {
        format: "#.##",
        decimals: 2,
        min: 0,
        max: 99999999.99
    };

    // Initializing date picker options
    $scope.dateTextbox = {
        format: "MM/dd/yyyy",
        min: new Date(1900, 0, 1),
        max: new Date(2099, 11, 31)
        //disableDates: ["sa", "su"]
    };

    // Initializing SCE detail model
    $scope.sceDetail = null;

    $rootScope.goToMyPendingAction = false;

    // Initializing category data source
    $scope.categoryDataSource = null;

    // Bind reviewer for transfer
    $scope.reviewerToTransfer = {};
    $scope.endorserToTransfer = {};
    $scope.approverToTransfer = {};
    $scope.reviewerForTransferSearchText = "";

    $scope.reviewerForTransferDataSource = {
        serverFiltering: true,
        transport: {
            read: function (options) {
                sceServices.getPreData('reviewers', null, $scope.reviewerForTransferSearchText).then(function (response) {
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
        }
    };

    $scope.reviewerForTransferOptions = {
        autoBind: false,
        filter: "contains",
        filtering: function (e) {
            $scope.reviewerForTransferSearchText = e.filter == null ? "" : e.filter.value;
        },
        optionLabel: "Select Reviewer",
        dataSource: $scope.reviewerForTransferDataSource,
        dataTextField: "userName",
        dataValueField: "userProfileId",
        valueTemplate: function (dataItem) {
            if (!dataItem.hasOwnProperty('image')) {
                dataItem.image = $scope.reviewerToTransfer.image;
            }
            return '<span class="selected-value" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span><span>{{dataItem.userName}}</span>';
        },
        template: '<div class="custom-dropdown"><span class="k-state-default" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span>' +
    '<span class="k-state-default"><h3>{{dataItem.userName}}</h3></span></div>'
    };
    // Bind endorser

    $scope.endorseDatasource = {
        serverFiltering: true,
        transport: {
            read: function (options) {
                sceServices.getPreData('endorsers', null, $scope.endorserSearchText).then(function (response) {
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
        }
    };

    $scope.endorserSearchText = "";

    $scope.endorserOptions = {
        autoBind: false,
        height: 300,
        filter: "contains",
        filtering: function (e) {
            $scope.endorserSearchText = e.filter == null ? "" : e.filter.value;
        },
        optionLabel: "Select Endorser",
        dataSource: $scope.endorseDatasource,
        dataTextField: "userName",
        dataValueField: "userProfileId",
        valueTemplate: function (dataItem) {
            if (!dataItem.hasOwnProperty('image')) {
                if ($scope.reviewModel.endorser == "") {
                    dataItem.image = $scope.endorserToTransfer.image;
                } else {
                    dataItem.image = $scope.reviewModel.endorser.image;
                }
            }
            return '<span class="selected-value" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span><span>{{dataItem.userName}}</span>';
        },
        template: '<div class="custom-dropdown"><span class="k-state-default" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span>' +
    '<span class="k-state-default"><h3>{{dataItem.userName}}</h3></span></div>'
    };

    // Bind approver
    $scope.approverDatasource = {
        serverFiltering: true,
        transport: {
            read: function (options) {
                sceServices.getPreData('approvers', null, $scope.approverSearchText).then(function (response) {
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
        }
    };

    $scope.approverSearchText = "";

    $scope.approverOptions = {
        autoBind: false,
        height: 300,
        optionLabel: "Select Approver",
        filter: "contains",
        filtering: function (e) {
            $scope.approverSearchText = e.filter == null ? "" : e.filter.value;
        },
        dataSource: $scope.approverDatasource,
        dataTextField: "userName",
        dataValueField: "userProfileId",
        valueTemplate: function (dataItem) {
            if (!dataItem.hasOwnProperty('image')) {
                if ($scope.reviewModel.endorser != "") {
                    dataItem.image = $scope.reviewModel.approver.image;
                } else {
                    dataItem.image = $scope.approverToTransfer.image;
                }
            }
            return '<span class="selected-value" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span><span>{{dataItem.userName}}</span>';
        },
        template: '<div class="custom-dropdown"><span class="k-state-default" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span>' +
    '<span class="k-state-default"><h3>{{dataItem.userName}}</h3></span></div>'
    };

    // Binding data to form
    var onLoad = function (routeName) {
        // check bigModule
        $rootScope.bigModuleTitle = "Safety Critical Equipment (SCE)";

        // end check
        switch (routeName) {
            case constants.state.sceupdaterequire:
                $rootScope.$app.title = "SCE Required Update";
                $rootScope.isLoading = true;
                try {
                    bindPreData();
                    getSceDetailCommon();
                }
                catch (err) {
                    utils.error.showErrorGet(err);
                    $rootScope.isLoading = false;
                }
                break;
            case constants.state.sceedit:
                $rootScope.$app.title = "SCE Edit";
                $rootScope.isLoading = true;
                try {
                    bindPreData();
                    getSceDetailCommon();
                }
                catch (err) {
                    utils.error.showErrorGet(err);
                    $rootScope.isLoading = false;
                }
                break;
            case constants.state.scenew:
                $rootScope.$app.title = "SCE New";
                $rootScope.isLoading = true;
                try {
                    bindPreData();
                    $rootScope.isLoading = false;
                }
                catch (err) {
                    utils.error.showErrorGet(err);
                    $rootScope.isLoading = false;
                }
                break;
            case constants.state.scecopynew:
                $rootScope.$app.title = constants.titlePage.sceCopyNew;
                $rootScope.isLoading = true;
                try {
                    bindPreData();
                    getSceCopied();
                } catch (err) {
                    utils.error.showErrorGet(err);
                    $rootScope.isLoading = false;
                }
                break;
            case constants.state.scedetail:
                $rootScope.isLoading = true;
                try {
                    if ($stateParams.sceId == null || $stateParams.sceId == "") {
                        $state.go(scelist);
                    }
                    sceServices.getSceDetail($stateParams.sceId).then(function (response) {
                        switch (response.data.statusKey) {
                            case "1":
                                $state.go(constants.state.sceedit, { sceId: $stateParams.sceId });
                                break;
                            case "2":
                                if (response.data.isRequireUpdate == null || response.data.isRequireUpdate == false) {
                                    $state.go(constants.state.scereview, { sceId: $stateParams.sceId });
                                } else {
                                    $state.go(constants.state.reviewupdaterequire, { sceId: $stateParams.sceId });
                                }
                                break;
                            case "3":
                                $state.go(constants.state.sceendorse, { sceId: $stateParams.sceId });
                                break;
                            case "4":
                                $state.go(constants.state.sceapprove, { sceId: $stateParams.sceId });
                                break;
                            case "5":
                                $state.go(constants.state.sceacknowledge, { sceId: $stateParams.sceId });
                                break;
                            case "7":
                                $state.go(constants.state.scelive, { sceId: $stateParams.sceId });
                                break;
                            case "9":
                                $state.go(constants.state.sceupdaterequire, { sceId: $stateParams.sceId });
                                break;
                            case "10":
                                $state.go(constants.state.scenormalized, { sceId: $stateParams.sceId });
                                break;
                        }
                        $rootScope.isLoading = false;
                    }, function (error) {
                        utils.error.showErrorGet(error);
                    });
                }
                catch (err) {
                    utils.error.showErrorGet(err);
                    $rootScope.isLoading = false;
                }
                break;
            case constants.state.reviewupdaterequire:
                $rootScope.$app.title = "SCE Review Update Require";
                try {
                    getSceDetailCommon();
                }
                catch (err) {
                    utils.error.showErrorGet(err);
                    $rootScope.isLoading = false;
                }
                break;
            case constants.state.scereview:
                $rootScope.$app.title = "SCE Review";
                $rootScope.isLoading = true;
                try {
                    getSceDetailCommon();
                }
                catch (err) {
                    utils.error.showErrorGet(err);
                    $rootScope.isLoading = false;
                }
                break;
            case constants.state.sceendorse:
                $rootScope.$app.title = "SCE Endorse";
                $rootScope.isLoading = true;
                try {
                    getSceDetailCommon();
                }
                catch (err) {
                    utils.error.showErrorGet(err);
                    $rootScope.isLoading = false;
                }
                break;
            case constants.state.sceapprove:
                $rootScope.$app.title = "SCE Approve";
                $rootScope.isLoading = true;
                try {
                    getSceDetailCommon();
                }
                catch (err) {
                    utils.error.showErrorGet(err);
                    $rootScope.isLoading = false;
                }
                break;
            case constants.state.sceacknowledge:
                $rootScope.$app.title = "SCE Acknowledge";
                $rootScope.isLoading = true;
                try {
                    getSceDetailCommon();
                }
                catch (err) {
                    utils.error.showErrorGet(err);
                    $rootScope.isLoading = false;
                }
                break;
            case constants.state.scelive:
                $rootScope.$app.title = "SCE Live";
                $rootScope.isLoading = true;
                try {
                    getSceDetailCommon();
                }
                catch (err) {
                    utils.error.showErrorGet(err);
                    $rootScope.isLoading = false;
                }
                break;
            case constants.state.scenormalized:
                $rootScope.$app.title = "SCE Normalized";
                $rootScope.isLoading = true;
                try {
                    getSceDetailCommon();
                }
                catch (err) {
                    utils.error.showErrorGet(err);
                    $rootScope.isLoading = false;
                }
                break;
        }
    };
    onLoad($state.current.name);

    //#endregion

    //#region Add new SCE

    $scope.goToListPage = function (event) {
        event.preventDefault();
        $state.go("scelist");
    };

    $scope.saveData = function (event, actionType) {
        //prevent multi click
        $scope.inProgress = true;
        event.preventDefault();
        event.stopImmediatePropagation();

        // show loading
        $rootScope.isLoading = true;

        try {
            var isValid = false;
            if (actionType == "Submit") {
                // Custom validations
                isValid = $("#createSceForm").kendoValidator({
                    rules: {
                        bypasstype: function (input) {
                            if (input.is("[name=TypeofBypass]")) {
                                var retVal = $("#childType").val() != "" || $("#otherType").val() != "";
                                if (retVal) {
                                    $("#parentType").removeClass("k-invalid");
                                } else {
                                    $("#childType").addClass("k-invalid");
                                    $("#otherType").addClass("k-invalid");
                                }
                                return retVal;
                            }
                            return true;
                        },
                        bypassmethod: function (input) {
                            if (input.is("[name=MethodsofBypass]")) {
                                var retVal = true;
                                if ($("#methodBypass").val() == '') {
                                    return false;
                                } else if ($("#methodBypass").val() == '0') {
                                    retVal = $("#otherMethod").val() != '';
                                }
                                if (retVal) {
                                    $("#methodBypass").removeClass("k-invalid");
                                } else {
                                    $("#methodBypass").addClass("k-invalid");
                                    $("#otherMethod").addClass("k-invalid");
                                }
                                return retVal;
                            }
                            return true;
                        },
                        greaterdate: function (input) {
                            if (input.is("[greaterdate]") && input.val() != "") {
                                var date = kendo.parseDate(input.val(), 'MM/dd/yyyy'),
                                    otherDate = kendo.parseDate($("[name='" + input.data("commpareControl") + "']").val(), 'MM/dd/yyyy');
                                return otherDate == null || otherDate.getTime() <= date.getTime();
                            }

                            return true;
                        },
                        otherTagNo: function (input) {
                            if (input.is("[name=tagNo]")) {
                                var retVal = true;
                                if ($scope.selectedTagNo == '') {
                                    return false;
                                } else if ($scope.selectedTagNo == '0') {
                                    retVal = $scope.model.otherTagNo != '';
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
                        bypasstype: "Type of Bypass is required",
                        bypassmethod: "Method of Bypass is required",
                        greaterdate: "Expected Date to Normalize should be after Date Required.",
                        otherTagNo: "Tag No. is required"
                    }
                }).data("kendoValidator").validate();
            } else {
                isValid = $("#createSceForm").kendoValidator({
                    rules: {
                        otherTagNo: function (input) {
                            if (input.is("[name=tagNo]")) {
                                var retVal = true;
                                if ($scope.selectedTagNo == '') {
                                    return false;
                                } else if ($scope.selectedTagNo == '0') {
                                    retVal = $scope.model.otherTagNo != '';
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
            if (actionType == 'Submit' && !utils.validRequiredAction(actionType)) {
                isValid = false;
            }
            if (isValid) {
                // Save Draft or Submit
                $scope.model.action = actionType;
                $scope.model.areaId = $scope.selectedArea;
                $scope.model.safetyIntegrityLvlId = $scope.selectedSILType;
                $scope.model.categoryId = $scope.selectedCategory;
                $scope.model.userProfileId = $scope.userProfile.UserProfileId;
                $scope.model.typeId = $scope.selectedType == '0' ? '' : $scope.selectedType;
                $scope.model.methodId = $scope.selectedMethod == '0' ? '' : $scope.selectedMethod;
                $scope.model.reviewerId = $scope.selectedReviewer == null ? null : $scope.selectedReviewer.userProfileId;
                $scope.model.unit = $scope.selectedUnitNo;
                $scope.model.tagNo = $scope.selectedTagNo == '0' ? '' : $scope.selectedTagNo;
                if ($scope.selectedTagNo == '0') {
                    $scope.model.tagNo = "";
                } else {
                    $scope.model.otherTagNo = "";
                    $scope.model.tagNo = $scope.selectedTagNo;
                }
                $scope.model.parentSceId = $stateParams.sceId;
                // Send data to server
                sceServices.addNewSCE($scope.model).then(function (response) {
                    $scope.inProgress = false;
                    $rootScope.isLoading = false;
                    $scope.userProfile.mobileNo = $scope.model.mobileNo;
                    $rootScope.$app.userProfile.mobileNo = $scope.model.mobileNo;
                    switch (actionType) {
                        case "Draft":
                            $scope.dialogOption.title = "Save SCE as Draft";
                            $scope.dialogOption.content = "This SCE is saved as draft";
                            utils.dialog.showDialog($scope.dialogOption, function () {
                                $state.go(constants.state.scelist);
                            });
                            break;
                        case "Submit":
                            $scope.dialogOption.title = "Create SCE";
                            $scope.dialogOption.content = "This SCE is submitted and <strong>pending review</strong>";
                            utils.dialog.showDialog($scope.dialogOption, function () {
                                $state.go(constants.state.scelist);
                            });
                            break;
                    }
                }, function (error) {
                    $scope.inProgress = false;
                    $rootScope.isLoading = false;
                    switch (actionType) {
                        case "Draft":
                            $scope.dialogOption.title = "Save SCE as Draft";
                            $scope.dialogOption.content = error.message;
                            utils.dialog.showDialog($scope.dialogOption);
                            break;
                        case "Submit":
                            $scope.dialogOption.title = "Create SCE";
                            $scope.dialogOption.content = error.message;
                            utils.dialog.showDialog($scope.dialogOption);
                            break;
                    }
                });
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

    //#endregion sce create form

    //#region Transfer SCE

    $scope.transferSceModel = {
        newApplicantId: "",
        comment: ""
    };

    $scope.transferSceAction = [{ text: 'CANCEL' },
    {
        text: 'TRANSFER',
        action: function () {
            // show loading
            $rootScope.isLoading = true;

            try {
                if ($scope.userProfile.userProfileId == $scope.sceDetail.applicant.userProfileId) {
                    sceServices.transferSce($stateParams.sceId, $scope.transferSceModel).then(function (response) {
                        $rootScope.isLoading = false;
                        $scope.dialogOption.title = "SCE Transferred";
                        $scope.dialogOption.content = "This SCE is now transferred to <strong>" + response.data + "</strong>. A notification has been sent to alert the new applicant.";
                        utils.dialog.showDialog($scope.dialogOption, function () {
                            $state.go(constants.state.scelist);
                        });
                    }, function (error) {
                        $scope.dialogOption.title = "SCE Transfer Failed";
                        $scope.dialogOption.content = error.message;
                        utils.dialog.showDialog($scope.dialogOption);
                    });
                } else {
                    $rootScope.isLoading = false;
                    $scope.dialogOption.title = "Access Denied";
                    $scope.dialogOption.content = "You don't have any permission to do this action.";
                    utils.dialog.showDialog($scope.dialogOption);
                }
                // Returning false will prevent the closing of the dialog
                return true;
            } catch (err) {
                utils.error.showErrorGet(err);
                $rootScope.isLoading = false;
            }
        },
        primary: true
    }];

    //#endregion

    //#region Require form

    $scope.updateRequire = function (e, actionType) {
        //prevent multi click
        $scope.inProgress = true;
        e.preventDefault();
        e.stopImmediatePropagation();

        // show loading
        $rootScope.isLoading = true;

        try {
            var isValid = $("#update-require").kendoValidator({
                rules: {
                    bypasstype: function (input) {
                        if (input.is("[name=TypeofBypass]")) {
                            var retVal = $("#childType").val() != "" || $("#otherType").val() != "";
                            if (retVal) {
                                $("#parentType").removeClass("k-invalid");
                            } else {
                                $("#childType").addClass("k-invalid");
                                $("#otherType").addClass("k-invalid");
                            }
                            return retVal;
                        }
                        return true;
                    },
                    bypassmethod: function (input) {
                        if (input.is("[name=MethodsofBypass]")) {
                            var retVal = true;
                            if ($("#methodBypass").val() == '') {
                                return false;
                            } else if ($("#methodBypass").val() == '0') {
                                retVal = $("#otherMethod").val() != '';
                            }
                            if (retVal) {
                                $("#methodBypass").removeClass("k-invalid");
                            } else {
                                $("#methodBypass").addClass("k-invalid");
                                $("#otherMethod").addClass("k-invalid");
                            }
                            return retVal;
                        }
                        return true;
                    },
                    greaterdate: function (input) {
                        if (input.is("[greaterdate]") && input.val() != "") {
                            var date = kendo.parseDate(input.val(), 'MM/dd/yyyy'),
                                otherDate = kendo.parseDate($("[name='" + input.data("commpareControl") + "']").val(), 'MM/dd/yyyy');
                            return otherDate == null || otherDate.getTime() <= date.getTime();
                        }

                        return true;
                    },
                    otherTagNo: function (input) {
                        if (input.is("[name=tagNo]")) {
                            var retVal = true;
                            if ($scope.selectedTagNo == '') {
                                return false;
                            } else if ($scope.selectedTagNo == '0') {
                                retVal = $scope.sceDetail.otherTagNo != '';
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
                    bypasstype: "Type of Bypass is required",
                    bypassmethod: "Method of Bypass is required",
                    greaterdate: "Expected Date to Normalize should be after Date Required.",
                    otherTagNo: "Tag No. is required"
                }
            }).data("kendoValidator").validate();

            if (isValid) {
                // Save Draft or Submit
                $scope.sceDetail.action = actionType;
                $scope.sceDetail.areaId = $scope.selectedArea;
                $scope.sceDetail.safetyIntegrityLvlId = $scope.selectedSILType;
                $scope.sceDetail.categoryId = $scope.selectedCategory;
                $scope.sceDetail.userProfileId = $scope.userProfile.UserProfileId;
                $scope.sceDetail.typeId = $scope.selectedType == '0' ? '' : $scope.selectedType;
                $scope.sceDetail.methodId = $scope.selectedMethod == '0' ? '' : $scope.selectedMethod;
                $scope.sceDetail.reviewerId = $scope.selectedReviewer == null ? null : $scope.selectedReviewer.userProfileId;
                $scope.sceDetail.unit = $scope.selectedUnitNo;
                if ($scope.selectedTagNo == '0') {
                    $scope.sceDetail.tagNo = '';
                } else {
                    $scope.sceDetail.tagNo = $scope.selectedTagNo;
                    $scope.sceDetail.otherTagNo = "";
                }
                // Send data to server
                sceServices.editSce($stateParams.sceId, $scope.sceDetail).then(function (response) {
                    $scope.inProgress = false;
                    $rootScope.isLoading = false;
                    $scope.userProfile.mobileNo = $scope.sceDetail.mobileNo;
                    $rootScope.$app.userProfile.mobileNo = $scope.sceDetail.mobileNo;
                    switch (actionType) {
                        case "Draft":
                            $scope.dialogOption.title = "Update SCE";
                            $scope.dialogOption.content = "This SCE is saved";
                            utils.dialog.showDialog($scope.dialogOption, function () {
                                $state.go(constants.state.scelist);
                            });
                            break;
                        case "Submit":
                            $scope.dialogOption.title = "Update SCE";
                            $scope.dialogOption.content = "This SCE is submitted and <strong>pending review</strong>";
                            utils.dialog.showDialog($scope.dialogOption, function () {
                                $state.go(constants.state.scelist);
                            });
                            break;
                    }
                }, function (error) {
                    $scope.inProgress = false;
                    $rootScope.isLoading = false;

                    $scope.dialogOption.title = "Update SCE";
                    $scope.dialogOption.content = error.message;
                    utils.dialog.showDialog($scope.dialogOption);
                });
            } else {
                $scope.inProgress = false;
                $rootScope.isLoading = false;
            }
        } catch (err) {
            utils.error.showErrorGet(err);
            $scope.inProgress = false;
            $rootScope.isLoading = false;
        }
    };

    //#endregion

    //#region Edit

    $scope.edit = function (e, actionType) {
        //prevent multi click
        $scope.inProgress = true;
        e.preventDefault();
        e.stopImmediatePropagation();

        // show loading
        $rootScope.isLoading = true;

        try {
            var isValid = false;
            if (actionType == "Submit") {
                // Custom validations
                isValid = $("#sce-edit").kendoValidator({
                    rules: {
                        bypasstype: function (input) {
                            if (input.is("[name=TypeofBypass]")) {
                                var retVal = $("#childType").val() != "" || $("#otherType").val() != "";
                                if (retVal) {
                                    $("#parentType").removeClass("k-invalid");
                                } else {
                                    $("#childType").addClass("k-invalid");
                                    $("#otherType").addClass("k-invalid");
                                }
                                return retVal;
                            }
                            return true;
                        },
                        bypassmethod: function (input) {
                            if (input.is("[name=MethodsofBypass]")) {
                                var retVal = true;
                                if ($("#methodBypass").val() == '') {
                                    return false;
                                } else if ($("#methodBypass").val() == '0') {
                                    retVal = $("#otherMethod").val() != '';
                                }
                                if (retVal) {
                                    $("#methodBypass").removeClass("k-invalid");
                                } else {
                                    $("#methodBypass").addClass("k-invalid");
                                    $("#otherMethod").addClass("k-invalid");
                                }
                                return retVal;
                            }
                            return true;
                        },
                        greaterdate: function (input) {
                            if (input.is("[greaterdate]") && input.val() != "") {
                                var date = kendo.parseDate(input.val(), 'MM/dd/yyyy'),
                                    otherDate = kendo.parseDate($("[name='" + input.data("commpareControl") + "']").val(), 'MM/dd/yyyy');
                                return otherDate == null || otherDate.getTime() <= date.getTime();
                            }

                            return true;
                        },
                        otherTagNo: function (input) {
                            if (input.is("[name=tagNo]")) {
                                var retVal = true;
                                if ($scope.selectedTagNo == '') {
                                    return false;
                                } else if ($scope.selectedTagNo == '0') {
                                    retVal = $scope.sceDetail.otherTagNo != '';
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
                        bypasstype: "Type of Bypass is required",
                        bypassmethod: "Method of Bypass is required",
                        greaterdate: "Expected Date to Normalize should be after Date Required.",
                        otherTagNo: "Tag No. is required"
                    }
                }).data("kendoValidator").validate();
            } else {
                isValid = $("#sce-edit").kendoValidator({
                    rules: {
                        otherTagNo: function (input) {
                            if (input.is("[name=tagNo]")) {
                                var retVal = true;
                                if ($scope.selectedTagNo == '') {
                                    return false;
                                } else if ($scope.selectedTagNo == '0') {
                                    retVal = $scope.sceDetail.otherTagNo != '';
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
            if (actionType == 'Submit' && !utils.validRequiredAction(actionType)) {
                isValid = false;
            }
            if (isValid) {
                // Save Draft or Submit
                $scope.sceDetail.action = actionType;
                $scope.sceDetail.areaId = $scope.selectedArea;
                $scope.sceDetail.safetyIntegrityLvlId = $scope.selectedSILType;
                $scope.sceDetail.categoryId = $scope.selectedCategory;
                $scope.sceDetail.userProfileId = $scope.userProfile.UserProfileId;
                $scope.sceDetail.typeId = $scope.selectedType == '0' ? '' : $scope.selectedType;
                $scope.sceDetail.methodId = $scope.selectedMethod == '0' ? '' : $scope.selectedMethod;
                $scope.sceDetail.reviewerId = $scope.selectedReviewer == null ? null : $scope.selectedReviewer.userProfileId;
                $scope.sceDetail.unit = $scope.selectedUnitNo;
                $scope.sceDetail.tagNo = $scope.selectedTagNo == '0' ? '' : $scope.selectedTagNo;
                // Send data to server
                sceServices.editSce($stateParams.sceId, $scope.sceDetail).then(function (response) {
                    $scope.inProgress = false;
                    $rootScope.isLoading = false;
                    $scope.userProfile.mobileNo = $scope.model.mobileNo;
                    $rootScope.$app.userProfile.mobileNo = $scope.model.mobileNo;
                    switch (actionType) {
                        case "Draft":
                            $scope.dialogOption.title = "Update SCE";
                            $scope.dialogOption.content = "This SCE is saved";
                            utils.dialog.showDialog($scope.dialogOption, function () {
                                $state.go(constants.state.scelist);
                            });
                            break;
                        case "Submit":
                            $scope.dialogOption.title = "Update SCE";
                            $scope.dialogOption.content = "This SCE is submitted and <strong>pending review</strong>";
                            utils.dialog.showDialog($scope.dialogOption, function () {
                                $state.go(constants.state.scelist);
                            });
                            break;
                    }
                }, function (error) {
                    $scope.inProgress = false;
                    $rootScope.isLoading = false;

                    $scope.dialogOption.title = "Update SCE";
                    $scope.dialogOption.content = error.message;
                    utils.dialog.showDialog($scope.dialogOption);
                });
            } else {
                $scope.inProgress = false;
                $rootScope.isLoading = false;
            }
        } catch (err) {
            utils.error.showErrorGet(err);
            $scope.inProgress = false;
            $rootScope.isLoading = false;
        }
    };

    //#endregion

    //#region Review form

    $scope.reviewModel = {
        comment: "",
        consequences: "",
        precautionsByOperations: "",
        isTempOperatingProcedureRequired: true,
        isDetailRARequired: true,
        isSpecialSIRequired: true,
        endorser: "",
        approver: "",
        action: "",
        isRequireUpdate: "",
        listFileIdUpload: [],
        listFileIdDelete: []
    };

    // Define template for list file selected
    $scope.uploadFileListTemplate = kendo.template("<span class='k-progress'></span>" +
        "<div class='file-wrapper'>" +
        "<span class='file-icon #=files[0].extension.slice(1).toLowerCase()#'></span>" +
        "<h4 class='file-heading file-name-heading'>#=name#</h4>" +
        "<strong class=\"k-upload-status\">" +
        "<button type='button' class='k-upload-action'></button>" +
        "</strong>" +
        "</div>");

    var promises = [];
    var isSuccess = false;

    // Get array of file identifier uploaded
    $scope.onUploadSuccess = function (e) {
        if (e.operation === "upload") {
            $scope.reviewModel.listFileIdUpload = $scope.reviewModel.listFileIdUpload.concat(e.response.result);
            isSuccess = true;
        }
    }

    $scope.onComplete = function () {
        if (isSuccess) {
            this.deferred.resolve();
        } else {
            this.deferred.reject();
        }
    }

    $scope.uploadTemporayUrl = sceServices.buildUploadUrl($stateParams.sceId, constants.uploadGroupKey.temporay);
    $scope.uploadSwiftUrl = sceServices.buildUploadUrl($stateParams.sceId, constants.uploadGroupKey.swift);
    $scope.uploadSpecialUrl = sceServices.buildUploadUrl($stateParams.sceId, constants.uploadGroupKey.specialStandingInstruction);

    // Handler event switch change
    $scope.onSwitchChange = function (e) {
        e.preventDefault();
        if (!e.checked) {
            var groupKey = $(e.sender.element[0]).data("group");

            _.each($scope.fileModel, function (file) {
                if (file.groupKey.toLowerCase() === groupKey) {
                    if (!_.contains($scope.reviewModel.listFileIdDelete, file.fileId)) {
                        $scope.reviewModel.listFileIdDelete.push(file.fileId);
                    }
                }
            });

            $scope.tempUpload = $("#temporayUpload").data("kendoUpload");
            $scope.swiftUpload = $("#swiftUpload").data("kendoUpload");
            $scope.specialUpload = $("#specialUpload").data("kendoUpload");
            switch (groupKey) {
                case 'temporay':
                    $scope.tempUpload.removeAllFiles();
                    break;
                case 'swift':
                    $scope.swiftUpload.removeAllFiles();
                    break;
                case 'special':
                    $scope.specialUpload.removeAllFiles();
                    break;
                default:
            }
        }
    }

    $scope.onSwitchUpdateChange = function (e) {
        e.preventDefault();
        if (!e.checked) {
            var groupKey = $(e.sender.element[0]).data("group");

            _.each($scope.fileModel, function (file) {
                if (file.groupKey.toLowerCase() === groupKey) {
                    $scope.reviewModel.listFileIdDelete.push(file.fileId);
                }
            });

            $scope.tempUpload = $("#temporayUploadUpdate").data("kendoUpload");
            $scope.swiftUpload = $("#swiftUploadUpdate").data("kendoUpload");
            $scope.specialUpload = $("#specialUploadUpdate").data("kendoUpload");
            switch (groupKey) {
                case 'temporay':
                    $scope.tempUpload.removeAllFiles();
                    break;
                case 'swift':
                    $scope.swiftUpload.removeAllFiles();
                    break;
                case 'special':
                    $scope.specialUpload.removeAllFiles();
                    break;
                default:
            }
        }
    };

    $scope.removeUploadedFile = function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        $scope.reviewModel.listFileIdDelete.push($(e.currentTarget).data("identifier"));
        $scope.fileModel = _.filter($scope.fileModel, function (file) {
            return file.fileId !== $(e.currentTarget).data("identifier");
        });
        $(e.currentTarget).closest("li").hide();
    }

    $scope.rejectComment = "";
    $scope.approveComment = "";

    var uploadAction = function (isUpdateAction) {
        if (!isUpdateAction) {
            // Define upload control for each group
            $scope.tempUpload = $("#temporayUpload").data("kendoUpload");
            $scope.swiftUpload = $("#swiftUpload").data("kendoUpload");
            $scope.specialUpload = $("#specialUpload").data("kendoUpload");
        } else {
            // Define upload control for each group
            $scope.tempUpload = $("#temporayUploadUpdate").data("kendoUpload");
            $scope.swiftUpload = $("#swiftUploadUpdate").data("kendoUpload");
            $scope.specialUpload = $("#specialUploadUpdate").data("kendoUpload");
        }

        // upload file
        var uploadFiles = [];
        var totalFilesSize = 0;

        uploadFiles = uploadFiles.concat($scope.tempUpload.getFiles());
        uploadFiles = uploadFiles.concat($scope.swiftUpload.getFiles());
        uploadFiles = uploadFiles.concat($scope.specialUpload.getFiles());

        if (uploadFiles.length > 15) {
            $rootScope.isLoading = false;

            $scope.dialogOption.title = "Files upload";
            $scope.dialogOption.content = "Total number of file upload cannot be more than <strong>15 files</strong>.";
            utils.dialog.showDialog($scope.dialogOption);
            return false;
        }

        _.each(uploadFiles, function (file) {
            totalFilesSize += file.size;
        });

        if (totalFilesSize > 15728640) {
            $rootScope.isLoading = false;

            $scope.dialogOption.title = "Files upload";
            $scope.dialogOption.content = "Total upload file size cannot be more than <strong> 15 megabyte</strong>.";
            utils.dialog.showDialog($scope.dialogOption);
            return false;
        }

        if ($scope.tempUpload.getFiles().length > 0) {
            $($scope.tempUpload)[0].deferred = $.Deferred();
            promises.push($($scope.tempUpload)[0].deferred.promise());
            $scope.tempUpload.upload();
        }
        if ($scope.swiftUpload.getFiles().length > 0) {
            $($scope.swiftUpload)[0].deferred = $.Deferred();
            promises.push($($scope.swiftUpload)[0].deferred.promise());
            $scope.swiftUpload.upload();
        }
        if ($scope.specialUpload.getFiles().length > 0) {
            $($scope.specialUpload)[0].deferred = $.Deferred();
            promises.push($($scope.specialUpload)[0].deferred.promise());
            $scope.specialUpload.upload();
        }
    }

    var review = function () {

        try {
            if ($scope.userProfile.userProfileId == $scope.sceDetail.reviewer.userProfileId) {
                $scope.reviewModel.isRequireUpdate = $scope.sceDetail.isRequireUpdate;
                if ($scope.reviewModel.action == 'reject') {
                    $scope.reviewModel.consequences = "";
                    $scope.reviewModel.precautionsByOperations = "";
                    $scope.reviewModel.isTempOperatingProcedureRequired = "";
                    $scope.reviewModel.isDetailRARequired = "";
                    $scope.reviewModel.isSpecialSIRequired = "";
                    $scope.reviewModel.endorser = null;
                    $scope.reviewModel.approver = null;
                } else {
                    $scope.reviewModel.endorser = $scope.reviewModel.endorser.userProfileId;
                    $scope.reviewModel.approver = $scope.reviewModel.approver.userProfileId;
                }
                $rootScope.isLoading = true;
                sceServices.reviewSce($stateParams.sceId, $scope.reviewModel).then(function (response) {
                    $rootScope.isLoading = false;
                    switch ($scope.reviewModel.action) {
                        case 'approve':
                            $scope.dialogOption.title = "SCE Reviewed";
                            $scope.dialogOption.content = "This SCE is reviewed and <strong>pending endorsement</strong>";
                            utils.dialog.showDialog($scope.dialogOption, function () {
                                $state.go(constants.state.scelist);
                            });
                            break;
                        case 'reject':
                            $scope.dialogOption.title = "SCE Not Reviewed";
                            $scope.dialogOption.content = "This SCE is not reviewed and <strong>requires update</strong> from the applicant";
                            utils.dialog.showDialog($scope.dialogOption, function () {
                                $state.go(constants.state.scelist);
                            });
                            break;
                        case 'update':
                            $scope.dialogOption.title = "SCE Review Updated";
                            $scope.dialogOption.content = "This SCE Review is saved";
                            utils.dialog.showDialog($scope.dialogOption, function () {
                                $state.go(constants.state.scelist);
                            });
                            break;
                    }
                }, function (error) {
                    $rootScope.isLoading = false;
                    console.log("review not success");
                    switch ($scope.reviewModel.action) {
                        case 'approve':
                            $scope.dialogOption.title = "SCE Review Failed";
                            $scope.dialogOption.content = error.message;
                            utils.dialog.showDialog($scope.dialogOption);
                            break;
                        case 'reject':
                            $scope.dialogOption.title = "SCE Not Reviewed";
                            $scope.dialogOption.content = error.message;
                            utils.dialog.showDialog($scope.dialogOption);
                            break;
                        case 'update':
                            $scope.dialogOption.title = "SCE Save Failed";
                            $scope.dialogOption.content = error.message;
                            utils.dialog.showDialog($scope.dialogOption);
                            break;
                    }
                });

            } else {
                $rootScope.isLoading = false;
                $scope.dialogOption.title = "Access Denied";
                $scope.dialogOption.content = "You don't have any permission to do this action.";
                utils.dialog.showDialog($scope.dialogOption);
            }
        } catch (err) {
            utils.error.showErrorGet(err);
            $rootScope.isLoading = false;
        }
    };

    // Clean up upload control and get list file to delete
    var cleanUploadControl = function (isUpdateAction) {
        if (!isUpdateAction) {
            // Define upload control for each group
            $scope.tempUpload = $("#temporayUpload").data("kendoUpload");
            $scope.swiftUpload = $("#swiftUpload").data("kendoUpload");
            $scope.specialUpload = $("#specialUpload").data("kendoUpload");
        } else {
            // Define upload control for each group
            $scope.tempUpload = $("#temporayUploadUpdate").data("kendoUpload");
            $scope.swiftUpload = $("#swiftUploadUpdate").data("kendoUpload");
            $scope.specialUpload = $("#specialUploadUpdate").data("kendoUpload");
        }

        $scope.tempUpload.removeAllFiles();
        $scope.swiftUpload.removeAllFiles();
        $scope.specialUpload.removeAllFiles();

        $scope.reviewModel.listFileIdDelete.concat($scope.reviewModel.listFileIdUpload);
        // hide loading
        $rootScope.isLoading = false;
    }

    $scope.reviewActions = [{
        text: 'CANCEL'
    },
    {
        text: "APPROVE",
        action: function () {
            // show loading
            $rootScope.isLoading = true;

            $scope.reviewModel.comment = $scope.approveComment;
            $scope.reviewModel.action = 'approve';
            if ($scope.validators.approveReview.validate()) {
                uploadAction(false);
                $.when.apply(null, promises).then(review, cleanUploadControl);
                return true;
            }
            // Returning false will prevent the closing of the dialog
            return false;
        },
        primary: true
    }];

    $scope.updateReviewActions = [
    {
        text: 'CANCEL'
    },
    {
        text: "UPDATE",
        action: function () {
            // show loading
            $rootScope.isLoading = true;

            $scope.reviewModel.comment = $scope.approveComment;
            $scope.reviewModel.action = 'update';
            if ($scope.validators.updateRequireReview.validate()) {
                uploadAction(true);
                $.when.apply(null, promises).then(review, cleanUploadControl);
                return true;
            }
            return false;
        },
        primary: true
    }
    ];

    $scope.rejectActions = [
    {
        text: 'CANCEL'
    },
    {
        text: 'REJECT',
        action: function () {
            $scope.reviewModel.comment = $scope.rejectComment;
            $scope.reviewModel.action = 'reject';
            if ($scope.validators.rejectReview.validate()) {
                review();
                // Returning false will prevent the closing of the dialog
                return true;
            }
            return false;
        },
        primary: true
    }
    ];

    //#endregion

    //#region Cancel SCE

    $scope.cancelSce = function (e) {
        //prevent multi click
        $scope.inProgress = true;
        e.preventDefault();
        e.stopImmediatePropagation();

        try {
            if ($scope.userProfile.userProfileId == $scope.sceDetail.applicant.userProfileId || $scope.isAdmin) {
                $scope.confirmDialog("SCE Cancel", "Are you sure you want to cancel this SCE?").then(function () {
                    // show loading
                    $rootScope.isLoading = true;

                    sceServices.cancelSce($stateParams.sceId).then(function (response) {
                        $scope.inProgress = false;
                        $rootScope.isLoading = false;

                        $scope.dialogOption.title = "SCE Canceled";
                        $scope.dialogOption.content = "SCE form has been canceled successfully";
                        utils.dialog.showDialog($scope.dialogOption, function () {
                            $state.go(constants.state.scelist);
                        });
                    }, function (error) {
                        $scope.inProgress = false;
                        $rootScope.isLoading = false;
                        $scope.dialogOption.title = "SCE Cancel Failed";
                        $scope.dialogOption.content = error.message;
                        utils.dialog.showDialog($scope.dialogOption);
                    });
                }, function () {
                    $scope.inProgress = false;
                });
            } else {
                $scope.inProgress = false;
                $rootScope.isLoading = false;

                $scope.dialogOption.title = "Access Denied";
                $scope.dialogOption.content = "You don't have any permission to do this action.";
                utils.dialog.showDialog($scope.dialogOption);
            }
        }
        catch (err) {
            utils.error.showErrorGet(err);
            $scope.inProgress = false;
            $rootScope.isLoading = false;
        }

        $scope.inProgress = false;
    };

    //#endregion

    //#region Endorse form

    $scope.endorseModel = {
        comment: "",
        precautionsByEndorser: "",
        action: ""
    };

    $scope.endorse = function () {
        // show loading
        $rootScope.isLoading = true;

        try {
            if ($scope.userProfile.userProfileId == $scope.sceDetail.endorser.userProfileId) {
                sceServices.endorseSce($stateParams.sceId, $scope.endorseModel).then(function (response) {
                    $rootScope.isLoading = false;
                    switch ($scope.endorseModel.action) {
                        case 'approve':
                            $scope.dialogOption.title = "SCE Endorsed";
                            $scope.dialogOption.content = "This SCE's Endorsement is approved and <strong>pending approval</strong>.";
                            utils.dialog.showDialog($scope.dialogOption, function () {
                                $state.go(constants.state.scelist);
                            });
                            break;
                        case 'reject':
                            $scope.dialogOption.title = "SCE Not Endorsed";
                            $scope.dialogOption.content = "This SCE is not endorsed and <strong>requires update</strong> from the reviewer";
                            utils.dialog.showDialog($scope.dialogOption, function () {
                                $state.go(constants.state.scelist);
                            });
                            break;
                    }
                }, function (error) {
                    $rootScope.isLoading = false;
                    switch ($scope.endorseModel.action) {
                        case 'approve':
                            $scope.dialogOption.title = "SCE Endorsed";
                            $scope.dialogOption.content = error.message;
                            utils.dialog.showDialog($scope.dialogOption);
                            break;
                        case 'reject':
                            $scope.dialogOption.title = "SCE Not Endorsed";
                            $scope.dialogOption.content = error.message;
                            utils.dialog.showDialog($scope.dialogOption);
                            break;
                    }
                });
            } else {
                $rootScope.isLoading = false;

                $scope.dialogOption.title = "Access Denied";
                $scope.dialogOption.content = "You don't have any permission to do this action.";
                utils.dialog.showDialog($scope.dialogOption);
            }
        }
        catch (err) {
            utils.error.showErrorGet(err);
            $rootScope.isLoading = false;
        }
    };

    $scope.endorseActions = [
    {
        text: 'CANCEL'
    },
    {
        text: 'ENDORSE',
        action: function () {
            $scope.endorseModel.comment = $scope.approveComment;
            $scope.endorseModel.action = 'approve';
            if ($scope.validators.approveEndorse.validate()) {
                $scope.endorse();
                return true;
            }
            return false;
        },
        primary: true
    }
    ];

    $scope.rejectEndorseActions = [
    {
        text: 'CANCEL'
    },
    {
        text: 'REJECT',
        action: function () {
            $scope.endorseModel.comment = $scope.rejectComment;
            $scope.endorseModel.action = 'reject';
            if ($scope.validators.rejectEndorse.validate()) {
                $scope.endorse();
                return true;
            }
            return false;
        },
        primary: true
    }
    ];

    $scope.openFile = function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var fileId = "";
        if ($(e.currentTarget).is("li")) {
            fileId = $(e.currentTarget).attr("id");
        } else {
            fileId = $(e.currentTarget).closest("li").attr("id");
        }

        window.open(sceServices.viewFile($stateParams.sceId, fileId), "_blank");
    }

    //#endregion

    //#region Approve form

    $scope.approveModel = {
        comment: "",
        precautionsByApprover: "",
        action: "",
        isReApprove: false
    };

    $scope.approve = function () {
        // show loading
        $rootScope.isLoading = true;

        try {
            if ($scope.userProfile.userProfileId == $scope.sceDetail.approver.userProfileId) {
                sceServices.approveSce($stateParams.sceId, $scope.approveModel).then(function (response) {
                    $rootScope.isLoading = false;
                    switch ($scope.approveModel.action) {
                        case 'approve':
                            $scope.dialogOption.title = "SCE Approved";
                            $scope.dialogOption.content = "This SCE is approved and <strong>pending acknowledgment</strong>.";
                            utils.dialog.showDialog($scope.dialogOption, function () {
                                $state.go(constants.state.scelist);
                            });
                            break;
                        case 'reject':
                            $scope.dialogOption.title = "SCE Not Approved";
                            $scope.dialogOption.content = "This SCE is not approved and <strong>requires update</strong> from the reviewer";
                            utils.dialog.showDialog($scope.dialogOption, function () {
                                $state.go(constants.state.scelist);
                            });
                            break;
                    }
                }, function (error) {
                    $rootScope.isLoading = false;
                    switch ($scope.approveModel.action) {
                        case 'approve':
                            $scope.dialogOption.title = "SCE Approve Failed";
                            $scope.dialogOption.content = error.message;
                            utils.dialog.showDialog($scope.dialogOption);
                            break;
                        case 'reject':
                            $scope.dialogOption.title = "SCE Reject Failed";
                            $scope.dialogOption.content = error.message;
                            utils.dialog.showDialog($scope.dialogOption);
                            break;
                    }
                });
            } else {
                $rootScope.isLoading = false;
                $scope.dialogOption.title = "Access Denied";
                $scope.dialogOption.content = "You don't have any permission to do this action.";
                utils.dialog.showDialog($scope.dialogOption);
            }
        }
        catch (err) {
            utils.error.showErrorGet(err);
            $rootScope.isLoading = false;
        }
    };

    $scope.approveActions = [
    {
        text: 'CANCEL'
    },
    {
        text: 'APPROVE',
        action: function () {
            $scope.approveModel.comment = $scope.approveComment;
            $scope.approveModel.action = 'approve';
            if ($scope.validators.approve.validate()) {
                $scope.approve();
                return true;
            }
            // Returning false will prevent the closing of the dialog
            return false;
        },
        primary: true
    }
    ];

    $scope.rejectApproveActions = [
    {
        text: 'CANCEL'
    },
    {
        text: 'REJECT',
        action: function () {
            $scope.approveModel.comment = $scope.rejectComment;
            $scope.approveModel.action = 'reject';
            if ($scope.validators.rejectApprove.validate()) {
                $scope.approve();
                return true;
            }
            return false;
        },
        primary: true
    }
    ];


    //#endregion

    //#region Acknowledge form

    $scope.acknowledgeActions = [
    {
        text: 'CANCEL'
    },
    {
        text: 'ACKNOWLEDGE',
        action: function () {
            // show loading
            $rootScope.isLoading = true;

            try {
                sceServices.acknowledgeSce($stateParams.sceId, { isReAcknowledge: false }).then(function (response) {
                    $rootScope.isLoading = false;

                    $scope.dialogOption.title = "SCE Acknowledged";
                    $scope.dialogOption.content = "This SCE is acknowledged and <strong>live</strong>.";
                    utils.dialog.showDialog($scope.dialogOption, function () {
                        $rootScope.goToMyPendingAction = true;
                        $state.go(constants.state.scelist);
                    });
                }, function (error) {
                    $rootScope.isLoading = false;

                    $scope.dialogOption.title = "SCE Acknowledge Failed.";
                    $scope.dialogOption.content = error.message;
                    utils.dialog.showDialog($scope.dialogOption);
                });
                // Returning false will prevent the closing of the dialog
                return true;
            }
            catch (err) {
                utils.error.showErrorGet(err);
                $rootScope.isLoading = false;
            }
        },
        primary: true
    }
    ];

    //#endregion

    //#region live add ptw form

    $scope.addNewPTWModel = {
        ptwNo: "",
        IsNormalize: false
    };

    $scope.EditPTWModel = {
        ptwId: "",
        ptwNo: ""
    };

    $scope.DeletePTWModel = {
        ptwId: ""
    };

    $scope.normalizedPTW = "";

    $scope.ptwActions = {
        dataSource: {
            transport: {
                read: function (options) {
                    sceServices.GetPTWListing($stateParams.sceId).then(function (response) {
                        if (response.data != null) {
                            var list = [];
                            for (i = 0; i < response.data.length; i++) {
                                if (!response.data[i].isNormalized) {
                                    list.push(response.data[i]);
                                } else {
                                    $scope.normalizedPTW = {
                                        normalizedBy: response.data[i].byPassedBy,
                                        profileId: response.data[i].byPassByProfileId,
                                        image: response.data[i].image,
                                        normalizedDateTime: response.data[i].time,
                                        ptwNo: response.data[i].ptwNo
                                    };
                                }
                            }
                            options.success(list);
                        } else {
                            options.success([]);
                        }
                    }, function (error) {
                        options.error([]);
                        utils.error.showErrorGet(error);
                    });
                },
                update: function (options) {
                    $scope.EditPTWModel.ptwId = options.data.models[0].sceptwId;
                    $scope.EditPTWModel.ptwNo = options.data.models[0].ptwNo;
                    sceServices.UpdatePTW($stateParams.sceId, $scope.EditPTWModel).then(function (response) {
                        options.data.sceptwId = response.data.sceptwId;
                        options.data.ptwNo = response.data.ptwNo;
                        options.data.byPassedBy = response.data.byPassedBy;
                        options.data.time = response.data.time;
                        options.data.isEditable = true;
                        options.success(options.data);
                    }, function (error) {
                        options.error([]);
                        $scope.dialogOption.title = "Update PTW Failed.";
                        $scope.dialogOption.content = error.message;
                        utils.dialog.showDialog($scope.dialogOption);
                    });
                },
                destroy: function (options) {
                    $scope.DeletePTWModel.ptwId = options.data.models[0].sceptwId;
                    sceServices.DeletePTW($stateParams.sceId, $scope.DeletePTWModel).then(function (response) {
                        options.success();
                    }, function (error) {
                        options.error([]);
                        $scope.dialogOption.title = "Destroy PTW Failed.";
                        $scope.dialogOption.content = error.message;
                        utils.dialog.showDialog($scope.dialogOption);
                    });
                },
                create: function (options) {
                    $scope.addNewPTWModel.ptwNo = options.data.models[0].ptwNo;
                    sceServices.AddNewPTW($stateParams.sceId, $scope.addNewPTWModel).then(function (response) {
                        options.data.sceptwId = response.data.sceptwId;
                        options.data.ptwNo = response.data.ptwNo;
                        options.data.byPassedBy = response.data.byPassedBy;
                        options.data.time = response.data.time;
                        options.data.isEditable = true;
                        if ($("#ptwGrid").data("kendoGrid").dataSource.data().length > 1) {
                            $("#ptwGrid").data("kendoGrid").dataSource.data()[1].isEditable = false;
                        }
                        options.success(options.data);
                    }, function (error) {
                        options.error([]);
                        $scope.dialogOption.title = "Create PTW Failed.";
                        $scope.dialogOption.content = error.message;
                        utils.dialog.showDialog($scope.dialogOption);
                    });
                },
                parameterMap: function (options, operation) {
                    if (operation !== "read" && options.models) {
                        return {
                            models: kendo.stringify(options.models)
                        };
                    }
                }
            },
            batch: true,
            pageSize: 20,
            schema: {
                model: {
                    id: "sceptwId",
                    fields: {
                        sceptwId: {
                            editable: false, nullable: false
                        },
                        ptwNo: {
                            validation: {
                                required: {
                                    message: "PTW# is required"
                                }
                            }
                        },
                        byPassedBy: {
                            editable: false, nullable: false
                        },
                        time: {
                            editable: false, nullable: true, type: "date"
                        },
                        isEditable: {
                            type: "boolean"
                        }
                    }
                }
            }
        },
        scrollable: false,
        sortable: false,
        pageable: false,
        columns: [
        {
            field: "ptwNo",
            title: "PTW #",
            width: "200px"
        },
        {
            field: "byPassedBy", title: "Bypassed By",
            template: function (dataItem) {
                return "<a href='/profile/" + dataItem.byPassByProfileId + "'><strong>" + dataItem.byPassedBy + "</strong></a>";
            }
        },
        {
            field: "time", title: "Time", format: "{0:dd MMM yyyy at h:mm tt}"
        },
        {
            command: [
            {
                name: "edit", text: {
                    edit: "Edit", update: "Add", cancel: "Cancel"
                }
            },
            {
                name: "Delete",
                click: function (e) {
                    e.preventDefault();
                    var tr = $(e.target).closest("tr");
                    var data = this.dataItem(tr);
                    $scope.confirmDialog("Delete PTW number", "Please confirm that you want to delete PTW number").then(function () {
                        $("#ptwGrid").data("kendoGrid").dataSource.remove(data);
                        $("#ptwGrid").data("kendoGrid").dataSource.sync();
                    }, function () { });
                }
            }
            ], title: "&nbsp;"
        }
        ],
        toolbar: [{ name: "create", text: "Add New PTW#" }],
        editable: "inline",
        dataBound: function () {
            $('#ptwGrid').find("tr[role='row']").each(function (index, item) {
                var currentDataItem = $("#ptwGrid").data("kendoGrid").dataItem($(this).closest("tr"));
                if (currentDataItem !== null && currentDataItem !== undefined) {
                    if (currentDataItem.isEditable == false || index > 1) {
                        $(item).find(".k-grid-edit").hide();
                        $(item).find(".k-grid-Delete").hide();
                    }
                }
            });
        }
    };

    //#endregion

    //#region Transfer re-approve
    $scope.showTransferReApproverDialog = function () {
        $scope.transferReApproverDialog.center();
        $scope.transferReApproverDialog.open();
    };

    //#endregion
    //#region Re-Approve
    //$scope.selectionReApproveActions = [
    //{
    //    text: 'NO',
    //    action: function () {
    //        $scope.showReApproveDialog();
    //    }
    //},
    //{
    //    text: 'YES',
    //    action: function () {
    //        $scope.showReApproveWithNewApproverDialog();
    //    },
    //    primary: true
    //}
    //];

    //$scope.showReApproveDialog = function () {
    //    $scope.reApproveDialog.center();
    //    $scope.reApproveDialog.open();
    //};

    //$scope.showReApproveWithNewApproverDialog = function () {
    //    $scope.reApproveWithNewApproverDialog.center();
    //    $scope.reApproveWithNewApproverDialog.open();
    //};

    $scope.reApprovalComment = "";

    $scope.transferReApproverAction = [
    {
        text: 'CANCEL'
    },
    {
        text: 'Transfer',
        action: function () {
            if ($scope.validators.transferReApprover.validate()) {
                $scope.reApprovalWithNewApproverClick();
                return true;
            }
            return false;
        },
        primary: true
    }];
   // $scope.reApproveActions = [
   //{
   //    text: 'CANCEL'
   //},
   //{
   //    text: 'RE-APPROVE',
   //    action: function () {
   //        $scope.reApprovalClick();
   //        return true;
   //    },
   //    primary: true
   //}];

    $scope.transferReApproverClick = function () {
        $scope.approverProfileId = $scope.approverToTransfer.userProfileId;
        // show loading
        $rootScope.isLoading = true;

        try {
            if (($scope.userProfile.userProfileId == $scope.sceDetail.approver.userProfileId) || ($scope.userProfile.userProfileId == $scope.sceDetail.reApprover.userProfileId)) {
                sceServices.approverTransfer($stateParams.sceId, { newApprover: $scope.approverProfileId, comment: $scope.reApprovalComment }).then(function (response) {
                    $rootScope.isLoading = false;
                    $scope.reApproveResult.center();
                    $scope.reApproveResult.open();
                }, function (error) {
                    $rootScope.isLoading = false;
                    $scope.dialogOption.title = "SCE Re-Approve Transfer Failed";
                    $scope.dialogOption.content = "Cannot Transfer Re-Approver";
                    utils.dialog.showDialog($scope.dialogOption);
                });
            } else {
                $rootScope.isLoading = false;
                $scope.dialogOption.title = "Access Denied";
                $scope.dialogOption.content = "You don't have any permission to do this action.";
                utils.dialog.showDialog($scope.dialogOption);
            }
        }
        catch (err) {
            utils.error.showErrorGet(err);
            $rootScope.isLoading = false;
        }
    }

    //$scope.reApprovalClick = function () {
    //    // show loading
    //    $rootScope.isLoading = true;

    //    try {
    //        if (($scope.userProfile.userProfileId == $scope.sceDetail.approver.userProfileId) || ($scope.userProfile.userProfileId == $scope.sceDetail.reApprover.userProfileId)) {
    //            sceServices.approveSce($stateParams.sceId, { comment: $scope.reApprovalComment, precautionsByApprover: "", action: "approve", isReApprove: true }).then(function (response) {
    //                $rootScope.isLoading = false;
    //                $scope.dialogOption.title = "SCE Re-Approve";
    //                $scope.dialogOption.content = "This SCE is re-approved.";
    //                utils.dialog.showDialog($scope.dialogOption, function () {
    //                    $rootScope.goToMyPendingAction = true;
    //                    $state.go(constants.state.scelist);
    //                });
    //            }, function (error) {
    //                $rootScope.isLoading = false;
    //                $scope.dialogOption.title = "SCE Re-Approve Failed";
    //                $scope.dialogOption.content = "This SCE is approve failed.";
    //                utils.dialog.showDialog($scope.dialogOption);
    //            });
    //        } else {
    //            $rootScope.isLoading = false;
    //            $scope.dialogOption.title = "Access Denied";
    //            $scope.dialogOption.content = "You don't have any permission to do this action.";
    //            utils.dialog.showDialog($scope.dialogOption);
    //        }

    //    }
    //    catch (err) {
    //        utils.error.showErrorGet(err);
    //        $rootScope.isLoading = false;
    //    }
    //};
    //$scope.reApprovalWithNewApproverClick = function () {
    //    $scope.approverProfileId = $scope.approverToTransfer.userProfileId;
    //    // show loading
    //    $rootScope.isLoading = true;

    //    try {
    //        if (($scope.userProfile.userProfileId == $scope.sceDetail.approver.userProfileId) || ($scope.userProfile.userProfileId == $scope.sceDetail.reApprover.userProfileId)) {
    //            sceServices.approveSce($stateParams.sceId, { comment: $scope.reApprovalComment, precautionsByApprover: "", action: "approve", isReApprove: true, approverProfileId: $scope.approverProfileId }).then(function (response) {
    //                $rootScope.isLoading = false;
    //                $scope.reApproveResult.center();
    //                $scope.reApproveResult.open();
    //            }, function (error) {
    //                $rootScope.isLoading = false;
    //                $scope.dialogOption.title = "SCE Re-Approve Failed";
    //                $scope.dialogOption.content = "This SCE is approve failed.";
    //                utils.dialog.showDialog($scope.dialogOption);
    //            });
    //        } else {
    //            $rootScope.isLoading = false;
    //            $scope.dialogOption.title = "Access Denied";
    //            $scope.dialogOption.content = "You don't have any permission to do this action.";
    //            utils.dialog.showDialog($scope.dialogOption);
    //        }
    //    }
    //    catch (err) {
    //        utils.error.showErrorGet(err);
    //        $rootScope.isLoading = false;
    //    }
    //};

    $scope.transferReApproveResultActions = [{
        text: 'CLOSE',
        action: function () {
            $rootScope.goToMyPendingAction = true;
            $state.go(constants.state.scelist);
        }
    }];


    //#endregion

    //#region Re-Acknowledge

    $scope.reAcknowledgeActions = [{
        text: 'CANCEL'
    },
    {
        text: 'RE-ACKNOWLEDGE',
        action: function () {
            // show loading
            $rootScope.isLoading = true;

            try {
                if ($scope.sceDetail.currentUserRole == "5") {
                    sceServices.acknowledgeSce($stateParams.sceId, { isReAcknowledge: true }).then(function (response) {
                        $rootScope.isLoading = false;
                        $scope.dialogOption.title = "SCE Re-Acknowledged";
                        $scope.dialogOption.content = "This SCE is <strong>re-acknowledged</strong> for Shift " + $scope.newestShiftNumber + ": " + $scope.newestShift + ".";
                        utils.dialog.showDialog($scope.dialogOption, function () {
                            $rootScope.goToMyPendingAction = true;
                            $state.go(constants.state.scelist);
                        });
                    }, function (error) {
                        $rootScope.isLoading = false;
                        $scope.dialogOption.title = "SCE Re-Acknowledge Failed.";
                        $scope.dialogOption.content = error.message;
                        utils.dialog.showDialog($scope.dialogOption);
                    });
                } else {
                    $rootScope.isLoading = false;
                    $scope.dialogOption.title = "Access Denied.";
                    $scope.dialogOption.content = "You don't have any permission to do this action.";
                    utils.dialog.showDialog($scope.dialogOption);
                }

                // Returning false will prevent the closing of the dialog
                return true;
            }
            catch (err) {
                utils.error.showErrorGet(err);
                $rootScope.isLoading = false;
            }
        },
        primary: true
    }];

    //#endregion

    //#region Normalize

    $scope.normalizeModel = {
        ptwNo: ""
    };

    $scope.normalizeActions = [
    {
        text: 'CANCEL'
    },
    {
        text: 'CONFIRM',
        action: function () {
            // show loading
            $rootScope.isLoading = true;

            try {
                if ($scope.validators.normalize.validate()) {
                    sceServices.normalizeSce($stateParams.sceId, $scope.normalizeModel).then(function (response) {
                        $rootScope.isLoading = false;
                        $scope.dialogOption.title = "SCE Normalized";
                        $scope.dialogOption.content = "This SCE is now <strong>Normalized and closed.</strong>";
                        utils.dialog.showDialog($scope.dialogOption, function () {
                            $state.go(constants.state.scelist);
                        });
                    }, function (error) {
                        $rootScope.isLoading = false;
                        $scope.dialogOption.title = "SCE Normalized Failed.";
                        $scope.dialogOption.content = error.message;
                        utils.dialog.showDialog($scope.dialogOption);
                    });
                    return true;
                } else {
                    $rootScope.isLoading = false;
                }
                return false;
            }
            catch (err) {
                utils.error.showErrorGet(err);
                $rootScope.isLoading = false;
            }
        },
        primary: true
    }
    ];
    //$sce.validatePTWActions = [{text:'CLOSE'}];

    //#endregion normalize

    $scope.pendingReview = false;
    $scope.pendingEndorse = false;
    $scope.pendingApprove = false;

    $scope.applicantIsTransfered = false;
    $scope.reviewerIsTransfered = false;
    $scope.endorserIsTransfered = false;
    $scope.approverIsTransfered = false;

    $scope.applicantToTransfer = {
    };

    $scope.applicantSearchText2 = "";

    $scope.applicantsOptions = {
        autoBind: false,
        optionLabel: "Select Applicant",
        filter: "contains",
        filtering: function (e) {
            $scope.applicantSearchText2 = e.filter == null ? "" : e.filter.value;
        },
        dataSource: $scope.applicantDataSource,
        dataTextField: "userName",
        dataValueField: "userProfileId",
        valueTemplate: function (dataItem) {
            if (!dataItem.hasOwnProperty('image')) {
                dataItem.image = $scope.applicantToTransfer.image;
            }
            return '<span class="selected-value" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span><span>{{dataItem.userName}}</span>';
        },
        template: '<div class="custom-dropdown"><span class="k-state-default" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span>' +
'<span class="k-state-default"><h3>{{dataItem.userName}}</h3></span></div>'
    };

    $scope.applicantDataSource = {
        serverFiltering: true,
        transport: {
            read: function (options) {
                sceServices.getApplicantsForTransferInSameAreas($stateParams.sceId, $scope.applicantSearchText2).then(function (response) {
                    if (response.data != null) {
                        options.success(response.data);
                    } else {
                        options.success([]);
                    }
                }, function (err) {
                    options.error([]);
                    utils.error.showErrorGet(err);
                });
            }
        }
    };

    $scope.showTransferRolesKendoDiaglog = function () {
        $scope.applicantToTransfer = $scope.sceDetail.applicant;
        $scope.reviewerToTransfer = $scope.sceDetail.reviewer;
        $scope.endorserToTransfer = $scope.sceDetail.endorser;
        $scope.approverToTransfer = $scope.sceDetail.approver;
        $("#sceTransferRoles").data("kendoDialog").open();
    };

    $scope.transferResultActions = [{
        text: 'CLOSE',
        action: function () {
            $state.go(constants.state.scelist);
        }
    }];

    $scope.transferRolesModel = {
    };

    $scope.adminComment = "";

    $scope.sceTransferRoles = [
    {
        text: 'CANCEL'
    },
    {
        text: 'CONFIRM',
        action: function () {
            if ($scope.validators.sceTransfer.validate()) {
                $rootScope.isLoading = true;
                $scope.transferRolesModel = {
                    applicantProfileId: ($scope.applicantToTransfer.userProfileId === null || $scope.applicantToTransfer.userProfileId === undefined || $scope.applicantToTransfer.userProfileId === "" || $scope.applicantToTransfer.userProfileId === undefined) ? null : $scope.applicantToTransfer.userProfileId,
                    reviewerProfileId: ($scope.pendingReview && $scope.reviewerToTransfer.userProfileId !== $scope.sceDetail.reviewer.userProfileId && $scope.reviewerToTransfer.userProfileId !== "") ? $scope.reviewerToTransfer.userProfileId : null,
                    endorserProfileId: ($scope.pendingEndorse && $scope.endorserToTransfer.userProfileId !== $scope.sceDetail.endorser.userProfileId && $scope.endorserToTransfer.userProfileId !== "") ? $scope.endorserToTransfer.userProfileId : null,
                    approverProfileId: ($scope.pendingApprove && $scope.approverToTransfer.userProfileId !== $scope.sceDetail.approver.userProfileId && $scope.approverToTransfer.userProfileId !== "") ? $scope.approverToTransfer.userProfileId : null,
                    comment: $scope.adminComment
                };
                if (($scope.transferRolesModel.applicantProfileId === null || $scope.transferRolesModel.applicantProfileId === undefined) && ($scope.transferRolesModel.reviewerProfileId === null || $scope.transferRolesModel.reviewerProfileId === undefined) && ($scope.transferRolesModel.endorserProfileId === null || $scope.transferRolesModel.endorserProfileId === undefined) && ($scope.transferRolesModel.approverProfileId === null || $scope.transferRolesModel.approverProfileId === undefined)) {
                    $rootScope.isLoading = false;
                    return true;
                }

                sceServices.transferRoles($stateParams.sceId, $scope.transferRolesModel).then(function (response) {
                    if ($scope.transferRolesModel.applicantProfileId != null && $scope.transferRolesModel.applicantProfileId != $scope.sceDetail.applicant.userProfileId) {
                        $scope.applicantIsTransfered = true;
                    }
                    if ($scope.transferRolesModel.reviewerProfileId != null && $scope.transferRolesModel.reviewerProfileId != $scope.sceDetail.reviewer.userProfileId) {
                        $scope.reviewerIsTransfered = true;
                    }
                    if ($scope.transferRolesModel.endorserProfileId != null && $scope.transferRolesModel.endorserProfileId != $scope.sceDetail.endorser.userProfileId) {
                        $scope.endorserIsTransfered = true;
                    }
                    if ($scope.transferRolesModel.approverProfileId != null && $scope.transferRolesModel.approverProfileId != $scope.sceDetail.approver.userProfileId) {
                        $scope.approverIsTransfered = true;
                    }
                    $rootScope.isLoading = false;
                    if ($scope.applicantIsTransfered || $scope.reviewerIsTransfered || $scope.endorserIsTransfered || $scope.approverIsTransfered) {
                        $("#transferResultForm").data("kendoDialog").open();
                    } else {
                        return true;
                    }
                }, function (err) {
                    $rootScope.isLoading = false;
                    $scope.dialogOption.title = "SCE Roles transferred failed.";
                    $scope.dialogOption.content = err.message;
                    utils.dialog.showDialog($scope.dialogOption);
                });

                return true;
            }
            return false;
        },
        primary: true
    }
    ];

    $scope.confirmDialog = function (title, content) {
        return $("<div></div>").kendoConfirm({
            title: title,
            content: content
        }).data("kendoConfirm").open().result;
    };

}]);