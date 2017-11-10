app.controller('asmDashBoardController', ['$rootScope', '$scope', '$state', 'constants', 'accessModule', 'asmDashBoardService', function ($rootScope, $scope, $state, constants, accessModule, asmDashBoardService) {
    $rootScope.$app.title = constants.titlePage.AsmDashBoard;

    $scope.hideActionCreateNewSce = false;  

    var currentUser = $rootScope.$app.userProfile;

    $scope.asmApplicant = checkUserHasRoleKey(currentUser.rolesKeyString, constants.role.roleKeys.asmApplicant);
    $scope.showEditEemuaButton = currentUser.isAsmAdmin;

    //fix
    $scope.dashboard = {
        asmRequiredUpdate: 0,
        asmPendingReview: 0,
        asmPendingEndorsement: 0,
        asmPendingApproval: 0,
        asmPendingShelving: 0,
        liveASM: 0,
        liveCritical: 0,
        liveNonCritical: 0,
        livePendingReShelving: 0,
        livePendingReApproval: 0,
        livePendingMOC: 0
    };

    //fix
    $scope.asmDashBoardFilter = {
        areasList: []
    };

    $scope.subscribedAreas = [];

    $scope.myPendingAsm = 0;

    $scope.myPendingRa = 0;

    $scope.totalArea = 0;

    $scope.pendingAsmDataSource = null;

    $scope.pendingRaDataSource = null;

    $scope.setDashBoardData = function (response) {
        $scope.dashboard.asmRequiredUpdate = response.data.asmRequiredUpdate;
        $scope.dashboard.asmPendingReview = response.data.asmPendingReview;
        $scope.dashboard.asmPendingEndorsement = response.data.asmPendingEndorsement;
        $scope.dashboard.asmPendingApproval = response.data.asmPendingApproval;
        $scope.dashboard.asmPendingShelving = response.data.asmPendingShelving;
        $scope.dashboard.liveASM = response.data.liveAsmShelved;
        $scope.dashboard.liveCritical = response.data.liveAsmCritical;
        $scope.dashboard.liveNonCritical = response.data.liveAsmNonCritical;
        $scope.dashboard.livePendingReShelving = response.data.liveAsmPendingReShelving;
        $scope.dashboard.livePendingReApproval = response.data.livePendingReApproval;
        $scope.dashboard.livePendingMOC = response.data.livePendingMoc;
        $("#asmLivePieChart").kendoChart({
            chartArea: {
                width: 165,
                height: 139
            },
            legend: {
                visible: true,
                position: "bottom"
            },
            seriesDefaults: {
                labels: {
                    visible: true,
                    position: "outsideEnd",
                    align: "column",
                    distance: 15,
                    background: "transparent",
                    template: "#= category #: #= value#"
                }
            },
            series: [
                {
                    type: "donut",
                    data: [
                        {
                            category: "Critical",
                            value: $scope.dashboard.liveCritical,
                            color: "#83B5E6",
                        },
                        {
                            category: "Non-Critical",
                            value: $scope.dashboard.liveNonCritical,
                            color: "#CBD34C",
                        }
                    ]
                }],
            tooltip: {
                visible: true,
                format: "{0}"
            }
        });
    };

    $scope.loadAreas = function () {
        $rootScope.isLoading = true;
        asmDashBoardService.getSubscribedAreas().then(function (response) {
            $rootScope.isLoading = false;
            if (response.data !== null && response.data !== undefined) {
                for (i = 0; i < response.data.length; i++) {
                    var area = {
                        areaId: response.data[i].areaId,
                        areaName: response.data[i].areaName,
                        isDefault: response.data[i].isDefault,
                        isChecked: true
                    };
                    $scope.subscribedAreas.push(area);
                }
                $scope.loadData();
            }
        }, function (err) {
            $rootScope.isLoading = false;
            utils.error.showErrorGet(err);
        });
    };

    var onLoad = function () {
        $rootScope.bigModuleTitle = "Alarm Shelving Application (ASM)";
        if (!accessModule.checkAccessModule(constants.module.asm, constants.allowAccess.allowRead) || !$scope.asmApplicant) {
            $scope.hideActionCreateNewAsm = true;
        }
        else {
            $scope.hideActionCreateNewAsm = false;
        }

        $scope.loadAreas();
        $("#multipleAreasMenu").kendoMenu({
            openOnClick: true
        });
    };
    onLoad();

    $scope.selectedChange = function () {
        $scope.loadData();
    };

    $scope.charChartTitle = "";

    $scope.currentYear = new Date().getFullYear();

    $scope.loadData = function () {
        //done
        $rootScope.isLoading = true;
        var selectedIds = [];
        var selectedAreasName = [];
        for (i = 0; i < $scope.subscribedAreas.length; i++) {
            if ($scope.subscribedAreas[i].isChecked) {
                selectedIds.push($scope.subscribedAreas[i].areaId);
                selectedAreasName.push($scope.subscribedAreas[i].areaName);
            }
        }
        var selectedAreas = selectedIds.join;
        // Gets Asm pending actions => done
        asmDashBoardService.getAsmPendingInDashboard({ areas: selectedAreas, take: "5" }).then(function (response) {
            $scope.pendingAsmDataSource = response.data;
            if (response.data !== null && response.data !== undefined && response.data.length > 0) {
                $scope.myPendingAsm = response.data[0].total;
            } else {
                $scope.myPendingAsm = 0;
            }
        }, function (error) {
            utils.error.showErrorGet(error);
        });


        //fix => done
        $scope.asmDashBoardFilter.areasList = selectedIds;

        //fix
        asmDashBoardService.getAsmDashBoard($scope.asmDashBoardFilter).then(function (response) {
            $rootScope.isLoading = false;
            $scope.setDashBoardData(response);
        }, function (error) {
            $rootScope.isLoading = false;
            utils.error.showErrorGet(error);
        });
        //$scope.charChartTitle = "EEMUA Standards ";
        //$scope.charChartTitle = $scope.charChartTitle + $scope.currentYear;
        $scope.charChartTitle = "Month";
        var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var colTitle = [];
        var barData = {
            psr_1_Data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            psr_2_Data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            offsite_Data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            complex_Data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

        };

        //update bar by barData
        $scope.updateCharData = function (data) {
            if (data !== null && data !== undefined && data.length > 0) {

                var monthAttr = "";

                for (var i = 0; i < monthNames.length; i++) {
                    monthAttr = monthNames[i].toLowerCase();
                    barData.psr_1_Data[i] = data[0][monthAttr];
                    barData.psr_2_Data[i] = data[1][monthAttr];
                    barData.offsite_Data[i] = data[2][monthAttr];
                    barData.complex_Data[i] = data[3][monthAttr];
                    if (i < data.length) {
                        if (data[i].hasOwnProperty('type')) {
                            colTitle[i] = data[i].type;
                        }
                    }
                }
            }

            $("#chart").kendoChart({
                title: {
                    text: $scope.charChartTitle,
                    position: "bottom",
                    color: "#3d3935",
                    font: "14px/20px 'museo_sans',sans-serif",
                    padding: {
                        top: 15
                    }
                },
                legend: {
                    position: "bottom"
                },
                seriesDefaults: {
                    type: "column"
                },
                series: [{
                    name: colTitle[0],
                    data: barData.psr_1_Data,
                    color: "#B9C7D4"
                }, {
                    name: colTitle[1],
                    data: barData.psr_2_Data,
                    color: "#4CCED3"
                }, {
                    name: colTitle[2],
                    data: barData.offsite_Data,
                    color: "#615E9B"
                }, {
                    name: colTitle[3],
                    data: barData.complex_Data,
                    color: "#F5D028"
                }],
                valueAxis: {
                    title: {
                        text: "Numbers of Alarm /Console /Hour",
                        font: "14px/20px 'museo_sans',sans-serif"
                    },
                    labels: {
                        format: "{0}"
                    },
                    line: {
                        visible: false
                    },
                    axisCrossingValue: 0
                },
                categoryAxis: {
                    //title: {
                    //    text: "Month",
                    //    font: "14px/20px 'museo_sans',sans-serif",
                    //    margin: {
                    //        right:65
                    //    },
                    //    padding: { top: 10 }
                    //},
                    categories: monthNames,
                    majorGridLines: {
                        visible: false
                    },
                    labels: {
                        padding: { top: 13 }
                    }
                },
                tooltip: {
                    visible: true,
                    format: "{0}%",
                    template: "#= series.name #: #= value #"
                }
            });
            $("#chart").css("position", "initial");
        }

        asmDashBoardService.getEEMUAData($scope.currentYear).then(function (response) {
            if (response.data !== null && response.data !== undefined && response.data.length > 0) {

                $scope.updateCharData(response.data);

            }
        });


    };

    $rootScope.filterByArea = [];

    $rootScope.filterByStatus = '';

    $rootScope.filterIsPendingReApprove = false;

    $rootScope.filterIsPendingReShelving = false;

    $rootScope.filterIsPendingMoc = false;

    $scope.filter = function (e) {
        e.preventDefault();
        var target = e.currentTarget;
        _.each($scope.subscribedAreas, function (m) {
            if (m.isChecked) {
                $rootScope.filterByArea.push(m.areaId);
            }
        });
        $rootScope.filterByStatus = $(target).data("status");
        if (($(target).data("pending-re-shelving") + '').toLowerCase() === "true") {
            $rootScope.filterIsPendingReShelving = $(target).data("pending-re-shelving");
        }
        if (($(target).data("pending-re-approve") + '').toLowerCase() === "true") {
            $rootScope.filterIsPendingReApprove = $(target).data("pending-re-approve");
        }
        if (($(target).data("pending-moc") + '').toLowerCase() === "true") {
            $rootScope.filterIsPendingMoc = $(target).data("pending-moc");
        }
        $state.go(constants.state.asmlist);

    };

    $scope.goToCreateAsm = function (e) {
        e.preventDefault();
        $state.go(constants.state.asmNewState);
    };

    $scope.openItemMenuAsmDashboard = function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        $("#ulContextMenuAsmEEMUAChart").slideToggle();
    };
    $scope.rawData = [];
    $scope.eemuaList = [];
    $scope.editEEMUA = function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        asmDashBoardService.getEEMUAData($scope.currentYear).then(function (response) {

            if (response.data !== null && response.data !== undefined && response.data.length > 0) {
                $scope.eemuaList = response.data;

                //declare temp to store data
                $scope.rawData = angular.copy(response.data);
                var now = new Date();
                $scope.currentMonth = now.getMonth() + 1;
            }
        });

        $("#model-eemua").show();
        $("#ulContextMenuAsmEEMUAChart").hide();
    }

    $scope.saveEEMUA = function (event) {
        $scope.rawData = angular.copy($scope.eemuaList);
        // console.log($scope.eemuaList);

        //prevent multi click
        $scope.inProgress = true;
        event.preventDefault();
        event.stopImmediatePropagation();

        // show loading
        $rootScope.isLoading = true;
        try {
            asmDashBoardService.saveEEMUAData($scope.eemuaList, $scope.currentYear);

            //add updateCharData
            $scope.updateCharData($scope.rawData);

            $("#model-eemua").hide();
            $scope.inProgress = false;
            $rootScope.isLoading = false;
        } catch (error) {
            utils.error.showErrorGet(error);
            $scope.inProgress = false;
            $rootScope.isLoading = false;
        }
    }
    $scope.cancelEEMUA = function () {
        $scope.eemuaList = [];
        $scope.eemuaList = angular.copy($scope.rawData);
        $("#model-eemua").hide();
    }
}]);