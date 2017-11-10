app.controller('loginController', ['$rootScope', '$window', '$scope', '$location', '$state', 'authService', 'appSettings', 'constants', function ($rootScope, $window, $scope, $location, $state, authService, appSettings, constants) {

    $rootScope.$app.title = constants.titlePage.login;
    $scope.loginData = {
        userId: "",
        password: "",
        domain: ""
    };
    $scope.domain = "";
    $scope.domains = {
        optionLabel: 'Domain*',
        optionLabelTemplate: function (optionLabel) { return '<span class="optionlabel">' + optionLabel + '</span>'; },
        dataTextField: 'name',
        dataValueField: 'name',
        dataSource: {
            transport: {
                read: {
                    dataType: "json",
                    url: constants.singleSignOn.domains
                }
            }
        }
    };
    $scope.message = "";
    $scope.loggingIn = false;
    $scope.login = function () {
        $scope.loginData.domain = $scope.domain;
        $scope.loggingIn = true;
        authService.login($scope.loginData).then(function (response) {
            var userProfile = response.userProfile;
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
            $rootScope.$app.userProfile.moduleAccess = userProfile.moduleAccess;
            $rootScope.$app.userProfile.rolesKeyString = userProfile.rolesKeyString;
            $window.localStorage.setItem(constants.localStorage.userProfile, JSON.stringify(userProfile));
            $window.localStorage.setItem(constants.localStorage.userSecret, response.secret);
            $window.localStorage.setItem(constants.localStorage.logined, true);
            if ($location.search().returnUrl !== null && $location.search().returnUrl !== undefined && $location.search().returnUrl.trim() !== ''
                && ($location.path() + '').toLowerCase() !== "/login" && ($location.path() + '').toLowerCase() !== "/download/app") {
                $window.location.href = $location.search().returnUrl;
            }
            else {
                $state.go(constants.state.landing);
            }
        },
         function (error) {
             $scope.message = error.message;
             $window.localStorage.removeItem(constants.localStorage.userId);
             $window.localStorage.removeItem(constants.localStorage.userSecret);
             $window.localStorage.setItem(constants.localStorage.logined, false);
             $scope.loggingIn = false;
         });
    };

}]);