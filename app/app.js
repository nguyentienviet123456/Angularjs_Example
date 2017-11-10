var app = angular.module('UnifiedPlantInstructionApp', ['ui.router', 'ngAnimate', 'underscore', 'kendo.directives', 'apiHelper', 'dndLists', 'ngCookies']);

app.run(["$rootScope", '$state', '$window', '$location', '$timeout', 'authService', 'apiHelper', 'accessModule', 'constants', function ($rootScope, $state, $window, $location, $timeout, authService, apiHelper, accessModule, constants) {
    $rootScope.$app = {};
    $rootScope.$app.userProfile = {
        userProfileId: "",
        userId: "",
        userName: "",
        areaId: null,
        areaName: "",
        staffNo: "",
        dept: "",
        contactNo: "",
        position: "",
        mobileNo: "",
        image: "",
        isAdmin: false,
        isAsmAdmin: false,
        moduleAccess: null,
        rolesKeyString: ""        
    };
    $rootScope.$app.menu = constants.menu;

    // isMobile
    //if (isMobile.any() && ($location.path() + '').toLowerCase() !== "/download/app") {
    //    $window.location.href = "/download/app";
    //    return false;
    //}

    // set timeOld
    var timeNow = new Date().getTime();
    $window.localStorage.setItem(constants.localStorage.timeOld, timeNow);
    // set User Profile
    var userProfile = JSON.parse($window.localStorage.getItem(constants.localStorage.userProfile));
    if (userProfile !== null && userProfile !== undefined) {
        $rootScope.$app.userProfile.userProfileId = userProfile.userProfileId;
        $rootScope.$app.userProfile.userName = userProfile.userName;
        $rootScope.$app.userProfile.userId = userProfile.userId;
        $rootScope.$app.userProfile.areaId = userProfile.areaId;
        $rootScope.$app.userProfile.areaName = userProfile.areaName;
        $rootScope.$app.userProfile.staffNo = userProfile.staffNo;
        $rootScope.$app.userProfile.dept = userProfile.dept;
        $rootScope.$app.userProfile.contactNo = userProfile.contactNo;
        $rootScope.$app.userProfile.position = userProfile.position;
        $rootScope.$app.userProfile.mobileNo = userProfile.mobileNo;
        $rootScope.$app.userProfile.image = userProfile.image;
        $rootScope.$app.userProfile.isAdmin = userProfile.isAdmin;
        $rootScope.$app.userProfile.isAsmAdmin = userProfile.isAsmAdmin;
        $rootScope.$app.userProfile.moduleAccess = userProfile.moduleAccess;
        $rootScope.$app.userProfile.rolesKeyString = userProfile.rolesKeyString;
    }

    var islogined = $window.localStorage.getItem(constants.localStorage.logined) === null || $window.localStorage.getItem(constants.localStorage.logined) === undefined ? false : $window.localStorage.getItem(constants.localStorage.logined) === "true";

    var checkLoginDone = function () {
        $timeout(function () {
            $rootScope.$app.checkLogin = false;
        }, 400);
    };

    if (($location.path() + '').toLowerCase() !== "/login" && ($location.path() + '').toLowerCase() !== "/download/app") {

        $rootScope.$app.checkLogin = true;

        if ($window.localStorage.getItem(constants.localStorage.logined) === null || $window.localStorage.getItem(constants.localStorage.logined) === undefined) {

            $rootScope.$app.checkLogin = true;

            var accessToken = $window.localStorage.getItem(constants.localStorage.accessToken);
            if (accessToken) {
                authService.signOn(accessToken).then(function (response) {
                    if (response !== null && response !== undefined && response.status === true) {
                        checkLoginDone();
                        $window.localStorage.setItem(constants.localStorage.logined, true);
                        $window.location.reload();
                    }
                    else {
                        checkLoginDone();
                        $window.localStorage.setItem(constants.localStorage.logined, false);
                        $state.go(constants.state.login);
                    }
                }, function (error) {
                    checkLoginDone();
                    $window.localStorage.setItem(constants.localStorage.logined, false);
                    $state.go(constants.state.login);
                });
            }
            else {
                $rootScope.$app.module = "login";
                $window.location.href = "/login?returnUrl=" + $location.path();
            }
        }
        else {
            if (!islogined) {
                $rootScope.$app.module = "login";
                $window.location.href = "/login?returnUrl=" + $location.path();
            }
            else {
                checkLoginDone();
            }
        }

        userProfile = JSON.parse($window.localStorage.getItem(constants.localStorage.userProfile));
        if (userProfile !== null && userProfile !== undefined) {
            $rootScope.$app.userProfile.userProfileId = userProfile.userProfileId;
            $rootScope.$app.userProfile.userId = userProfile.userId;
            $rootScope.$app.userProfile.areaId = userProfile.areaId;
            $rootScope.$app.userProfile.areaName = userProfile.areaName;
            $rootScope.$app.userProfile.staffNo = userProfile.staffNo;
            $rootScope.$app.userProfile.dept = userProfile.dept;
            $rootScope.$app.userProfile.contactNo = userProfile.contactNo;
            $rootScope.$app.userProfile.position = userProfile.position;
            $rootScope.$app.userProfile.mobileNo = userProfile.mobileNo;
            $rootScope.$app.userProfile.image = userProfile.image;
            $rootScope.$app.userProfile.isAdmin = userProfile.isAdmin;
            $rootScope.$app.userProfile.isAsmAdmin = userProfile.isAsmAdmin;
            $rootScope.$app.userProfile.moduleAccess = userProfile.moduleAccess;
            $rootScope.$app.userProfile.rolesKeyString = userProfile.rolesKeyString;
        }
    }

    $rootScope.$on('$stateChangeStart', function (event, toState) {
        if (toState.name === "login") {
            $rootScope.$app.module = "login";
        }
        else {
            $rootScope.$app.module = "notlogin";

            var islogined = $window.localStorage.getItem(constants.localStorage.logined) === null || $window.localStorage.getItem(constants.localStorage.logined) === undefined ? false : $window.localStorage.getItem(constants.localStorage.logined) === "true";

            if (islogined === true) {
                accessModule.checkAccess(event, toState.name);
            }
        }
    });

}]);