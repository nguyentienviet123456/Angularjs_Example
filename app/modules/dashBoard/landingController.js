app.controller('landingController', ['$rootScope', '$window', '$scope', '$location', '$state', 'authService', 'appSettings', 'constants', function ($rootScope, $window, $scope, $location, $state, authService, appSettings, constants) {
    $rootScope.$app.title = "Landing";

    $state.go(constants.state.rotfDashboardOverview);
    $rootScope.bigModuleTitle = "Refinery Of The Future (ROTF)";
}]);