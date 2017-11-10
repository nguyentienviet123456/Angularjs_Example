app.controller('diDashBoardController', ['$rootScope', '$scope', '$state', 'constants', 'accessModule', 'diDashBoardService', function ($rootScope, $scope, $state, constants, accessModule, diDashBoardService) {
        $rootScope.$app.title = constants.titlePage.diDashBoard;

        $scope.sampleData = diDashBoardService.getSampleData();

    }]);