app.controller('raListController', ['$rootScope', '$state', '$scope', '$stateParams', '$location', '$timeout', 'authService', 'appSettings', 'raServices', 'statusService', 'areaService', 'riskService', 'constants',
function ($rootScope, $state, $scope, $stateParams, $location, $timeout, authService, appSettings, raServices, statusService, areaService, riskService, constants) {
    var isProcessTriggerClick = true;

    $scope.userProfile = $rootScope.$app.userProfile;

    $scope.isAdmin = $scope.userProfile.isAdmin;

    $scope.hasApplicantRole = ("," + $rootScope.$app.userProfile.rolesKeyString + ",").indexOf(",1,") >= 0;

    $rootScope.$app.title = constants.titlePage.raListing;
    var indexTab = 0;
    $scope.hide_item = "hide-item";

    $scope.totalMyRaListing = {
        totalMyRa: 0,
        totalPendingMyAction: 0
    };
    $scope.model = {
        view: "All",
        tagNo: "",
        status: "",
        filter: [{
            field: "",
            valueString: "",
            valueDateTimeFrom: "",
            valueDateTimeTo: "",
            valueDecimalFrom: "",
            valueDecimalTo: "",
            valueBit: "",
            isActive: false
        }],
        sort: [{
            field: "",
            asc: false,
            isActive: ""
        }],
        skip: 0,
        take: 0,
        isExport: false
    };

    onLoad = function () {
        // check bigModule
        $rootScope.bigModuleTitle = "Safety Critical Equipment (SCE)";

        // end check
        raServices.getTotalMyRaListing().then(function (response) {
            $scope.totalMyRaListing = {
                totalMyRa: response.data.totalMyRa,
                totalPendingMyAction: response.data.totalPendingMyAction
            };
        }, function (error) {
            utils.error.showErrorGet(error);
        });
    };
    onLoad();

    $scope.searchByTagNo = function (keyEvent) {
        if (keyEvent.which === 13)
            $scope.searchByTagNoClick();
    };

    $scope.searchByTagNoClick = function () {
        $scope.onChangeTab(indexTab);
    };

    $scope.defaultView = "All";

    $scope.resetModel = function () {
        $scope.model.view = "";
        $scope.model.status = "";
        $scope.model.filter = [];
        $scope.model.sort = [];
        $scope.model.skip = "";
        $scope.model.take = "";
        $scope.model.isExport = "";
    };

    $scope.areasDataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                areaService.getAllAreaIsActive().then(function (response) {
                    if (response.data !== null && response.data !== undefined) {
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
    });

    $scope.riskLevelDataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                riskService.getAllRiskLevel().then(function (response) {
                    if (response.data !== null && response.data !== undefined) {
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
    });

    $scope.statusDataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                statusService.getListStatusOfRa().then(function (response) {
                    if (response.data !== null && response.data !== undefined) {
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
    });

    $scope.initData = function (options) {
        kendo.ui.progress($('.ra-listing'), false);
        $scope.resetModel();
        var optionfilters = [];
        var filters = [
            {
                field: "applicationDate",
                valueDateTimeFrom: null,
                valueDateTimeTo: null,
                isActive: false
            },
            {
                field: "riskLevel",
                valueString: "",
                isActive: false
            },
            {
                field: "area",
                valueString: "",
                isActive: false
            },
            {
                field: "status",
                valueString: "",
                isActive: false
            },
            {
                field: "lapse",
                ValueDecimalFrom: null,
                isActive: false
            }
        ];
        if (options.data.filter !== null && options.data.filter !== undefined) {

            _.each(options.data.filter.filters, function (o) {
                var listFilterOut = [];
                utils.getfilter(o, listFilterOut);
                Array.prototype.push.apply(optionfilters, listFilterOut);
            });

            if (optionfilters !== null && optionfilters !== undefined) {
                _.each(optionfilters, function (m) {
                    var date = null;
                    switch (m.field) {
                        case "applicationDate":
                            if (m.operator === "gte") {
                                date = $.format.toBrowserTimeZone(m.value, constants.format.date.default);
                                filters[0].valueDateTimeFrom = date;
                                filters[0].isActive = true;
                            }
                            else {
                                date = $.format.toBrowserTimeZone(m.value, constants.format.date.default);
                                filters[0].valueDateTimeTo = date;
                                filters[0].isActive = true;
                            }
                            break;

                        case "riskLevel":
                            filters[1].valueString = filters[1].valueString + "," + m.value;
                            filters[1].isActive = true;
                            break;

                        case "area":
                            filters[2].valueString = filters[2].valueString + "," + m.value;
                            filters[2].isActive = true;
                            break;

                        case "status":
                            filters[3].valueString = filters[3].valueString + "," + m.value;
                            filters[3].isActive = true;
                            break;
                        case "lapse":
                            filters[4].ValueDecimalFrom = m.value;
                            filters[4].isActive = true;
                            break;
                        default:
                            var filterModel = {
                                field: m.field,
                                valueString: m.value,
                                isActive: true
                            };
                            filters.push(filterModel);
                            break;
                    }
                });
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
        $scope.model.view = $scope.defaultView;
        $scope.model.take = options.data.take;
        $scope.model.skip = (options.data.page - 1) * options.data.pageSize;
    };

    $rootScope.isLoading = true;
    $scope.isCalling = true;
    $scope.isFilter = 0;
    $scope.needToCallServer = 0;

    $scope.mainGridOptions = {
        dataSource: {
            transport: {
                read: function (options) {
                    if ($scope.isCalling) {
                        $rootScope.isLoading = true;

                        $scope.initData(options);

                        var isPreFilter = $rootScope.filterByArea !== null && $rootScope.filterByArea !== undefined && $rootScope.filterByArea.length > 0;

                        $scope.needToCallServer++;

                        if (isPreFilter && $scope.isFilter === 0) {
                            var ds = $(".ra-listing").data("kendoGrid").dataSource;
                            var currentFilter = [];
                            currentFilter.push({ field: "status", operator: "eq", value: $rootScope.filterByStatus });
                            _.each($rootScope.filterByArea, function (m) {
                                currentFilter.push({ field: "area", operator: "eq", value: m });
                            });
                            $scope.isFilter++;
                            ds.filter(currentFilter);
                        }

                        if (!isPreFilter || isPreFilter && $scope.needToCallServer === 2) {
                            raServices.getRaListing($scope.model).then(function (response) {
                                if (response.data !== null && response.data !== undefined) {
                                    options.success(response.data);

                                } else {
                                    options.success([]);
                                }

                                // reset value
                                $rootScope.filterByArea = null;
                                $rootScope.filterByStatus = '';
                                $rootScope.isLoading = false;
                            }, function (error) {
                                options.error([]);
                                utils.error.showErrorGet(error);
                                // reset value
                                $rootScope.filterByArea = null;
                                $rootScope.filterByStatus = '';

                                $rootScope.isLoading = false;
                            });
                        }
                        else {
                            options.success([]);
                            $('.ra-listing .k-grid-norecords-template').hide();
                        }
                    } else {
                        options.success([]);
                        $('.ra-listing .k-grid-norecords-template').hide();
                    }
                }
            },
            schema: {
                model: {
                    fields: {
                        area: { type: "string" },
                        tagNo: { type: "string" },
                        RaNo: { type: "string" },
                        reason: { type: "string" },
                        riskLevel: { type: "string" },
                        applicationDate: { type: "date" },
                        lapse: { type: "number", validation: { required: true, min: 0 } },
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
        },
        scrollable: false,
        sortable: {
            mode: "multiple",
            allowUnsort: true
        },
        pageable: {
            pageSizes: true,
            buttonCount: 5
        },
        filterable: {
            extra: true,
            operators: {
                date: {
                    gte: "Start Date",
                    lte: "End Date"
                },
                string: {
                    operator: "contains"
                },
                number: {
                    operator: "eq"
                }
            }
        },
        filterMenuInit: function (e) {
            utils.filterMenuInit(e);
        },
        columns: [{
            field: "area",
            title: "Area",
            width: "70px",
            attributes: {
                "class": "cell_area"
            },
            filterable: {
                multi: true,
                dataSource: $scope.areasDataSource,
                itemTemplate: function (e) {
                    if (e.field === "all") {
                        return "<li class=\"select_all\"><label><input type='checkbox' /> <span>#= all#</span></label></li>";
                    } else {
                        return "<li><label><input type='checkbox' name='" + e.field + "' value='#=data.lookupAreaId#'/> <span>#= data.description #</span></label></li>";
                    }
                }
            }
        }, {
            field: "tagNo",
            title: "Tag No.",
            width: "93px",
            attributes: {
                "class": "cell_tag_no"
            },
            filterable: {
                extra: false
            }
        }, {
            field: "raNo",
            title: "RA No.",
            width: "200px",
            attributes: {
                "class": "cell_ra_no"
            },
            filterable: {
                extra: false
            }
        }, {
            field: "reason",
            title: "Reason",
            filterable: {
                extra: false
            },
            attributes: {
                "class": "cell_reason"
            }
        }, {
            field: "riskLevel",
            title: "Risk Identification",
            width: "140px",
            attributes: {
                "class": "cell_risk_level"
            },
            filterable: {
                multi: true,
                dataSource: $scope.riskLevelDataSource,
                itemTemplate: function (e) {
                    if (e.field === "all") {
                        return "<li class=\"select_all\"><label><input type='checkbox' /> <span>#= all#</span></label></li>";
                    } else {
                        return "<li><label><input type='checkbox' name='" + e.field + "' value='#=data.value#'/> <span>#= data.description #</span></label></li>";
                    }
                }
            },
            template: function (dataItem) {
                var retVal = "";
                switch (dataItem.riskLevel) {
                    case "1":
                        retVal = "<strong class='text-light-green'>" + dataItem.riskLevelDescription + "</strong>";
                        break;
                    case "2":
                        retVal = "<strong class='text-yellow'>" + dataItem.riskLevelDescription + "</strong>";
                        break;
                    case "3":
                        retVal = "<strong class='text-orange'>" + dataItem.riskLevelDescription + "</strong>";
                        break;
                    case "4":
                        retVal = "<strong class='text-red'>" + dataItem.riskLevelDescription + "</strong>";
                        break;
                    default:
                        retVal = "N/A";
                        break;
                }
                return retVal;
            }
        }, {
            field: "applicationDate",
            title: "SCE Application Date",
            width: "200px",
            format: "{0:dd MMM yyyy}",
            attributes: {
                "class": "cell_application_date"
            },
            filterable: {
                ui: "datepicker"
            }
        }, {
            field: "lapse",
            title: "Lapse",
            width: "85px",
            attributes: {
                "class": "cell_lapse"
            },
            filterable: {
                extra: false
            },
            template: '#:lapse# days'
        }, {
            field: "status",
            title: "Status",
            width: "300px",
            attributes: {
                "class": "cell_live"
            },
            filterable: {
                multi: true,
                dataSource: $scope.statusDataSource,
                itemTemplate: function (e) {
                    if (e.field === "all") {
                        return "<li class=\"select_all\"><label><input type='checkbox' /> <span>#= all#</span></label></li>";
                    } else {
                        return "<li><label><input type='checkbox' name='" + e.field + "' value='#=data.statusKey#'/> <span>#= data.description #</span></label></li>";
                    }
                }
            },
            template: function (dataItem) {
                var retVal = "";
                switch (dataItem.statusKey) {
                    case "11":
                        retVal = "<strong class='text-grey'>" + dataItem.status + "</strong>";
                        break;
                    case "12":
                    case "13":
                    case "14":
                    case "15":
                    case "16":
                    case "17":
                    case "19":
                        retVal = "<strong class='text-light-orange'>" + dataItem.status + "</strong>";
                        break;
                    case "18":
                    case "20":
                        retVal = "<strong class='text-green'>" + dataItem.status + "</strong>";
                        break;
                }

                var canTransferRole = $scope.isAdmin && (dataItem.statusKey === "12" || dataItem.statusKey === "13" || dataItem.statusKey === "14" || dataItem.statusKey === "16");
                var isDraft = dataItem.statusKey === "11";

                retVal += "\n\r<button class=\"btn-grid-item-menu\" type=\"button\" data-ng-click=\"openItemMenu($event)\"><i class=\"icon-dot-3 icon-btn-grid-item-menu\"></i></button>" +
                        "<ul class=\"grid-item-menu\" data-id='" + dataItem.raId + "' style=\"display: none; background-color: #fff; border: 1px solid #ccc;\" >" +
                            "<li><a href=\"#\" data-ng-click=\"viewDetail('" + dataItem.sceId + "','" + dataItem.raId + "')\">View</a></li>" +
                            "<li><a data-ng-class=\"" + (canTransferRole ? '' : 'hide_item') + "\"  href=\"#\" data-ng-click =\"showTransferRolesKendoDiaglog('" + dataItem.sceId + "','" + dataItem.raId + "')\">Transfer Roles...</a></li>" +
                            "<li><a href=\"#\" data-ng-click=\"statusLog('" + dataItem.sceId + "','" + dataItem.raId + "')\">Status Log</a></li>" +
                            "<li><a data-ng-class=\"" + (!isDraft ? '' : 'hide_item') + "\" href=\"#\" data-ng-click = \"raPrint('" + dataItem.sceId + "','" + dataItem.raId + "')\">Print</a></li>" +
                            "<li><a href=\"#\" data-ng-click=\"" + (($scope.isAdmin || ($scope.userProfile.userProfileId === dataItem.applicantId && $scope.hasApplicantRole)) && (dataItem.statusKey == '16' || dataItem.statusKey == '17') ? 'cancelMOC(\'' + dataItem.sceId + "','" + dataItem.raId + '\')' : '') + "\" data-ng-class=\"" + (($scope.isAdmin || ($scope.userProfile.userProfileId === dataItem.applicantId && $scope.hasApplicantRole)) && (dataItem.statusKey == '16' || dataItem.statusKey == '17') ? '' : 'hide_item') + "\">Cancel MOC</a></li>" +
                            "<li><a href=\"#\" data-ng-click=\"" + (($scope.userProfile.userProfileId === dataItem.applicantId && $scope.hasApplicantRole || $scope.isAdmin) && dataItem.statusKey !== '20' ? 'cancelRA(\'' + dataItem.sceId + "','" + dataItem.raId + '\')' : '') + "\" data-ng-class=\"" + (($scope.userProfile.userProfileId === dataItem.applicantId && $scope.hasApplicantRole || $scope.isAdmin) && dataItem.statusKey !== '20' ? '' : 'hide_item') + "\">Cancel RA</a></li>" +
                        "</ul>";
                return retVal;
            }
        }],
        noRecords: true,
        messages: {
            noRecords: "There is no data on current page"
        },
        toolbar: [{
            template: "<kendo-tabstrip>" +
                            "<ul>" +
                                "<li data-ng-click=\"onChangeTab(0)\" class=\"k-state-active\">All</li>" +
                                "<li data-ng-click=\"onChangeTab(1)\">My RA <small>({{totalMyRaListing.totalMyRa}})</small></li>" +
                                "<li data-ng-click=\"onChangeTab(2)\">Pending My Action <small>({{totalMyRaListing.totalPendingMyAction}})</small></li>" +
                            "</ul>" +
                        "</kendo-tabstrip>"
        }],
        selectable: "row",
        change: function (e) {
            e.preventDefault();
            var dataItem = this.dataItem(this.select());
            $state.go(constants.state.raDetail, { sceId: dataItem.sceId, raId: dataItem.raId });
        }
    };

    $scope.raPrint = function (sceId, raId) {
        window.open('/print/ra/' + sceId + '/' + raId, '_blank');
    };

    $scope.cancelRA = function (sceId, raId) {
        $scope.confirmDialog("RA Cancel", "Are you sure you want to cancel this RA?").then(function () {
            $rootScope.isLoading = true;
            raServices.cancelRA(sceId, raId).then(function (response) {
                $rootScope.isLoading = false;
                var option = {
                    id: "dialogInfo",
                    title: "RA Cancelled",
                    lableClose: "CLOSE",
                    content: "RA Form has been cancelled successfully",
                    width: 300
                };
                utils.dialog.showDialog(option, function () {
                    $rootScope.isLoading = true;
                    $('#raListingGrid').data('kendoGrid').dataSource.read();
                    onLoad();
                    $rootScope.isLoading = false;
                });
            }, function (error) {
                $rootScope.isLoading = false;
                var option = {
                    id: "dialogInfo",
                    title: "RA Cancelled Failed",
                    lableClose: "CLOSE",
                    content: error.message,
                    width: 300
                };
                utils.dialog.showDialog(option, function () {
                });
            });
        }, function () {
            // Choosed cancel, do nothing
        });
    };

    $scope.cancelMocConfirmDialog = function (title, content) {
        return $("<div></div>").kendoConfirm({
            title: title,
            content: content,
            actions: [{ text: "CANCEL MOC", primary: true },
                { text: "CANCEL" }]
        }).data("kendoConfirm").open().result;
    };
    //Cancel MOC by admin   
    $scope.cancelMOC = function (sceId, raId) {
        $scope.cancelMocConfirmDialog("Cancel MOC", "Are you sure to cancel MOC?").then(function () {
            raServices.cancelMOC(sceId, raId).then(function (response) {
                var option = {
                    id: "dialogInfo",
                    title: "MOC Cancelled",
                    lableClose: "CLOSE",
                    content: "This MOC is cancelled",
                    width: 500
                };
                utils.dialog.showDialog(option, function () {
                    $state.go(constants.state.raList);
                });
            }, function (error) {
                var option = {
                    id: "dialogInfo",
                    title: "RA is Cancelled Failed",
                    lableClose: "CLOSE",
                    content: error.message,
                    width: 500
                };
                utils.dialog.showDialog(option, function () {
                });
            });
        }, function () {
            // Choosed cancel, do nothing
        });
    };
    //#region funtions for 3 dots button group

    $scope.viewDetail = function (sceId, raId) {
        $state.go(constants.state.raDetail, { sceId: sceId, raId: raId });
    };
    //go to log' page
    $scope.statusLog = function (sceId, id) {
        $state.go(constants.state.raStatusLog, { sceId: sceId, raId: id });
    }

    //#endregion

    $scope.onChangeTab = function (index) {
        indexTab = index;
        var grid = $(".ra-listing").data("kendoGrid");

        $scope.isCalling = false;
        // clear filter
        grid.dataSource.sort({});
        grid.dataSource.filter({});

        switch (index) {
            case 0:
                $scope.defaultView = "All";
                $scope.isCalling = true;
                grid.dataSource.read();
                break;
            case 1:
                $scope.defaultView = "MyRa";
                $scope.isCalling = true;
                grid.dataSource.read();
                break;
            case 2:
                $scope.defaultView = "PendingMyAction";
                $scope.isCalling = true;
                grid.dataSource.read();
                break;
        }
    };

    $scope.openItemMenu = function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var itemMenu = $(e.target).closest("td").find(".grid-item-menu");
        _.each($('.grid-item-menu'), function (item) {
            if ($(item).attr("data-id") !== $(itemMenu).attr("data-id")) {
                $(item).hide();
            }
            else {
                $(itemMenu).slideToggle();
            }
        });
    };

    $scope.confirmDialog = function (title, content) {
        return $("<div></div>").kendoConfirm({
            title: title,
            content: content
        }).data("kendoConfirm").open().result;
    };

    //#region Transfer Roles
    $scope.facilitatorSearchText = "";

    $scope.facilitatorDataSource = {
        serverFiltering: true,
        transport: {
            read: function (options) {
                raServices.getRAFacilitors($scope.facilitatorSearchText).then(function (response) {
                    if (response.data !== null && response.data !== undefined) {
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

    $scope.endorserSearchText = "";

    $scope.endorserDataSource = {
        serverFiltering: true,
        transport: {
            read: function (options) {
                raServices.getRAEndorsers($scope.endorserSearchText).then(function (response) {
                    if (response.data !== null && response.data !== undefined) {
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

    $scope.approverSearchText = "";

    $scope.approverDataSource = {
        serverFiltering: true,
        transport: {
            read: function (options) {
                raServices.getRAApprovers($scope.approverSearchText).then(function (response) {
                    if (response.data !== null && response.data !== undefined) {
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

    $scope.mocApproverSearchText = "";

    $scope.mocApproverDataSource = {
        serverFiltering: true,
        transport: {
            read: function (options) {
                raServices.getMocApprovers($scope.mocApproverSearchText).then(function (response) {
                    if (response.data !== null && response.data !== undefined) {
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

    $scope.pendingReview = false;
    $scope.pendingEndorse = false;
    $scope.pendingApprove = false;
    $scope.pendingMOCApproval = false;
    $scope.reviewerToTransfer = null;
    $scope.backupReviewer = null;
    $scope.endorserToTransfer = null;
    $scope.backupEndorser = null;
    $scope.approverToTransfer = null;
    $scope.mocApproverToTransfer = null;
    $scope.backupMOCApprover = null;
    $scope.adminComment = "";
    $scope.backupApprover = null;

    $scope.reviewerIsTransfered = false;
    $scope.endorserIsTransfered = false;
    $scope.approverIsTransfered = false;
    $scope.mocApproverIsTransfered = false;
    $scope.transferRolesModel = null;

    $scope.transferResultActions = [{
        text: 'CLOSE',
        action: function () {
            $state.go(constants.state.raList);
        }
    }];

    $scope.raTransferRoles = [
            { text: 'CANCEL' },
            {
                text: 'CONFIRM',
                action: function () {

                    if (!isProcessTriggerClick) {
                        return false;
                    }
                    isProcessTriggerClick = false;

                    if (!$scope.validators.raTransfer.validate()) {
                        isProcessTriggerClick = true;
                        return;
                    }
                    $scope.transferRolesModel = {
                        reviewerProfileId: $scope.pendingReview && $scope.reviewerToTransfer.userProfileId !== $scope.backupReviewer.userProfileId && $scope.reviewerToTransfer.userProfileId !== "" ? $scope.reviewerToTransfer.userProfileId : null,
                        endorserProfileId: $scope.pendingEndorse && $scope.endorserToTransfer.userProfileId !== $scope.backupEndorser.userProfileId && $scope.endorserToTransfer.userProfileId !== "" ? $scope.endorserToTransfer.userProfileId : null,
                        approverProfileId: $scope.pendingApprove && $scope.approverToTransfer.userProfileId !== $scope.backupApprover.userProfileId && $scope.approverToTransfer.userProfileId !== "" ? $scope.approverToTransfer.userProfileId : null,
                        mocApproverProfileId: $scope.pendingMOCApproval && $scope.mocApproverToTransfer.userProfileId !== $scope.backupMOCApprover.userProfileId && $scope.mocApproverToTransfer.userProfileId !== "" ? $scope.mocApproverToTransfer.userProfileId : null,
                        comment: $scope.adminComment
                    };
                    if ($scope.transferRolesModel !== null && $scope.transferRolesModel !== undefined && ($scope.transferRolesModel.reviewerProfileId === null || $scope.transferRolesModel.reviewerProfileId === undefined) && ($scope.transferRolesModel.endorserProfileId === null || $scope.transferRolesModel.endorserProfileId === undefined) && ($scope.transferRolesModel.approverProfileId === null || $scope.transferRolesModel.approverProfileId === null) && ($scope.transferRolesModel.mocApproverProfileId === null || $scope.transferRolesModel.mocApproverProfileId === null)) {
                        isProcessTriggerClick = true;
                        return true;
                    }
                    $rootScope.isLoading = true;
                    isProcessTriggerClick = true;
                    raServices.transferRoles($scope.transferSceId, $scope.transferRaId, $scope.transferRolesModel).then(function (response) {
                        if ($scope.transferRolesModel !== null && $scope.transferRolesModel !== undefined && $scope.transferRolesModel.reviewerProfileId !== null && $scope.transferRolesModel.reviewerProfileId !== undefined) {
                            $scope.reviewerIsTransfered = true;
                        }
                        if ($scope.transferRolesModel !== null && $scope.transferRolesModel !== undefined && $scope.transferRolesModel.endorserProfileId !== null && $scope.transferRolesModel.endorserProfileId !== undefined) {
                            $scope.endorserIsTransfered = true;
                        }
                        if ($scope.transferRolesModel !== null && $scope.transferRolesModel !== undefined && $scope.transferRolesModel.approverProfileId !== null && $scope.transferRolesModel.approverProfileId !== undefined) {
                            $scope.approverIsTransfered = true;
                        }
                        if ($scope.transferRolesModel !== null && $scope.transferRolesModel !== undefined && $scope.transferRolesModel.mocApproverProfileId !== null && $scope.transferRolesModel.mocApproverProfileId !== undefined) {
                            $scope.mocApproverIsTransfered = true;
                        }
                        $rootScope.isLoading = false;
                        $scope.transferResultDialog.open();
                        $('#raListingGrid').data('kendoGrid').dataSource.read();
                        onLoad();
                    }, function (err) {
                        $rootScope.isLoading = false;
                        var option = {
                            id: "dialogInfo",
                            title: "RA Roles Transferred failed.",
                            lableClose: "CLOSE",
                            content: err.message,
                            width: 500
                        };
                        utils.dialog.showDialog(option, function () {
                        });
                    });
                    return true;
                },
                primary: true
            }
    ];

    $scope.transferSceId = "";
    $scope.transferRaId = "";

    $scope.showTransferRolesKendoDiaglog = function (sceId, raId) {
        $scope.transferSceId = sceId;
        $scope.transferRaId = raId;
        $rootScope.isLoading = true;
        raServices.getPendingPerson(sceId, raId).then(function (response) {
            $rootScope.isLoading = false;
            if (response.data !== null && response.data !== undefined) {
                var statusKey = response.data.statusKey;
                switch (statusKey) {
                    case constants.RA.statusKey.raPendingReview:
                        {
                            $scope.pendingReview = true;
                            $scope.pendingEndorse = false;
                            $scope.pendingApprove = false;
                            $scope.pendingMOCApproval = false;
                            $scope.reviewerToTransfer = {
                                userProfileId: response.data.userProfileId,
                                userId: response.data.userId,
                                userName: response.data.userName,
                                position: response.data.position,
                                image: response.data.image
                            };
                            $scope.backupReviewer = $scope.reviewerToTransfer;

                            $scope.endorserToTransfer = null;
                            $scope.approverToTransfer = null;
                            $scope.mocApproverToTransfer = null;
                            $scope.facilitatorOptions = {
                                optionLabel: "Select Facilitator",
                                filter: "contains",
                                filtering: function (e) {
                                    $scope.facilitatorSearchText = e.filter === null || e.filter === undefined ? "" : e.filter.value;
                                },
                                dataSource: $scope.facilitatorDataSource,
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
                            break;
                        }
                    case constants.RA.statusKey.raPendingEndorsement:
                        {
                            $scope.pendingReview = false;
                            $scope.pendingEndorse = true;
                            $scope.pendingApprove = false;
                            $scope.pendingMOCApproval = false;
                            $scope.endorserToTransfer = {
                                userProfileId: response.data.userProfileId,
                                userId: response.data.userId,
                                userName: response.data.userName,
                                position: response.data.position,
                                image: response.data.image
                            };
                            $scope.backupEndorser = $scope.endorserToTransfer;
                            $scope.reviewerToTransfer = null;
                            $scope.approverToTransfer = null;
                            $scope.mocApproverToTransfer = null;
                            $scope.endorsersOptions = {
                                optionLabel: "Select Endorser",
                                filter: "contains",
                                filtering: function (e) {
                                    $scope.endorserSearchText = e.filter === null || e.filter === undefined ? "" : e.filter.value;
                                },
                                dataSource: $scope.endorserDataSource,
                                dataTextField: "userName",
                                dataValueField: "userProfileId",
                                valueTemplate: function (dataItem) {
                                    if (!dataItem.hasOwnProperty('image')) {
                                        dataItem.image = $scope.endorserToTransfer.image;
                                    }
                                    return '<span class="selected-value" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span><span>{{dataItem.userName}}</span>';
                                },
                                template: '<div class="custom-dropdown"><span class="k-state-default" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span>' +
                            '<span class="k-state-default"><h3>{{dataItem.userName}}</h3></span></div>'
                            };
                            break;
                        }
                    case constants.RA.statusKey.raPendingApproval:
                        {
                            $scope.pendingReview = false;
                            $scope.pendingEndorse = false;
                            $scope.pendingApprove = true;
                            $scope.pendingMOCApproval = false;
                            $scope.approverToTransfer = {
                                userProfileId: response.data.userProfileId,
                                userId: response.data.userId,
                                userName: response.data.userName,
                                position: response.data.position,
                                image: response.data.image
                            };
                            $scope.backupApprover = $scope.approverToTransfer;

                            $scope.reviewerToTransfer = null;
                            $scope.endorserToTransfer = null;
                            $scope.mocApproverToTransfer = null;
                            $scope.approversOptions = {
                                optionLabel: "Select Approver",
                                filter: "contains",
                                filtering: function (e) {
                                    $scope.approverSearchText = e.filter === null || e.filter === undefined ? "" : e.filter.value;
                                },
                                dataSource: $scope.approverDataSource,
                                dataTextField: "userName",
                                dataValueField: "userProfileId",
                                valueTemplate: function (dataItem) {
                                    if (!dataItem.hasOwnProperty('image')) {
                                        dataItem.image = $scope.approverToTransfer.image;
                                    }
                                    return '<span class="selected-value" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span><span>{{dataItem.userName}}</span>';
                                },
                                template: '<div class="custom-dropdown"><span class="k-state-default" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span>' +
                            '<span class="k-state-default"><h3>{{dataItem.userName}}</h3></span></div>'
                            };
                            break;
                        }
                    case constants.RA.statusKey.raPendingMocApproval:
                        {
                            $scope.pendingReview = false;
                            $scope.pendingEndorse = false;
                            $scope.pendingApprove = false;
                            $scope.pendingMOCApproval = true;

                            $scope.reviewerToTransfer = null;
                            $scope.endorserToTransfer = null;
                            $scope.approverToTransfer = null;
                            $scope.mocApproverToTransfer = {
                                userProfileId: response.data.userProfileId,
                                userId: response.data.userId,
                                userName: response.data.userName,
                                position: response.data.position,
                                image: response.data.image
                            }
                            $scope.backupMOCApprover = $scope.mocApproverToTransfer;

                            $scope.mocApproversOptions = {
                                optionLabel: "Select MOC Approver",
                                filter: "contains",
                                filtering: function (e) {
                                    $scope.mocApproverSearchText = e.filter === null || e.filter === undefined ? "" : e.filter.value;
                                },
                                dataSource: $scope.mocApproverDataSource,
                                dataTextField: "userName",
                                dataValueField: "userProfileId",
                                valueTemplate: function (dataItem) {
                                    if (!dataItem.hasOwnProperty('image')) {
                                        dataItem.image = $scope.mocApproverToTransfer.image;
                                    }
                                    return '<span class="selected-value" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span><span>{{dataItem.userName}}</span>';
                                },
                                template: '<div class="custom-dropdown"><span class="k-state-default" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span>' +
                            '<span class="k-state-default"><h3>{{dataItem.userName}}</h3></span></div>'
                            };
                            break;
                        }
                    default:
                        {
                            $scope.pendingReview = false;
                            $scope.pendingEndorse = false;
                            $scope.pendingApprove = false;
                            $scope.pendingMOCApproval = false;
                            $scope.reviewerToTransfer = null;
                            $scope.endorserToTransfer = null;
                            $scope.approverToTransfer = null;
                            $scope.mocApproverToTransfer = null;
                            break;
                        }
                }
                if ($scope.pendingReview || $scope.pendingEndorse || $scope.pendingApprove || $scope.pendingMOCApproval) {
                    $scope.transferRolesKendoDiaglog.center();
                    $scope.transferRolesKendoDiaglog.open();
                }
            }
        }, function (err) {
            $rootScope.isLoading = false;
            utils.error.showErrorGet(err);
        });
    };
    //#endregion
}]);