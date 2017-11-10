app.controller('scePrintController', ['$rootScope', '$stateParams', '$scope', 'constants', 'sceServices', function ($rootScope, $stateParams, $scope, constants, sceServices) {

    $scope.sceDetail = null;
    $scope.normalizedPTW = null;
    $scope.reAcknowledgeHistoriesLeft = null;
    $scope.reAcknowledgeHistoriesRight = null;
    $scope.reApproveHistoriesLeft = null;
    $scope.reApproveHistoriesRight = null;

    var loadData = function () {
        $rootScope.isLoading = true;
        sceServices.getScePrintingDetail($stateParams.sceId).then(function (response) {
            if (response.data != null) {
                $scope.sceDetail = response.data;

                for (i = 0; i < response.data.scePtw.length; i++) {
                    if (response.data.scePtw[i].isNormalized) {
                        $scope.normalizedPTW = response.data.scePtw[i];
                    }
                }

                if (response.data.reAcknowledgementHistory != null) {
                    var halfLength = Math.ceil(response.data.reAcknowledgementHistory.length / 2);
                    $scope.reAcknowledgeHistoriesLeft = response.data.reAcknowledgementHistory.splice(0, halfLength);
                    $scope.reAcknowledgeHistoriesRight = response.data.reAcknowledgementHistory.splice(0, halfLength);
                }

                if (response.data.reApprovalHistory != null) {
                    var halfLength = Math.ceil(response.data.reApprovalHistory.length / 2);
                    $scope.reApproveHistoriesLeft = response.data.reApprovalHistory.splice(0, halfLength);
                    $scope.reApproveHistoriesRight = response.data.reApprovalHistory.splice(0, halfLength);
                }
            }
            $rootScope.isLoading = false;
        }, function (error) {
            utils.error.showErrorGet(error);
            $rootScope.isLoading = false;
        });
    };
    loadData();

}]);