app.controller('sceDashBoardController',
    ['$rootScope', '$scope', '$interval', '$state', '$cookies', 'constants', 'accessModule', 'sceDashBoardService', 'appSettings',
        function ($rootScope, $scope, $interval, $state, $cookies, constants, accessModule, sceDashBoardService, appSettings) {

    $rootScope.$app.title = constants.titlePage.SceDashBoard;
    $scope.isAdmin = $rootScope.$app.userProfile.isAsmAdmin;
    $scope.hideActionCreateNewSce = false;

    $scope.dashboard = {
        sceRequiredUpdate: 0,
        scePendingReview: 0,
        scePendingEndorsement: 0,
        scePendingApproval: 0,
        scePendingAcknowledgement: 0,
        raRequiredUpdate: 0,
        raPendingReview: 0,
        raPendingEndorsement: 0,
        raPendingApproval: 0,
        raPendingAcknowledgement: 0,
        liveSCE: 0,
        livePM: 0,
        liveRM: 0,
        liveOthers: 0,
        livePendingReAcknowlegement: 0,
        livePendingReApproval: 0,
        livePendingMOC: 0
    };

    $scope.sceDashBoardFilter = {
        areasList: []
    };

    $scope.subscribedAreas = [];

    $scope.myPendingSce = 0;

    $scope.myPendingRa = 0;

    $scope.totalArea = 0;

    $scope.pendingSceDataSource = null;

    $scope.pendingRaDataSource = null;

    $scope.setDashBoardData = function (response) {
        $scope.dashboard.sceRequiredUpdate = response.data.sceRequiredUpdate;
        $scope.dashboard.scePendingReview = response.data.scePendingReview;
        $scope.dashboard.scePendingEndorsement = response.data.scePendingEndorsement;
        $scope.dashboard.scePendingApproval = response.data.scePendingApproval;
        $scope.dashboard.scePendingAcknowledgement = response.data.scePendingAcknowledgement;
        $scope.dashboard.raRequiredUpdate = response.data.raRequiredUpdate;
        $scope.dashboard.raPendingReview = response.data.raPendingReview;
        $scope.dashboard.raPendingEndorsement = response.data.raPendingEndorsement;
        $scope.dashboard.raPendingApproval = response.data.raPendingApproval;
        $scope.dashboard.raPendingAcknowledgement = response.data.raPendingAcknowledgement;
        $scope.dashboard.liveSCE = response.data.liveSCE;
        $scope.dashboard.livePM = response.data.livePM;
        $scope.dashboard.liveRM = response.data.liveRM;
        $scope.dashboard.liveOthers = response.data.liveOthers;
        $scope.dashboard.livePendingReAcknowlegement = response.data.livePendingReAcknowlegement;
        $scope.dashboard.livePendingReApproval = response.data.livePendingReApproval;
        $scope.dashboard.livePendingMOC = response.data.livePendingMOC;
        $("#sceLivePieChart").kendoChart({
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
                    distance: 9,
                    background: "transparent",
                    template: "#= category #: #= value#"
                }
            },
            series: [{
                type: "donut",
                data: [
                    {
                        category: "RM",
                        value: $scope.dashboard.liveRM,
                        color: "#83B5E6"
                    },
                    {
                        category: "PM",
                        value: $scope.dashboard.livePM,
                        color: "#CBD34C"
                    },
                    {
                        category: "Others",
                        value: $scope.dashboard.liveOthers,
                        color: "#A9F5BC"
                    }]
            }],
            tooltip: {
                visible: true,
                format: "{0}"
            }
        });
    };

    $scope.loadAreas = function () {
        $rootScope.isLoading = true;
        sceDashBoardService.getSubscribedAreas().then(function (response) {
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
        $rootScope.bigModuleTitle = "Safety Critical Equipment (SCE)";

        if (!accessModule.checkAccessModule(constants.module.sce, constants.allowAccess.allowWrite)) {
            $scope.hideActionCreateNewSce = true;
        }
        else {
            $scope.hideActionCreateNewSce = false;
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
        // Gets Sce pending actions
        sceDashBoardService.getScePendingInDashboard({ areas: selectedAreas, take: "5" }).then(function (response) {
            $scope.pendingSceDataSource = response.data;
            if (response.data !== null && response.data !== undefined && response.data.length > 0) {
                $scope.myPendingSce = response.data[0].total;
            } else {
                $scope.myPendingSce = 0;
            }
        }, function (error) {
            utils.error.showErrorGet(error);
        });

        // Gets ra pending actions
        sceDashBoardService.getRaPendingInDashboard({ areas: selectedAreas, take: "5" }).then(function (response) {
            $scope.pendingRaDataSource = response.data;
            if (response.data !== null && response.data !== undefined && response.data.length > 0) {
                $scope.myPendingRa = response.data[0].total;
            } else {
                $scope.myPendingRa = 0;
            }
        }, function (error) {
            utils.error.showErrorGet(error);
        });
        $scope.sceDashBoardFilter.areasList = selectedIds;

        sceDashBoardService.getSCEDashBoard($scope.sceDashBoardFilter).then(function (response) {
            $rootScope.isLoading = false;
            $scope.setDashBoardData(response);
        }, function (error) {
            $rootScope.isLoading = false;
            utils.error.showErrorGet(error);
        });
        $scope.charChartTitle = "PPMSB ";
        $scope.charChartTitle = $scope.charChartTitle + $scope.currentYear + "(Areas ";

        for (i = 0; i < selectedAreasName.length; i++) {
            if (i !== selectedAreasName.length - 1) {
                $scope.charChartTitle = $scope.charChartTitle + selectedAreasName[i] + ", ";
            } else {
                $scope.charChartTitle = $scope.charChartTitle + selectedAreasName[i] + ")";
            }
        }
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var currentDate = new Date();

        $("#barChart").kendoChart({
            dataSource: {
                transport: {
                    read: function (options) {
                        sceDashBoardService.getSCELiveStatistic($scope.sceDashBoardFilter).then(function (response) {
                            if (response.data !== null && response.data !== undefined && response.data.length > 0) {
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
            },
            legend: {
                position: "bottom"
            },
            title: {
                text: $scope.charChartTitle,
                position: "bottom",
                color: "#3d3935",
                font: "14px/20px 'museo_sans',sans-serif"
            },
            seriesColors: ["#83B5E6", "#CBD34C", "#A9F5BC"],
            series: [
                {
                    field: "rm",
                    name: "RM",
                    stack: true,
                    color: function (point) {
                        if (point.dataItem.month === monthNames[currentDate.getMonth()]) {
                            return "#83B5E6";
                        } else {
                            return "#898989";
                        }
                    }
                },
                {
                    field: "pm",
                    name: "PM",
                    stack: true,
                    color: function (point) {
                        if (point.dataItem.month === monthNames[currentDate.getMonth()]) {
                            return "#CBD34C";
                        } else {
                            return "#CBCBCB";
                        }
                    }
                },
                {
                    field: "others",
                    name: "Others",
                    stack: true,
                    color: function (point) {
                        if (point.dataItem.month === monthNames[currentDate.getMonth()]) {
                            return "#A9F5BC";
                        } else {
                            return "#E6E6E6";
                        }
                    }
                }
            ],
            categoryAxis: {
                field: "month",
                majorGridLines: {
                    visible: false
                }
            },
            tooltip: {
                visible: true,
                template: "#= series.name #: #= value #"
            }
        });
    };

    $rootScope.filterByArea = [];

    $rootScope.filterByStatus = '';

    $rootScope.filterIsPendingReApprove = false;

    $rootScope.filterIsPendingReAcknowledge = false;

    $rootScope.filterIsPendingMoc = false;

    $scope.filter = function (e) {
        e.preventDefault();
        var target = e.currentTarget;
        _.each($scope.subscribedAreas, function (m) {
            if (m.isChecked) {
                $rootScope.filterByArea.push(m.areaId);
            }
        });
        var module = $(target).data("module");
        $rootScope.filterByStatus = $(target).data("status");
        if (($(target).data("pending-re-acknowledge") + '').toLowerCase() === "true") {
            $rootScope.filterIsPendingReAcknowledge = $(target).data("pending-re-acknowledge");
        }
        if (($(target).data("pending-re-approve") + '').toLowerCase() === "true") {
            $rootScope.filterIsPendingReApprove = $(target).data("pending-re-approve");
        }
        if (($(target).data("pending-moc") + '').toLowerCase() === "true") {
            $rootScope.filterIsPendingMoc = $(target).data("pending-moc");
        }

        switch (module) {
            case "sce":
                $state.go(constants.state.scelist);
                break;
            case "ra":
                $state.go(constants.state.raList);
                break;
        }
    };

    $scope.goToCreateSce = function (e) {
        e.preventDefault();
        $state.go(constants.state.scenew);
    };
}]);