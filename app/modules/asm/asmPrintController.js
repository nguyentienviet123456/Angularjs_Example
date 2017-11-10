app.controller('asmPrintController',
    ['$rootScope', '$stateParams', '$scope', 'constants', 'asmWorkflowServices',
function ($rootScope, $stateParams, $scope, constants, asmWorkflowServices) {

    $scope.asmDetail = null;    
    $scope.reAcknowledgeHistoriesLeft = null;
    $scope.reAcknowledgeHistoriesRight = null;
    $scope.reApproveHistoriesLeft = null;
    $scope.reApproveHistoriesRight = null;

    var loadData = function () {
        $rootScope.isLoading = true;
        asmWorkflowServices.getAsmPrintingDetail($stateParams.alarmId).then(function (response) {
            if (response.data != null) {
                $scope.asmDetail = response.data;

                if (response.data.reShelvingHistory != null) {
                    var halfLength = Math.ceil(response.data.reShelvingHistory.length / 2);
                    $scope.reShelvingHistoryLeft = response.data.reShelvingHistory.splice(0, halfLength);
                    $scope.reShelvingHistoryRight = response.data.reShelvingHistory.splice(0, halfLength);
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