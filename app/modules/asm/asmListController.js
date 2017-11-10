app.controller('asmListController',
    ['$rootScope', '$state', '$stateParams', '$scope', '$location', '$timeout', 'asmServices', 'statusService', 'areaService', 'constants',
function ($rootScope, $state, $stateParams, $scope, $location, $timeout, asmServices, statusService, areaService, constants) {
    var indexTab = 0;
    $scope.alarmId = $stateParams.alarmId;
    $scope.isCalling = true;
    $scope.dialogOption = {
        id: "dialogInfo",
        title: "",
        lableClose: "CLOSE",
        content: "",
        width: 300
    };

    // total my asm listing model
    $scope.totalMyAsmListing = {
        totalMyAsm: 0,
        totalMyPendingAction: 0
    };

    // listing model
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
        take: 0
    };

    var onLoad = function () {
        $rootScope.bigModuleTitle = "Alarm Shelving Application (ASM)";
        // Set page title
        $rootScope.$app.title = constants.titlePage.asmListing;

        // Is current user has applicant role
        $scope.hasApplicantRole = ("," + $rootScope.$app.userProfile.rolesKeyString + ",").indexOf(",21,") >= 0;

        // Get number of my asm and my pending action
        asmServices.getTotalMyPedingAsm().then(function (response) {
            $scope.totalMyAsmListing = {
                totalMyAsm: response.data.myAsmNumber,
                totalMyPendingAction: response.data.myPendingActionNumber
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
    };

    $scope.initData = function (options, isPendingReApproval, isPendingReShelving, isPendingMoc) {
        kendo.ui.progress($('.asm-listing'), false);
        // reset input data
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
                field: "isPendingReShelving",
                valueBit: true,
                isActive: isPendingReShelving === true
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

            _.each(optionfilters, function (m) {
                var date;
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

                    case "area":
                        filters[1].valueString = filters[1].valueString + "," + m.value;
                        filters[1].isActive = true;
                        break;

                    case "status":
                        filters[2].valueString = filters[2].valueString + "," + m.value;
                        filters[2].isActive = true;
                        break;
                    case "lapse":
                        filters[3].ValueDecimalFrom = m.value;
                        filters[3].isActive = true;
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

                    $scope.initData(options, $rootScope.filterIsPendingReApprove, $rootScope.filterIsPendingReShelving, $rootScope.filterIsPendingMoc);

                    var isPreFilter = $rootScope.filterByArea !== null && $rootScope.filterByArea !== undefined && $rootScope.filterByArea.length > 0;

                    $scope.needToCallServer++;

                    if (isPreFilter && $scope.isFilter === 0) {
                        var ds = $(".asm-listing").data("kendoGrid").dataSource;
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
                            $("#asmTab").data("kendoTabStrip").select(2);
                            $scope.model.view = "PendingMyAction";
                            $rootScope.goToMyPendingAction = false;
                        }
                        asmServices.getAsmListing($scope.model).then(function (response) {
                            if (response.data !== null && response.data !== undefined) {
                                options.success(response.data);
                            } else {
                                options.success([]);
                            }
                            // reset value
                            $rootScope.filterByArea = null;
                            $rootScope.filterByStatus = '';
                            $rootScope.filterIsPendingReApprove = false;
                            $rootScope.filterIsPendingReShelving = false;
                            $rootScope.filterIsPendingMoc = false;

                            $rootScope.isLoading = false;
                        }, function (error) {
                            options.error([]);
                            utils.error.showErrorGet(error);
                            // reset value
                            $rootScope.filterByArea = null;
                            $rootScope.filterByStatus = '';
                            $rootScope.filterIsPendingReApprove = false;
                            $rootScope.filterIsPendingReShelving = false;
                            $rootScope.filterIsPendingMoc = false;

                            $rootScope.isLoading = false;
                        });
                    }
                    else {
                        options.success([]);
                        $('.asm-listing .k-grid-norecords-template').hide();
                    }
                }
                else {
                    options.success([]);
                    $('.asm-listing .k-grid-norecords-template').hide();
                }
            }
        },
        schema: {
            model: {
                fields: {
                    area: { type: "string" },
                    tagNo: { type: "string" },
                    alarmNo: { type: "string" },
                    description: { type: "string" },
                    applicationDate: { type: "date" },
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
                dataSource: {
                    transport: {
                        read: function (options) {
                            areaService.getAreas().then(function (response) {
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
                },
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
            field: "alarmNo",
            title: "ASM No.",
            width: "127px",
            attributes: {
                "class": "cell_alarm_no"
            },
            filterable: {
                extra: false
            }
        }, {
            field: "description",
            title: "Description",
            filterable: {
                extra: false
            },
            attributes: {
                "class": "cell_description"
            }
        }, {
            field: "applicationDate",
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
                dataSource: {
                    transport: {
                        read: function (options) {
                            statusService.getListStatusByModuleName(constants.module.asm).then(function (response) {
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
                },
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
                    case "21":
                        retVal = "<strong class='text-grey'>" + dataItem.status + "</strong>";
                        break;
                    case "22":
                    case "23":
                    case "24":
                    case "25":
                    case "26":
                        retVal = "<strong class='text-light-orange'>" + dataItem.status + "</strong>";
                        break;
                    case "28":
                    case "30":
                        retVal = "<strong class='text-green'>" + dataItem.status + "</strong>";
                        break;
                    case "31":
                    case "32":
                    case "33":
                    case "34":
                        retVal = "<strong class='text-green'>ASM Live</strong>";
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
                    _.each(dataArray, function (item) {
                        outPut += "<li><span><i class=\"icon-hourglass\"></i> " + item + "</span></li>";
                    });
                }
                if (outPut !== '') {
                    outPut = "<ul class=\"live_data\">"
                                + outPut +
                            "</ul>";
                }

                return "<button class=\"btn-grid-item-menu\" type=\"button\" data-ng-click=\"openItemMenu($event)\"><i class=\"icon-dot-3 icon-btn-grid-item-menu\"></i></button>" +
                        outPut +
                        "<ul class=\"grid-item-menu\" data-id='" + dataItem.alarmId + "' style=\"display: none; background-color: #fff; border: 1px solid #ccc;\" >" +
                            // Bind view detail menu item
                            "<li><a href=\"#\" data-ng-click=\"viewDetail('" + dataItem.statusKey + "', '" + dataItem.alarmId + "')\">View</a></li>" +
                            // Bind transfer roles menu item
                            ($rootScope.$app.userProfile.isAsmAdmin && parseInt(dataItem.statusKey) > 21 ? "<li><a href =\"#\" data-ng-click=\"showTransferRolesKendoDiaglog('" + dataItem.alarmId + "')\">Transfer Roles...</a></li>" : "") +
                            // Bind transfer menu item
                            ($scope.hasApplicantRole && $rootScope.$app.userProfile.userProfileId === dataItem.applicantId && parseInt(dataItem.statusKey) > 21 ? "<li><a href=\"#\" data-ng-click=\"transferAlarm('" + dataItem.alarmId + "')\">Transfer</a></li>" : "") +
                            // Bind copy alarm menu item
                            ($scope.hasApplicantRole && parseInt(dataItem.statusKey) >= 26 ? "<li><a href=\"#\" data-ng-click=\"copyAlarm('" + dataItem.alarmId + "', '" + dataItem.alarmNo + "')\">Copy Alarm</li>" : "") +
                            // Bind cancel alarm menu item
                            ((($rootScope.$app.userProfile.isAsmAdmin
                                || ($scope.hasApplicantRole && $rootScope.$app.userProfile.userProfileId === dataItem.applicantId))
                                && (parseInt(dataItem.statusKey) < 26)) ?
                            "<li><a href=\"#\" data-ng-click=\"cancelShelving('" + dataItem.alarmId + "')\">Cancel Shelving</a></li>" : "") +
                           // Bind print alarm menu item                    
                            (parseInt(dataItem.statusKey) > 27 ? "<li><a href data-ng-click='asmPrint(\"" + dataItem.alarmId + "\")' data-ng-hide='" + (dataItem.statusKey === "1") + "'>Print</a></li>" : "") +
                           // Bind alarm status log menu item
                            "<li><a href=\"#\" data-ng-click=\"statusLog('" + dataItem.alarmId + "')\">Status Log</a></li>" +
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
            template: "<kendo-tabstrip id='asmTab'>" +
                            "<ul>" +
                                "<li data-ng-click=\"onChangeTab(0)\" class=\"k-state-active\">All</li>" +
                                "<li data-ng-click=\"onChangeTab(1)\">My ASM <small>({{totalMyAsmListing.totalMyAsm}})</small></li>" +
                                "<li data-ng-click=\"onChangeTab(2)\">Pending My Action <small>({{totalMyAsmListing.totalMyPendingAction}})</small></li>" +
                            "</ul>" +
                        "</kendo-tabstrip>"
        }],
        selectable: "row",
        change: function (e) {
            e.preventDefault();
            var dataItem = this.dataItem(this.select());
            $scope.viewDetail(dataItem.statusKey, dataItem.alarmId);
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


    $scope.asmPrint = function (id) {
        window.open('/print/asm/' + id, '_blank');
    };

    $scope.viewDetail = function (statusKey, alarmId) {
        if (statusKey === "21") {
            $state.go(constants.state.asmEditDraft, { alarmId: alarmId });
        } else {
            $state.go(constants.state.asmDetail, { alarmId: alarmId });
        }
    };

    $scope.statusLog = function (id) {
        $state.go(constants.state.asmStatusLog, { alarmId: id });
    }

    $scope.alarmIdSelected = "";

    $scope.transferAlarm = function (id) {
        $scope.alarmIdSelected = id;
        $scope.transferDialog.open();
    };

    $scope.cancelShelving = function (id) {
        $scope.confirmDialog("Cancel Alarm Shelving", "Are you sure you want to cancel this shelving?").then(function () {
            $rootScope.isLoading = true;
            try {
                asmServices.cancelShelving(id).then(function (response) {
                    if (response.data === true) {
                        $scope.dialogOption.title = "Alarm Shelving Canceled";
                        $scope.dialogOption.content = "Alarm Shelving form has been canceled successfully";
                        utils.dialog.showDialog($scope.dialogOption, function () {
                            var grid = $(".asm-listing").data("kendoGrid");
                            grid.dataSource.read();
                            onLoad();
                        });
                    }

                    $rootScope.isLoading = false;
                }, function (error) {
                    $rootScope.isLoading = false;

                    $scope.dialogOption.title = "Alarm Shelving Cancel Failed";
                    $scope.dialogOption.content = error.message;
                    utils.dialog.showDialog($scope.dialogOption);
                });
            }
            catch (err) {
                $rootScope.isLoading = false;
            }
        }, function () {
            // Chooses cancel, do nothing
        });
    };

    //$scope.asmPrint = function (id) {
    //    window.open('/print/asm/' + id, '_blank');
    //};

    $scope.alarmCopyDialog = function (title, content) {
        return $("<div></div>").kendoConfirm({
            title: title,
            content: content,
            actions: [{ text: "COPY", primary: true },
                { text: "CANCEL" }]
        }).data("kendoConfirm").open().result;
    };

    $scope.copyAlarm = function (id, alarmNo) {
        $scope.alarmCopyDialog("Copy Alarm", "Existing alarm shelving request No. <strong>" + alarmNo + "</strong> information will be copied into new Alarm request. Are you sure to proceed?").then(function () {
            $state.go(constants.state.asmCopy, { alarmId: id });
        }, function () {
            // Chooses cancel, do nothing
        });
    }

    $scope.onChangeTab = function (index) {
        indexTab = index;
        var grid = $(".asm-listing").data("kendoGrid");

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
                $scope.model.view = "MyASM";
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

    //#region Transfer ASM
    $scope.transferAlarmModel = {
        newApplicantId: "",
        comment: ""
    };

    $scope.transferAlarmAction = [
        { text: 'CANCEL' },
        {
            text: 'TRANSFER',
            action: function () {
                $rootScope.isLoading = true;
                asmServices.transferAsm($scope.alarmIdSelected, $scope.transferAlarmModel).then(function (response) {
                    $rootScope.isLoading = false;
                    $scope.dialogOption.title = "ASM Transferred";
                    $scope.dialogOption.content = "This ASM is now transferred to <strong>" + response.data + "</strong>. A notification has been sent to alert the new applicant.";
                    utils.dialog.showDialog($scope.dialogOption, function () {
                        $state.go(constants.state.asmlist);
                        if ($state.current.name === constants.state.asmlist) {
                            var grid = $(".asm-listing").data("kendoGrid");
                            switch (indexTab) {
                                case 0:
                                    $scope.model.view = "All";
                                    $scope.isCalling = true;
                                    grid.dataSource.read();
                                    break;
                                case 1:
                                    $scope.model.view = "MyASM";
                                    $scope.isCalling = true;
                                    grid.dataSource.read();
                                    break;
                                case 2:
                                    $scope.model.view = "PendingMyAction";
                                    $scope.isCalling = true;
                                    grid.dataSource.read();
                                    break;
                            }
                        }
                    });
                    onLoad();
                }, function (error) {
                    var option = {
                        id: "dialogInfo",
                        title: "ASM Transfer Failure",
                        lableClose: "CLOSE",
                        content: error.message,
                        width: 300
                    };
                    $rootScope.isLoading = false;
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
                    asmServices.getApplicantsForTransferInSameAreas($scope.alarmIdSelected, $scope.applicantSearchTextForApplicant).then(function (response) {
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

    $scope.mocApproverToTransfer = null;
    $scope.backupMocApprover = null;

    $scope.applicantSearchText = "";
    // Bind new applicant to transfer
    $scope.newApplicantOptions = {
        autoBind: false,
        optionLabel: "Select new Applicant",
        filter: "contains",
        filtering: function (e) {
            $scope.applicantSearchText = e.filter == null || e.filter == undefined ? "" : e.filter.value;
        },
        dataSource: {
            serverFiltering: true,
            transport: {
                read: function (options) {
                    asmServices.getApplicantsForTransferInSameAreas($scope.transferAlarmId, $scope.applicantSearchText).then(function (response) {
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

    $scope.reviewerForTransferSearchText = "";

    $scope.reviewerForTransferDataSource = {
        serverFiltering: true,
        transport: {
            read: function (options) {
                asmServices.getPreData('reviewers', null, $scope.reviewerForTransferSearchText).then(function (response) {
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
                asmServices.getPreData('endorsers', null, $scope.endorserSearchText).then(function (response) {
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
                asmServices.getPreData('approvers', null, $scope.approverSearchText).then(function (response) {
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

    $scope.mocApproverSearchText = "";

    $scope.mocApproverDatasource = {
        serverFiltering: true,
        transport: {
            read: function (options) {
                asmServices.getPreData('mocapprovers', null, $scope.mocApproverSearchText).then(function (response) {
                    if (response.data !== null && response.data !== undefined && response.data.length > 0) {
                        options.success(response.data);
                    } else {
                        options.success([]);
                    }
                }, function (error) {
                    option.error([]);
                    utils.error.showErrorGet(error);
                });
            }
        }
    };

    $scope.transferAlarmId = "";

    $scope.pendingReview = false;

    $scope.pendingEndorse = false;

    $scope.pendingApprove = false;

    $scope.pendingMocApprove = false;
    $scope.showTransferRolesKendoDiaglog = function (alarmId) {
        $scope.transferAlarmId = alarmId;
        $rootScope.isLoading = true;
        asmServices.getPendingPeopleForTransferingRoles(alarmId).then(function (response) {
            $rootScope.isLoading = false;
            if (response.data !== null && response.data !== undefined) {
                var statusKey = response.data.statusKey;
                $scope.applicantToTransfer = response.data.applicant;
                $scope.backupApplicant = $scope.applicantToTransfer;
                switch (statusKey) {
                    case "24": {
                        $scope.pendingReview = true;
                        $scope.pendingEndorse = false;
                        $scope.pendingApprove = false;
                        $scope.pendingMocApprove = false;
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
                    case "23": {
                        $scope.pendingReview = false;
                        $scope.pendingEndorse = true;
                        $scope.pendingApprove = false;
                        $scope.pendingMocApprove = false;
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
                    case "25": {
                        $scope.pendingReview = false;
                        $scope.pendingEndorse = false;
                        $scope.pendingApprove = true;
                        $scope.pendingMocApprove = false;
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
                    case "32": {
                        $scope.pendingReview = false;
                        $scope.pendingEndorse = false;
                        $scope.pendingApprove = false;
                        $scope.pendingMocApprove = true;
                        console.log($scope.pendingMocApprove);
                        $scope.mocApproverToTransfer = response.data.pendingPerson;
                        $scope.backupMocApprover = $scope.mocApproverToTransfer;
                        $scope.reviewerToTransfer = null;
                        $scope.endorserToTransfer = null;

                        $scope.mocApproverOptions = {
                            autoBind: false,
                            optionLabel: "Select MOC Approver",
                            filter: "contains",
                            filtering: function (e) {
                                $scope.mocApproverSearchText = e.filter === null || e.filter === undefined ? "" : e.filter.value;
                            },
                            dataSource: $scope.mocApproverDatasource,
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
                    default: {
                        $scope.pendingReview = false;
                        $scope.pendingEndorse = false;
                        $scope.pendingApprove = false;
                        $scope.pendingMocApprove = false;
                        $scope.reviewerToTransfer = null;
                        $scope.endorserToTransfer = null;
                        $scope.approverToTransfer = null;
                        $scope.mocApproverToTransfer = null;
                        break;
                    }
                }
                $scope.alarmTransferRolesKendoDiaglog.center();
                $scope.alarmTransferRolesKendoDiaglog.open();
            }
        }, function (err) {
            $rootScope.isLoading = false;
            utils.error.showErrorGet(err);
        });
    };

    $scope.adminComment = "";
    $scope.applicantIsTransfered = false;
    $scope.reviewerIsTransfered = false;
    $scope.endorserIsTransfered = false;
    $scope.approverIsTransfered = false;
    $scope.mocApproverIsTransfered = false;
    $scope.alarmTransferRoles = [
        { text: 'CANCEL' },
        {
            text: 'CONFIRM',
            action: function () {
                if ($scope.validators.alarmTransfer.validate()) {
                    $scope.transferRolesModel = {
                        applicantProfileId: $scope.applicantToTransfer.userProfileId !== $scope.backupApplicant.userProfileId && $scope.applicantToTransfer.userProfileId !== "" ? $scope.applicantToTransfer.userProfileId : null,
                        reviewerProfileId: $scope.pendingReview && $scope.reviewerToTransfer.userProfileId !== $scope.backupReviewer.userProfileId && $scope.reviewerToTransfer.userProfileId !== "" ? $scope.reviewerToTransfer.userProfileId : null,
                        endorserProfileId: $scope.pendingEndorse && $scope.endorserToTransfer.userProfileId !== $scope.backupEndorser.userProfileId && $scope.endorserToTransfer.userProfileId !== "" ? $scope.endorserToTransfer.userProfileId : null,
                        approverProfileId: $scope.pendingApprove && $scope.approverToTransfer.userProfileId !== $scope.backupApprover.userProfileId && $scope.approverToTransfer.userProfileId !== "" ? $scope.approverToTransfer.userProfileId : null,
                        mocApproverProfileId: $scope.pendingMocApprove && $scope.mocApproverToTransfer.userProfileId !== $scope.backupMocApprover.userProfileId && $scope.mocApproverToTransfer.userProfileId !== "" ? $scope.mocApproverToTransfer.userProfileId : null,
                        comment: $scope.adminComment
                    };
                    if (($scope.transferRolesModel.applicantProfileId === null || $scope.transferRolesModel.applicantProfileId === undefined) && ($scope.transferRolesModel.reviewerProfileId === null || $scope.transferRolesModel.reviewerProfileId === undefined) && ($scope.transferRolesModel.endorserProfileId === null || $scope.transferRolesModel.endorserProfileId === undefined) && ($scope.transferRolesModel.approverProfileId === null || $scope.transferRolesModel.approverProfileId === undefined) && ($scope.transferRolesModel.mocApproverProfileId === null || $scope.transferRolesModel.mocApproverProfileId === undefined)) {
                        isProcessTriggerClick = true;
                        return true;
                    }
                    $rootScope.isLoading = true;
                    asmServices.transferRoles($scope.transferAlarmId, $scope.transferRolesModel).then(function (response) {
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
                        if ($scope.transferRolesModel !== null && $scope.transferRolesModel !== undefined && $scope.transferRolesModel.mocApproverProfileId !== null && $scope.transferRolesModel.mocApproverProfileId !== undefined) {
                            $scope.mocApproverIsTransfered = true;
                        }
                        $rootScope.isLoading = false;
                        $scope.transferResultDialog.center();
                        $scope.transferResultDialog.open();
                        if ($state.current.name === constants.state.asmlist) {
                            var grid = $(".asm-listing").data("kendoGrid");
                            grid.dataSource.read();
                        }
                        onLoad();
                    }, function (err) {
                        $rootScope.isLoading = false;
                        var option = {
                            id: "dialogInfo",
                            title: "ASM Roles transferred failed.",
                            lableClose: "CLOSE",
                            content: err.message,
                            width: 300
                        };
                        utils.dialog.showDialog(option);
                    });
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
            $state.go(constants.state.asmlist);
        }
    }];
    //#endregion

    $scope.confirmDialog = function (title, content) {
        return $("<div></div>").kendoConfirm({
            title: title,
            content: content
        }).data("kendoConfirm").open().result;
    };
}]);