app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'constants', function ($stateProvider, $urlRouterProvider, $locationProvider, constants) {

    $urlRouterProvider.rule(function ($i, $location) {
        var path = $location.path();
        var normalized = path.toLowerCase();
        if (path !== normalized) return normalized;
    });

    $stateProvider.state(constants.state.downloadApp, {
        url: "/download/app",
        controller: "downloadAppController",
        templateUrl: "app/views/shared/dowloadApp/download_app.html"
    });

    $stateProvider.state(constants.state.login, {
        url: "/login",
        controller: "loginController",
        templateUrl: "app/views/modules/security/login.html"
    });

    $stateProvider.state(constants.state.accessdenied, {
        url: "/access_denied",
        controller: "accessDeniedController",
        templateUrl: "app/views/modules/security/page_access_denied.html"
    });

    $stateProvider.state(constants.state.default, {
        url: "/",
        controller: "landingController",
        templateUrl: "app/views/modules/dashBoard/landing.html"
    });

    $stateProvider.state(constants.state.landing, {
        url: "/landing",
        controller: "landingController",
        templateUrl: "app/views/modules/dashBoard/landing.html"
    });

    $stateProvider.state(constants.state.scelist, {
        url: "/scelist",
        controller: "sceListController",
        templateUrl: "app/views/modules/sce/sce_list.html"
    });

    $stateProvider.state(constants.state.scenew, {
        url: "/scenew",
        controller: "sceController",
        templateUrl: "app/views/modules/sce/sce_new.html"
    });

    $stateProvider.state(constants.state.scecopynew, {
        url: "/scenew/:sceId/copy",
        controller: "sceController",
        templateUrl: "app/views/modules/sce/sce_copy.html"
    });

    $stateProvider.state(constants.state.scedetail, {
        url: "/sce_detail/:sceId",
        controller: "sceController",
        templateUrl: "app/views/modules/sce/sce_detail.html"
    });

    $stateProvider.state(constants.state.sceedit, {
        url: "/sceedit/:sceId",
        controller: "sceController",
        templateUrl: "app/views/modules/sce/sce_edit.html"
    });

    $stateProvider.state(constants.state.sceupdaterequire, {
        url: "/sce_update_require/:sceId",
        controller: "sceController",
        templateUrl: "app/views/modules/sce/sce_require_update.html"
    });

    $stateProvider.state(constants.state.scereview, {
        url: "/sce_review/:sceId",
        controller: "sceController",
        templateUrl: "app/views/modules/sce/sce_review.html"
    });

    $stateProvider.state(constants.state.reviewupdaterequire, {
        url: "/sce_review_update_require/:sceId",
        controller: "sceController",
        templateUrl: "app/views/modules/sce/sce_review_update_require.html"
    });

    $stateProvider.state(constants.state.sceendorse, {
        url: "/sce_endorse/:sceId",
        controller: "sceController",
        templateUrl: "app/views/modules/sce/sce_endorse.html"
    });

    $stateProvider.state(constants.state.sceapprove, {
        url: "/sce_approve/:sceId",
        controller: "sceController",
        templateUrl: "app/views/modules/sce/sce_approve.html"
    });

    $stateProvider.state(constants.state.sceacknowledge, {
        url: "/sce_acknowledge/:sceId",
        controller: "sceController",
        templateUrl: "app/views/modules/sce/sce_acknowledge.html"
    });

    $stateProvider.state(constants.state.scelive, {
        url: "/sce_live/:sceId",
        controller: "sceController",
        templateUrl: "app/views/modules/sce/sce_live.html"
    });

    $stateProvider.state(constants.state.scenormalized, {
        url: "/sce_normalized/:sceId",
        controller: "sceController",
        templateUrl: "app/views/modules/sce/sce_normalized.html"
    });

    $stateProvider.state(constants.state.sceDashBoard, {
        url: "/scedashboard",
        controller: "sceDashBoardController",
        templateUrl: "app/views/modules/dashBoard/sce_dashboard.html"
    });

    $stateProvider.state(constants.state.scePrint, {
        url: "/print/sce/:sceId",
        controller: "scePrintController",
        templateUrl: "app/views/modules/sce/sce_print.html"
    });

    $stateProvider.state(constants.state.raNew, {
        url: "/ranew/:sceId",
        controller: "raController",
        templateUrl: "app/views/modules/sce/ra/ra_new.html"
    });

    $stateProvider.state(constants.state.raCopy, {
        url: "/ra/copy/:sceId",
        controller: "raController",
        templateUrl: "app/views/modules/sce/ra/ra_new.html"
    });

    $stateProvider.state(constants.state.raDetail, {
        url: "/radetail/:sceId/:raId",
        controller: "raController",
        templateUrl: "app/views/modules/sce/ra/ra_detail.html"
    });

    $stateProvider.state(constants.state.raEdit, {
        url: "/raedit/:sceId/:raId",
        controller: "raController",
        templateUrl: "app/views/modules/sce/ra/ra_edit.html"
    });

    $stateProvider.state(constants.state.raReview, {
        url: "/rareview/:sceId/:raId",
        controller: "raController",
        templateUrl: "app/views/modules/sce/ra/ra_review.html"
    });

    $stateProvider.state(constants.state.raEndorse, {
        url: "/raendorse/:sceId/:raId",
        controller: "raController",
        templateUrl: "app/views/modules/sce/ra/ra_endorse.html"
    });

    $stateProvider.state(constants.state.raApprove, {
        url: "/raapprove/:sceId/:raId",
        controller: "raController",
        templateUrl: "app/views/modules/sce/ra/ra_approve.html"
    });

    $stateProvider.state(constants.state.raInfo, {
        url: "/ra/info/:sceId/:raId",
        controller: "raController",
        templateUrl: "app/views/modules/sce/ra/ra_info.html"
    });

    $stateProvider.state(constants.state.raPrint, {
        url: "/print/ra/:sceId/:raId",
        controller: "raController",
        templateUrl: "app/views/modules/sce/ra/ra_print.html"
    });

    $stateProvider.state(constants.state.raMOC, {
        url: "/ramoc/:sceId/:raId",
        controller: "raController",
        templateUrl: "app/views/modules/sce/ra/ra_moc.html"
    });

    $stateProvider.state(constants.state.raUpdateRequired, {
        url: "/raupdaterequired/:sceId/:raId",
        controller: "raController",
        templateUrl: "app/views/modules/sce/ra/ra_review_required_update.html"
    });

    $stateProvider.state(constants.state.raList, {
        url: "/ra_list",
        controller: "raListController",
        templateUrl: "app/views/modules/sce/ra/ra_list.html"
    });

    $stateProvider.state(constants.state.manageUser, {
        url: "/user/manage",
        controller: "userListController",
        templateUrl: "app/views/modules/user/user_list.html"
    });

    $stateProvider.state(constants.state.newUser, {
        url: "/user/new",
        controller: "userController",
        templateUrl: "app/views/modules/user/user_new.html"
    });

    $stateProvider.state(constants.state.editUser, {
        url: "/user/edit/:id",
        controller: "userController",
        templateUrl: "app/views/modules/user/user_edit.html"
    });

    $stateProvider.state(constants.state.myProfile, {
        url: "/myprofile",
        controller: "userProfileController",
        templateUrl: "app/views/modules/user/my_profile.html"
    });

    $stateProvider.state(constants.state.profile, {
        url: "/profile/:id",
        controller: "userProfileController",
        templateUrl: "app/views/modules/user/profile.html"
    });

    $stateProvider.state(constants.state.notificationList, {
        url: "/notifications",
        controller: "notificationListController",
        templateUrl: "app/views/modules/notification/notification_list.html"
    });

    $stateProvider.state(constants.state.adminMessage, {
        url: "/messages",
        controller: "messageAdminController",
        templateUrl: "app/views/modules/message/admin_message.html"
    });

    $stateProvider.state(constants.state.sceStatusLog, {
        url: "/sce/:sceId/statuslog",
        controller: "statusLogController",
        templateUrl: "app/views/shared/logstatus/status_log.html"
    });

    $stateProvider.state(constants.state.raStatusLog, {
        url: "/ra/:sceId/:raId/statuslog",
        controller: "statusLogController",
        templateUrl: "app/views/shared/logstatus/status_log.html"
    });

    $stateProvider.state(constants.state.sceViewFile, {
        url: "/files/sce/:sceId/:fileId",
        controller: "fileController",
        templateUrl: "app/views/modules/file/view_file.html"
    });

    $stateProvider.state(constants.state.requireUpdateMOC, {
        url: "/moc_update_require",
        controller: "asmMocController",
        templateUrl: "app/views/modules/asm/asm_moc_require_update.html"
    });
    $stateProvider.state(constants.state.asmDashBoard, {
        url: "/asmdashboard",
        controller: "asmDashBoardController",
        templateUrl: "app/views/modules/dashBoard/asm_dashboard.html"
    });
    $stateProvider.state(constants.state.asmNewState, {
        url: "/asmnew",
        controller: "asmNewController",
        templateUrl: "app/views/modules/asm/asm_new.html"
    });
    $stateProvider.state(constants.state.asmRequiresUpdate, {
        url: "/asmrequiresupdate/:asmId",
        controller: "asmNewController",
        templateUrl: "app/views/modules/asm/asm_require_update.html"
    });
    $stateProvider.state(constants.state.asmCopy, {
        url: "/asmcopy/:alarmId",
        controller: "asmNewController",
        templateUrl: "app/views/modules/asm/asm_new.html"
    });
    $stateProvider.state(constants.state.asmStatusLog, {
        url: "/asmstatuslog/:alarmId",
        controller: "statusLogController",
        templateUrl: "app/views/shared/logstatus/status_log.html"
    });
    $stateProvider.state(constants.state.asmEditDraft, {
        url: "/asmeditdraft/:alarmId",
        controller: "asmNewController",
        templateUrl: "app/views/modules/asm/asm_new.html"
    });
    $stateProvider.state(constants.state.asmlist, {
        url: "/asmlist",
        controller: "asmListController",
        templateUrl: "app/views/modules/asm/asm_list.html"
    });
    $stateProvider.state(constants.state.asmDetail, {
        url: "/asm_detail/:alarmId",
        controller: "asmWorkflowController",
        templateUrl: "app/views/modules/asm/asm_detail.html"
    });
    $stateProvider.state(constants.state.asmPrint, {
        url: "/print/asm/:alarmId",
        controller: "asmPrintController",
        templateUrl: "app/views/modules/asm/asm_print.html"
    });
    $stateProvider.state(constants.state.diDashBoard, {
        url: "/didashBoard",
        controller: "diDashBoardController",
        templateUrl: "app/views/modules/dashBoard/di_DashBoard.html"
    });
    $stateProvider.state(constants.state.diList, {
        url: "/dilist",
        controller: "diListController",
        templateUrl: "app/views/modules/di/di_List.html"
    });
    $stateProvider.state(constants.state.diNew, {
        url: "/dinew",
        controller: "diNewController",
        templateUrl: "app/views/modules/di/di_New.html"
    });
    $stateProvider.state(constants.state.rotfDashboard, {
        url: "/rotfdashboard",
        controller: "rotfDashBoardController",
        abstract: true,
        templateUrl: "app/views/modules/dashboard/rotf_dashboard.html"
    });
    $stateProvider.state(constants.state.rotfDashboardOverview, {
        url: "",
        controller: "rotfDashboardOverviewController",
        templateUrl: "app/views/modules/rotf/rotf_dashboard_overview.html"
    });
    $stateProvider.state(constants.state.rotfDashboardOperation, {
        url: "/operation",
        controller: "rotfDashboardOperationController",
        templateUrl: "app/views/modules/rotf/rotf_dashboard_operation.html"
    });
    $locationProvider.html5Mode(true).hashPrefix('!'); 
}]);