app.controller('sceListController', ['$rootScope', '$state', '$scope', '$location', '$timeout', 'sceServices', 'statusService', 'areaService', 'constants','$window',
function ($rootScope, $state, $scope, $location, $timeout, sceServices, statusService, areaService, constants, $window) {

    $scope.userProfile = $rootScope.$app.userProfile;
    $rootScope.bigModuleTitle = "Safety Critical Equipment (SCE)";
    $scope.dialogOption = {
        id: "dialogInfo",
        title: "",
        lableClose: "CLOSE",
        content: "",
        width: 300
    };

    $scope.isAdmin = $scope.userProfile.isAdmin;

    $scope.hide_item = "hide-item";

    $scope.hasApplicantRole = ("," + $rootScope.$app.userProfile.rolesKeyString + ",").indexOf(",1,") >= 0;

    $rootScope.$app.title = constants.titlePage.sceListing;

    var indexTab = 0;
    $scope.isCalling = true;

    $scope.totalMySceListing = {
        totalMySCE: 0,
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
        $rootScope.bigModuleTitle = "Safety Critical Equipment (SCE)";

        sceServices.getTotalMySceListing().then(function (response) {
            $scope.totalMySceListing = {
                totalMySCE: response.data.totalMySCE,
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

    $scope.resetModel = function () {
        $scope.model.status = "";
        $scope.model.filter = [];
        $scope.model.sort = [];
        $scope.model.skip = "";
        $scope.model.take = "";
        $scope.model.isExport = "";
    };

    $scope.initData = function (options, isPendingReApproval, isPendingReAcknowledge, isPendingMoc) {

        kendo.ui.progress($('.sce-listing'), false);
        // reset input data
        $scope.resetModel();
        var optionfilters = [];
        var filters = [
            {
                field: "requiredDate",
                valueDateTimeFrom: null,
                valueDateTimeTo: null,
                isActive: false
            },
            {
                field: "requisitionDate",
                valueDateTimeFrom: null,
                valueDateTimeTo: null,
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
            },
            {
                field: "isPendingReApprove",
                valueBit: true,
                isActive: isPendingReApproval === true
            },
            {
                field: "isPendingReAcknowledge",
                valueBit: true,
                isActive: isPendingReAcknowledge === true
            },
            {
                field: "isPendingMoc",
                valueBit: true,
                isActive: isPendingMoc === true
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
                        case "requiredDate":
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

                        case "requisitionDate":
                            if (m.operator === "gte") {
                                date = $.format.toBrowserTimeZone(m.value, constants.format.date.default);
                                filters[1].valueDateTimeFrom = date;
                                filters[1].isActive = true;
                            }
                            else {
                                date = $.format.toBrowserTimeZone(m.value, constants.format.date.default);
                                filters[1].valueDateTimeTo = date;
                                filters[1].isActive = true;
                            }
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
        $scope.model.take = options.data.take;
        $scope.model.skip = (options.data.page - 1) * options.data.pageSize;
    };

    $scope.isFilter = 0;
    $scope.needToCallServer = 0;

    $scope.allDataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                if ($scope.isCalling) {
                    $rootScope.isLoading = true;

                    $scope.initData(options, $rootScope.filterIsPendingReApprove, $rootScope.filterIsPendingReAcknowledge, $rootScope.filterIsPendingMoc);

                    var isPreFilter = $rootScope.filterByArea !== null && $rootScope.filterByArea !== undefined && $rootScope.filterByArea.length > 0;

                    $scope.needToCallServer++;

                    if (isPreFilter && $scope.isFilter === 0) {
                        var ds = $(".sce-listing").data("kendoGrid").dataSource;
                        var currentFilter = [];
                        currentFilter.push({ field: "status", operator: "eq", value: $rootScope.filterByStatus });
                        _.each($rootScope.filterByArea, function (m) {
                            currentFilter.push({ field: "area", operator: "eq", value: m });
                        });
                        $scope.isFilter++;
                        ds.filter(currentFilter);
                    }

                    if (!isPreFilter || isPreFilter && $scope.needToCallServer === 2) {
                        if ($rootScope.goToMyPendingAction) {
                            $("#sceTab").data("kendoTabStrip").select(2);
                            $scope.model.view = "PendingMyAction";
                            $rootScope.goToMyPendingAction = false;
                        }
                        sceServices.getSceListing($scope.model).then(function (response) {
                            if (response.data !== null && response.data !== undefined) {
                                options.success(response.data);
                            } else {
                                options.success([]);
                            }
                            // reset value
                            $rootScope.filterByArea = null;
                            $rootScope.filterByStatus = '';
                            $rootScope.filterIsPendingReApprove = false;
                            $rootScope.filterIsPendingReAcknowledge = false;
                            $rootScope.filterIsPendingMoc = false;

                            $rootScope.isLoading = false;
                        }, function (error) {
                            options.error([]);
                            utils.error.showErrorGet(error);
                            // reset value
                            $rootScope.filterByArea = null;
                            $rootScope.filterByStatus = '';
                            $rootScope.filterIsPendingReApprove = false;
                            $rootScope.filterIsPendingReAcknowledge = false;
                            $rootScope.filterIsPendingMoc = false;

                            $rootScope.isLoading = false;
                        });
                    }
                    else {
                        options.success([]);
                        $('.sce-listing .k-grid-norecords-template').hide();
                    }
                }
                else {
                    options.success([]);
                    $('.sce-listing .k-grid-norecords-template').hide();
                }
            }
        },
        schema: {
            model: {
                fields: {
                    area: { type: "string" },
                    tagNo: { type: "string" },
                    sceNo: { type: "string" },
                    reason: { type: "string" },
                    requisitionDate: { type: "date" },
                    requiredDate: { type: "date" },
                    lapse: { type: "number", validation: { required: true, min: 0 } },
                    status: { type: "string" },
                    live: { type: "string" }
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

    $scope.status = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                statusService.getStatusBySce().then(function (response) {
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

    $scope.areas = new kendo.data.DataSource({
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

    $scope.mainGridOptions = {
        dataSource: $scope.allDataSource,
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
        scrollable: false,
        sortable: {
            mode: "multiple",
            allowUnsort: true
        },
        pageable: {
            pageSizes: true,
            buttonCount: 5
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
                dataSource: $scope.areas,
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
            field: "sceNo",
            title: "SCE No.",
            width: "127px",
            attributes: {
                "class": "cell_sce_no"
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
            field: "requisitionDate",
            title: "Application Date",
            width: "140px",
            format: "{0:dd MMM yyyy}",
            attributes: {
                "class": "cell_application_date"
            },
            filterable: {
                ui: "datepicker"
            }
        }, {
            field: "requiredDate",
            title: "Required Date",
            width: "140px",
            format: "{0:dd MMM yyyy}",
            attributes: {
                "class": "cell_required_date"
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
            width: "145px",
            attributes: {
                "class": "cell_status"
            },
            filterable: {
                multi: true,
                dataSource: $scope.status,
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
                    case "1":
                        retVal = "<strong class='text-grey'>" + dataItem.status + "</strong>";
                        break;
                    case "2":
                    case "3":
                    case "4":
                    case "5":
                    case "9":
                        retVal = "<strong class='text-light-orange'>" + dataItem.status + "</strong>";
                        break;
                    case "7":
                    case "10":
                        retVal = "<strong class='text-green'>" + dataItem.status + "</strong>";
                        break;
                }
                return retVal;
            }
        }, {
            title: "Live",
            field: "live",
            width: "300px",
            attributes: {
                "class": "cell_live"
            },
            template: function (dataItem) {
                var outPut = '';
                if (dataItem.live !== '') {
                    var dataArray = jQuery.parseJSON(dataItem.live);
                    _.each(dataArray, function (item, index) {
                        outPut += "<li><span><i class=\"icon-hourglass\"></i> " + item + "</span></li>";
                    });
                }
                if (outPut !== '') {
                    outPut = "<ul class=\"live_data\">"
                                + outPut +
                            "</ul>";
                }

                var canTransferRoles = $scope.isAdmin && dataItem.statusKey !== "10";

                return "<button class=\"btn-grid-item-menu\" type=\"button\" data-ng-click=\"openItemMenu($event)\"><i class=\"icon-dot-3 icon-btn-grid-item-menu\"></i></button>" +
                        outPut +
                        "<ul class=\"grid-item-menu\" data-id='" + dataItem.sceId + "' style=\"display: none; background-color: #fff; border: 1px solid #ccc;\" >" +
                            "<li><a href=\"#\" data-ng-click=\"viewDetail('" + dataItem.sceId + "')\">View</a></li>" +
                            (dataItem.statusKey !== '10' && dataItem.statusKey !== '1' && $scope.hasApplicantRole && $scope.userProfile.userProfileId === dataItem.applicantId && !dataItem.isRaCreated ? '<li><a href="#" data-ng-click="requestRa(\'' + dataItem.sceId + '\')">Request RA</a></li>' : '') +
                            ($scope.userProfile.userProfileId === dataItem.applicantId && dataItem.statusKey !== '10' ? '<li><a href="#" data-ng-click="transferSce(\'' + dataItem.sceId + '\')">Transfer</a></li>' : '') +
                            "<li><a href =\"#\" data-ng-class=\"" + (canTransferRoles ? '' : 'hide_item') + "\" data-ng-click = \"showTransferRolesKendoDiaglog('" + dataItem.sceId + "')\" >Transfer Roles...</a></li>" +
                            ($scope.hasApplicantRole && parseInt(dataItem.statusKey) >= 5 ? "<li><a href=\"#\" data-ng-click=\"copySce('" + dataItem.sceId + "', '" + dataItem.sceNo + "')\">Copy SCE</li>" : '') +
                            "<li><a href=\"#\" data-ng-click=\"statusLog('" + dataItem.sceId + "')\">Status Log</a></li>" +
                            "<li><a href data-ng-click='scePrint(\"" + dataItem.sceId + "\")' data-ng-hide='" + (dataItem.statusKey === "1") + "'>Print</a></li>" +
                            (($scope.userProfile.userProfileId === dataItem.applicantId && $scope.hasApplicantRole || $scope.userProfile.isAdmin) && (dataItem.statusKey === "9" || parseInt(dataItem.statusKey) < 7) ? '<li><a href="#" data-ng-click="cancelSce(\'' + dataItem.sceId + '\')">Cancel SCE</a></li>' : '') +
                        "</ul>";
            },
            filterable: false,
            sortable: false
        }],
        noRecords: true,
        messages: {
            noRecords: "There is no data on current page"
        },
        toolbar: [{
            template: "<kendo-tabstrip id='sceTab'>" +
                            "<ul>" +
                                "<li data-ng-click=\"onChangeTab(0)\" class=\"k-state-active\">All</li>" +
                                "<li data-ng-click=\"onChangeTab(1)\">My SCE <small>({{totalMySceListing.totalMySCE}})</small></li>" +
                                "<li data-ng-click=\"onChangeTab(2)\">Pending My Action <small>({{totalMySceListing.totalPendingMyAction}})</small></li>" +
                            "</ul>" +
                        "</kendo-tabstrip>"
        }],
        selectable: "row",
        change: function (e) {
            e.preventDefault();
            var dataItem = this.dataItem(this.select());
            $state.go(constants.state.scedetail, { sceId: dataItem.sceId });
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

    $scope.viewDetail = function (id) {
        $state.go("scedetail", { sceId: id });
    };

    $scope.requestRa = function (id) {
        // do something
        $state.go(constants.state.raNew, { sceId: id });
    };

    $scope.statusLog = function (id) {
        $state.go(constants.state.sceStatusLog, { sceId: id });
    }

    $scope.sceIdSelected = "";

    $scope.transferSce = function (id) {
        $scope.sceIdSelected = id;
        $scope.transferDialog.open();
    };

    $scope.cancelSce = function (id) {
        $scope.confirmDialog("Cancel SCE", "Are you sure you want to cancel this SCE?").then(function () {
            $rootScope.isLoading = true;
            try {
                sceServices.cancelSce(id).then(function (response) {
                    $scope.dialogOption.title = "SCE Cancelled";
                    $scope.dialogOption.content = "SCE form has been cancelled successfully";
                    utils.dialog.showDialog($scope.dialogOption, function () {
                        var grid = $(".sce-listing").data("kendoGrid");
                        grid.dataSource.read();
                        onLoad();
                    });

                    $rootScope.isLoading = false;
                }, function (error) {
                    $rootScope.isLoading = false;

                    $scope.dialogOption.title = "SCE Cancel Failed";
                    $scope.dialogOption.content = error.message;
                    utils.dialog.showDialog($scope.dialogOption);
                });
            }
            catch (err) {
                $rootScope.isLoading = false;
            }
        }, function () {
            // Choosed cancel, do nothing
        });
    };

    $scope.scePrint = function (id) {
        window.open('/print/sce/' + id, '_blank');
    };

    $scope.sceCopyDialog = function (title, content) {
        return $("<div></div>").kendoConfirm({
            title: title,
            content: content,
            actions: [{ text: "COPY", primary: true },
                { text: "CANCEL" }]
        }).data("kendoConfirm").open().result;
    };

    $scope.copySce = function (id, sceNo) {
        $scope.sceCopyDialog("SCE Copy Confirmation", "Existing SCE No. <strong>" + sceNo + "</strong> information will be copied into new SCE request. Are you sure to proceed?").then(function () {
            $state.go(constants.state.scecopynew, { sceId: id });
        }, function () {
            // Chooses cancel, do nothing
        });
    }

    $scope.onChangeTab = function (index) {
        indexTab = index;
        var grid = $(".sce-listing").data("kendoGrid");

        $scope.isCalling = false;
        // clear filter
        grid.dataSource.sort({});
        grid.dataSource.filter({});

        switch (index) {
            case 0:
                $scope.model.view = "All";
                $scope.isCalling = true;
                grid.dataSource.read();
                break;
            case 1:
                $scope.model.view = "MySCE";
                $scope.isCalling = true;
                grid.dataSource.read();
                break;
            case 2:
                $scope.model.view = "PendingMyAction";
                $scope.isCalling = true;
                grid.dataSource.read();
                break;
        }
    };

    //#region Transfer SCE
    $scope.transferSceModel = {
        newApplicantId: "",
        comment: ""
    };

    $scope.transferSceAction = [
        { text: 'CANCEL' },
        {
            text: 'TRANSFER',
            action: function () {
                sceServices.transferSce($scope.sceIdSelected, $scope.transferSceModel).then(function (response) {
                    $scope.dialogOption.title = "SCE Transferred";
                    $scope.dialogOption.content = "This SCE is now transferred to <strong>" + response.data + "</strong>. A notification has been sent to alert the new applicant.";

                    utils.dialog.showDialog($scope.dialogOption, function () {
                        var grid = $(".sce-listing").data("kendoGrid");
                        switch (indexTab) {
                            case 0:
                                $scope.model.view = "All";
                                $scope.isCalling = true;
                                grid.dataSource.read();
                                break;
                            case 1:
                                $scope.model.view = "MySCE";
                                $scope.isCalling = true;
                                grid.dataSource.read();
                                break;
                            case 2:
                                $scope.model.view = "PendingMyAction";
                                $scope.isCalling = true;
                                grid.dataSource.read();
                                break;
                        }
                    });
                    onLoad();
                }, function (error) {
                    var option = {
                        id: "dialogInfo",
                        title: "SCE Transfer Failure",
                        lableClose: "CLOSE",
                        content: error.message,
                        width: 300
                    };
                    utils.dialog.showDialog(option);
                });
                // Returning false will prevent the closing of the dialog
                return true;
            },
            primary: true
        }
    ];

    $scope.applicantSearchTextForApplicant = "";
    // Bind new applicant to transfer
    $scope.newApplicantForApplicantOptions = {
        autoBind: false,
        optionLabel: "Select New Applicant",
        filter: "contains",
        filtering: function (e) {
            $scope.applicantSearchTextForApplicant = e.filter == null ? "" : e.filter.value;
        },
        dataSource: {
            serverFiltering: true,
            transport: {
                read: function (options) {
                    sceServices.getApplicantsForTransferInSameAreas($scope.sceIdSelected, $scope.applicantSearchTextForApplicant).then(function (response) {
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
                dataItem.image = $scope.applicantToTransfer === null || $scope.applicantToTransfer === undefined ? "" : $scope.applicantToTransfer.image;
            }
            return '<span class="selected-value" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span><span>{{dataItem.userName}}</span>';
        },
        template: '<div class="custom-dropdown"><span class="k-state-default" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span>' +
            '<span class="k-state-default"><h3>{{dataItem.userName}}</h3></span></div>'
    };


    $scope.applicantSearchText = "";

    // Bind new applicant to transfer
    $scope.newApplicantOptions = {
        autoBind: false,
        optionLabel: "Select new Applicant",
        filter: "contains",
        filtering: function (e) {
            $scope.applicantSearchText = e.filter === null || e.filter === undefined ? "" : e.filter.value;
        },
        dataSource: {
            serverFiltering: true,
            transport: {
                read: function (options) {
                    sceServices.getApplicantsForTransfer($scope.applicantSearchText).then(function (response) {
                        if (response.data !== null && response.data !== undefined && response.data.length > 0) {
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
            if (!dataItem.hasOwnProperty("image")) {
                dataItem.image = $scope.applicantToTransfer === null || $scope.applicantToTransfer === undefined ? "" : $scope.applicantToTransfer.image;
            }
            return '<span class="selected-value" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span><span>{{dataItem.userName}}</span>';
        },
        template: '<div class="custom-dropdown"><span class="k-state-default" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span>' +
            '<span class="k-state-default"><h3>{{dataItem.userName}}</h3></span></div>'
    };
    //#endregion

    //#region Transfer Role
    $scope.applicantToTransfer = null;
    $scope.backupApplicant = null;

    $scope.reviewerToTransfer = null;
    $scope.backupReviewer = null;

    $scope.endorserToTransfer = null;
    $scope.backupEndorser = null;

    $scope.approverToTransfer = null;
    $scope.backupApprover = null;

    $scope.reviewerForTransferSearchText = "";

    $scope.reviewerForTransferDataSource = {
        serverFiltering: true,
        transport: {
            read: function (options) {
                sceServices.getPreData('reviewers', null, $scope.reviewerForTransferSearchText).then(function (response) {
                    if (response.data !== null && response.data !== undefined && response.data.length > 0) {
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

    $scope.endorseDatasource = {
        serverFiltering: true,
        transport: {
            read: function (options) {
                sceServices.getPreData('endorsers', null, $scope.endorserSearchText).then(function (response) {
                    if (response.data !== null && response.data !== undefined && response.data.length > 0) {
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

    $scope.approverDatasource = {
        serverFiltering: true,
        transport: {
            read: function (options) {
                sceServices.getPreData('approvers', null, $scope.approverSearchText).then(function (response) {
                    if (response.data !== null && response.data !== undefined && response.data.length > 0) {
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

    $scope.transferSceId = "";

    $scope.pendingReview = false;

    $scope.pendingEndorse = false;

    $scope.pendingApprove = false;

    $scope.showTransferRolesKendoDiaglog = function (sceId) {
        $scope.transferSceId = sceId;
        $rootScope.isLoading = true;
        sceServices.getPendingPeopleForTransferingRoles(sceId).then(function (response) {
            $rootScope.isLoading = false;
            if (response.data !== null && response.data !== undefined) {
                var statusKey = response.data.statusKey;
                $scope.applicantToTransfer = response.data.applicant;
                $scope.backupApplicant = $scope.applicantToTransfer;
                switch (statusKey) {
                    case "2": {
                        $scope.pendingReview = true;
                        $scope.pendingEndorse = false;
                        $scope.pendingApprove = false;
                        $scope.reviewerToTransfer = response.data.pendingPerson;
                        $scope.backupReviewer = $scope.reviewerToTransfer;
                        $scope.endorserToTransfer = null;
                        $scope.approverToTransfer = null;

                        $scope.reviewerForTransferOptions = {
                            autoBind: false,
                            filter: "contains",
                            filtering: function (e) {
                                $scope.reviewerForTransferSearchText = e.filter === null || e.filter === undefined ? "" : e.filter.value;
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
                        break;
                    }
                    case "3": {
                        $scope.pendingReview = false;
                        $scope.pendingEndorse = true;
                        $scope.pendingApprove = false;
                        $scope.endorserToTransfer = response.data.pendingPerson;
                        $scope.backupEndorser = $scope.endorserToTransfer;
                        $scope.reviewerToTransfer = null;
                        $scope.approverToTransfer = null;

                        $scope.endorserOptions = {
                            autoBind: false,
                            filter: "contains",
                            filtering: function (e) {
                                $scope.endorserSearchText = e.filter === null || e.filter === undefined ? "" : e.filter.value;
                            },
                            optionLabel: "Select Endorser",
                            dataSource: $scope.endorseDatasource,
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
                    case "4": {
                        $scope.pendingReview = false;
                        $scope.pendingEndorse = false;
                        $scope.pendingApprove = true;
                        $scope.approverToTransfer = response.data.pendingPerson;
                        $scope.backupApprover = $scope.approverToTransfer;
                        $scope.reviewerToTransfer = null;
                        $scope.endorserToTransfer = null;

                        $scope.approverOptions = {
                            autoBind: false,
                            optionLabel: "Select Approver",
                            filter: "contains",
                            filtering: function (e) {
                                $scope.approverSearchText = e.filter === null || e.filter === undefined ? "" : e.filter.value;
                            },
                            dataSource: $scope.approverDatasource,
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
                    default: {
                        $scope.pendingReview = false;
                        $scope.pendingEndorse = false;
                        $scope.pendingApprove = false;
                        $scope.reviewerToTransfer = null;
                        $scope.endorserToTransfer = null;
                        $scope.approverToTransfer = null;
                        break;
                    }
                }
                $scope.sceTransferRolesKendoDiaglog.center();
                $scope.sceTransferRolesKendoDiaglog.open();
            }
        }, function (err) {
            $rootScope.isLoading = false;
            utils.error.showErrorGet(err);
        });
    };
    $scope.adminComment = "";
    $scope.sceTransferRoles = [
        { text: 'CANCEL' },
        {
            text: 'CONFIRM',
            action: function () {
                if ($scope.validators.sceTransfer.validate()) {
                    $scope.transferRolesModel = {
                        applicantProfileId: $scope.applicantToTransfer.userProfileId !== $scope.backupApplicant.userProfileId && $scope.applicantToTransfer.userProfileId !== "" ? $scope.applicantToTransfer.userProfileId : null,
                        reviewerProfileId: $scope.pendingReview && $scope.reviewerToTransfer.userProfileId !== $scope.backupReviewer.userProfileId && $scope.reviewerToTransfer.userProfileId !== "" ? $scope.reviewerToTransfer.userProfileId : null,
                        endorserProfileId: $scope.pendingEndorse && $scope.endorserToTransfer.userProfileId !== $scope.backupEndorser.userProfileId && $scope.endorserToTransfer.userProfileId !== "" ? $scope.endorserToTransfer.userProfileId : null,
                        approverProfileId: $scope.pendingApprove && $scope.approverToTransfer.userProfileId !== $scope.backupApprover.userProfileId && $scope.approverToTransfer.userProfileId !== "" ? $scope.approverToTransfer.userProfileId : null,
                        comment: $scope.adminComment
                    };

                    if (($scope.transferRolesModel.applicantProfileId === null || $scope.transferRolesModel.applicantProfileId === undefined) && ($scope.transferRolesModel.reviewerProfileId === null || $scope.transferRolesModel.reviewerProfileId === undefined) && ($scope.transferRolesModel.endorserProfileId === null || $scope.transferRolesModel.endorserProfileId === undefined) && ($scope.transferRolesModel.approverProfileId === null || $scope.transferRolesModel.approverProfileId === undefined)) {
                        isProcessTriggerClick = true;
                        return true;
                    }
                    $rootScope.isLoading = true;
                    sceServices.transferRoles($scope.transferSceId, $scope.transferRolesModel).then(function (response) {
                        if ($scope.transferRolesModel !== null && $scope.transferRolesModel !== undefined && $scope.transferRolesModel.applicantProfileId !== null && $scope.transferRolesModel.applicantProfileId !== undefined) {
                            $scope.applicantIsTransfered = true;
                        }
                        if ($scope.transferRolesModel !== null && $scope.transferRolesModel !== undefined && $scope.transferRolesModel.reviewerProfileId !== null && $scope.transferRolesModel.reviewerProfileId !== undefined) {
                            $scope.reviewerIsTransfered = true;
                        }
                        if ($scope.transferRolesModel !== null && $scope.transferRolesModel !== undefined && $scope.transferRolesModel.endorserProfileId !== null && $scope.transferRolesModel.endorserProfileId !== undefined) {
                            $scope.endorserIsTransfered = true;
                        }
                        if ($scope.transferRolesModel !== null && $scope.transferRolesModel !== undefined && $scope.transferRolesModel.approverProfileId !== null && $scope.transferRolesModel.approverProfileId !== undefined) {
                            $scope.approverIsTransfered = true;
                        }
                        $rootScope.isLoading = false;
                        $scope.transferResultDialog.center();
                        $scope.transferResultDialog.open();

                        var grid = $(".sce-listing").data("kendoGrid");
                        grid.dataSource.read();

                        onLoad();
                    }, function (err) {
                        $rootScope.isLoading = false;
                        var option = {
                            id: "dialogInfo",
                            title: "SCE Roles transferred failed.",
                            lableClose: "CLOSE",
                            content: err.message,
                            width: 300
                        };
                        utils.dialog.showDialog(option);
                    });
                    //todo
                    return true;
                }
                return false;
            },
            primary: true
        }
    ];

    $scope.transferResultActions = [{
        text: 'CLOSE',
        action: function () {
            $state.go(constants.state.scelist);
        }
    }];
    //#endregion

    $scope.confirmDialog = function (title, content) {
        return $("<div></div>").kendoConfirm({
            title: title,
            content: content
        }).data("kendoConfirm").open().result;
    };
    
    $scope.exportFile = function () {
        var token = $window.localStorage.getItem(constants.localStorage.userSecret);
        $window.open(
            constants.SCE.exportFile + "?Token=" + token,
            '_blank'
        );
    };
}]);