app.controller('fileController', ['$rootScope', '$scope', '$state', '$window', '$stateParams', 'constants', 'fileService', function ($rootScope, $scope, $state, $window, $stateParams, constants, fileService) {

    $rootScope.$app.title = "Loading file ...";

    var onLoad = function (stateName) {
        switch (stateName) {
            case constants.state.sceViewFile:
                $rootScope.isLoading = true;

                fileService.checkExistFile($stateParams.fileId).then(function (response) {
                    $rootScope.isLoading = false;
                    var token = $window.localStorage.getItem(constants.localStorage.userSecret);
                    $window.location.href = constants.viewFile.fileSce.format($stateParams.sceId, $stateParams.fileId, token);
                }, function (error) {
                    $scope.messageError = error.message;
                    $rootScope.isLoading = false;
                });
                break;
        }

    };

    onLoad($state.current.name);

}]);