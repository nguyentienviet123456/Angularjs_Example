app.controller('HeaderController', ['$rootScope', '$state', '$window', '$scope', 'authService', 'constants', function ($rootScope, $state, $window, $scope, authService, constants) {
    $scope.userProfile = $rootScope.$app.userProfile;
    $scope.isShow = true;
    if ($scope.userProfile.image == null) {
        $scope.isShow = false;
    }

    angular.element(document).ready(function () {
        $('#ProfileMenu').kendoMenu({ closeOnClick: true });
    });

    $scope.myAccount = function () {
        $rootScope.bigModuleTitle = "HOME";
        $('#ProfileMenu').find(".k-animation-container").hide();
        $state.go(constants.state.myProfile);
    };

    $scope.logout = function () {
        $scope.loggingIn = false;
        $window.localStorage.removeItem(constants.localStorage.userProfile);
        $window.localStorage.removeItem(constants.localStorage.userSecret);
        $window.localStorage.removeItem(constants.localStorage.logined);
        $window.localStorage.removeItem(constants.localStorage.timeOld);
        var accessTokenSingleSignOn = $window.localStorage.getItem(constants.localStorage.accessToken);
        authService.logoutSingleSignOn(accessTokenSingleSignOn).then(function (response) {
            $window.localStorage.removeItem(constants.localStorage.accessToken);
            $window.location.href = "/login";
        }, function (err) {
            $window.localStorage.removeItem(constants.localStorage.accessToken);
            $window.location.href = "/login";
        });
    };

}]);