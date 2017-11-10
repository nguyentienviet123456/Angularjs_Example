app.controller('raController', ['$rootScope', '$window', '$state', '$sce', '$stateParams', '$scope', '$location', 'authService', 'appSettings', 'constants', 'raServices',
    function ($rootScope, $window, $state, $sce, $stateParams, $scope, $location, authService, appSettings, constants, raServices) {
        var isProcessTriggerClick = true;

        $scope.statusLog = function () {
            $state.go(constants.state.raStatusLog, { sceId: $stateParams.sceId, raId: $stateParams.raId });
        }

        //Get user who loged in
        $scope.userProfile = $rootScope.$app.userProfile;
        $scope.actionResponse = "";
        $scope.statusTypeResponse = "";
        $scope.personInCharge = {
            userName: "",
            userProfileId: "",
            staffNo: "",
            remarks: "",
            dateTime: "",
            status: ""
        };
        $scope.isFacilitator = false;
        $scope.isEndorser = false;
        $scope.isApprover = false;

        $scope.isAdmin = $scope.userProfile.isAdmin;
        $scope.showMocFlow = false;
        $scope.hasApplicantRole = ("," + $rootScope.$app.userProfile.rolesKeyString + ",").indexOf(",1,") >= 0;
        $scope.hasReviewerRole = ("," + $rootScope.$app.userProfile.rolesKeyString + ",").indexOf(",9,") >= 0;
        $scope.hasEndorserRole = ("," + $rootScope.$app.userProfile.rolesKeyString + ",").indexOf(",10,") >= 0;
        $scope.hasApproverRole = ("," + $rootScope.$app.userProfile.rolesKeyString + ",").indexOf(",11,") >= 0;
        $scope.hasMOCApproverRole = ("," + $rootScope.$app.userProfile.rolesKeyString + ",").indexOf(",15,") >= 0;
        $scope.isApplicant = false;
        $scope.isMocApprover = false;
        $scope.RaStatus = "";
        //region "RA Create new"
        $scope.selectedFacilitator = "";
        $scope.selectedEndorser = "";
        $scope.selectedApprover = "";
        //$scope.applicantToTransfer = "";
        $scope.reviewerToTransfer = "";
        $scope.endorserToTransfer = "";
        $scope.approverToTransfer = "";
        $scope.selectedPeopleSeverity = null;
        $scope.selectedEnvironmentSeverity = null;
        $scope.selectedAssetSeverity = null;
        $scope.selectedReputationSeverity = null;
        $scope.selectedPeopleLikelihood = null;
        $scope.selectedEnvironmentLikelihood = null;
        $scope.selectedAssetLikelihood = null;
        $scope.selectedReputationLikelihood = null;
        $scope.peopleRiskValue = 0;
        $scope.peopleRiskDescription = "";
        $scope.peopleRiskId = "";
        $scope.environmentRiskValue = 0;
        $scope.environmentRiskDescription = "";
        $scope.environmentRiskId = "";
        $scope.assetRiskValue = 0;
        $scope.assetRiskDescription = "";
        $scope.assetRiskId = "";
        $scope.reputationRiskValue = 0;
        $scope.reputationRiskDescription = "";
        $scope.reputationRiskId = "";
        $scope.riskLevel = 0;
        $scope.riskDescription = "N/A";
        $scope.teamMembers = [];

        $scope.teamMember = {
            userProfileId: "",
            userId: "",
            userName: "",
            position: "",
            image: ""
        };

        $scope.sceLink = "/sce_detail/" + $stateParams.sceId;

        $scope.initialData = {
            areaId: "",
            areaName: "",
            sceNo: "",
            tagNo: ""
        };

        $scope.peopleRisk = {
            riskId: "",
            riskValue: "",
            riskDescription: ""
        };

        $scope.environmentRisk = {
            riskId: "",
            riskValue: "",
            riskDescription: ""
        };

        $scope.assetRisk = {
            riskId: "",
            riskValue: "",
            riskDescription: ""
        };

        $scope.reputationRisk = {
            riskId: "",
            riskValue: "",
            riskDescription: ""
        };

        //$scope.changeSwithText = function () {
        //    if ($(".k-switch-container .k-switch-label-on").length) {
        //        $(".k-switch-container .k-switch-label-on").text("YES");
        //    }
        //    if ($(".k-switch-container .k-switch-label-off").length) {
        //        $(".k-switch-container .k-switch-label-off").text("NO");
        //    }
        //};

        $scope.showUpdateMOCKendoDialog = function () {
            utils.clearValid();
            $scope.updateMOCKendoDialog.center();
            $scope.updateMOCKendoDialog.open();
            //$scope.changeSwithText();
        };

        $scope.showRejectMocDialog = function () {
            utils.clearValid();
            $scope.rejectMocDialog.center();
            $scope.rejectMocDialog.open();
        }

        $scope.showApproveMocDialog = function () {
            utils.clearValid();
            $scope.approveMocDialog.center();
            $scope.approveMocDialog.open();
        }

        $scope.getInitialData = function (isCopyRa) {
            $rootScope.isLoading = true;
            raServices.getInitialData($stateParams.sceId).then(function (response) {
                if (response.data !== null && response.data !== undefined) {
                    $scope.initialData.areaId = response.data.areaId;
                    $scope.initialData.areaName = response.data.areaName;
                    $scope.initialData.sceNo = response.data.sceNo;
                    $scope.initialData.tagNo = response.data.tagNo;
                }

                if (isCopyRa === null || isCopyRa === undefined || isCopyRa === false) {
                    $rootScope.isLoading = false;
                }
                else {
                    $scope.$broadcast('initialDataCopy', $stateParams.sceId);
                }

            }, function (err) {
                $rootScope.isLoading = false;
                utils.error.showErrorGet(err);
            });
        };

        $scope.$on('initialDataCopy', function (event, sceId) {
            raServices.getInfoRaCopy(sceId).then(function (response) {
                $rootScope.isLoading = false;
                $scope.selectedFacilitator = {
                    userProfileId: response.data.reviewerProfileId,
                    userName: response.data.reviewerName,
                    image: response.data.reviewerImage
                };

                $scope.selectedEndorser = {
                    userProfileId: response.data.endorserProfileId,
                    userName: response.data.endorserName,
                    image: response.data.endorserImage
                };

                $scope.selectedApprover = {
                    userProfileId: response.data.approverProfileId,
                    userName: response.data.approverName,
                    image: response.data.approverImage
                };

                $scope.raHeaderModel.consequences = response.data.consequences;

            }, function (error) {
                $rootScope.isLoading = false;
            });
        });

        $scope.setRiskLevel = function (peopleRisk, environmentRisk, assetRisk, reputationRisk) {
            $scope.riskLevel = Math.max(peopleRisk, environmentRisk, assetRisk, reputationRisk);
            $scope.setRiskClass("#riskLevel", $scope.riskLevel, true);
            if ($scope.riskLevel === 0) $scope.riskDescription === "N/A";
            else {
                switch ($scope.riskLevel) {
                    case peopleRisk:
                        $scope.riskDescription = $scope.peopleRiskDescription;
                        break;
                    case environmentRisk:
                        $scope.riskDescription = $scope.environmentRiskDescription;
                        break;
                    case assetRisk:
                        $scope.riskDescription = $scope.assetRiskDescription;
                        break;
                    case reputationRisk:
                        $scope.riskDescription = $scope.reputationRiskDescription;
                        break;
                }
            }
            $("#riskLevel").text($scope.riskDescription);
        };

        $scope.setRiskIdentification = function (data, type) {
            if (data === null || data === undefined) {
                switch (type) {
                    case constants.RA.consequenceType.people:
                        $("#peopleRisk").html("");
                        $scope.peopleRiskValue = 0;
                        $scope.peopleRiskDescription = "";
                        $scope.setRiskClass("#peopleRisk", 0, false);
                        $scope.setRiskLevel($scope.peopleRiskValue, $scope.environmentRiskValue, $scope.assetRiskValue, $scope.reputationRiskValue);
                        break;
                    case constants.RA.consequenceType.environment:
                        $("#environmentRisk").text("");
                        $scope.environmentRiskValue = 0;
                        $scope.environmentRiskDescription = "";
                        $scope.setRiskClass("#environmentRisk", 0, false);
                        $scope.setRiskLevel($scope.peopleRiskValue, $scope.environmentRiskValue, $scope.assetRiskValue, $scope.reputationRiskValue);
                        break;
                    case constants.RA.consequenceType.asset:
                        $("#assetRisk").text("");
                        $scope.assetRiskValue = 0;
                        $scope.assetRiskDescription = "";
                        $scope.setRiskClass("#assetRisk", 0, false);
                        $scope.setRiskLevel($scope.peopleRiskValue, $scope.environmentRiskValue, $scope.assetRiskValue, $scope.reputationRiskValue);
                        break;
                    case constants.RA.consequenceType.reputation:
                        $("#reputationRisk").text("");
                        $scope.reputationRiskValue = 0;
                        $scope.reputationRiskDescription = "";
                        $scope.setRiskClass("#reputationRisk", 0, false);
                        $scope.setRiskLevel($scope.peopleRiskValue, $scope.environmentRiskValue, $scope.assetRiskValue, $scope.reputationRiskValue);
                        break;
                }
            } else {
                switch (type) {
                    case constants.RA.consequenceType.people:
                        $("#peopleRisk").html($scope.selectedPeopleLikelihood.value + '' + $scope.selectedPeopleSeverity.value + '&nbsp&nbsp' + data.riskDescription);
                        $scope.peopleRiskValue = data.riskValue;
                        $scope.peopleRiskDescription = data.riskDescription;
                        $scope.setRiskClass("#peopleRisk", data.riskValue, false);
                        $scope.setRiskLevel($scope.peopleRiskValue, $scope.environmentRiskValue, $scope.assetRiskValue, $scope.reputationRiskValue);
                        break;
                    case constants.RA.consequenceType.environment:
                        $("#environmentRisk").html($scope.selectedEnvironmentLikelihood.value + '' + $scope.selectedEnvironmentSeverity.value + '&nbsp&nbsp' + data.riskDescription);
                        $scope.environmentRiskValue = data.riskValue;
                        $scope.environmentRiskDescription = data.riskDescription;
                        $scope.setRiskClass("#environmentRisk", data.riskValue, false);
                        $scope.setRiskLevel($scope.peopleRiskValue, $scope.environmentRiskValue, $scope.assetRiskValue, $scope.reputationRiskValue);
                        break;
                    case constants.RA.consequenceType.asset:
                        $("#assetRisk").html($scope.selectedAssetLikelihood.value + '' + $scope.selectedAssetSeverity.value + '&nbsp&nbsp' + data.riskDescription);
                        $scope.assetRiskValue = data.riskValue;
                        $scope.assetRiskDescription = data.riskDescription;
                        $scope.setRiskClass("#assetRisk", data.riskValue, false);
                        $scope.setRiskLevel($scope.peopleRiskValue, $scope.environmentRiskValue, $scope.assetRiskValue, $scope.reputationRiskValue);
                        break;
                    case constants.RA.consequenceType.reputation:
                        $("#reputationRisk").html($scope.selectedReputationLikelihood.value + '' + $scope.selectedReputationSeverity.value + '&nbsp&nbsp' + data.riskDescription);
                        $scope.reputationRiskValue = data.riskValue;
                        $scope.reputationRiskDescription = data.riskDescription;
                        $scope.setRiskClass("#reputationRisk", data.riskValue, false);
                        $scope.setRiskLevel($scope.peopleRiskValue, $scope.environmentRiskValue, $scope.assetRiskValue, $scope.reputationRiskValue);
                        break;
                }
            }
        };

        $scope.setRiskClass = function (element, riskValue, isRiskIdentification) {
            switch (riskValue) {
                case constants.RA.riskLevel.lowRisk:
                    $(element).removeClass();
                    $(element).addClass('bg_green risk_label');
                    break;
                case constants.RA.riskLevel.mediumRisk:
                    $(element).removeClass();
                    $(element).addClass('bg_yellow risk_label');
                    break;
                case constants.RA.riskLevel.highRisk:
                    $(element).removeClass();
                    $(element).addClass('bg_orange risk_label');
                    break;
                case constants.RA.riskLevel.veryHigh:
                    $(element).removeClass();
                    $(element).addClass('bg_red risk_label');
                    break;
                default:
                    $(element).removeClass();
                    if (isRiskIdentification) $(element).addClass('bg_grey risk_label');
                    break;
            }
        };

        $scope.setRiskClassForPrinting = function (element, riskValue, isRiskIdentification) {
            if (!$(element).length) return;
            switch (riskValue) {
                case constants.RA.riskLevel.lowRisk:
                    $(element).removeClass();
                    $(element).addClass('risk-label bg-green');
                    break;
                case constants.RA.riskLevel.mediumRisk:
                    $(element).removeClass();
                    $(element).addClass('risk-label bg-yellow');
                    break;
                case constants.RA.riskLevel.highRisk:
                    $(element).removeClass();
                    $(element).addClass('risk-label bg-orange');
                    break;
                case constants.RA.riskLevel.veryHigh:
                    $(element).removeClass();
                    $(element).addClass('risk-label bg-red');
                    break;
                default:
                    $(element).removeClass();
                    if (isRiskIdentification) $(element).addClass('bg_grey risk-label');
                    break;
            }
        };

        $scope.getRiskIdentification = function (impactValue, likelihoodValue, type) {
            if (impactValue === null || impactValue === undefined || impactValue === "" || likelihoodValue === null || likelihoodValue === undefined || likelihoodValue === "") {
                $scope.setRiskIdentification("", type);
                return;
            }
            raServices.getRiskIdentification(impactValue, likelihoodValue).then(function (response) {
                if (response.data !== null && response.data !== undefined) {
                    $scope.setRiskIdentification(response.data, type);
                } else {
                    $scope.setRiskIdentification("", type);
                }
            }, function (err) {
                $scope.setRiskIdentification("", type);
                utils.error.showErrorGet(err);
            });
        };

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

        $scope.facilitatorSearchText = "";

        $scope.facilitatorOptions = {
            autoBind: false,
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
                    dataItem.image = $scope.selectedFacilitator.image;
                }
                return '<span class="selected-value" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span><span>{{dataItem.userName}}</span>';
            },
            template: '<div class="custom-dropdown"><span class="k-state-default" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span>' +
        '<span class="k-state-default"><h3>{{dataItem.userName}}</h3></span></div>'
        };
        $scope.endorserSearchText = "";

        $scope.endorsersOptions = {
            autoBind: false,
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
                    dataItem.image = $scope.selectedEndorser.image;
                }
                return '<span class="selected-value" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span><span>{{dataItem.userName}}</span>';
            },
            template: '<div class="custom-dropdown"><span class="k-state-default" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span>' +
        '<span class="k-state-default"><h3>{{dataItem.userName}}</h3></span></div>'
        };
        $scope.approverSearchText = "";

        $scope.approversOptions = {
            autoBind: false,
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
                    dataItem.image = $scope.selectedApprover.image;
                }
                return '<span class="selected-value" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span><span>{{dataItem.userName}}</span>';
            },
            template: '<div class="custom-dropdown"><span class="k-state-default" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span>' +
        '<span class="k-state-default"><h3>{{dataItem.userName}}</h3></span></div>'
        };

        $scope.raNewModel = {
            reviewerProfileId: "",
            endorserProfileId: "",
            approverProfileId: "",
            raHeader: "",
            raTeamMembers: [],
            action: ""
        };

        $scope.raHeaderModel = {
            workDescription: "",
            consequences: "",
            peopleSeverity: "",
            peopleLikelihood: "",
            environmentSeverity: "",
            environmentLikelihood: "",
            assetsSeverity: "",
            assetsLikelihood: "",
            reputationSeverity: "",
            reputationLikelihood: "",
            riskLevel: 0,
            processMonitoring: "",
            processTrips: "",
            recoveryMeasures: "",
            instructionOfOperation: "",
            instrumentImpact: "",
            allowByPassViaMOC: "",
            mocApproveDate: "",
            mocApprovedBy: ""
        };

        $scope.peopleSeverityDataSource = {
            transport: {
                read: function (options) {
                    raServices.getSeverities(constants.impactGroup.people).then(function (response) {
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

        $scope.environmentSeverityDataSource = {
            transport: {
                read: function (options) {
                    raServices.getSeverities(constants.impactGroup.environment).then(function (response) {
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

        $scope.assetSeverityDataSource = {
            transport: {
                read: function (options) {
                    raServices.getSeverities(constants.impactGroup.asset).then(function (response) {
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

        $scope.reputationSeverityDataSource = {
            transport: {
                read: function (options) {
                    raServices.getSeverities(constants.impactGroup.reputation).then(function (response) {
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

        $scope.LikelihoodDataSource = {
            transport: {
                read: function (options) {
                    raServices.getLikelihoods().then(function (response) {
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

        $scope.onPeopleSeverityChange = function () {
            var index = this.selectedIndex;
            if (index !== 0) {
                $("#peopleImpactDescription").text(this.dataItem(index).impact);
                $scope.selectedPeopleSeverity = this.dataItem(index);
                if ($scope.selectedPeopleLikelihood !== null && $scope.selectedPeopleLikelihood !== undefined) {
                    var impactValue = this.dataItem(index).value;
                    var likelihoodValue = $scope.selectedPeopleLikelihood.value;
                    $scope.getRiskIdentification(impactValue, likelihoodValue, constants.RA.consequenceType.people);
                }
            }
            else {
                $("#peopleImpactDescription").text("");
                $scope.selectedPeopleSeverity = null;
                $scope.setRiskIdentification(null, constants.RA.consequenceType.people);
                $scope.setRiskLevel(0, $scope.environmentRiskValue, $scope.assetRiskValue, $scope.reputationRiskValue);
            }
        };

        $scope.onEnvironmentSeverityChange = function () {
            var index = this.selectedIndex;
            if (index !== 0) {
                $("#environmentImpactDescription").text(this.dataItem(index).impact);
                $scope.selectedEnvironmentSeverity = this.dataItem(index);
                if ($scope.selectedEnvironmentLikelihood !== null && $scope.selectedEnvironmentLikelihood !== undefined) {
                    var impactValue = this.dataItem(index).value;
                    var likelihoodValue = $scope.selectedEnvironmentLikelihood.value;
                    $scope.getRiskIdentification(impactValue, likelihoodValue, constants.RA.consequenceType.environment);
                }
            }
            else {
                $("#environmentImpactDescription").text("");
                $scope.selectedEnvironmentSeverity = null;
                $scope.setRiskIdentification(null, constants.RA.consequenceType.environment);
                $scope.setRiskLevel($scope.peopleRiskValue, 0, $scope.assetRiskValue, $scope.reputationRiskValue);
            }
        };

        $scope.onAssetSeverityChange = function () {
            var index = this.selectedIndex;
            if (index !== 0) {
                $("#assetImpactDescription").text(this.dataItem(index).impact);
                $scope.selectedAssetSeverity = this.dataItem(index);
                if ($scope.selectedAssetLikelihood !== null && $scope.selectedAssetLikelihood !== undefined) {
                    var impactValue = this.dataItem(index).value;
                    var likelihoodValue = $scope.selectedAssetLikelihood.value;
                    $scope.getRiskIdentification(impactValue, likelihoodValue, constants.RA.consequenceType.asset);
                }
            }
            else {
                $("#assetImpactDescription").text("");
                $scope.selectedAssetSeverity = null;
                $scope.setRiskIdentification(null, constants.RA.consequenceType.asset);
                $scope.setRiskLevel($scope.peopleRiskValue, $scope.environmentRiskValue, 0, $scope.reputationRiskValue);
            }
        };

        $scope.onReputationSeverityChange = function () {
            var index = this.selectedIndex;
            if (index !== 0) {
                $("#reputationImpactDescription").text(this.dataItem(index).impact);
                $scope.selectedReputationSeverity = this.dataItem(index);
                if ($scope.selectedReputationLikelihood !== null && $scope.selectedReputationLikelihood !== undefined) {

                    var impactValue = this.dataItem(index).value;
                    var likelihoodValue = $scope.selectedReputationLikelihood.value;
                    $scope.getRiskIdentification(impactValue, likelihoodValue, constants.RA.consequenceType.reputation);
                }
            }
            else {
                $("#reputationImpactDescription").text("");
                $scope.selectedReputationSeverity = null;
                $scope.setRiskIdentification(null, constants.RA.consequenceType.reputation);
                $scope.setRiskLevel($scope.peopleRiskValue, $scope.environmentRiskValue, $scope.assetRiskValue, 0);
            }
        };

        $scope.onPeopleLikelihoodChange = function () {
            var index = this.selectedIndex;
            if (index !== 0) {
                $("#peopleLikelihoodDescription").text(this.dataItem(index).description);
                $scope.selectedPeopleLikelihood = this.dataItem(index);
                if ($scope.selectedPeopleSeverity !== null && $scope.selectedPeopleSeverity !== undefined) {
                    var impactValue = $scope.selectedPeopleSeverity.value;
                    var likelihoodValue = this.dataItem(index).value;
                    $scope.getRiskIdentification(impactValue, likelihoodValue, constants.RA.consequenceType.people);
                }
            }
            else {
                $("#peopleLikelihoodDescription").text("");
                $scope.selectedPeopleLikelihood = null;
                $scope.setRiskIdentification(null, constants.RA.consequenceType.people);
            }
        };

        $scope.onEnvironmentLikelihoodChange = function () {
            var index = this.selectedIndex;
            if (index !== 0) {
                $("#environmentLikelihoodDescription").text(this.dataItem(index).description);
                $scope.selectedEnvironmentLikelihood = this.dataItem(index);
                if ($scope.selectedEnvironmentSeverity !== null && $scope.selectedEnvironmentSeverity !== undefined) {
                    var impactValue = $scope.selectedEnvironmentSeverity.value;
                    var likelihoodValue = this.dataItem(index).value;
                    $scope.getRiskIdentification(impactValue, likelihoodValue, constants.RA.consequenceType.environment);
                }
            }
            else {
                $("#environmentLikelihoodDescription").text("");
                $scope.selectedEnvironmentLikelihood = null;
                $scope.setRiskIdentification(null, constants.RA.consequenceType.environment);
            }
        };

        $scope.onAssetLikelihoodChange = function () {
            var index = this.selectedIndex;
            if (index !== 0) {
                $("#assetLikelihoodDescription").text(this.dataItem(index).description);
                $scope.selectedAssetLikelihood = this.dataItem(index);
                if ($scope.selectedAssetSeverity !== null && $scope.selectedAssetSeverity !== undefined) {
                    var impactValue = $scope.selectedAssetSeverity.value;
                    var likelihoodValue = this.dataItem(index).value;
                    $scope.getRiskIdentification(impactValue, likelihoodValue, constants.RA.consequenceType.asset);
                }
            }
            else {
                $("#assetLikelihoodDescription").text("");
                $scope.selectedAssetLikelihood = null;
                $scope.setRiskIdentification(null, constants.RA.consequenceType.asset);
            }
        };

        $scope.onReputationLikelihoodChange = function () {
            var index = this.selectedIndex;
            if (index !== 0) {
                $("#reputationLikelihoodDescription").text(this.dataItem(index).description);
                $scope.selectedReputationLikelihood = this.dataItem(index);
                if ($scope.selectedReputationSeverity !== null && $scope.selectedReputationSeverity !== undefined) {
                    var impactValue = $scope.selectedReputationSeverity.value;
                    var likelihoodValue = this.dataItem(index).value;
                    $scope.getRiskIdentification(impactValue, likelihoodValue, constants.RA.consequenceType.reputation);
                }
            }
            else {
                $("#reputationLikelihoodDescription").text("");
                $scope.selectedReputationLikelihood = null;
                $scope.setRiskIdentification(null, constants.RA.consequenceType.reputation);
            }
        };

        $scope.peopleSeveritiesOptions = {
            autoBind: false,
            optionLabel: "Select Severity",
            dataSource: $scope.peopleSeverityDataSource,
            dataTextField: "severity",
            dataValueField: "severityId",
            valueTemplate: '<span class="selected-value">{{dataItem.severity}}<span>',
            template: '<strong>{{dataItem.severity}}</strong><span>{{dataItem.impact}}</span>',
            change: $scope.onPeopleSeverityChange,
            open: function (e) {
                e.sender.popup.element.addClass('risk_options');
            }
        };

        $scope.environmentSeveritiesOptions = {
            autoBind: false,
            optionLabel: "Select Severity",
            dataSource: $scope.environmentSeverityDataSource,
            dataTextField: "severity",
            dataValueField: "severityId",
            valueTemplate: '<span class="selected-value">{{dataItem.severity}}</span>',
            template: '<strong>{{dataItem.severity}}</strong><span>{{dataItem.impact}}</span>',
            change: $scope.onEnvironmentSeverityChange,
            open: function (e) {
                e.sender.popup.element.addClass('risk_options');
            }
        };

        $scope.assetSeveritiesOptions = {
            autoBind: false,
            optionLabel: "Select Severity",
            dataSource: $scope.assetSeverityDataSource,
            dataTextField: "severity",
            dataValueField: "severityId",
            valueTemplate: '<span class="selected-value">{{dataItem.severity}}</span>',
            template: '<strong>{{dataItem.severity}}</strong><span>{{dataItem.impact}}</span>',
            change: $scope.onAssetSeverityChange,
            open: function (e) {
                e.sender.popup.element.addClass('risk_options');
            }
        };

        $scope.reputationSeveritiesOptions = {
            autoBind: false,
            optionLabel: "Select Severity",
            dataSource: $scope.reputationSeverityDataSource,
            dataTextField: "severity",
            dataValueField: "severityId",
            valueTemplate: '<span class="selected-value">{{dataItem.severity}}</span>',
            template: '<strong>{{dataItem.severity}}</strong><span>{{dataItem.impact}}</span>',
            change: $scope.onReputationSeverityChange,
            open: function (e) {
                e.sender.popup.element.addClass('risk_options');
            }
        };

        $scope.peopleLikelihoodOptions = {
            autoBind: false,
            optionLabel: "Select Likelihood",
            dataSource: $scope.LikelihoodDataSource,
            dataTextField: "likelihood",
            dataValueField: "likelihoodId",
            valueTemplate: '<span class="selected-value">{{dataItem.likelihood}}</span>',
            template: '<strong>{{dataItem.likelihood}}</strong><span>{{dataItem.description}}</span>',
            change: $scope.onPeopleLikelihoodChange,
            open: function (e) {
                e.sender.popup.element.addClass('risk_options');
            }
        };

        $scope.environmentLikelihoodOptions = {
            autoBind: false,
            optionLabel: "Select Likelihood",
            dataSource: $scope.LikelihoodDataSource,
            dataTextField: "likelihood",
            dataValueField: "likelihoodId",
            valueTemplate: '<span class="selected-value">{{dataItem.likelihood}}</span>',
            template: '<strong>{{dataItem.likelihood}}</strong><span>{{dataItem.description}}</span>',
            change: $scope.onEnvironmentLikelihoodChange,
            open: function (e) {
                e.sender.popup.element.addClass('risk_options');
            }
        };

        $scope.assetLikelihoodOptions = {
            autoBind: false,
            optionLabel: "Select Likelihood",
            dataSource: $scope.LikelihoodDataSource,
            dataTextField: "likelihood",
            dataValueField: "likelihoodId",
            valueTemplate: '<span class="selected-value">{{dataItem.likelihood}}</span>',
            template: '<strong>{{dataItem.likelihood}}</strong><span>{{dataItem.description}}</span>',
            change: $scope.onAssetLikelihoodChange,
            open: function (e) {
                e.sender.popup.element.addClass('risk_options');
            }
        };

        $scope.reputationLikelihoodOptions = {
            autoBind: false,
            optionLabel: "Select Likelihood",
            dataSource: $scope.LikelihoodDataSource,
            dataTextField: "likelihood",
            dataValueField: "likelihoodId",
            valueTemplate: '<span class="selected-value">{{dataItem.likelihood}}</span>',
            template: '<strong>{{dataItem.likelihood}}</strong><span>{{dataItem.description}}</span>',
            change: $scope.onReputationLikelihoodChange,
            open: function (e) {
                e.sender.popup.element.addClass('risk_options');
            }
        };

        // Kendo Function : ON KendoWidget Create
        $scope.$on("kendoWidgetCreated", function (ev, widget) {
            // in widget you have a reference to the event
            if (widget === $scope.MemberGrid) {
                $scope.MemberGrid.element.find(".k-grid-toolbar").insertAfter($scope.MemberGrid.element.find(".k-grid-content"));

            }
        });

        $scope.teamMembersOptions = {
            dataSource: {
                data: $scope.teamMembers,
                autoSync: true,
                height: 400,
                schema: {
                    model: {
                        id: "raTeamId",
                        fields: {
                            raTeamId: { type: "string" },
                            teamMember: { defaultValue: { userId: "", userName: "", position: "", image: "" } }
                        }
                    }
                }
            },
            toolbar: [{ name: "create", text: "Add new team member", className: "add_new" }],
            columns: [
                {
                    field: "teamMember",
                    title: "Team Member",
                    width: "400px",
                    editor: dropdownlistEditor,
                    template: function (dataItem) {
                        if (dataItem !== null && dataItem !== undefined && dataItem.teamMember !== null && dataItem.teamMember !== undefined) {
                            if (!dataItem.teamMember.hasOwnProperty('image')) {
                                dataItem.teamMember.image = "";
                            }
                            return '<div class="selected-teammate">' +
                                '<span class="selected-value" style="background-image: url(data:image/jpeg;base64,' + dataItem.teamMember.image + ')"></span>' +
                                '<span>' +
                                dataItem.teamMember.userName + '<br />' +
                                '<span class="teammate-position">' + dataItem.teamMember.position + '</span>' +
                                '</span>' +
                                '</div>';
                        }
                    }
                },
                {
                    command: {
                        text: "Remove", click: function (e) {
                            e.preventDefault();
                            var tr = $(e.target).closest("tr");
                            var data = this.dataItem(tr);
                            $("#teamMembersGrid").data("kendoGrid").dataSource.remove(data);
                            $("#teamMembersGrid").data("kendoGrid").dataSource.sync();
                        }
                    }, width: "100px"
                }
            ],
            editable: true
        };

        $scope.teamMemberTextSearch = "";
        $scope.selectedTeamMember = null;

        function dropdownlistEditor(container, options) {
            $('<input class = "txt dd_avatar" required data-required-msg= "Team Member is required" name = "' + options.field + '" />')
                .appendTo(container)
                .kendoDropDownList({
                    autoBind: false,
                    filter: "contains",
                    model: $scope.selectedTeamMember,
                    filtering: function (e) {
                        $scope.teamMemberTextSearch = e.filter === null || e.filter === undefined ? "" : e.filter.value;
                    },
                    optionLabel: "Select team member",
                    dataTextField: "userName",
                    dataValueField: "userId",
                    required: true,
                    template: function (dataItem) {
                        if (!dataItem.hasOwnProperty('image')) {
                            dataItem.image = "";
                        }
                        return '<div class="custom-dropdown">' +
                            '<span class="k-state-default" style="background-image: url(data:image/jpeg;base64,' + dataItem.image + ')"></span>' +
                            '<span class="k-state-default">' +
                            '<div class="teammate-info">' +
                            '<label>' + dataItem.userName + '</label>' +
                            '<label>&nbsp&nbsp</label>' +
                            '</div>' +
                            '</span>' +
                                '</div>';
                    },
                    valueTemplate: function (dataItem) {
                        if (dataItem !== null && dataItem !== undefined) {
                            if (!dataItem.hasOwnProperty('image')) {
                                dataItem.image = "";
                            }
                            return '<div class="selected-teammate">' +
                                '<span class="selected-value" style="background-image: url(data:image/jpeg;base64,' + dataItem.image + ')"></span>' +
                                '<span>' +
                                dataItem.userName + '<br />' +
                                '<span class="teammate-position">' + dataItem.position + '</span>' +
                                '</span>' +
                                '</div>';
                        }
                    },
                    dataSource: {
                        serverFiltering: true,
                        transport: {
                            read: function (options) {
                                raServices.getTeamMembers($scope.teamMemberTextSearch).then(function (response) {
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
                    }
                });
        }

        $scope.saveData = function (e, action) {
            if (!isProcessTriggerClick) {
                return false;
            }
            isProcessTriggerClick = false;

            e.preventDefault();
            e.stopPropagation();

            var isValid = $scope.raNewValidator.validate();

            if (action === 'Submit' && !utils.validRequiredAction(action)) {
                isValid = false;
            }
            if (!isValid) {
                isProcessTriggerClick = true;
                return false;
            }
            var team = $("#teamMembersGrid").data("kendoGrid").dataSource.data();
            for (i = 0; i < team.length; i++) {
                if ($scope.raNewModel.raTeamMembers.length > 0) {
                    for (j = 0; j < $scope.raNewModel.raTeamMembers.length; j++) {
                        if (team[i].teamMember.userId === $scope.raNewModel.raTeamMembers[j] || $scope.raNewModel.raTeamMembers[j] === "" || $scope.raNewModel.raTeamMembers[j] === null || $scope.raNewModel.raTeamMembers[j] === undefined) {
                            var option = {
                                id: "dialogInfo",
                                title: "Create RA",
                                lableClose: "CLOSE",
                                content: "Data is not valid. Please remove redundant values from <strong>Team Member</strong>!",
                                width: 500
                            };
                            utils.dialog.showDialog(option, function () {
                            });

                            $scope.raNewModel.raTeamMembers = [];
                            isProcessTriggerClick = true;
                            return false;
                        }
                    }
                }
                $scope.raNewModel.raTeamMembers.push(team[i].teamMember.userId);
            }
            $scope.raNewModel.action = action;
            $scope.raHeaderModel.peopleSeverity = $scope.selectedPeopleSeverity === null || $scope.selectedPeopleSeverity === undefined || _.isEmpty($scope.selectedPeopleSeverity) ? null : $scope.selectedPeopleSeverity.severityId;
            $scope.raHeaderModel.peopleLikelihood = $scope.selectedPeopleLikelihood === null || $scope.selectedPeopleLikelihood === undefined || _.isEmpty($scope.selectedPeopleLikelihood) ? null : $scope.selectedPeopleLikelihood.likelihoodId;
            $scope.raHeaderModel.environmentSeverity = $scope.selectedEnvironmentSeverity === null || $scope.selectedEnvironmentSeverity === undefined || _.isEmpty($scope.selectedEnvironmentSeverity) ? null : $scope.selectedEnvironmentSeverity.severityId;
            $scope.raHeaderModel.environmentLikelihood = $scope.selectedEnvironmentLikelihood === null || $scope.selectedEnvironmentLikelihood === undefined || _.isEmpty($scope.selectedEnvironmentLikelihood) ? null : $scope.selectedEnvironmentLikelihood.likelihoodId;
            $scope.raHeaderModel.assetsSeverity = $scope.selectedAssetSeverity === null || $scope.selectedAssetSeverity === undefined || _.isEmpty($scope.selectedAssetSeverity) ? null : $scope.selectedAssetSeverity.severityId;
            $scope.raHeaderModel.assetsLikelihood = $scope.selectedAssetLikelihood === null || $scope.selectedAssetLikelihood === undefined || _.isEmpty($scope.selectedAssetLikelihood) ? null : $scope.selectedAssetLikelihood.likelihoodId;
            $scope.raHeaderModel.reputationSeverity = $scope.selectedReputationSeverity === null || $scope.selectedReputationSeverity === undefined || _.isEmpty($scope.selectedReputationSeverity) ? null : $scope.selectedReputationSeverity.severityId;
            $scope.raHeaderModel.reputationLikelihood = $scope.selectedReputationLikelihood === null || $scope.selectedReputationLikelihood === undefined || _.isEmpty($scope.selectedReputationLikelihood) ? null : $scope.selectedReputationLikelihood.likelihoodId;
            $scope.raHeaderModel.riskLevel = $scope.riskLevel;
            $scope.raNewModel.raHeader = $scope.raHeaderModel;
            $scope.raNewModel.reviewerProfileId = $scope.selectedFacilitator === null || $scope.selectedFacilitator === undefined || _.isEmpty($scope.selectedFacilitator) ? null : $scope.selectedFacilitator.userProfileId;
            $scope.raNewModel.endorserProfileId = $scope.selectedEndorser === null || $scope.selectedEndorser === undefined || _.isEmpty($scope.selectedEndorser) ? null : $scope.selectedEndorser.userProfileId;
            $scope.raNewModel.approverProfileId = $scope.selectedApprover === null || $scope.selectedApprover === undefined || _.isEmpty($scope.selectedApprover) ? null : $scope.selectedApprover.userProfileId;

            $rootScope.isLoading = true;
            isProcessTriggerClick = true;

            raServices.createRA($stateParams.sceId, $scope.raNewModel).then(function (response) {
                $rootScope.isLoading = false;
                var option = {};
                if (response.data !== null && response.data !== undefined) {
                    switch (action) {
                        case "Draft":
                            option = {
                                id: "dialogInfo",
                                title: "Create RA",
                                lableClose: "CLOSE",
                                content: "This RA is saved as draft",
                                width: 500
                            };
                            utils.dialog.showDialog(option, function () {
                                $state.go(constants.state.raList);
                            });

                            break;
                        case "Submit":
                            option = {
                                id: "dialogInfo",
                                title: "Create RA",
                                lableClose: "CLOSE",
                                content: "This RA is submitted and <strong>pending review</strong>",
                                width: 500
                            };
                            utils.dialog.showDialog(option, function () {
                                $state.go(constants.state.raList);
                            });

                            break;
                    }
                } else {
                    switch (action) {
                        case "Draft":
                            option = {
                                id: "dialogInfo",
                                title: "Create RA",
                                lableClose: "CLOSE",
                                content: "This RA has error when saving.",
                                width: 500
                            };
                            utils.dialog.showDialog(option);

                            break;
                        case "Submit":
                            option = {
                                id: "dialogInfo",
                                title: "Create RA",
                                lableClose: "CLOSE",
                                content: "This RA has error when submitting.",
                                width: 500
                            };
                            utils.dialog.showDialog(option);

                            break;
                    }
                }
            }, function (error) {
                $rootScope.isLoading = false;
                var option = {};
                switch (action) {
                    case "Draft":
                        option = {
                            id: "dialogInfo",
                            title: "Create RA",
                            lableClose: "CLOSE",
                            content: kendo.format("This RA can not be saved as daft.\r\n{0}", error.message),
                            width: 500
                        };
                        utils.dialog.showDialog(option);
                        break;
                    case "Submit":
                        option = {
                            id: "dialogInfo",
                            title: "Create RA",
                            lableClose: "CLOSE",
                            content: kendo.format("This RA can not be created.\r\n{0}", error.message),
                            width: 500
                        };
                        utils.dialog.showDialog(option);
                        break;
                }
            });

        };

        $scope.raUpdateModel = {
            ReviewerProfileId: "",
            EndorserProfileId: "",
            ApproverProfileId: "",
            WorkDescription: "",
            Consequences: "",
            PeopleSeverityId: "",
            PeopleLikelihoodId: "",
            EnvironmentSeverityId: "",
            EnvironmentLikelihoodId: "",
            AssetSeverityId: "",
            AssetLikelihoodId: "",
            ReputationSeverityId: "",
            ReputationLikelihoodId: "",
            ProcessMonitoring: "",
            ProcessTrips: "",
            RecoveryMeasures: "",
            InstructionOfOperation: "",
            InstrumentImpact: "",
            TeamMembers: [],
            Action: ""
        };

        $scope.updateData = function (e, action) {
            if (!isProcessTriggerClick) {
                return false;
            }
            isProcessTriggerClick = false;

            e.preventDefault();
            e.stopPropagation();

            var isValid = $scope.raEditValidator.validate();

            if (action === 'Submit' && !utils.validRequiredAction(action)) {
                isValid = false;
            }
            if (!isValid) {
                isProcessTriggerClick = true;
                return false;
            }
            var team = $("#teamMembersGrid").data("kendoGrid").dataSource.data();
            for (i = 0; i < team.length; i++) {
                if ($scope.raUpdateModel.TeamMembers.length > 0) {
                    for (j = 0; j < $scope.raUpdateModel.TeamMembers.length; j++) {
                        if (team[i].teamMember.userId === $scope.raUpdateModel.TeamMembers[j] || $scope.raUpdateModel.TeamMembers[j] === "" || $scope.raUpdateModel.TeamMembers[j] === null || $scope.raUpdateModel.TeamMembers[j] === undefined) {
                            var option = {
                                id: "dialogInfo",
                                title: "Create RA",
                                lableClose: "CLOSE",
                                content: "Data is not valid. Please remove redundant values from <strong>Team Member</strong>!",
                                width: 500
                            };
                            utils.dialog.showDialog(option);

                            $scope.raUpdateModel.TeamMembers = [];
                            isProcessTriggerClick = true;
                            return false;
                        }
                    }
                }
                $scope.raUpdateModel.TeamMembers.push(team[i].teamMember.userId);
            }
            $scope.raUpdateModel.ReviewerProfileId = $scope.selectedFacilitator === null || $scope.selectedFacilitator === undefined || _.isEmpty($scope.selectedFacilitator) ? null : $scope.selectedFacilitator.userProfileId;
            $scope.raUpdateModel.EndorserProfileId = $scope.selectedEndorser === null || $scope.selectedEndorser === undefined || _.isEmpty($scope.selectedEndorser) ? null : $scope.selectedEndorser.userProfileId;
            $scope.raUpdateModel.ApproverProfileId = $scope.selectedApprover === null || $scope.selectedApprover === undefined || _.isEmpty($scope.selectedApprover) ? null : $scope.selectedApprover.userProfileId;
            $scope.raUpdateModel.WorkDescription = $scope.raDetail.raHeaderDetail.workDescription;
            $scope.raUpdateModel.Consequences = $scope.raDetail.raHeaderDetail.consequences;
            $scope.raUpdateModel.PeopleSeverityId = $scope.selectedPeopleSeverity === null || $scope.selectedPeopleSeverity === undefined || _.isEmpty($scope.selectedPeopleSeverity) ? null : $scope.selectedPeopleSeverity.severityId;
            $scope.raUpdateModel.PeopleLikelihoodId = $scope.selectedPeopleLikelihood === null || $scope.selectedPeopleLikelihood === undefined || _.isEmpty($scope.selectedPeopleLikelihood) ? null : $scope.selectedPeopleLikelihood.likelihoodId;
            $scope.raUpdateModel.EnvironmentSeverityId = $scope.selectedEnvironmentSeverity === null || $scope.selectedEnvironmentSeverity === undefined || _.isEmpty($scope.selectedEnvironmentSeverity) ? null : $scope.selectedEnvironmentSeverity.severityId;
            $scope.raUpdateModel.EnvironmentLikelihoodId = $scope.selectedEnvironmentLikelihood === null || $scope.selectedEnvironmentLikelihood === undefined || _.isEmpty($scope.selectedEnvironmentLikelihood) ? null : $scope.selectedEnvironmentLikelihood.likelihoodId;
            $scope.raUpdateModel.AssetSeverityId = $scope.selectedAssetSeverity === null || $scope.selectedAssetSeverity === undefined || _.isEmpty($scope.selectedAssetSeverity) ? null : $scope.selectedAssetSeverity.severityId;
            $scope.raUpdateModel.AssetLikelihoodId = $scope.selectedAssetLikelihood === null || $scope.selectedAssetLikelihood === undefined || _.isEmpty($scope.selectedAssetLikelihood) ? null : $scope.selectedAssetLikelihood.likelihoodId;
            $scope.raUpdateModel.ReputationSeverityId = $scope.selectedReputationSeverity === null || $scope.selectedReputationSeverity === undefined || _.isEmpty($scope.selectedReputationSeverity) ? null : $scope.selectedReputationSeverity.severityId;
            $scope.raUpdateModel.ReputationLikelihoodId = $scope.selectedReputationLikelihood === null || $scope.selectedReputationLikelihood === undefined || _.isEmpty($scope.selectedReputationLikelihood) ? null : $scope.selectedReputationLikelihood.likelihoodId;
            $scope.raUpdateModel.ProcessMonitoring = $scope.raDetail.raHeaderDetail.processMonitoring;
            $scope.raUpdateModel.ProcessTrips = $scope.raDetail.raHeaderDetail.processTrips;
            $scope.raUpdateModel.RecoveryMeasures = $scope.raDetail.raHeaderDetail.recoveryMeasures;
            $scope.raUpdateModel.InstructionOfOperation = $scope.raDetail.raHeaderDetail.instructionOfOperation;
            $scope.raUpdateModel.InstrumentImpact = $scope.raDetail.raHeaderDetail.instrumentImpact;

            $scope.raUpdateModel.Action = action;

            $rootScope.isLoading = true;
            isProcessTriggerClick = true;

            raServices.updateRA($stateParams.sceId, $stateParams.raId, $scope.raUpdateModel).then(function (response) {
                $rootScope.isLoading = false;
                var option = {};
                if (response.data !== null && response.data !== undefined) {
                    switch (action) {
                        case "Draft":
                            option = {
                                id: "dialogInfo",
                                title: "Update RA",
                                lableClose: "CLOSE",
                                content: "This RA is updated",
                                width: 500
                            };
                            utils.dialog.showDialog(option, function () {
                                $state.go(constants.state.raList);
                            });
                            break;
                        case "Submit":
                            option = {
                                id: "dialogInfo",
                                title: "Submit RA",
                                lableClose: "CLOSE",
                                content: "This RA is submitted and <strong>pending review</strong>",
                                width: 500
                            };
                            utils.dialog.showDialog(option, function () {
                                $state.go(constants.state.raList);
                            });
                            break;
                    }
                } else {
                    switch (action) {
                        case "Draft":
                            option = {
                                id: "dialogInfo",
                                title: "Update RA",
                                lableClose: "CLOSE",
                                content: kendo.format("This RA has error when saving.\r\n{0}"),
                                width: 500
                            };
                            utils.dialog.showDialog(option);
                            break;
                        case "Submit":
                            option = {
                                id: "dialogInfo",
                                title: "Update RA",
                                lableClose: "CLOSE",
                                content: kendo.format("This RA has error when submiting.\r\n{0}"),
                                width: 500
                            };
                            utils.dialog.showDialog(option);
                            break;
                    }
                }
            }, function (error) {
                $rootScope.isLoading = false;
                var option = {};
                switch (action) {
                    case "Draft":
                        option = {
                            id: "dialogInfo",
                            title: "Update RA",
                            lableClose: "CLOSE",
                            content: error.message,
                            width: 500
                        };
                        utils.dialog.showDialog(option);
                        break;
                    case "Submit":
                        option = {
                            id: "dialogInfo",
                            title: "SUBMIT RA",
                            lableClose: "CLOSE",
                            content: error.message,
                            width: 500
                        };
                        utils.dialog.showDialog(option);
                        break;
                }
            });
        };

        $scope.updateMOCModel = {
            sceByPass: true,
            mocNo: "",
            mocMeetingDateTime: "",
            mocApprover: ""
        };

        $scope.isReviewed = false;
        $scope.isEndorsed = false;
        $scope.isApproved = false;
        $scope.pendingReview = false;
        $scope.pendingEndorse = false;
        $scope.pendingApprove = false;

        $scope.selectedMocApprover = "";

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

        $scope.mocApproverToTransfer = null;

        $scope.mocApproversOptions = {
            autoBind: false,
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
                    dataItem.image = $scope.selectedMocApprover.image;
                }
                return '<span class="selected-value" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span><span>{{dataItem.userName}}</span>';
            },
            template: '<div class="custom-dropdown"><span class="k-state-default" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span>' +
        '<span class="k-state-default"><h3>{{dataItem.userName}}</h3></span></div>'
        };


        $scope.updateMOC = function (e) {
            if (!isProcessTriggerClick) {
                return false;
            }
            isProcessTriggerClick = false;

            e.preventDefault();
            e.stopPropagation();

            var isValid = $scope.mocValidator.validate();
            if (!isValid) {
                isProcessTriggerClick = true;
                return false;
            }
            $scope.mocConfirmDialog("MOC Updated", "Please confirm that you have updated the MOC and ready to re-submit for MOC approval.").then(function () {
                $scope.updateMOCModel.mocMeetingDateTime = $.format.toBrowserTimeZone($scope.raDetail.raHeaderDetail.mocMeetingDate, constants.format.date.ddMMMyyyyhhmma);
                $scope.updateMOCModel.sceByPass = $scope.raDetail.raHeaderDetail.allowByPassViaMOC;
                $scope.updateMOCModel.mocNo = $scope.raDetail.raHeaderDetail.mocNo;
                $scope.updateMOCModel.mocApprover = $scope.selectedMocApprover.userProfileId;
                $rootScope.isLoading = true;
                isProcessTriggerClick = true;
                raServices.updateMOC($stateParams.sceId, $stateParams.raId, $scope.updateMOCModel).then(function (response) {
                    $rootScope.isLoading = false;
                    var option = {
                        id: "dialogInfo",
                        title: "MOC Submitted",
                        lableClose: "CLOSE",
                        content: "This MOC is submitted and pending MOC approval.",
                        width: 500
                    };
                    utils.dialog.showDialog(option, function () {
                        $state.go(constants.state.raList);
                    });

                }, function (err) {
                    $rootScope.isLoading = false;
                    var option = {
                        id: "dialogInfo",
                        title: "MOC Updated failed",
                        lableClose: "CLOSE",
                        content: err.message,
                        width: 500
                    };
                    utils.dialog.showDialog(option);
                });
                return true;
            }, function () {
                // Choosed cancel, do nothing
                isProcessTriggerClick = true;
                return true;
            });
        };

        $scope.submitMOCApproval = function (e) {
            if (!isProcessTriggerClick) {
                return false;
            }
            isProcessTriggerClick = false;

            e.preventDefault();
            e.stopPropagation();

            var isValid = $scope.mocValidator.validate();
            if (!isValid) {
                isProcessTriggerClick = true;
                return false;
            }
            $scope.updateMOCModel.mocMeetingDateTime = $.format.toBrowserTimeZone($scope.updateMOCModel.mocMeetingDateTime, constants.format.date.ddMMMyyyyhhmma);
            $scope.updateMOCModel.mocApprover = $scope.selectedMocApprover.userProfileId;
            $rootScope.isLoading = true;
            isProcessTriggerClick = true;

            raServices.updateMOC($stateParams.sceId, $stateParams.raId, $scope.updateMOCModel).then(function (response) {
                $rootScope.isLoading = false;
                var option = {
                    id: "dialogInfo",
                    title: "MOC Submitted",
                    lableClose: "CLOSE",
                    content: "This MOC is submitted and pending MOC approval.",
                    width: 500
                };
                utils.dialog.showDialog(option, function () {
                    $state.go(constants.state.raList);
                });

            }, function (err) {
                $rootScope.isLoading = false;
                var option = {
                    id: "dialogInfo",
                    title: "MOC Updated failed",
                    lableClose: "CLOSE",
                    content: err.message,
                    width: 500
                };
                utils.dialog.showDialog(option);

            });
            return true;
        }

        $scope.updateMOCActions = [
           { text: 'CANCEL' },
           {
               text: 'REQUEST MOC',
               action: function () {

                   if (!isProcessTriggerClick) {
                       return false;
                   }
                   isProcessTriggerClick = false;
                   var isValid = $scope.validators.updateMOC.validate();
                   if (!isValid) {
                       isProcessTriggerClick = true;
                       return false;
                   }
                   $scope.updateMOCModel.mocMeetingDateTime = $.format.toBrowserTimeZone($scope.updateMOCModel.mocMeetingDateTime, constants.format.date.ddMMMyyyyhhmma);
                   $scope.updateMOCModel.mocApprover = $scope.selectedMocApprover.userProfileId;
                   $rootScope.isLoading = true;
                   isProcessTriggerClick = true;
                   raServices.updateMOC($stateParams.sceId, $stateParams.raId, $scope.updateMOCModel).then(function (response) {
                       $rootScope.isLoading = false;
                       var option = {
                           id: "dialogInfo",
                           title: "MOC Submitted",
                           lableClose: "CLOSE",
                           content: "This MOC is submitted and <strong>pending MOC approval.</strong>",
                           width: 500
                       };
                       utils.dialog.showDialog(option, function () {
                           $state.go(constants.state.raList);
                       });

                   }, function (err) {
                       $rootScope.isLoading = false;
                       var option = {
                           id: "dialogInfo",
                           title: "MOC is submitted failed",
                           lableClose: "CLOSE",
                           content: err.message,
                           width: 500
                       };
                       utils.dialog.showDialog(option);

                   });
                   return true;
               },
               primary: true
           }
        ];


        $scope.mocApproveComment = "";

        $scope.approveMOC = function (sceId, raId, model) {
            raServices.approveMOC(sceId, raId, model).then(function (response) {
                $rootScope.isLoading = false;
                var option = {};
                if (response.data !== null && response.data !== undefined) {
                    if (model.isApproved) {
                        option = {
                            id: "dialogInfo",
                            title: "MOC Approved",
                            lableClose: "CLOSE",
                            content: "This MOC is approved",
                            width: 500
                        };
                        utils.dialog.showDialog(option, function () {
                            $state.go(constants.state.raList);
                        });
                    } else {
                        option = {
                            id: "dialogInfo",
                            title: "MOC Not Approved",
                            lableClose: "CLOSE",
                            content: "This MOC is not approved and <strong>requires update</strong> from the applicant",
                            width: 500
                        };
                        utils.dialog.showDialog(option, function () {
                            $state.go(constants.state.raList);
                        });

                    }
                } else {
                    option = {
                        id: "dialogInfo",
                        title: "MOC is approved Failed",
                        lableClose: "CLOSE",
                        content: "There are some errors occur",
                        width: 500
                    };
                    utils.dialog.showDialog(option);
                }
            }, function (err) {
                $rootScope.isLoading = false;
                var option = {
                    id: "dialogInfo",
                    title: "MOC is approved Failed",
                    lableClose: "CLOSE",
                    content: err.message,
                    width: 500
                };
                utils.dialog.showDialog(option);
            });
        };

        $scope.mocApproveActions = [
            { text: 'CANCEL' },
            {
                text: 'APPROVE',
                action: function () {

                    if (!isProcessTriggerClick) {
                        return false;
                    }
                    isProcessTriggerClick = false;
                    if (!$scope.validators.mocApprove.validate()) {
                        isProcessTriggerClick = true;
                        return false;
                    }

                    if ($scope.validators.mocApprove.validate()) {
                        $scope.workFlowModel.remarks = $scope.mocApproveComment;
                        $scope.workFlowModel.isApproved = true;
                        $rootScope.isLoading = true;
                        isProcessTriggerClick = true;
                        $scope.approveMOC($stateParams.sceId, $stateParams.raId, $scope.workFlowModel);
                        return true;
                    }
                    return false;
                },
                primary: true
            }
        ];

        $scope.mocRejectComment = "";

        $scope.mocRejectActions = [
            { text: 'CANCEL' },
            {
                text: 'REJECT',
                action: function () {

                    if (!isProcessTriggerClick) {
                        return false;
                    }
                    isProcessTriggerClick = false;

                    if (!$scope.validators.mocReject.validate()) {
                        isProcessTriggerClick = true;
                        return false;
                    }
                    if ($scope.validators.mocReject.validate()) {
                        $scope.workFlowModel.remarks = $scope.mocRejectComment;
                        $scope.workFlowModel.isApproved = false;
                        $rootScope.isLoading = true;
                        isProcessTriggerClick = true;
                        $scope.approveMOC($stateParams.sceId, $stateParams.raId, $scope.workFlowModel);
                        return true;
                    }
                    return false;
                },
                primary: true
            }
        ];


        $scope.showTransferRolesKendoDiaglog = function () {
            $scope.reviewerToTransfer = $scope.raDetail.reviewer;
            $scope.endorserToTransfer = $scope.raDetail.endorser;
            $scope.approverToTransfer = $scope.raDetail.approver;
            $scope.mocApproverToTransfer = $scope.raDetail.mocApprover;
            if ($scope.pendingReview || $scope.pendingEndorse || $scope.pendingApprove || $scope.raDetail.mocStatusKey == 2) {
                $scope.transferRolesKendoDiaglog.center();
                $scope.transferRolesKendoDiaglog.open();
            }
        };

        $scope.transferRolesModel = {};
        $scope.applicantIsTransfered = false;
        $scope.reviewerIsTransfered = false;
        $scope.endorserIsTransfered = false;
        $scope.approverIsTransfered = false;
        $scope.mocApproverIsTransfered = false;
        $scope.adminComment = "";

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
                        return false;
                    }

                    if ($scope.validators.raTransfer.validate()) {
                        $scope.transferRolesModel = {
                            reviewerProfileId: $scope.pendingReview && $scope.raDetail.reviewer.userProfileId !== $scope.reviewerToTransfer.userProfileId && $scope.reviewerToTransfer.userProfileId !== "" ? $scope.reviewerToTransfer.userProfileId : null,
                            endorserProfileId: $scope.pendingEndorse && $scope.raDetail.endorser.userProfileId !== $scope.endorserToTransfer.userProfileId && $scope.endorserToTransfer.userProfileId !== "" ? $scope.endorserToTransfer.userProfileId : null,
                            approverProfileId: $scope.pendingApprove && $scope.raDetail.approver.userProfileId !== $scope.approverToTransfer.userProfileId && $scope.approverToTransfer.userProfileId !== "" ? $scope.approverToTransfer.userProfileId : null,
                            mocApproverProfileId: $scope.raDetail.mocStatusKey == 2 && $scope.raDetail.mocApprover.userProfileId !== $scope.mocApproverToTransfer.userProfileId && $scope.mocApproverToTransfer.userProfileId !== "" ? $scope.mocApproverToTransfer.userProfileId : null,
                            comment: $scope.adminComment
                        };
                        if (($scope.transferRolesModel.reviewerProfileId === null || $scope.transferRolesModel.reviewerProfileId === undefined) &&
                            ($scope.transferRolesModel.endorserProfileId === null || $scope.transferRolesModel.endorserProfileId === undefined) &&
                            ($scope.transferRolesModel.approverProfileId === null || $scope.transferRolesModel.approverProfileId === undefined) &&
                            ($scope.transferRolesModel.mocApproverProfileId === null || $scope.transferRolesModel.mocApproverProfileId === undefined)) {
                            isProcessTriggerClick = true;
                            return true;
                        }
                        $rootScope.isLoading = true;
                        isProcessTriggerClick = true;
                        raServices.transferRoles($stateParams.sceId, $stateParams.raId, $scope.transferRolesModel).then(function (response) {
                            if ($scope.transferRolesModel.reviewerProfileId !== null && $scope.transferRolesModel.reviewerProfileId !== undefined) {
                                $scope.reviewerIsTransfered = true;
                            }
                            if ($scope.transferRolesModel.endorserProfileId !== null && $scope.transferRolesModel.endorserProfileId !== undefined) {
                                $scope.endorserIsTransfered = true;
                            }
                            if ($scope.transferRolesModel.approverProfileId !== null && $scope.transferRolesModel.approverProfileId !== undefined) {
                                $scope.approverIsTransfered = true;
                            }
                            if ($scope.transferRolesModel.mocApproverProfileId !== null && $scope.transferRolesModel.mocApproverProfileId !== undefined) {
                                $scope.mocApproverIsTransfered = true;
                            }
                            $rootScope.isLoading = false;
                            $scope.transferResultDialog.open();
                        }, function (err) {
                            $rootScope.isLoading = false;
                            var option = {
                                id: "dialogInfo",
                                title: "RA Roles Transferred failed.",
                                lableClose: "CLOSE",
                                content: err.message,
                                width: 500
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
                $state.go(constants.state.raList);
            }
        }];

        var mocMeetingDateTimeOptions = {
            format: "yyyy/MM/dd hh:mm tt",
            min: new Date(1900, 0, 1),
            max: new Date(2099, 11, 31)
        };
        //End region "RA Create new"

        //region "RA Update Require"
        $scope.raDetail = {};

        $scope.reviewStatus = "";

        function setRiskTabkeIntializing() {
            $scope.selectedFacilitator = $scope.raDetail.reviewer;
            $scope.selectedEndorser = $scope.raDetail.endorser;
            $scope.selectedApprover = $scope.raDetail.approver;
            $scope.selectedPeopleSeverity = $scope.raDetail.peopleSeverity;
            if ($scope.raDetail.peopleSeverity !== null && $scope.raDetail.peopleSeverity !== undefined) {
                $("#peopleImpactDescription").text($scope.raDetail.peopleSeverity.impact);
            } else {
                $("#peopleImpactDescription").text("");
            }
            $scope.selectedPeopleLikelihood = $scope.raDetail.peopleLikelihood;
            if ($scope.raDetail.peopleLikelihood !== null && $scope.raDetail.peopleLikelihood !== undefined) {
                $("#peopleLikelihoodDescription").text($scope.raDetail.peopleLikelihood.description);
            } else {
                $("#peopleLikelihoodDescription").text("");
            }
            $scope.selectedEnvironmentSeverity = $scope.raDetail.environmentSeverity;
            if ($scope.raDetail.environmentSeverity !== null && $scope.raDetail.environmentSeverity !== undefined) {
                $("#environmentImpactDescription").text($scope.raDetail.environmentSeverity.impact);
            } else {
                $("#environmentImpactDescription").text("");
            }
            $scope.selectedEnvironmentLikelihood = $scope.raDetail.environmentLikelihood;
            if ($scope.raDetail.environmentLikelihood !== null && $scope.raDetail.environmentLikelihood !== undefined) {
                $("#environmentLikelihoodDescription").text($scope.raDetail.environmentLikelihood.description);
            } else {
                $("#environmentLikelihoodDescription").text("");
            }

            $scope.selectedReputationSeverity = $scope.raDetail.reputationSeverity;
            if ($scope.raDetail.reputationSeverity !== null && $scope.raDetail.reputationSeverity !== undefined) {
                $("#reputationImpactDescription").text($scope.raDetail.reputationSeverity.impact);
            } else {
                $("#reputationImpactDescription").text("");
            }
            $scope.selectedReputationLikelihood = $scope.raDetail.reputationLikelihood;
            if ($scope.raDetail.reputationLikelihood !== null && $scope.raDetail.reputationLikelihood !== undefined) {
                $("#reputationLikelihoodDescription").text($scope.raDetail.reputationLikelihood.description);
            } else {
                $("#reputationLikelihoodDescription").text("");
            }
            $scope.selectedAssetLikelihood = $scope.raDetail.assetLikelihood;
            if ($scope.raDetail.assetLikelihood !== null && $scope.raDetail.assetLikelihood !== undefined) {
                $("#assetLikelihoodDescription").text($scope.raDetail.assetLikelihood.description);
            } else {
                $("#assetLikelihoodDescription").text("");
            }
            $scope.selectedAssetSeverity = $scope.raDetail.assetSeverity;
            if ($scope.raDetail.assetSeverity !== null && $scope.raDetail.assetSeverity !== undefined) {
                $("#assetImpactDescription").text($scope.raDetail.assetSeverity.impact);
            } else {
                $("#assetImpactDescription").text("");
            }
            if ($scope.raDetail.peopleRisk !== null && $scope.raDetail.peopleRisk !== undefined) {
                $("#peopleRisk").html($scope.raDetail.peopleLikelihood.value + $scope.raDetail.peopleSeverity.value + "&nbsp&nbsp" + $scope.raDetail.peopleRisk.riskDescription);
            } else {
                $("#peopleRisk").text("");
            }
            if ($scope.raDetail.environmentRisk !== null && $scope.raDetail.environmentRisk !== undefined) {
                $("#environmentRisk").html($scope.raDetail.environmentLikelihood.value + $scope.raDetail.environmentSeverity.value + "&nbsp&nbsp" + $scope.raDetail.environmentRisk.riskDescription);
            } else {
                $("#environmentRisk").text("");
            }
            if ($scope.raDetail.assetRisk !== null && $scope.raDetail.assetRisk !== undefined) {
                $("#assetRisk").html($scope.raDetail.assetLikelihood.value + $scope.raDetail.assetSeverity.value + "&nbsp&nbsp" + $scope.raDetail.assetRisk.riskDescription);
            } else {
                $("#assetRisk").text("");
            }
            if ($scope.raDetail.reputationRisk !== null && $scope.raDetail.reputationRisk !== undefined) {
                $("#reputationRisk").html($scope.raDetail.reputationLikelihood.value + $scope.raDetail.reputationSeverity.value + "&nbsp&nbsp" + $scope.raDetail.reputationRisk.riskDescription);
            } else {
                $("#reputationRisk").text("");
            }
            $scope.riskDescription = $scope.raDetail.riskIdentification === null || $scope.raDetail.riskIdentification === undefined ? "" : $scope.raDetail.riskIdentification.riskDescription;
            if ($scope.raDetail.riskIdentification !== null && $scope.raDetail.riskIdentification !== undefined) {
                $("#riskLevel").text($scope.raDetail.riskIdentification.riskDescription);
            } else {
                $("#riskLevel").text("");
            }

            $scope.teamMembers = $scope.raDetail.teamMembers;
            if ($scope.raDetail.riskIdentification !== null && $scope.raDetail.riskIdentification !== undefined) {
                $scope.riskLevel = $scope.raDetail.riskIdentification.riskValue;
            } else {
                $scope.riskLevel = 0;
            }

            $("#teamMembersGrid").data("kendoGrid").dataSource.data($scope.raDetail.teamMembers);
        }

        function chunk(arr, size) {
            var newArr = [];
            for (var i = 0; i < arr.length; i += size) {
                newArr.push(arr.slice(i, i + size));
            }
            return newArr;
        }

        $scope.chunkTeamMember = {};

        $scope.raPrint = function () {
            window.open('/print/ra/' + $stateParams.sceId + '/' + $stateParams.raId, '_blank');
        };

        $scope.getRADetailData = function (statusKey) {
            $rootScope.isLoading = true;
            raServices.getRADetail($stateParams.sceId, $stateParams.raId).then(function (response) {
                $rootScope.isLoading = false;
                if (response.data !== null && response.data !== undefined && response.data.raHeaderDetail !== null && response.data.raHeaderDetail !== undefined) {
                    if (statusKey !== response.data.raHeaderDetail.raStatusKey) {
                        $scope.redirectFunction(response, response.data.raHeaderDetail.raStatusKey);
                    }
                    $scope.raDetail = response.data;
                    $scope.InitializeStatusAndPermission();
                    if ($scope.raDetail.raHeaderDetail.raStatusKey === constants.RA.statusKey.raUpdateRequired) {
                        if ($scope.raDetail.reviewer !== null && $scope.raDetail.reviewer.status === false) {
                            $scope.actionResponse = constants.RA.actionResponse.review;
                            $scope.statusTypeResponse = constants.RA.statusTypeReponse.review;
                            $scope.personInCharge = $scope.raDetail.reviewer;
                        }
                        else {
                            if ($scope.raDetail.endorser !== null && $scope.raDetail.endorser.status === false) {
                                $scope.actionResponse = constants.RA.actionResponse.endorse;
                                $scope.statusTypeResponse = constants.RA.statusTypeReponse.endorse;
                                $scope.personInCharge = $scope.raDetail.endorser;
                            } else {
                                if ($scope.raDetail.approver !== null && $scope.raDetail.approver.status === false) {
                                    $scope.actionResponse = constants.RA.actionResponse.approve;
                                    $scope.statusTypeResponse = constants.RA.statusTypeReponse.approve;
                                    $scope.personInCharge = $scope.raDetail.approver;
                                }
                            }
                        }
                    }

                    if (response.data.raHeaderDetail.mocNo !== null && response.data.raHeaderDetail.mocNo !== undefined && response.data.raHeaderDetail.mocNo !== "") {
                        $scope.isUpdatedMOC = true;
                    } else {
                        $scope.isUpdatedMOC = false;
                    }

                    if (response.data.hasOwnProperty('raHeaderDetail')) {
                        $scope.isMOCRequired = response.data.raHeaderDetail.isMOCRequired;
                    } else {
                        $scope.isMOCRequired = response.data.isMOCRequired;
                    }
                    $scope.peopleRiskValue = $scope.raDetail.peopleRisk === null || $scope.raDetail.peopleRisk === undefined ? 0 : $scope.raDetail.peopleRisk.riskValue;
                    $scope.peopleRiskDescription = $scope.raDetail.peopleRisk === null || $scope.raDetail.peopleRisk === undefined ? "" : $scope.raDetail.peopleRisk.riskDescription;
                    $scope.environmentRiskValue = $scope.raDetail.environmentRisk === null || $scope.raDetail.environmentRisk === undefined ? 0 : $scope.raDetail.environmentRisk.riskValue;
                    $scope.environmentRiskDescription = $scope.raDetail.environmentRisk === null || $scope.raDetail.environmentRisk === undefined ? "" : $scope.raDetail.environmentRisk.riskDescription;
                    $scope.assetRiskValue = $scope.raDetail.assetRisk === null || $scope.raDetail.assetRisk === undefined ? 0 : $scope.raDetail.assetRisk.riskValue;
                    $scope.assetRiskDescription = $scope.raDetail.assetRisk === null || $scope.raDetail.assetRisk === undefined ? "" : $scope.raDetail.assetRisk.riskDescription;
                    $scope.reputationRiskValue = $scope.raDetail.reputationRisk === null || $scope.raDetail.reputationRisk === undefined ? 0 : $scope.raDetail.reputationRisk.riskValue;
                    $scope.reputationRiskDescription = $scope.raDetail.reputationRisk === null || $scope.raDetail.reputationRisk === undefined ? "" : $scope.raDetail.reputationRisk.riskDescription;

                    setRiskTabkeIntializing();
                    if ($scope.raDetail.peopleRisk !== null && $scope.raDetail.peopleRisk !== undefined)
                        $scope.setRiskClass("#peopleRisk", $scope.raDetail.peopleRisk.riskValue, false);
                    if ($scope.raDetail.environmentRisk !== null && $scope.raDetail.environmentRisk !== undefined)
                        $scope.setRiskClass("#environmentRisk", $scope.raDetail.environmentRisk.riskValue, false);
                    if ($scope.raDetail.assetRisk !== null && $scope.raDetail.assetRisk !== undefined)
                        $scope.setRiskClass("#assetRisk", $scope.raDetail.assetRisk.riskValue, false);
                    if ($scope.raDetail.reputationRisk !== null && $scope.raDetail.reputationRisk !== undefined)
                        $scope.setRiskClass("#reputationRisk", $scope.raDetail.reputationRisk.riskValue, false);
                    $scope.setRiskClass("#riskLevel", $scope.riskLevel, true);
                    if ($("#riskDescription").length) {
                        $scope.setRiskClass("#riskDescription", $scope.riskLevel, true);
                    }
                } else {
                    var option = {
                        id: "dialogInfo",
                        title: "Data Not Found",
                        lableClose: "CLOSE",
                        content: response.message,
                        width: 500
                    };
                    utils.dialog.showDialog(option, function () {
                        $state.go(constants.state.raList);
                    });

                }
            }, function (err) {
                $rootScope.isLoading = false;
                utils.error.showErrorGet(err);
            });
        };

        $scope.getRACopyData = function () {
            $rootScope.isLoading = true;

            raServices.getInfoRaCopy($stateParams.sceId).then(function (response) {
                if (response.data !== null && response.data !== undefined && response.data.raHeaderDetail !== null && response.data.raHeaderDetail !== undefined) {
                    $rootScope.isLoading = false;

                    $scope.initialData.areaId = response.data.raHeaderDetail.areaId;
                    $scope.initialData.areaName = response.data.raHeaderDetail.area;
                    $scope.initialData.sceNo = response.data.raHeaderDetail.sceNo;
                    $scope.initialData.tagNo = response.data.raHeaderDetail.tagNo;

                    //================
                    $scope.selectedFacilitator = {
                        userProfileId: response.data.reviewer.userProfileId,
                        userName: response.data.reviewer.userName,
                        image: response.data.reviewer.image
                    };

                    $scope.selectedEndorser = {
                        userProfileId: response.data.endorser.userProfileId,
                        userName: response.data.endorser.userName,
                        image: response.data.endorser.image
                    };

                    $scope.selectedApprover = {
                        userProfileId: response.data.approver.userProfileId,
                        userName: response.data.approver.userName,
                        image: response.data.approver.image
                    };

                    $scope.raHeaderModel.workDescription = response.data.raHeaderDetail.workDescription;
                    $scope.raHeaderModel.consequences = response.data.raHeaderDetail.consequences;
                    $scope.raHeaderModel.processMonitoring = response.data.raHeaderDetail.processMonitoring;
                    $scope.raHeaderModel.processTrips = response.data.raHeaderDetail.processTrips;
                    $scope.raHeaderModel.recoveryMeasures = response.data.raHeaderDetail.recoveryMeasures;
                    $scope.raHeaderModel.instructionOfOperation = response.data.raHeaderDetail.instructionOfOperation;
                    $scope.raHeaderModel.instrumentImpact = response.data.raHeaderDetail.instrumentImpact;

                    //========================
                    
                    $scope.raDetail = response.data;
                    $scope.InitializeStatusAndPermission();
                    
                    if ($scope.raDetail.reviewer !== null && $scope.raDetail.reviewer.status === false) {
                        $scope.actionResponse = constants.RA.actionResponse.review;
                        $scope.statusTypeResponse = constants.RA.statusTypeReponse.review;
                        $scope.personInCharge = $scope.raDetail.reviewer;
                    }
                    else {
                        if ($scope.raDetail.endorser !== null && $scope.raDetail.endorser.status === false) {
                            $scope.actionResponse = constants.RA.actionResponse.endorse;
                            $scope.statusTypeResponse = constants.RA.statusTypeReponse.endorse;
                            $scope.personInCharge = $scope.raDetail.endorser;
                        } else {
                            if ($scope.raDetail.approver !== null && $scope.raDetail.approver.status === false) {
                                $scope.actionResponse = constants.RA.actionResponse.approve;
                                $scope.statusTypeResponse = constants.RA.statusTypeReponse.approve;
                                $scope.personInCharge = $scope.raDetail.approver;
                            }
                        }
                    }
                   
                    
                    $scope.peopleRiskValue = $scope.raDetail.peopleRisk === null || $scope.raDetail.peopleRisk === undefined ? 0 : $scope.raDetail.peopleRisk.riskValue;
                    $scope.peopleRiskDescription = $scope.raDetail.peopleRisk === null || $scope.raDetail.peopleRisk === undefined ? "" : $scope.raDetail.peopleRisk.riskDescription;
                    $scope.environmentRiskValue = $scope.raDetail.environmentRisk === null || $scope.raDetail.environmentRisk === undefined ? 0 : $scope.raDetail.environmentRisk.riskValue;
                    $scope.environmentRiskDescription = $scope.raDetail.environmentRisk === null || $scope.raDetail.environmentRisk === undefined ? "" : $scope.raDetail.environmentRisk.riskDescription;
                    $scope.assetRiskValue = $scope.raDetail.assetRisk === null || $scope.raDetail.assetRisk === undefined ? 0 : $scope.raDetail.assetRisk.riskValue;
                    $scope.assetRiskDescription = $scope.raDetail.assetRisk === null || $scope.raDetail.assetRisk === undefined ? "" : $scope.raDetail.assetRisk.riskDescription;
                    $scope.reputationRiskValue = $scope.raDetail.reputationRisk === null || $scope.raDetail.reputationRisk === undefined ? 0 : $scope.raDetail.reputationRisk.riskValue;
                    $scope.reputationRiskDescription = $scope.raDetail.reputationRisk === null || $scope.raDetail.reputationRisk === undefined ? "" : $scope.raDetail.reputationRisk.riskDescription;

                    setRiskTabkeIntializing();
                    if ($scope.raDetail.peopleRisk !== null && $scope.raDetail.peopleRisk !== undefined)
                        $scope.setRiskClass("#peopleRisk", $scope.raDetail.peopleRisk.riskValue, false);
                    if ($scope.raDetail.environmentRisk !== null && $scope.raDetail.environmentRisk !== undefined)
                        $scope.setRiskClass("#environmentRisk", $scope.raDetail.environmentRisk.riskValue, false);
                    if ($scope.raDetail.assetRisk !== null && $scope.raDetail.assetRisk !== undefined)
                        $scope.setRiskClass("#assetRisk", $scope.raDetail.assetRisk.riskValue, false);
                    if ($scope.raDetail.reputationRisk !== null && $scope.raDetail.reputationRisk !== undefined)
                        $scope.setRiskClass("#reputationRisk", $scope.raDetail.reputationRisk.riskValue, false);
                    $scope.setRiskClass("#riskLevel", $scope.riskLevel, true);
                    if ($("#riskDescription").length) {
                        $scope.setRiskClass("#riskDescription", $scope.riskLevel, true);
                    }
                } else {
                    var option = {
                        id: "dialogInfo",
                        title: "Data Not Found",
                        lableClose: "CLOSE",
                        content: response.message,
                        width: 500
                    };
                    utils.dialog.showDialog(option, function () {
                        $state.go(constants.state.raList);
                    });

                }
            }, function (err) {
                $rootScope.isLoading = false;
                utils.error.showErrorGet(err);
            });
        };

        $scope.approveComment = "";

        $scope.rejectComment = "";

        $scope.reviewRejectActions = [
            { text: 'CANCEL' },
            {
                text: 'REJECT',
                action: function () {

                    if (!isProcessTriggerClick) {
                        return false;
                    }
                    isProcessTriggerClick = false;

                    if (!$scope.validators.reject.validate()) {
                        isProcessTriggerClick = true;
                        return false;
                    }
                    if ($scope.validators.reject.validate()) {
                        $scope.workFlowModel.remarks = $scope.rejectComment;
                        $scope.workFlowModel.isApproved = false;
                        $rootScope.isLoading = true;
                        isProcessTriggerClick = true;
                        $scope.reviewRA($stateParams.sceId, $stateParams.raId, $scope.workFlowModel);
                        return true;
                    }
                    return false;
                },
                primary: true
            }
        ];

        $scope.reviewApproveActions = [
            { text: 'CANCEL' },
            {
                text: 'APPROVE',
                action: function () {

                    if (!isProcessTriggerClick) {
                        return false;
                    }
                    isProcessTriggerClick = false;

                    if (!$scope.validators.approve.validate()) {
                        isProcessTriggerClick = true;
                        return false;
                    }

                    if ($scope.validators.approve.validate()) {
                        $scope.workFlowModel.remarks = $scope.approveComment;
                        $scope.workFlowModel.isApproved = true;
                        $rootScope.isLoading = true;
                        isProcessTriggerClick = true;
                        $scope.reviewRA($stateParams.sceId, $stateParams.raId, $scope.workFlowModel);
                        return true;
                    }
                    return false;
                },
                primary: true
            }
        ];

        $scope.endorseRejectActions = [
            { text: 'CANCEL' },
            {
                text: 'REJECT',
                action: function () {

                    if (!isProcessTriggerClick) {
                        return false;
                    }
                    isProcessTriggerClick = false;

                    if (!$scope.validators.reject.validate()) {
                        isProcessTriggerClick = true;
                        return false;
                    }

                    if ($scope.validators.reject.validate()) {
                        $scope.workFlowModel.remarks = $scope.rejectComment;
                        $scope.workFlowModel.isApproved = false;
                        $rootScope.isLoading = true;
                        isProcessTriggerClick = true;
                        $scope.endorseRA($stateParams.sceId, $stateParams.raId, $scope.workFlowModel);
                        return true;
                    }
                    return false;
                },
                primary: true
            }
        ];

        $scope.endorseApproveActions = [
            { text: 'CANCEL' },
            {
                text: 'APPROVE',
                action: function () {
                    if (!isProcessTriggerClick) {
                        return false;
                    }
                    isProcessTriggerClick = false;

                    if (!$scope.validators.approve.validate()) {
                        isProcessTriggerClick = true;
                        return false;
                    }

                    if ($scope.validators.approve.validate()) {
                        $scope.workFlowModel.remarks = $scope.approveComment;
                        $scope.workFlowModel.isApproved = true;
                        $rootScope.isLoading = true;
                        isProcessTriggerClick = true;
                        $scope.endorseRA($stateParams.sceId, $stateParams.raId, $scope.workFlowModel);
                        return true;
                    }
                    return false;
                },
                primary: true
            }
        ];

        $scope.approveRejectActions = [
            { text: 'CANCEL' },
            {
                text: 'REJECT',
                action: function () {
                    if (!isProcessTriggerClick) {
                        return false;
                    }
                    isProcessTriggerClick = false;
                    if (!$scope.validators.reject.validate()) {
                        isProcessTriggerClick = true;
                        return false;
                    }
                    if ($scope.validators.reject.validate()) {
                        $scope.workFlowModel.remarks = $scope.rejectComment;
                        $scope.workFlowModel.isApproved = false;
                        $rootScope.isLoading = true;
                        isProcessTriggerClick = true;
                        $scope.approveRA($stateParams.sceId, $stateParams.raId, $scope.workFlowModel);
                        return true;
                    }
                    return false;
                },
                primary: true
            }
        ];

        $scope.approveApproveActions = [
            { text: 'CANCEL' },
            {
                text: 'APPROVE',
                action: function () {

                    if (!isProcessTriggerClick) {
                        return false;
                    }
                    isProcessTriggerClick = false;
                    if (!$scope.validators.approve.validate()) {
                        isProcessTriggerClick = true;
                        return false;
                    }

                    if ($scope.validators.approve.validate()) {
                        $scope.workFlowModel.remarks = $scope.approveComment;
                        $scope.workFlowModel.isApproved = true;
                        $rootScope.isLoading = true;
                        isProcessTriggerClick = true;
                        $scope.approveRA($stateParams.sceId, $stateParams.raId, $scope.workFlowModel);
                        return true;
                    }
                    return false;
                },
                primary: true
            }
        ];

        $scope.reviewRA = function (sceId, raId, model) {
            raServices.reviewRA(sceId, raId, model).then(function (response) {
                $rootScope.isLoading = false;
                var option = {};
                if (response.data !== null && response.data !== undefined) {
                    if (model.isApproved) {
                        option = {
                            id: "dialogInfo",
                            title: "RA Reviewed",
                            lableClose: "CLOSE",
                            content: "This RA is reviewed and <strong>pending endorsement</strong>.",
                            width: 500
                        };
                        utils.dialog.showDialog(option, function () {
                            $state.go(constants.state.raList);
                        });

                    } else {
                        option = {
                            id: "dialogInfo",
                            title: "RA Rejected",
                            lableClose: "CLOSE",
                            content: "This RA is not reviewed and <strong>requires update</strong> from the applicant",
                            width: 500
                        };
                        utils.dialog.showDialog(option, function () {
                            $state.go(constants.state.raList);
                        });
                    }
                } else {
                    option = {
                        id: "dialogInfo",
                        title: "RA Review failed",
                        lableClose: "CLOSE",
                        content: "There are some errors occurs",
                        width: 500
                    };
                    utils.dialog.showDialog(option);
                }
            }, function (err) {
                $rootScope.isLoading = false;
                var option = {
                    id: "dialogInfo",
                    title: "RA Review failed",
                    lableClose: "CLOSE",
                    content: err.message,
                    width: 500
                };
                utils.dialog.showDialog(option, function () {
                });

            });
        };

        $scope.endorseRA = function (sceId, raId, model) {
            raServices.endorseRA(sceId, raId, model).then(function (response) {
                $rootScope.isLoading = false;
                var option = {};
                if (response.data !== null && response.data !== undefined) {
                    if (model.isApproved) {
                        option = {
                            id: "dialogInfo",
                            title: "RA Endorsed",
                            lableClose: "CLOSE",
                            content: "This RA is endorsed and <strong>pending approval</strong>.",
                            width: 500
                        };
                        utils.dialog.showDialog(option, function () {
                            $state.go(constants.state.raList);
                        });

                    } else {
                        option = {
                            id: "dialogInfo",
                            title: "RA Rejected",
                            lableClose: "CLOSE",
                            content: "This RA is not endorsed and <strong>requires update</strong> from the applicant",
                            width: 500
                        };
                        utils.dialog.showDialog(option, function () {
                            $state.go(constants.state.raList);
                        });

                    }
                } else {
                    option = {
                        id: "dialogInfo",
                        title: "Endorse RA Failed",
                        lableClose: "CLOSE",
                        content: "There are some errors occur",
                        width: 500
                    };
                    utils.dialog.showDialog(option);
                }
            }, function (err) {
                $rootScope.isLoading = false;
                var option = {
                    id: "dialogInfo",
                    title: "Approve RA Failed",
                    lableClose: "CLOSE",
                    content: err.message,
                    width: 500
                };
                utils.dialog.showDialog(option, function () {
                });

            });
        };

        $scope.approveRA = function (sceId, raId, model) {
            raServices.approveRA(sceId, raId, model).then(function (response) {
                $rootScope.isLoading = false;
                var option = {};
                if (response.data !== null && response.data !== undefined) {
                    if (model.isApproved) {
                        option = {
                            id: "dialogInfo",
                            title: "RA Approved",
                            lableClose: "CLOSE",
                            content: "This RA is approved",
                            width: 500
                        };
                        utils.dialog.showDialog(option, function () {
                            $state.go(constants.state.raList);
                        });
                    } else {
                        option = {
                            id: "dialogInfo",
                            title: "RA Not Approved",
                            lableClose: "CLOSE",
                            content: "This RA is not approved and <strong>requires update</strong> from the applicant",
                            width: 500
                        };
                        utils.dialog.showDialog(option, function () {
                            $state.go(constants.state.raList);
                        });

                    }
                } else {
                    option = {
                        id: "dialogInfo",
                        title: "Approve RA Failed",
                        lableClose: "CLOSE",
                        content: "There are some errors occur",
                        width: 500
                    };
                    utils.dialog.showDialog(option);
                }
            }, function (err) {
                $rootScope.isLoading = false;
                var option = {
                    id: "dialogInfo",
                    title: "Approve RA Failed",
                    lableClose: "CLOSE",
                    content: err.message,
                    width: 500
                };
                utils.dialog.showDialog(option);
            });
        };

        $scope.cancelRA = function () {
            if ($scope.isApplicant || $scope.isAdmin) {
                $scope.confirmDialog("RA Cancel", "Are you sure you want to cancel this RA?").then(function () {
                    raServices.cancelRA($stateParams.sceId, $stateParams.raId).then(function (response) {
                        var option = {
                            id: "dialogInfo",
                            title: "RA Cancelled",
                            lableClose: "CLOSE",
                            content: "RA form has been cancelled successfully",
                            width: 500
                        };
                        utils.dialog.showDialog(option, function () {
                            $state.go(constants.state.raList);
                        });
                    }, function (error) {
                        var option = {
                            id: "dialogInfo",
                            title: "RA Cancelled Failed",
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
            } else {
                var option = {
                    id: "dialogInfo",
                    title: "Access Denied",
                    lableClose: "CLOSE",
                    content: "You don't have permission to do this action. Please contact to Administrator.",
                    width: 500
                };
                utils.dialog.showDialog(option, function () {
                    $state.go(constants.state.raList);
                });
            }
        };

        $scope.workFlowModel = {
            isApproved: false,
            remarks: ""
        };

        $(".approve-button").click(function () {
            var dialog = $("#approveDialog").data("kendoDialog");
            dialog.open();
        });

        $(".cancel-button").click(function () {
            $scope.cancelRA();
        });

        $(".reject-button").click(function () {
            utils.clearValid();
            var dialog = $("#rejectDialog").data("kendoDialog");
            dialog.open();
        });

        $scope.confirmDialog = function (title, content) {
            return $("<div></div>").kendoConfirm({
                title: title,
                content: content
            }).data("kendoConfirm").open().result;
        };
        $scope.mocConfirmDialog = function (title, content) {
            return $("<div></div>").kendoConfirm({
                title: title,
                content: content,
                actions: [{ text: "SUBMIT", primary: true },
                    { text: "CANCEL" }]
            }).data("kendoConfirm").open().result;
        };

        $scope.cancelMocConfirmDialog = function (title, content) {
            return $("<div></div>").kendoConfirm({
                title: title,
                content: content,
                actions: [{ text: "CANCEL MOC", primary: true },
                    { text: "CANCEL" }]
            }).data("kendoConfirm").open().result;
        };
        $scope.cancelMOC = function () {
            if ($scope.isApplicant || $scope.isAdmin) {
                $scope.cancelMocConfirmDialog("Cancel MOC", "Are you sure to cancel MOC?").then(function () {
                    raServices.cancelMOC($stateParams.sceId, $stateParams.raId).then(function (response) {
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
            } else {
                var option = {
                    id: "dialogInfo",
                    title: "Access Denied",
                    lableClose: "CLOSE",
                    content: "You don't have permission to do this action. Please contact to Administrator.",
                    width: 500
                };
                utils.dialog.showDialog(option, function () {
                    $state.go(constants.state.raList);
                });
            }
        };


        $scope.InitializeStatusAndPermission = function () {
            if ($scope.raDetail.raHeaderDetail.applicantUserProfileId === $scope.userProfile.userProfileId) {
                $scope.isApplicant = true;
            } else {
                $scope.isApplicant = false;
            }

            if ($scope.raDetail.reviewer !== null && $scope.raDetail.reviewer !== undefined && $scope.raDetail.reviewer.userProfileId === $scope.userProfile.userProfileId) {
                $scope.isFacilitator = true;
            } else {
                $scope.isFacilitator = false;
            }

            if ($scope.raDetail.endorser !== null && $scope.raDetail.endorser !== undefined && $scope.raDetail.endorser.userProfileId === $scope.userProfile.userProfileId) {
                $scope.isEndorser = true;
            } else {
                $scope.isEndorser = false;
            }
            if ($scope.raDetail.approver !== null && $scope.raDetail.approver !== undefined && $scope.raDetail.approver.userProfileId === $scope.userProfile.userProfileId) {
                $scope.isApprover = true;
            } else {
                $scope.isApprover = false;
            }
            if ($scope.raDetail.mocApprover !== null && $scope.raDetail.mocApprover !== undefined && $scope.raDetail.mocApprover.userProfileId === $scope.userProfile.userProfileId) {
                $scope.isMocApprover = true;
            } else {
                $scope.isMocApprover = false;
            }
            switch ($scope.raDetail.raHeaderDetail.raStatusKey) {
                case constants.RA.statusKey.raUpdateRequired:
                    $scope.RaStatus = constants.RA.status.updateRequired;
                    break;
                case constants.RA.statusKey.raPendingReview:
                    $scope.pendingReview = true;
                    $scope.RaStatus = constants.RA.status.pendingReview;
                    break;
                case constants.RA.statusKey.raPendingEndorsement:
                    $scope.pendingEndorse = true;
                    $scope.RaStatus = constants.RA.status.pendingEndorse;
                    break;
                case constants.RA.statusKey.raPendingApproval:
                    $scope.pendingApprove = true;
                    $scope.RaStatus = constants.RA.status.pendingApproval;
                    break;
                case constants.RA.statusKey.raApproved:
                    $scope.RaStatus = constants.RA.status.approved;
                    break;
                case constants.RA.statusKey.raPendingMoc:
                    $scope.RaStatus = constants.RA.status.pendingMOC;
                    break;
                case constants.RA.statusKey.raPendingMocApproval:
                    $scope.RaStatus = constants.RA.status.pendingMOCApproval;
                    break;
                case constants.RA.statusKey.raMocRequiresUpdate:
                    $scope.RaStatus = constants.RA.status.MocRequriesUpdate;
                    break;
                case constants.RA.statusKey.raMoc:
                    $scope.RaStatus = constants.RA.status.Moc;
                    break;
            }
        };

        $scope.isMOCRequired = false;
        $scope.isUpdatedMOC = false;
        // Class for MOC flow
        $scope.mocFlowClass = {
            application: '',
            approval: ''
        }

        $scope.getRADetailForWorkflow = function () {
            $rootScope.isLoading = true;
            raServices.getRADetail($stateParams.sceId, $stateParams.raId).then(function (response) {
                $rootScope.isLoading = false;
                if (response.data !== null && response.data !== undefined) {
                    $scope.raDetail = response.data;
                    $scope.InitializeStatusAndPermission();

                    switch ($scope.raDetail.raHeaderDetail.raStatusKey) {
                        case constants.RA.statusKey.raPendingReview: {
                            $scope.pendingReview = true;
                            break;
                        }
                        case constants.RA.statusKey.raPendingEndorsement: {
                            $scope.pendingEndorse = true;
                            $scope.isReviewed = true;
                            break;
                        }
                        case constants.RA.statusKey.raPendingApproval: {
                            $scope.pendingApprove = true;
                            $scope.isReviewed = true;
                            $scope.isEndorsed = true;
                            break;
                        }
                        case constants.RA.statusKey.raApproved: {
                            $scope.isReviewed = true;
                            $scope.isEndorsed = true;
                            $scope.isApproved = true;
                            break;
                        }
                        case constants.RA.statusKey.raPendingMoc:
                            {
                                $scope.isReviewed = true;
                                $scope.isEndorsed = true;
                                $scope.isApproved = true;
                                if ($scope.isApplicant) {
                                    $scope.mocFlowClass.application = 'current';
                                } else {
                                    $scope.mocFlowClass.application = '';
                                }
                                $scope.mocFlowClass.approval = '';
                                $scope.showMocFlow = true;
                                break;
                            }
                        case constants.RA.statusKey.raMocRequiresUpdate: {
                            $scope.isReviewed = true;
                            $scope.isEndorsed = true;
                            $scope.isApproved = true;
                            $scope.mocFlowClass.application = 'current';
                            $scope.mocFlowClass.approval = '';
                            $scope.showMocFlow = true;
                            break;
                        }
                        case constants.RA.statusKey.raPendingMocApproval: {
                            $scope.isReviewed = true;
                            $scope.isEndorsed = true;
                            $scope.isApproved = true;
                            $scope.mocFlowClass.application = 'completed';
                            if ($scope.isMocApprover) {
                                $scope.mocFlowClass.approval = 'current';
                            } else {
                                $scope.mocFlowClass.approval = '';
                            }
                            $scope.showMocFlow = true;
                            break;
                        }
                        case constants.RA.statusKey.raMoc: {
                            $scope.isReviewed = true;
                            $scope.isEndorsed = true;
                            $scope.isApproved = true;
                            $scope.mocFlowClass.application = 'completed';
                            $scope.mocFlowClass.approval = 'completed';
                            $scope.showMocFlow = true;
                            break;
                        }
                    }
                    if (response.data.raHeaderDetail !== null && response.data.raHeaderDetail !== undefined && (response.data.raHeaderDetail.mocNo !== null && response.data.raHeaderDetail.mocNo !== undefined && response.data.raHeaderDetail.mocNo !== "")) {
                        $scope.isUpdatedMOC = true;
                    } else {
                        $scope.isUpdatedMOC = false;
                    }
                    if (response.data.hasOwnProperty('raHeaderDetail')) {
                        $scope.isMOCRequired = response.data.raHeaderDetail.isMOCRequired;
                    } else {
                        $scope.isMOCRequired = response.data.isMOCRequired;
                    }
                    //set Initial Data
                    $scope.selectedFacilitator = $scope.raDetail.reviewer;
                    $scope.selectedEndorser = $scope.raDetail.endorser;
                    $scope.selectedApprover = $scope.raDetail.approver;
                    $scope.selectedMocApprover = $scope.raDetail.mocApprover;
                    $scope.selectedPeopleSeverity = $scope.raDetail.peopleSeverity;
                    $scope.selectedPeopleLikelihood = $scope.raDetail.peopleLikelihood;
                    $scope.selectedEnvironmentSeverity = $scope.raDetail.environmentSeverity;
                    $scope.selectedEnvironmentLikelihood = $scope.raDetail.environmentLikelihood;
                    $scope.selectedReputationSeverity = $scope.raDetail.reputationSeverity;
                    $scope.selectedReputationLikelihood = $scope.raDetail.reputationLikelihood;
                    $scope.selectedAssetLikelihood = $scope.raDetail.assetLikelihood;
                    $scope.selectedAssetSeverity = $scope.raDetail.assetSeverity;
                    $scope.riskDescription = $scope.raDetail.riskIdentification.riskDescription;
                    $scope.teamMembers = $scope.raDetail.teamMembers;
                    $scope.chunkTeamMember = chunk($scope.teamMembers, constants.RA.teamMemberSplitSize);
                    $scope.riskLevel = $scope.raDetail.riskIdentification.riskValue;
                    $scope.setRiskClass("#peopleRisk", $scope.raDetail.peopleRisk.riskValue, false);
                    $scope.setRiskClassForPrinting("#print_PeopleRisk", $scope.raDetail.peopleRisk.riskValue, false);

                    $scope.setRiskClass("#environmentRisk", $scope.raDetail.environmentRisk.riskValue, false);
                    $scope.setRiskClassForPrinting("#print_EnvironmentRisk", $scope.raDetail.environmentRisk.riskValue, false);

                    $scope.setRiskClass("#assetRisk", $scope.raDetail.assetRisk.riskValue, false);
                    $scope.setRiskClassForPrinting("#print_AssetRisk", $scope.raDetail.assetRisk.riskValue, false);

                    $scope.setRiskClass("#reputationRisk", $scope.raDetail.reputationRisk.riskValue, false);
                    $scope.setRiskClassForPrinting("#print_ReputationRisk", $scope.raDetail.reputationRisk.riskValue, false);

                    $scope.setRiskClass("#riskLevel", $scope.riskLevel, true);

                    $scope.setRiskClassForPrinting("#print_RiskDescription", $scope.riskLevel, true);
                    if ($("#riskDescription").length) {
                        $scope.setRiskClass("#riskDescription", $scope.riskLevel, true);
                    }
                } else {
                    var option = {
                        id: "dialogInfo",
                        title: "Data Not Found",
                        lableClose: "CLOSE",
                        content: response.message,
                        width: 500
                    };
                    utils.dialog.showDialog(option, function () {
                        $state.go(constants.state.raList);
                    });
                }
            }, function (err) {
                $rootScope.isLoading = false;
                utils.error.showErrorGet(err);
                //$state.go(constants.state.raList);
            });
        };
        //end region "RA Update Require"

        $scope.redirectFunction = function (response, statusKey) {
            switch (statusKey) {
                case constants.RA.statusKey.raDraft:
                    if (response.data.applicantProfileId !== $scope.userProfile.userProfileId) {
                        $state.go(constants.state.raList);
                    } else {
                        $state.go(constants.state.raEdit, { sceId: $stateParams.sceId, raId: $stateParams.raId });
                    }
                    break;
                case constants.RA.statusKey.raUpdateRequired:
                    {
                        if (response.data.applicantProfileId !== $scope.userProfile.userProfileId) {
                            $state.go(constants.state.raInfo, { sceId: $stateParams.sceId, raId: $stateParams.raId });
                        } else {
                            $state.go(constants.state.raUpdateRequired, { sceId: $stateParams.sceId, raId: $stateParams.raId });
                        }
                        break;
                    }
                case constants.RA.statusKey.raPendingReview:
                    $state.go(constants.state.raReview, { sceId: $stateParams.sceId, raId: $stateParams.raId });
                    break;
                case constants.RA.statusKey.raPendingEndorsement:
                    $state.go(constants.state.raEndorse, { sceId: $stateParams.sceId, raId: $stateParams.raId });
                    break;
                case constants.RA.statusKey.raPendingApproval:
                    $state.go(constants.state.raApprove, { sceId: $stateParams.sceId, raId: $stateParams.raId });
                    break;
                case constants.RA.statusKey.raApproved:
                    $state.go(constants.state.raInfo, { sceId: $stateParams.sceId, raId: $stateParams.raId });
                    break;
                case constants.RA.statusKey.raPendingMoc:
                case constants.RA.statusKey.raPendingMocApproval:
                case constants.RA.statusKey.raMocRequiresUpdate:
                case constants.RA.statusKey.raMoc:
                    {
                        $state.go(constants.state.raMOC, { sceId: $stateParams.sceId, raId: $stateParams.raId });
                        break;
                    }

            }
        };

        //Redirect site based on the corresponding function
        var onLoad = function (routeName) {
            // check bigModule
            $rootScope.bigModuleTitle = "Safety Critical Equipment (SCE)";
            
            // end check
            switch (routeName) {
                case constants.state.raNew:
                    $rootScope.$app.title = constants.titlePage.raNew;
                    $scope.getInitialData();
                    break;
                case constants.state.raCopy:
                    $rootScope.$app.title = constants.titlePage.raNew;
                    $scope.getRACopyData();
                    break;
                case constants.state.raDetail:
                    $rootScope.isLoading = true;
                    raServices.getRABasic($stateParams.raId).then(function (response) {
                        $rootScope.isLoading = false;
                        if (response.data !== null && response.data !== undefined) {
                            $scope.redirectFunction(response, response.data.statusKey);
                        } else {
                            var option = {
                                id: "dialogInfo",
                                title: "Data Not Found",
                                lableClose: "CLOSE",
                                content: response.message,
                                width: 500
                            };
                            utils.dialog.showDialog(option, function () {
                                $state.go(constants.state.raList);
                            });
                        }
                    }, function (err) {
                        $rootScope.isLoading = false;
                        utils.error.showErrorGet(err);
                    });
                    break;
                case constants.state.raEdit:
                    $rootScope.$app.title = constants.titlePage.raUpdate;
                    $scope.getRADetailData(constants.RA.statusKey.raDraft);
                    break;
                case constants.state.raUpdateRequired:
                    $rootScope.$app.title = constants.titlePage.raUpdateRequired;
                    $scope.getRADetailData(constants.RA.statusKey.raUpdateRequired);
                    break;
                case constants.state.raReview:
                    $rootScope.$app.title = constants.titlePage.raReview;
                    $scope.getRADetailForWorkflow();
                    break;
                case constants.state.raEndorse:
                    $rootScope.$app.title = constants.titlePage.raEndorse;
                    $scope.getRADetailForWorkflow();
                    break;
                case constants.state.raApprove:
                    $rootScope.$app.title = constants.titlePage.raApprove;
                    $scope.getRADetailForWorkflow();
                    break;
                case constants.state.raInfo:
                    $rootScope.$app.title = constants.titlePage.raInfo;
                    $scope.getRADetailForWorkflow();
                    break;
                case constants.state.raMOC:
                    $rootScope.$app.title = constants.titlePage.raMOC;
                    $scope.getRADetailForWorkflow();
                    break;
                case constants.state.raPrint:
                    {
                        $rootScope.isLoading = true;
                        raServices.getRABasic($stateParams.raId).then(function (response) {
                            $scope.getRADetailForWorkflow();
                        },
                        function (err) {
                            $rootScope.isLoading = false;
                            utils.error.showErrorGet(err);
                        });
                        break;
                    }
            }
        };

        onLoad($state.current.name);
        // Discard button click event
        $scope.goToListPage = function (event) {
            event.preventDefault();
            $state.go(constants.state.raList);
        };
        // Open/Close Custom Dropdown (Vertical Dot)
        $(".dropdown_toggle").click(function (e) {
            $(this).parent().toggleClass("dd_open");
            e.stopPropagation();
        });

        // Close dropdown on click outside div
        $(document).on("click", function (e) {
            if ($(e.target).is(".dropdown_menu") === false) {
                $(".dd_block").removeClass("dd_open");
            }
        });

    }
]);