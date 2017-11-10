app.controller('asmWorkflowController',
    ['$rootScope', '$window', '$state', '$stateParams', '$scope', '$location', 'authService', 'appSettings', 'constants', 'asmWorkflowServices', 'asmServices', 'asmNewServices', 'serviceHelper',
        function ($rootScope, $window, $state, $stateParams, $scope, $location, authService, appSettings, constants, asmWorkflowServices, asmServices, asmNewServices, serviceHelper) {
            //user Profile
            $scope.alarmId = $stateParams.alarmId;
            $scope.isPic = false;
            $scope.userProfile = $rootScope.$app.userProfile;
            $scope.model = null;
            $scope.panelOperatorRole = "";

            var isProcessTriggerClick = true;
            $scope.alarmModel = {
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
                isSubmitAction: null
            };
            // check visibility button
            $scope.visibleButton = {
                adminCancelAsm: false,
                //review
                rejectReview: false,
                review: false,
                applicantCancelAsm: false,
                //endorse 
                rejectEndorse: false,
                endorse: false,
                //approve
                rejectApprove: false,
                approve: false,
                //require update by review
                rejectByReviewer: false,
                submitForEndorser: false,
                // require update by applicant
                updateRequireUpdateApplicant: false,
                submitForReview: false,
                //shelving alarm
                shelve: false,
                //request moc
                requestMoc: false,
                close: false,
                //update moc
                updateMoc: false,
                cancelMoc: false,
                //approve moc
                rejectMoc: false,
                approveMoc: false,
                hideCancelShelving: false,
                adminCancelMoc: false,
                applicantCancelMoc: false
            }

            // check userRole, set false is default
            $scope.checkUserRole = {
                asmApplicant: false,
                asmReviewer: false,
                asmEndorser: false,
                asmApprover: false,
                asmShelver: false,
                asmMocApprover: false,
                asmAdmin: false
            };
            // variable to check isApplicant
            $scope.checkIsApplicant = false;
            $scope.checkIsReviewer = false;
            $scope.checkIsEndorser = false;
            $scope.checkIsApprover = false;
            $scope.checkIsShelver = false;
            $scope.checkIsMocApprover = false;
            // check statusTitle
            $scope.checkStatusTitle = {
                PendingReview: false,
                PendingEndorse: false,
                PendingApproval: false,
                RequiresUpdate: false,
                PendingShelving: false,
                Live: false,
                PendingMoc: false,
                PendingMocApproval: false,
                MOCRequireUpdate: false,
                ASMMoc: false,
                ASMCLose: false,
                Draft: false
            }
            $scope.checkStatus = {
                Applicant: false,
                Review: false,
                Endorsement: false,
                Approval: false,
                Shelving: false,
                Live: false,
                MOC: false,
                MOCApproval: false,
            }
            // show section, set false is default
            $scope.showSection = {
                Application: false,
                Review: false,
                Endorsement: false,
                Approval: false,
                Live: false,
                MocApplication: false,
                MocApproval: false,
                MocApplicationUpdate: false,
                Close: false
            };
            $scope.status = "";
            $scope.statusTitle = "";
            // check userRole
            $scope.checkUserRole.asmApplicant = checkUserHasRoleKey($scope.userProfile.rolesKeyString, constants.role.roleKeys.asmApplicant);
            $scope.checkUserRole.asmReviewer = checkUserHasRoleKey($scope.userProfile.rolesKeyString, constants.role.roleKeys.asmReviewer);
            $scope.checkUserRole.asmEndorser = checkUserHasRoleKey($scope.userProfile.rolesKeyString, constants.role.roleKeys.asmEndorser);
            $scope.checkUserRole.asmApprover = checkUserHasRoleKey($scope.userProfile.rolesKeyString, constants.role.roleKeys.asmApprover);
            $scope.checkUserRole.asmShelver = checkUserHasRoleKey($scope.userProfile.rolesKeyString, constants.role.roleKeys.asmShelver);
            $scope.checkUserRole.asmMocApprover = checkUserHasRoleKey($scope.userProfile.rolesKeyString, constants.role.roleKeys.asmMocApprover);
            $scope.checkUserRole.asmAdmin = checkUserHasRoleKey($scope.userProfile.rolesKeyString, constants.role.roleKeys.asmAdmin);
            // end check

            // function check action bar(doing)

            var onLoad = function () {
                $rootScope.bigModuleTitle = "Alarm Shelving Application (ASM)";
            };

            onLoad();

            //get detail of asm
            var getAsmDetail = function () {
                $rootScope.isLoading = true;
                asmWorkflowServices.getAsmDetail($stateParams.alarmId).then(function (response) {
                    $rootScope.isLoading = false;
                    if (response.data !== null && response.data !== undefined) {
                        $scope.model = response.data;

                        if ($scope.model.asmDetail != null) {
                            var checkUserProfile = function (id) {
                                try {
                                    if ($scope.userProfile.userProfileId === id) {
                                        return true;
                                    } else return false;
                                } catch (err) {
                                    return false;
                                }
                            };

                            // add reviewModel attribute
                            $scope.reviewModel.occurence = $scope.model.asmDetail.occurence;
                            $scope.reviewModel.sapNo = $scope.model.asmDetail.sapNo;
                            $scope.reviewModel.faultCondition = $scope.model.asmDetail.faultCondition;
                            $scope.reviewModel.consequences = $scope.model.asmDetail.consequences;
                            $scope.reviewModel.endorser = $scope.model.endorser;
                            $scope.reviewModel.approver = $scope.model.approver;

                            // check role admin to show bar action

                            // check is people in charge

                            if ($scope.model.applicant != null) {
                                $scope.checkIsApplicant =
                                    $scope.userProfile.userProfileId === $scope.model.applicant.userProfileId
                                    ? true
                                    : false;
                            } else {
                                $scope.checkIsApplicant = false;
                            }
                            if ($scope.model.reviewer != null) {
                                $scope.checkIsReviewer =
                                    $scope.userProfile.userProfileId === $scope.model.reviewer.userProfileId
                                    ? true
                                    : false;
                            } else {
                                $scope.checkIsReviewer = false;
                            }
                            if ($scope.model.endorser != null) {
                                $scope.checkIsEndorser =
                                    $scope.userProfile.userProfileId === $scope.model.endorser.userProfileId
                                    ? true
                                    : false;
                            } else {
                                $scope.checkIsEndorser = false;
                            }
                            if ($scope.model.approver != null) {
                                $scope.checkIsApprover =
                                    $scope.userProfile.userProfileId === $scope.model.approver.userProfileId
                                    ? true
                                    : false;
                            } else {
                                $scope.checkIsApprover = false;
                            }
                            if ($scope.model.mocApprover != null) {
                                $scope.checkIsMocApprover =
                                    $scope.userProfile.userProfileId === $scope.model.mocApprover.userProfileId
                                    ? true
                                    : false;
                            } else {
                                $scope.checkIsMocApprover = false;
                            }

                            // check status key
                            switch (response.data.asmDetail.statusKey) {
                                case constants.ASM.statusKey.requiresUpdate:
                                    {
                                        $rootScope.$app.title = "ASM Requires Update ";
                                        $scope.status = "Application";
                                        $scope.statusTitle = "Requires Update";
                                        $scope.checkStatusTitle.RequiresUpdate = true;
                                        angular.merge($scope.showSection,
                                            {
                                                Application: true
                                            });
                                        // require update by applicant
                                        $scope.isPic = ($scope.checkIsApplicant && $scope.checkUserRole.asmApplicant);
                                        $scope.panelOperatorRole = "Applicant";
                                        angular.merge($scope.visibleButton,
                                            {
                                                updateRequireUpdateApplicant: $scope.checkIsApplicant &&
                                                    $scope.checkUserRole.asmApplicant,
                                                submitForReview: $scope.checkIsApplicant && $scope.checkUserRole.asmApplicant,
                                                applicantCancelAsm: ($scope.checkIsApplicant &&
                                                    $scope.checkUserRole.asmApplicant),
                                                adminCancelAsm: $scope.checkUserRole.asmAdmin
                                            });
                                        if ($scope.checkIsApplicant && $scope.checkUserRole.asmApplicant) {
                                            //bind data to asm_form
                                            bindAsmDetail(response);
                                        } else {
                                            break;
                                        }
                                        break;
                                    }
                                case constants.ASM.statusKey.pendingReview:
                                    {
                                        $scope.status = "Review";
                                        if ($scope.model.asmDetail.isRequiredUpdate === true) {
                                            $scope.checkStatusTitle.RequiresUpdate = true;
                                            $scope.statusTitle = "Requires Update";
                                            $rootScope.$app.title = "ASM Requires Update";
                                            angular.merge($scope.showSection,
                                                {
                                                    Application: true,
                                                    Review: true
                                                });
                                        } else {
                                            $scope.checkStatusTitle.PendingReview = true;
                                            $scope.statusTitle = "Pending Review";
                                            $rootScope.$app.title = "ASM Pending Review";
                                            angular.merge($scope.showSection,
                                                {
                                                    Application: true
                                                });
                                        }
                                        $scope.isPic = ($scope.checkIsReviewer && $scope.checkUserRole.asmReviewer) ||
                                            ($scope.checkIsApplicant && $scope.checkUserRole.asmApplicant);
                                        $scope.panelOperatorRole =
                                            ($scope.checkIsApplicant && $scope.checkUserRole.asmApplicant)
                                            ? "Applicant"
                                            : "Reviewer";
                                        angular.merge($scope.visibleButton,
                                            {
                                                applicantCancelAsm: ($scope.checkIsApplicant &&
                                                    $scope.checkUserRole.asmApplicant),
                                                rejectByReviewer: $scope.checkStatusTitle.RequiresUpdate &&
                                                    ($scope.checkIsReviewer && $scope.checkUserRole.asmReviewer),
                                                submitForEndorser: $scope.checkStatusTitle.RequiresUpdate &&
                                                    ($scope.checkIsReviewer && $scope.checkUserRole.asmReviewer),
                                                rejectReview: $scope.checkStatusTitle.PendingReview &&
                                                    ($scope.checkIsReviewer && $scope.checkUserRole.asmReviewer),
                                                review: $scope.checkStatusTitle.PendingReview &&
                                                    ($scope.checkIsReviewer && $scope.checkUserRole.asmReviewer),
                                                adminCancelAsm: $scope.checkUserRole.asmAdmin
                                            });
                                        break;
                                    }
                                case constants.ASM.statusKey.pendingEndorse:
                                    {
                                        $rootScope.$app.title = "ASM Pending Endorsement ";
                                        $scope.status = "Endorsement";
                                        $scope.statusTitle = "Pending Endorse";
                                        $scope.checkStatusTitle.PendingEndorse = true;
                                        angular.merge($scope.showSection,
                                            {
                                                Application: true,
                                                Review: true
                                            });
                                        $scope.isPic = ($scope.checkIsApplicant && $scope.checkUserRole.asmApplicant) ||
                                            ($scope.checkIsEndorser && $scope.checkUserRole.asmEndorser);
                                        $scope.panelOperatorRole =
                                            ($scope.checkIsApplicant && $scope.checkUserRole.asmApplicant)
                                            ? "Applicant"
                                            : "Endorser";
                                        angular.merge($scope.visibleButton,
                                            {
                                                applicantCancelAsm: ($scope.checkIsApplicant &&
                                                    $scope.checkUserRole.asmApplicant),
                                                endorse: $scope.checkIsEndorser && $scope.checkUserRole.asmEndorser,
                                                rejectEndorse: $scope.checkIsEndorser && $scope.checkUserRole.asmEndorser,
                                                adminCancelAsm: $scope.checkUserRole.asmAdmin
                                            });
                                        break;
                                    }
                                case constants.ASM.statusKey.pendingApproval:
                                    {
                                        $rootScope.$app.title = "ASM Pending Approval ";
                                        $scope.status = "Approval";
                                        $scope.statusTitle = "Pending Approval";
                                        $scope.checkStatusTitle.PendingApproval = true;
                                        angular.merge($scope.showSection,
                                            {
                                                Application: true,
                                                Review: true,
                                                Endorsement: true
                                            });
                                        $scope.isPic = ($scope.checkIsApplicant && $scope.checkUserRole.asmApplicant) ||
                                            ($scope.checkIsApprover && $scope.checkUserRole.asmApprover);
                                        $scope.panelOperatorRole =
                                            ($scope.checkIsApplicant && $scope.checkUserRole.asmApplicant)
                                            ? "Applicant"
                                            : "Approver";
                                        angular.merge($scope.visibleButton,
                                            {
                                                applicantCancelAsm: ($scope.checkIsApplicant &&
                                                    $scope.checkUserRole.asmApplicant),
                                                approve: $scope.checkIsApprover && $scope.checkUserRole.asmApprover,
                                                rejectApprove: $scope.checkIsApprover && $scope.checkUserRole.asmApprover,
                                                adminCancelAsm: $scope.checkUserRole.asmAdmin
                                            });
                                        break;
                                    }
                                case constants.ASM.statusKey.pendingShelving:
                                    {
                                        $rootScope.$app.title = "ASM Pending Shelving ";
                                        $scope.status = "Shelving";
                                        $scope.statusTitle = "Pending Shelving";
                                        $scope.checkStatusTitle.PendingShelving = true;
                                        $scope.visibleButton.hideCancelShelving = true;
                                        angular.merge($scope.showSection,
                                            {
                                                Application: true,
                                                Review: true,
                                                Endorsement: true,
                                                Approval: true
                                            });
                                        // check whether user is Shelver or Applicant       
                                        $scope.isPic = ($scope.model.isShelver && $scope.checkUserRole.asmShelver) ||
                                            ($scope.checkIsApplicant && $scope.checkUserRole.asmApplicant);
                                        $scope.panelOperatorRole =
                                            ($scope.checkIsApplicant && $scope.checkUserRole.asmApplicant)
                                            ? "Applicant"
                                            : "Shelver";
                                        angular.merge($scope.visibleButton,
                                            {
                                                shelve: $scope.model.isShelver ||
                                                ($scope.userProfile.userProfileId ==
                                                    $scope.model.asmDetail.applicantProfileId),
                                                close: $scope.checkIsApplicant && $scope.checkUserRole.asmApplicant
                                            });
                                        break;
                                    }

                                    //case constants.ASM.statusKey.pendingReShelving:
                                    //    {
                                    //        $rootScope.$app.title = "Pending Re-Shelving ";
                                    //        $scope.status = "Pending Re-Shelving";
                                    //        angular.merge($scope.checkStatus, {
                                    //            PendingReShelving: true
                                    //        });
                                    //        $scope.statusTitle = "Pending Re-Shelving";
                                    //        $scope.checkStatusTitle.PendingReShelving = true;
                                    //        $scope.visibleButton.hideCancelShelving = true;
                                    //        angular.merge($scope.showSection, {
                                    //            Application: true,
                                    //            Review: true,
                                    //            Endorsement: true,
                                    //            Approval: true,
                                    //            Shelving: true,
                                    //            Live: true
                                    //        });
                                    //        if ($scope.userProfile.userProfileId == $scope.model.applicant.userProfileId) {
                                    //            $scope.checkIsApplicant = true;
                                    //        }
                                    //        if ($scope.userProfile.userProfileId == $scope.model.reviewer.userProfileId) {
                                    //            $scope.checkIsReviewer = true;
                                    //        }
                                    //        if ($scope.userProfile.userProfileId == $scope.model.endorser.userProfileId) {
                                    //            $scope.checkIsEndorser = true;
                                    //        }
                                    //        if ($scope.userProfile.userProfileId == $scope.model.approver.userProfileId) {
                                    //            $scope.checkIsApprover = true;
                                    //        }
                                    //        if ($scope.model.isShelver) {
                                    //            $scope.checkIsShelver = true;
                                    //        }
                                    //        // check whether user is Shelver or Applicant                                 
                                    //        $scope.isPic = $scope.model.isShelver || ($scope.checkIsApplicant && $scope.checkUserRole.asmApplicant);
                                    //        break;
                                    //    }

                                case constants.ASM.statusKey.live:
                                    {
                                        $rootScope.$app.title = "ASM Live ";
                                        $scope.status =
                                            (response.data.asmDetail.isPendingReShelving == false &&
                                                response.data.asmDetail.isPendingReApproval == false)
                                            ? "NoReShelvingOrReApproval"
                                            : "Live";
                                        $scope.statusTitle = "Live";
                                        $scope.checkStatusTitle.Live = true;
                                        $scope.visibleButton.hideCancelShelving = true;
                                        angular.merge($scope.showSection,
                                            {
                                                Application: true,
                                                Review: true,
                                                Endorsement: true,
                                                Approval: true,
                                                Live: true
                                            });
                                        $scope.isPic = $scope.checkIsApplicant && $scope.checkUserRole.asmApplicant;
                                        $scope.panelOperatorRole = "Applicant";
                                        angular.merge($scope.visibleButton,
                                            {
                                                close: $scope.checkIsApplicant && $scope.checkUserRole.asmApplicant
                                            });
                                        break;
                                    }
                                case constants.ASM.statusKey.pendingMoc:
                                    {
                                        $rootScope.$app.title = "ASM Pending MOC ";
                                        $scope.status = "MOC";
                                        $scope.statusTitle = "Pending MOC";
                                        $scope.checkStatusTitle.PendingMoc = true;
                                        $scope.visibleButton.hideCancelShelving = true;
                                        angular.merge($scope.showSection,
                                            {
                                                Application: true,
                                                Review: true,
                                                Endorsement: true,
                                                Approval: true,
                                                Live: true
                                            });
                                        $scope.isPic = $scope.checkIsApplicant && $scope.checkUserRole.asmApplicant;
                                        $scope.panelOperatorRole = "Applicant";
                                        angular.merge($scope.visibleButton,
                                            {
                                                close: $scope.checkIsApplicant && $scope.checkUserRole.asmApplicant,
                                                requestMoc: $scope.checkIsApplicant && $scope.checkUserRole.asmApplicant,

                                            });
                                        break;
                                    }
                                case constants.ASM.statusKey.pendingMocApproval:
                                    {
                                        $rootScope.$app.title = "ASM Pending MOC Approval ";
                                        $scope.status = "MOC Approval";
                                        $scope.statusTitle = "Pending MOC Approval";
                                        $scope.checkStatusTitle.PendingMocApproval = true;
                                        $scope.visibleButton.hideCancelShelving = true;
                                        angular.merge($scope.showSection,
                                            {
                                                Application: true,
                                                Review: true,
                                                Endorsement: true,
                                                Approval: true,
                                                Live: true,
                                                MocApplication: true
                                            });
                                        $scope.isPic = ($scope.checkIsMocApprover && $scope.checkUserRole.asmMocApprover) ||
                                            ($scope.checkIsApplicant && $scope.checkUserRole.asmApplicant);
                                        $scope.panelOperatorRole =
                                            ($scope.checkIsApplicant && $scope.checkUserRole.asmApplicant)
                                            ? "Applicant"
                                            : "MocApprover";
                                        angular.merge($scope.visibleButton,
                                            {
                                                rejectMoc: $scope.checkIsMocApprover && $scope.checkUserRole.asmMocApprover,
                                                approveMoc: $scope.checkIsMocApprover && $scope.checkUserRole.asmMocApprover,
                                                adminCancelMoc: $scope.checkUserRole.asmAdmin,
                                                applicantCancelMoc: ($scope.checkIsApplicant &&
                                                    $scope.checkUserRole.asmApplicant)
                                            });
                                        break;
                                    }
                                case constants.ASM.statusKey.requireMocUpdate:
                                    {
                                        $scope.status = "MOC";
                                        $rootScope.$app.title = "MOC Requires Update ";
                                        $scope.statusTitle = "MOC Requires Update";
                                        $scope.checkStatusTitle.MOCRequireUpdate = true;
                                        $scope.visibleButton.hideCancelShelving = true;
                                        angular.merge($scope.showSection,
                                            {
                                                Application: true,
                                                Review: true,
                                                Endorsement: true,
                                                Approval: true,
                                                Live: true,
                                                MocApplicationUpdate: true
                                            });
                                        $scope.isPic = $scope.checkIsApplicant && $scope.checkUserRole.asmApplicant;
                                        $scope.panelOperatorRole = "Applicant";
                                        angular.merge($scope.visibleButton,
                                            {
                                                updateMoc: $scope.checkIsApplicant && $scope.checkUserRole.asmApplicant,
                                                adminCancelMoc: $scope.checkUserRole.asmAdmin,
                                                applicantCancelMoc: ($scope.checkIsApplicant &&
                                                    $scope.checkUserRole.asmApplicant)
                                            });
                                        break;
                                    }
                                case constants.ASM.statusKey.moc:
                                    {
                                        $rootScope.$app.title = "ASM MOC";
                                        $scope.status = "finish";
                                        $scope.statusTitle = "ASM MOC";
                                        $scope.checkStatusTitle.ASMMoc = true;
                                        $scope.visibleButton.hideCancelShelving = true;
                                        angular.merge($scope.showSection,
                                            {
                                                Application: true,
                                                Review: true,
                                                Endorsement: true,
                                                Approval: true,
                                                Live: true,
                                                MocApplication: true,
                                                MocApproval: true
                                            });
                                        $scope.isPic = $scope.checkIsApplicant && $scope.checkUserRole.asmApplicant;
                                        $scope.panelOperatorRole = "Applicant";
                                        angular.merge($scope.visibleButton,
                                            {
                                                close: $scope.checkIsApplicant && $scope.checkUserRole.asmApplicant,
                                            });
                                        break;
                                    }
                                case constants.ASM.statusKey.closed:
                                    {
                                        $rootScope.$app.title = "Closed";
                                        if (response.data.mocApprover == null && response.data.shelver == null) {
                                            $scope.status = "ApprovalClose";
                                            $scope.statusTitle = "Closed";
                                            $scope.checkStatusTitle.Closed = true;
                                            $scope.visibleButton.hideCancelShelving = true;
                                            $scope.isPic = false;
                                            angular.merge($scope.showSection,
                                                {
                                                    Application: true,
                                                    Review: true,
                                                    Endorsement: true,
                                                    Approval: true,
                                                    Close: true
                                                });
                                        }
                                        else if (response.data.mocApprover == null && response.data.shelver != null) {
                                            $scope.status = "NoReShelvingOrReApproval";
                                            $scope.statusTitle = "Closed";
                                            $scope.checkStatusTitle.Closed = true;
                                            $scope.visibleButton.hideCancelShelving = true;
                                            $scope.isPic = false;
                                            angular.merge($scope.showSection,
                                                {
                                                    Application: true,
                                                    Review: true,
                                                    Endorsement: true,
                                                    Approval: true,
                                                    Live: true,
                                                    Close: true
                                                });
                                        }
                                            //else if (response.data.mocApprover.userName != null &&
                                            //    response.data.asmDetail.mocApproveDate == null) {
                                            //    $scope.status = "NoReShelvingOrReApproval";
                                            //    $scope.statusTitle = "Closed";
                                            //    $scope.checkStatusTitle.Closed = true;
                                            //    $scope.visibleButton.hideCancelShelving = true;
                                            //    $scope.isPic = false;
                                            //    angular.merge($scope.showSection,
                                            //        {
                                            //            Application: true,
                                            //            Review: true,
                                            //            Endorsement: true,
                                            //            Approval: true,
                                            //            Live: true,
                                            //            MocApplication: true
                                            //        });
                                            //}
                                        else {
                                            $scope.status = "finish";
                                            $scope.statusTitle = "Closed";
                                            $scope.checkStatusTitle.Closed = true;
                                            $scope.visibleButton.hideCancelShelving = true;
                                            $scope.isPic = false;
                                            angular.merge($scope.showSection,
                                                {
                                                    Application: true,
                                                    Review: true,
                                                    Endorsement: true,
                                                    Approval: true,
                                                    Live: true,
                                                    MocApplication: true,
                                                    MocApproval: true,
                                                    Close: true
                                                });
                                        }

                                        break;
                                    }
                                default:
                                    break;
                            }
                        } else {
                            var option = {
                                id: "dialogInfo",
                                title: "This Alarm is canceled.",
                                lableClose: "Back to list",
                                content: response.message,
                                width: 500
                            };
                            utils.dialog.showDialog(option, function () {
                                $state.go(constants.state.asmlist);
                            });
                        }

                    } else {
                        var option = {
                            id: "dialogInfo",
                            title: "Data Not Found",
                            lableClose: "Back to list",
                            content: response.message,
                            width: 500
                        };
                        utils.dialog.showDialog(option, function () {
                            $state.go(constants.state.asmlist);
                        });
                    }
                }, function (err) {
                    $rootScope.isLoading = false;
                    utils.error.showErrorGet(err);
                });

            }

            getAsmDetail();

            //#region Bind endorser
            $scope.endorseDatasource = {
                serverFiltering: true,
                transport: {
                    read: function (options) {
                        asmWorkflowServices.getEndorsers($scope.endorserSearchText).then(function (response) {
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
                //optionLabel: "Select Endorser",
                dataSource: $scope.endorseDatasource,
                dataTextField: "userName",
                dataValueField: "userProfileId",
                valueTemplate: function (dataItem) {
                    if (!dataItem.hasOwnProperty('image')) {
                        if ($scope.reviewModel.endorser == "") {
                            dataItem.image = '';
                        } else {
                            dataItem.image = $scope.reviewModel.endorser.image;
                        }
                    }
                    return '<span class="selected-value" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span><span>{{dataItem.userName}}</span>';
                },
                template: '<div class="custom-dropdown"><span class="k-state-default" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span>' +
                '<span class="k-state-default"><h3>{{dataItem.userName}}</h3></span></div>'
            };
            //#endregion

            //#region Bind approver
            $scope.approverDatasource = {
                serverFiltering: true,
                transport: {
                    read: function (options) {
                        asmWorkflowServices.getApprovers($scope.approverSearchText).then(function (response) {
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
            $scope.copyAlarm = function () {
                $state.go(constants.state.asmCopy, { alarmId: $stateParams.alarmId });
            }

            $scope.asmPrint = function () {
                window.open('/print/asm/' + $stateParams.alarmId, '_blank');
            };


            $scope.statusLog = function () {
                $state.go(constants.state.asmStatusLog, { alarmId: $stateParams.alarmId });
            }

            $scope.approverSearchText = "";

            $scope.approverOptions = {
                autoBind: false,
                height: 300,
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
                            dataItem.image = '';
                        }
                    }
                    return '<span class="selected-value" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span><span>{{dataItem.userName}}</span>';
                },
                template: '<div class="custom-dropdown"><span class="k-state-default" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span>' +
                '<span class="k-state-default"><h3>{{dataItem.userName}}</h3></span></div>'
            };
            //#endregion

            //#region Review form

            $scope.reviewModel = {
                comment: "",
                occurence: "",
                sapNo: "",
                faultCondition: "",
                consequences: "",
                endorser: "",
                approver: "",
                action: "",
                isRequiredUpdate: ""
            };


            $scope.review = function () {
                // show loading
                $rootScope.isLoading = true;

                try {
                    if ($scope.userProfile.userProfileId == $scope.model.reviewer.userProfileId) {
                        $scope.reviewModel.isRequiredUpdate = $scope.model.asmDetail.isRequiredUpdate;
                        if ($scope.reviewModel.action == 'reject') {
                            $scope.reviewModel.consequences = "";
                            $scope.reviewModel.occurence = "";
                            $scope.reviewModel.sapNo = "";
                            $scope.reviewModel.faultCondition = "";
                            $scope.reviewModel.consequences = "";
                            $scope.reviewModel.endorser = null;
                            $scope.reviewModel.approver = null;
                        } else {
                            $scope.reviewModel.endorser = $scope.reviewModel.endorser.userProfileId;
                            $scope.reviewModel.approver = $scope.reviewModel.approver.userProfileId;
                        }

                        asmWorkflowServices.reviewAsm($stateParams.alarmId, $scope.reviewModel).then(function (response) {
                            $rootScope.isLoading = false;
                            if (response.data !== null || response.data !== undefined) {
                                switch ($scope.reviewModel.action) {
                                    case 'approve':
                                        $scope.dialogOption.title = "Shelving Reviewed";
                                        $scope.dialogOption.content = "This Shelving is reviewed and <strong>pending endorsement</strong>";
                                        utils.dialog.showDialog($scope.dialogOption, function () {
                                            $state.go(constants.state.asmlist);
                                        });
                                        break;
                                    case 'reject':
                                        $scope.dialogOption.title = "Shelving Rejected";
                                        $scope.dialogOption.content = "This Shelving is not reviewed and <strong>requires update</strong> from the applicant";
                                        utils.dialog.showDialog($scope.dialogOption, function () {
                                            $state.go(constants.state.asmlist);
                                        });
                                        break;
                                    case 'update':
                                        $scope.dialogOption.title = "Shelving Review Updated";
                                        $scope.dialogOption.content = "This Shelving Review is saved";
                                        utils.dialog.showDialog($scope.dialogOption, function () {
                                            $state.go(constants.state.asmlist);
                                        });
                                        break;
                                }
                            } else {
                                //TODO
                            }
                        }, function (error) {
                            $rootScope.isLoading = false;
                            switch ($scope.reviewModel.action) {
                                case 'approve':
                                    $scope.dialogOption.title = "Shelving Review Failed";
                                    $scope.dialogOption.content = error.message;
                                    utils.dialog.showDialog($scope.dialogOption);
                                    break;
                                case 'reject':
                                    $scope.dialogOption.title = "Shelving Not Reviewed";
                                    $scope.dialogOption.content = error.message;
                                    utils.dialog.showDialog($scope.dialogOption);
                                    break;
                                case 'update':
                                    $scope.dialogOption.title = "Shelving Save Failed";
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

            $scope.reviewActions = [
                {
                    text: 'CANCEL'
                },
                {
                    text: "APPROVE",
                    action: function () {
                        $scope.reviewModel.comment = $scope.approveComment;
                        $scope.reviewModel.action = 'approve';
                        if ($scope.validators.approveReview.validate()) {
                            $scope.review();
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
                    text: 'UPDATE',
                    action: function () {
                        $scope.reviewModel.action = 'update';
                        if ($scope.validators.updateRequireReview.validate()) {
                            $scope.review();
                            return true;
                        }
                        // Returning false will prevent the closing of the dialog
                        return false;
                    },
                    primary: true
                }
            ];

            $scope.rejectReviewActions = [
                {
                    text: 'CANCEL'
                },
                {
                    text: 'REJECT',
                    action: function () {
                        $scope.reviewModel.comment = $scope.rejectComment;
                        $scope.reviewModel.action = 'reject';
                        if ($scope.validators.rejectReview.validate()) {
                            $scope.review();
                            return true;
                        }
                        // Returning false will prevent the closing of the dialog
                        return false;
                    },
                    primary: true
                }
            ];

            $scope.submitForEndorsementActions = [
                {
                    text: 'CANCEL'
                },
                {
                    text: 'SUBMIT',
                    action: function () {
                        $scope.reviewModel.action = 'approve';
                        if ($scope.validators.submitUpdateRevew.validate()) {
                            $scope.review();
                            return true;
                        }
                        // Returning false will prevent the closing of the dialog
                        return false;
                    },
                    primary: true
                }];
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
                    if ($scope.userProfile.userProfileId == $scope.model.endorser.userProfileId) {
                        asmWorkflowServices.endorseAsm($stateParams.alarmId, $scope.endorseModel).then(function (response) {
                            $rootScope.isLoading = false;
                            switch ($scope.endorseModel.action) {
                                case 'approve':
                                    $scope.dialogOption.title = "Shelving Endorsed";
                                    $scope.dialogOption.content = "This Shelving is endorsed and <strong>pending approval</strong>";
                                    utils.dialog.showDialog($scope.dialogOption, function () {
                                        $state.go(constants.state.asmlist);
                                    });
                                    break;
                                case 'reject':
                                    $scope.dialogOption.title = "Shelving Rejected";
                                    $scope.dialogOption.content = "This Shelving is not endorsed and <strong>requires update</strong> from the reviewer";
                                    utils.dialog.showDialog($scope.dialogOption, function () {
                                        $state.go(constants.state.asmlist);
                                    });
                                    break;
                            }
                        }, function (error) {
                            $rootScope.isLoading = false;
                            switch ($scope.endorseModel.action) {
                                case 'approve':
                                    $scope.dialogOption.title = "Shelving Endorsed";
                                    $scope.dialogOption.content = error.message;
                                    utils.dialog.showDialog($scope.dialogOption);
                                    break;
                                case 'reject':
                                    $scope.dialogOption.title = "Shelving Not Endorsed";
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

            //#endregion

            //#region Approve form

            $scope.approveModel = {
                comment: "",
                precautionsByApprover: "",
                action: "",
                isReApprove: false
            };
            $scope.approveComment = "";
            $scope.approve = function () {
                // show loading
                $rootScope.isLoading = true;

                try {
                    if ($scope.userProfile.userProfileId == $scope.model.approver.userProfileId) {
                        asmWorkflowServices.approveAsm($stateParams.alarmId, $scope.approveModel).then(function (response) {
                            $rootScope.isLoading = false;
                            switch ($scope.approveModel.action) {
                                case 'approve':
                                    $scope.dialogOption.title = "Shelving Approved";
                                    $scope.dialogOption.content = "This Shelving is approved and <strong>pending shelving</strong>.";
                                    utils.dialog.showDialog($scope.dialogOption, function () {
                                        $state.go(constants.state.asmlist);
                                    });
                                    break;
                                case 'reject':
                                    $scope.dialogOption.title = "Shelving Rejected";
                                    $scope.dialogOption.content = "This Shelving is not approved and <strong>requires update</strong> from the reviewer";
                                    utils.dialog.showDialog($scope.dialogOption, function () {
                                        $state.go(constants.state.asmlist);
                                    });
                                    break;
                            }
                        }, function (error) {
                            $rootScope.isLoading = false;
                            switch ($scope.approveModel.action) {
                                case 'approve':
                                    $scope.dialogOption.title = "Shelving Approve Failed";
                                    $scope.dialogOption.content = error.message;
                                    utils.dialog.showDialog($scope.dialogOption);
                                    break;
                                case 'reject':
                                    $scope.dialogOption.title = "Shelving Reject Failed";
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

            //#region Transfer Roles
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
                        asmWorkflowServices.getApplicantsForTransferInSameAreas($stateParams.alarmId, $scope.applicantSearchText2).then(function (response) {
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
                $scope.applicantToTransfer = $scope.model.applicant;
                $scope.reviewerToTransfer = $scope.model.reviewer;
                $scope.endorserToTransfer = $scope.model.endorser;
                $scope.approverToTransfer = $scope.model.approver;
                $("#asmTransferRoles").data("kendoDialog").open();
            };

            $scope.transferResultActions = [{
                text: 'CLOSE',
                action: function () {
                    $state.go(constants.state.asmlist);
                }
            }];

            $scope.transferRolesModel = {
            };

            $scope.adminComment = "";

            $scope.asmTransferRoles = [
                {
                    text: 'CANCEL'
                },
                {
                    text: 'CONFIRM',
                    action: function () {
                        if ($scope.validators.asmTransfer.validate()) {
                            $rootScope.isLoading = true;
                            $scope.transferRolesModel = {
                                applicantProfileId: ($scope.applicantToTransfer.userProfileId === null || $scope.applicantToTransfer.userProfileId === undefined || $scope.applicantToTransfer.userProfileId === "" || $scope.applicantToTransfer.userProfileId === undefined) ? null : $scope.applicantToTransfer.userProfileId,
                                reviewerProfileId: ($scope.pendingReview && $scope.reviewerToTransfer.userProfileId !== $scope.model.reviewer.userProfileId && $scope.reviewerToTransfer.userProfileId !== "") ? $scope.reviewerToTransfer.userProfileId : null,
                                endorserProfileId: ($scope.pendingEndorse && $scope.endorserToTransfer.userProfileId !== $scope.model.endorser.userProfileId && $scope.endorserToTransfer.userProfileId !== "") ? $scope.endorserToTransfer.userProfileId : null,
                                approverProfileId: ($scope.pendingApprove && $scope.approverToTransfer.userProfileId !== $scope.model.approver.userProfileId && $scope.approverToTransfer.userProfileId !== "") ? $scope.approverToTransfer.userProfileId : null,
                                comment: $scope.adminComment
                            };
                            if (($scope.transferRolesModel.applicantProfileId === null || $scope.transferRolesModel.applicantProfileId === undefined) && ($scope.transferRolesModel.reviewerProfileId === null || $scope.transferRolesModel.reviewerProfileId === undefined) && ($scope.transferRolesModel.endorserProfileId === null || $scope.transferRolesModel.endorserProfileId === undefined) && ($scope.transferRolesModel.approverProfileId === null || $scope.transferRolesModel.approverProfileId === undefined)) {
                                $rootScope.isLoading = false;
                                return true;
                            }

                            asmWorkflowServices.transferRoles($stateParams.alarmId, $scope.transferRolesModel).then(function (response) {
                                if ($scope.transferRolesModel.applicantProfileId != null && $scope.transferRolesModel.applicantProfileId != $scope.model.applicant.userProfileId) {
                                    $scope.applicantIsTransfered = true;
                                }
                                if ($scope.transferRolesModel.reviewerProfileId != null && $scope.transferRolesModel.reviewerProfileId != $scope.model.reviewer.userProfileId) {
                                    $scope.reviewerIsTransfered = true;
                                }
                                if ($scope.transferRolesModel.endorserProfileId != null && $scope.transferRolesModel.endorserProfileId != $scope.model.endorser.userProfileId) {
                                    $scope.endorserIsTransfered = true;
                                }
                                if ($scope.transferRolesModel.approverProfileId != null && $scope.transferRolesModel.approverProfileId != $scope.model.approver.userProfileId) {
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
                                $scope.dialogOption.title = "ASM Roles transferred failed.";
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

            $scope.transferResultActions = [{
                text: 'CLOSE',
                action: function () {
                    $state.go(constants.state.asmlist);
                }
            }];
            //#endregion

            //#region Transfer ASM
            $scope.transferAsmModel = {
                newApplicantId: "",
                comment: ""
            };

            $scope.transferAsmAction = [{
                text: 'CANCEL'
            },
            {
                text: 'TRANSFER',
                action: function () {
                    // show loading
                    $rootScope.isLoading = true;

                    try {
                        if ($scope.userProfile.userProfileId == $scope.model.applicant.userProfileId) {
                            asmWorkflowServices.transferAsm($stateParams.asmId, $scope.transferAsmModel).then(function (response) {
                                $rootScope.isLoading = false;
                                $scope.dialogOption.title = "ASM Transferred";
                                $scope.dialogOption.content = "This ASM is now transferred to <strong>" + response.data + "</strong>. A notification has been sent to alert the new applicant.";
                                utils.dialog.showDialog($scope.dialogOption, function () {
                                    $state.go(constants.state.asmlist);
                                });
                            }, function (error) {
                                $scope.dialogOption.title = "ASM Transfer Failed";
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
            // Pop up internal kendo
            $scope.confirmDialog = function (title, content) {
                return $("<div></div>").kendoConfirm({
                    title: title,
                    content: content
                }).data("kendoConfirm").open().result;
            };

            $scope.dialogOption = {
                id: "dialogInfo",
                title: "",
                lableClose: "CLOSE",
                content: "",
                width: 300
            };

            //#region Submit MOC
            $scope.submitMOCModel = {
                allowByPassViaMOC: true,
                mocNo: "",
                mocMeetingDate: "",
                mocApprovedBy: ""
            };
            //initializing preData
            $scope.selectedMocApprover = "";
            $scope.mocApproverSearchText = "";

            // get MOC approver
            $scope.mocApproverDataSource = {
                serverFiltering: true,
                transport: {
                    read: function (options) {
                        asmWorkflowServices.getMocApprovers($scope.mocApproverSearchText).then(function (response) {
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
            // submit MOC
            $scope.mocSubmitAction = [
                { text: 'CANCEL' },
                {
                    text: 'SUBMIT',
                    action: function () {

                        if (!isProcessTriggerClick) {
                            return false;
                        }
                        isProcessTriggerClick = false;
                        var isValid = $scope.validators.submitMOC.validate();
                        if (!isValid) {
                            isProcessTriggerClick = true;
                            return false;
                        }

                        $rootScope.isLoading = true;
                        isProcessTriggerClick = true;
                        $scope.submitMOCModel.mocMeetingDate = $.format.toBrowserTimeZone($scope.submitMOCModel.mocMeetingDate, constants.format.date.ddMMMyyyyhhmma);
                        asmWorkflowServices.submitMOC($stateParams.alarmId, $scope.submitMOCModel).then(function (response) {
                            $rootScope.isLoading = false;
                            var option = {
                                id: "dialogInfo",
                                title: "MOC Submitted",
                                lableClose: "CLOSE",
                                content: "This MOC is submitted and pending MOC approval",
                                width: 500
                            };
                            utils.dialog.showDialog(option, function () {
                                $state.go(constants.state.asmlist);
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

            $scope.showSubmitMOCKendoDialog = function () {
                utils.clearValid();
                // $scope.submitMOCKendoDialog.center();
                $scope.submitMOCKendoDialog.open();
                //$scope.changeSwithText();
            };
            //#endregion

            //#region Cancel MOC
            $scope.cancelMOC = function (e) {
                //prevent multi click
                $scope.inProgress = true;
                e.preventDefault();
                e.stopImmediatePropagation();

                try {
                    if ((($scope.checkUserRole.asmApplicant && $scope.userProfile.userProfileId == $scope.model.applicant.userProfileId)) && ($scope.checkStatusTitle.PendingMocApproval || $scope.checkStatusTitle.MOCRequireUpdate)) {

                        $scope.confirmDialog("MOC Cancel", "Are you sure you want to cancel this MOC?").then(function () {
                            // show loading
                            cancelMoc: true;
                            $rootScope.isLoading = true;

                            asmWorkflowServices.cancelMOC($stateParams.alarmId).then(function (response) {
                                $scope.inProgress = false;
                                $rootScope.isLoading = false;

                                $scope.dialogOption.title = "MOC Canceled";
                                $scope.dialogOption.content = "MOC form has been canceled successfully";
                                utils.dialog.showDialog($scope.dialogOption, function () {
                                    $state.go(constants.state.asmlist);
                                });
                            }, function (error) {
                                $scope.inProgress = false;
                                $rootScope.isLoading = false;
                                $scope.dialogOption.title = "MOC Cancel Failed";
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

            //#region Cancel alarm shelving
            $scope.cancelAsm = function (e) {
                //prevent multi click
                $scope.inProgress = true;
                e.preventDefault();
                e.stopImmediatePropagation();

                try {
                    if ((($scope.checkUserRole.asmApplicant && userProfile.userProfileId == model.applicant.userProfileId) || $scope.checkUserRole.asmAdmin) && ((checkStatusTitle.PendingReview || checkStatusTitle.PendingEndorse || checkStatusTitle.PendingApproval || checkStatusTitle.RequiresUpdate || checkStatusTitle.Application))) {
                        $scope.confirmDialog("Alarm Shelving Cancel", "Are you sure you want to cancel this Alarm Shelving?").then(function () {
                            // show loading
                            cancelAsm: true;
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

            //#region Approve MOC Action
            $scope.approveMocModel = {
                remarks: "",
                action: "",
                IsApproved: false
            };
            $scope.mocApproveComment = "";
            $scope.mocApprove = function () {
                // show loading
                $rootScope.isLoading = true;
                try {
                    if ($scope.userProfile.userProfileId == $scope.model.mocApprover.userProfileId) {
                        asmWorkflowServices.approveMoc($stateParams.alarmId, $scope.approveMocModel).then(function (response) {
                            $rootScope.isLoading = false;
                            switch ($scope.approveMocModel.action) {
                                case 'approve':
                                    $scope.dialogOption.title = "MOC Approved";
                                    $scope.dialogOption.content = "This MOC is approved.";
                                    utils.dialog.showDialog($scope.dialogOption, function () {
                                        $state.go(constants.state.asmlist);
                                    });
                                    break;
                                case 'reject':
                                    $scope.dialogOption.title = "MOC Not Approved";
                                    $scope.dialogOption.content = "This MOC is not approved and <strong>requires update</strong> from the applicant";
                                    utils.dialog.showDialog($scope.dialogOption, function () {
                                        $state.go(constants.state.asmlist);
                                    });
                                    break;
                            }
                        }, function (error) {
                            $rootScope.isLoading = false;
                            switch ($scope.approveMocModel.action) {
                                case 'approve':
                                    $scope.dialogOption.title = "ASM Approve Failed";
                                    $scope.dialogOption.content = error.message;
                                    utils.dialog.showDialog($scope.dialogOption);
                                    break;
                                case 'reject':
                                    $scope.dialogOption.title = "ASM Reject Failed";
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

            $scope.mocApproveActions = [
                {
                    text: 'CANCEL'
                },
                {
                    text: 'APPROVE',
                    action: function () {
                        if ($scope.validators.mocApprove.validate()) {
                            $scope.approveMocModel.remarks = $scope.mocApproveComment;
                            $scope.approveMocModel.action = 'approve';
                            $scope.approveMocModel.isApproved = true;
                            $scope.mocApprove();
                            return true;
                        }
                        // Returning false will prevent the closing of the dialog
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
                            $scope.approveMocModel.remarks = $scope.mocRejectComment;
                            $scope.approveMocModel.isApproved = false;
                            $scope.approveMocModel.action = 'reject';
                            $rootScope.isLoading = true;
                            isProcessTriggerClick = true;
                            $scope.mocApprove();
                            return true;

                        }
                        return false;
                    },
                    primary: true
                }
            ];

            $scope.updateMOC = function (e) {
                if (!isProcessTriggerClick) {
                    return false;
                }
                isProcessTriggerClick = false;

                e.preventDefault();
                e.stopPropagation();


                $scope.mocConfirmDialog("MOC Updated", "Please confirm that you have updated the MOC and ready to re-submit for MOC approval.").then(function () {
                    $scope.submitMOCModel.allowByPassViaMOC = $scope.model.asmDetail.allowByPassViaMOC;
                    $scope.submitMOCModel.mocNo = $scope.model.asmDetail.mocNO;
                    $scope.submitMOCModel.mocMeetingDate = $scope.model.asmDetail.mocMeetingDate;
                    $scope.submitMOCModel.mocApprovedBy = $scope.model.mocApprover.userProfileId;
                    $rootScope.isLoading = true;
                    isProcessTriggerClick = true;
                    asmWorkflowServices.requireUpdateMOC($stateParams.alarmId, $scope.submitMOCModel).then(function (response) {
                        $rootScope.isLoading = false;
                        var option = {
                            id: "dialogInfo",
                            title: "MOC Submitted",
                            lableClose: "CLOSE",
                            content: "This MOC is submitted and pending MOC approval.",
                            width: 500
                        };
                        utils.dialog.showDialog(option, function () {
                            $state.go(constants.state.asmlist);
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
                    // Chooses cancel, do nothing
                    isProcessTriggerClick = true;
                    return true;
                });
            };
            //#endregion

            //#region Cancel ASM

            $scope.cancelAsm = function (e) {
                //prevent multi click
                $scope.inProgress = true;
                e.preventDefault();
                e.stopImmediatePropagation();

                try {
                    if ($scope.userProfile.userProfileId === $scope.model.applicant.userProfileId || $scope.checkUserRole.asmAdmin) {
                        $scope.confirmDialog("ASM Cancel", "Are you sure you want to cancel this ASM?").then(function () {
                            // show loading
                            $rootScope.isLoading = true;
                            asmWorkflowServices.cancelAsm($stateParams.alarmId).then(function (response) {
                                $scope.inProgress = false;
                                $rootScope.isLoading = false;

                                $scope.dialogOption.title = "ASM Canceled";
                                $scope.dialogOption.content = "ASM form has been canceled successfully";
                                utils.dialog.showDialog($scope.dialogOption, function () {
                                    $state.go(constants.state.asmlist);
                                });
                            }, function (error) {
                                $scope.inProgress = false;
                                $rootScope.isLoading = false;
                                $scope.dialogOption.title = "ASM Cancel Failed";
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


            //#region Shelve form

            $scope.shelveActions = [
                {
                    text: 'CANCEL'
                },
                {
                    text: 'SHELVE',
                    action: function () {
                        // show loading
                        $rootScope.isLoading = true;

                        try {
                            asmServices.asmShelving($stateParams.alarmId, { isReShelving: false }).then(function (response) {
                                $rootScope.isLoading = false;
                                $scope.dialogOption.title = "Alarm Shelved";
                                $scope.dialogOption.content = "This alarm is shelved and <strong>live</strong>.";
                                utils.dialog.showDialog($scope.dialogOption, function () {
                                    $rootScope.goToMyPendingAction = true;
                                    $state.go(constants.state.asmlist);
                                });
                            }, function (error) {
                                $rootScope.isLoading = false;

                                $scope.dialogOption.title = "Alarm Shelve Failed.";
                                $scope.dialogOption.content = error.message;
                                utils.dialog.showDialog($scope.dialogOption);
                            });

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

            // Get close reason

            var GetAlarmCloseReason = function () {
                //$scope.GetAlarmClosureReason = null;
                asmServices.getAlarmClosureReason().then(function (response) {
                    $scope.ClosureReason = response.data;
                    $scope.closeReason = response.data[0].lookupId; //set default reason for closing
                    $('#closeAlarmDialog').data("kendoDialog").open();
                }, function (error) {
                    utils.error.showErrorGet(error);
                });
            }

            $scope.closeAlarm = function (event) {
                $scope.inProgress = true;
                event.preventDefault();
                event.stopImmediatePropagation();
                try {
                    GetAlarmCloseReason()
                } catch (error) {
                    utils.error.showErrorGet(error);
                    $scope.inProgress = false;
                    $rootScope.isLoading = false;
                }
            }

            //#region Close Shelving
            $scope.closeAlarmActions = [
                {
                    text: 'CANCEL'
                },
                {
                    text: 'CLOSE',
                    action: function () {
                        // show loading
                        $rootScope.isLoading = true;

                        try {
                            if ($scope.validators.close.validate()) {
                                asmServices.asmClose($stateParams.alarmId, { ClosureReasonId: $scope.closeReason }).then(function (response) {
                                    $rootScope.isLoading = false;
                                    $scope.dialogOption.title = "Alarm Closed";
                                    $scope.dialogOption.content = "Successfully close.";
                                    utils.dialog.showDialog($scope.dialogOption, function () {
                                        $state.go(constants.state.asmlist);
                                    });

                                }, function (error) {
                                    $rootScope.isLoading = false;
                                    $scope.dialogOption.title = "Alarm Close Failed.";
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

            //#endregion close

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

            $scope.showUpdateMOCKendoDialog = function () {
                utils.clearValid();
                $scope.updateMOCKendoDialog.center();
                $scope.updateMOCKendoDialog.open();
                //$scope.changeSwithText();
            };

            $scope.mocConfirmDialog = function (title, content) {
                return $("<div></div>").kendoConfirm({
                    title: title,
                    content: content,
                    actions: [{ text: "SUBMIT", primary: true },
                    { text: "CANCEL" }]
                }).data("kendoConfirm").open().result;
            };

            //#region for asm_Live grid
            $scope.reShelvingScheduleOptions = {
                dataSource: {
                    transport: {
                        read: function (options) {
                            asmWorkflowServices.getAsmReShelvingSchedule(
                                {
                                    alarmId: $stateParams.alarmId,
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
                                shift: {
                                    type: "string"
                                },
                                shiftTime: {
                                    type: "string"
                                },
                                shelvedBy: {
                                    type: "string"
                                },
                                shelvedTime: {
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
                    field: "shelvedBy", title: "Shelved By",
                    template: function (dataItem) {
                        if (dataItem.isShelving == null && dataItem.isNewestShift) {
                            if ($scope.model.asmDetail.statusKey !== "30") {
                                return "<strong class='pending_info pending-reacknowledge'>Pending Re-shelve</strong>";
                            } else {
                                return "";
                            }
                        } else if (dataItem.isShelving == null && !dataItem.isNewestShift) {
                            return "None";
                        } else {
                            return "<a href data-ng-click='goToProfile(\"" + dataItem.shelversId + "\")'><strong>" + dataItem.shelvingBy + "</strong></a>";
                        }
                    }
                }, {
                    field: "shelvedTime", title: "Time Shelved",
                    template: function (dataItem) {
                        if (dataItem.isShelving == null && dataItem.isNewestShift) {
                            $scope.newestShift = dataItem.shiftTime;
                            $scope.newestShiftNumber = dataItem.shift;
                            if ($scope.userProfile.userProfileId == $scope.model.asmDetail.applicantProfileId || $scope.model.isShelver) {
                                if ($scope.model.asmDetail.statusKey !== "30") {
                                    return "<button class='btn-sd btn-sm btn-purple k-button' data-ng-click='reShelvingDialog.open()'>Re-shelve</button>";
                                } else {
                                    return "";
                                }
                            } else {
                                return "";
                            }
                        } else if (dataItem.isShelving == null && !dataItem.isNewestShift) {
                            return "";
                        } else {
                            return kendo.toString(kendo.parseDate(dataItem.shelvingTime), "dd MMM yyyy at hh:mm tt");
                        }
                    }
                }],
                noRecords: true,
                messages: {
                    noRecords: "There is no data on current page"
                }
            };

            $scope.reApprovalOptions = {
                dataSource: {
                    transport: {
                        read: function (options) {
                            asmWorkflowServices.getAsmApprovalExtension(
                                {
                                    alarmId: $stateParams.alarmId,
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
                            if ($scope.model.asmDetail.statusKey !== '30') {
                                return "<strong class='pending_info pending-reapproval'>Pending Re-approval</strong>";
                            } else {
                                return "";
                            }
                        }
                        else {
                            return "<strong><a href data-ng-click='goToProfile(\"" + dataItem.approvedId + "\")'>" + dataItem.approvedBy + "</a></strong>";
                        }
                    }
                }, {
                    field: "approvedTime", title: "Time Approved",
                    template: function (dataItem) {
                        if (dataItem.approvedTime == null && dataItem.isNewest) {
                            if ($scope.userProfile.userProfileId == $scope.model.approver.userProfileId) {
                                if ($scope.model.asmDetail.statusKey !== '30') {
                                    return "<button class='btn-sd btn-sm btn-purple k-button right' data-ng-click='reApproveDialog.open()'>Re-approve</button>";
                                } else {
                                    return "";
                                }
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
            //#endregion

            //#region Re-Approve

            $scope.reApprovalComment = "";

            $scope.reApproveActions = [
                {
                    text: 'CANCEL'
                },
                {
                    text: 'RE-APPROVE',
                    action: function () {
                        $scope.reApprovalClick();
                        return true;
                    },
                    primary: true
                }];

            $scope.reApprovalClick = function () {
                // show loading
                $rootScope.isLoading = true;

                try {
                    if ($scope.userProfile.userProfileId == $scope.model.approver.userProfileId) {
                        asmWorkflowServices.reApproveAsm($stateParams.alarmId).then(function (response) {
                            $rootScope.isLoading = false;
                            $scope.dialogOption.title = "Alarm Re-Approve";
                            $scope.dialogOption.content = "This alarm is re-approved.";
                            utils.dialog.showDialog($scope.dialogOption, function () {
                                $rootScope.goToMyPendingAction = true;
                                $state.go(constants.state.asmlist);
                            });
                        }, function (error) {
                            $rootScope.isLoading = false;
                            $scope.dialogOption.title = "Alarm Re-Approve Failed";
                            $scope.dialogOption.content = "This alarm is approve failed.";
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
            };

            //#endregion

            //#region Re-Shelve form

            $scope.reShelveActions = [
                {
                    text: 'CANCEL'
                },
                {
                    text: 'RE-SHELVE',
                    action: function () {
                        // show loading
                        $rootScope.isLoading = true;

                        try {
                            asmWorkflowServices.reShelveAsm($stateParams.alarmId).then(function (response) {
                                $rootScope.isLoading = false;
                                $scope.dialogOption.title = "Alarm Re-Shelved";
                                $scope.dialogOption.content = "This alarm is re-shelved and <strong>live</strong>.";
                                utils.dialog.showDialog($scope.dialogOption, function () {
                                    $rootScope.goToMyPendingAction = true;
                                    $state.go(constants.state.asmlist);
                                });
                            }, function (error) {
                                $rootScope.isLoading = false;

                                $scope.dialogOption.title = "Alarm Re-Shelve Failed.";
                                $scope.dialogOption.content = error.message;
                                utils.dialog.showDialog($scope.dialogOption);
                            });

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

            //#region asm update require

            // Model
            $scope.updatemodel = {
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
                isSubmitAction: null
            };

            //Common field value
            $scope.selectedArea = { areaId: "" };
            $scope.selectedAlarmClass = { alarmClassId: "" };
            $scope.selectedUnitNo = { unitId: "" };
            $scope.selectedTagNo = { tagId: "" };
            $scope.selectedType = { selectedTypeId: "" };
            $scope.selectedReviewer = { reviewerId: "" };

            //#region Business function for asm update

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

            // On selected Area changed
            $scope.onAreaChange = function () {
                if ($("#asmArea").val() !== "") {
                    $scope.unitDataSource = {
                        transport: {
                            read: function (options) {
                                getUnitNoByAreaId(options, $("#asmArea").val());
                            }
                        },
                        schema: {
                            model: {
                                fields: {
                                    lookupUnitId: { type: "string" },
                                    description: { type: "string" }
                                }
                            }
                        }
                    };
                    $scope.tagNoDataSource = null;
                } else {
                    $scope.unitDataSource = null;
                    $scope.tagNoDataSource = null;
                }
                //$scope.selectedArea = $("#asmArea").val();
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

            // Bind detail data to form
            var bindAsmDetail = function (response) {
                // Bind area data source
                $scope.areasDataSource = {
                    transport: {
                        read: function (options) {
                            getArea(options);
                        }
                    },
                    schema: {
                        model: {
                            fields: {
                                lookupAreaId: { type: "string" },
                                description: { type: "string" }
                            }
                        }
                    }
                };

                // Bind unit data source
                $scope.unitDataSource = {
                    transport: {
                        read: function (options) {
                            getUnitNoByAreaId(options, response.data.asmDetail.areaId);
                        }
                    },
                    schema: {
                        model: {
                            fields: {
                                lookupUnitId: { type: "string" },
                                description: { type: "string" }
                            }
                        }
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
                            dataItem.image = $scope.selectedReviewer.reviewerId.image;
                        }
                        return '<span class="selected-value" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span><span>{{dataItem.userName}}</span>';
                    },
                    template: '<div class="custom-dropdown"><span class="k-state-default" data-ng-style="{\'background-image\' : \'url(data:image/jpg;base64,{{dataItem.image}})\'}"></span>' +
                    '<span class="k-state-default"><h3>{{dataItem.userName}}</h3></span></div>'
                };

                try {
                    $scope.selectedArea.areaId = response.data.asmDetail.areaId;
                    $scope.selectedAlarmClass.alarmClassId = response.data.asmDetail.alarmClassId;
                    $scope.selectedUnitNo.unitId = response.data.asmDetail.unitId;
                    $scope.selectedTagNo.tagId = response.data.asmDetail.tagId == null ? "0" : response.data.asmDetail.tagId;
                    $scope.updatemodel.otherTagNo = response.data.asmDetail.tagId !== null ? "" : response.data.asmDetail.tagNo;
                    $scope.selectedType.selectedTypeId = response.data.asmDetail.typeId == null ? "0" : response.data.asmDetail.typeId;
                    $scope.selectedReviewer.reviewerId = response.data.reviewer == null ? "" : response.data.reviewer.userProfileId;
                    $scope.updatemodel.radio = response.data.asmDetail.radio;
                    $scope.updatemodel.mobileNo = $scope.userProfile.mobileNo;
                    $scope.updatemodel.equipmentNo = response.data.asmDetail.equipmentNo;
                    $scope.updatemodel.description = response.data.asmDetail.description;
                    $scope.updatemodel.otherType = response.data.asmDetail.typeId !== null ? "" : response.data.asmDetail.type;
                } catch (eerror) {
                    utils.error.showErrorGet(error);
                    $scope.inProgress = false;
                    $rootScope.isLoading = false;
                }
            }

            //#endregion

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
                                    if ($scope.selectedTagNo.tagId === '' || $scope.selectedTagNo.tagId == null) {
                                        return false;
                                    } else if ($scope.selectedTagNo.tagId === '0') {
                                        retVal = $scope.updatemodel.otherTagNo != null & $scope.updatemodel.otherTagNo != "";
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
                                    if ($scope.selectedType.selectedTypeId === '' || $scope.selectedType.selectedTypeId == null) {
                                        return false;
                                    } else if ($scope.selectedType.selectedTypeId === '0') {
                                        retVal = $scope.updatemodel.otherType != null & $scope.updatemodel.otherType != "";
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
                                    if ($scope.selectedTagNo.tagId === '' || $scope.selectedTagNo.tagId == null) {
                                        return false;
                                    } else if ($scope.selectedTagNo.tagId === '0') {
                                        retVal = $scope.updatemodel.otherTagNo != null & $scope.updatemodel.otherTagNo != "";
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


            // save data for asm_form
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
                        $scope.updatemodel.isSubmitAction = actionType;
                        $scope.updatemodel.areaId = $scope.selectedArea.areaId;
                        //$scope.updatemodel.userProfileId = $scope.userProfile.userProfileId;
                        $scope.updatemodel.unitId = $scope.selectedUnitNo.unitId;
                        $scope.updatemodel.tagNo = $scope.selectedTagNo.tagId === '0' ? '' : $scope.selectedTagNo.tagId;
                        $scope.updatemodel.alarmClass = $scope.selectedAlarmClass.alarmClassId;
                        $scope.updatemodel.type = $scope.selectedType.selectedTypeId === '0' ? '' : $scope.selectedType.selectedTypeId;
                        //$scope.model.parentAlarm = $stateParams.alarmId == undefined ? null : $stateParams.alarmId;
                        $scope.updatemodel.reviewerId = $scope.selectedReviewer.reviewerId == null ? null : $scope.selectedReviewer.reviewerId;

                        // Send  data to server
                        if (actionType) {
                            asmNewServices.asmUpdatesRequires($stateParams.alarmId, $scope.updatemodel).then(function (response) {
                                $scope.inProgress = false;
                                $rootScope.isLoading = false;
                                if (response.data == true) {
                                    $scope.userProfile.mobileNo = $scope.updatemodel.mobileNo;
                                    $rootScope.$app.userProfile.mobileNo = $scope.updatemodel.mobileNo;
                                    $scope.model.asmDetail.mobileNo = $scope.updatemodel.mobileNo;
                                    $scope.dialogOption.title = "Submit for Review";
                                    $scope.dialogOption.content = "This ASM is submitted and <strong>pending review</strong>";
                                    utils.dialog.showDialog($scope.dialogOption, function () {
                                        $state.go(constants.state.asmlist);
                                    });
                                }
                            }, function (error) {
                                $scope.inProgress = false;
                                $rootScope.isLoading = false;

                                $scope.dialogOption.title = "Submit for Review";
                                $scope.dialogOption.content = error.message;
                                utils.dialog.showDialog($scope.dialogOption);

                            });
                        } else {
                            asmNewServices.editAsm($stateParams.alarmId, $scope.updatemodel).then(function () {
                                $scope.inProgress = false;
                                $rootScope.isLoading = false;
                                $scope.userProfile.mobileNo = $scope.updatemodel.mobileNo;
                                $rootScope.$app.userProfile.mobileNo = $scope.updatemodel.mobileNo;
                                $scope.model.asmDetail.mobileNo = $scope.updatemodel.mobileNo;

                                $scope.dialogOption.title = "Update ASM";
                                $scope.dialogOption.content = "This ASM is saved";
                                utils.dialog.showDialog($scope.dialogOption, function () {
                                    $state.go(constants.state.asmlist);
                                });
                            }, function (error) {
                                $scope.inProgress = false;
                                $rootScope.isLoading = false;
                                $scope.dialogOption.title = "Update ASM";
                                $scope.dialogOption.content = error.message;
                                utils.dialog.showDialog($scope.dialogOption);

                            });
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

            // update asm
            $scope.updateRequire = function (event, actionType) {
                saveData(event, actionType);
            }

            //submit asm for review
            $scope.submitForReview = function (event, actionType) {
                saveData(event, actionType);
            }

            //#endregion


        }]);