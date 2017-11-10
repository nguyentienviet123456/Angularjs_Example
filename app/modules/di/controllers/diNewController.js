app.controller('diNewController',
    ['$rootScope', '$window', '$state', '$stateParams', '$scope', '$location', 'authService', 'appSettings', 'constants', 'serviceHelper',
        function ($rootScope, $window, $state, $stateParams, $scope, $location, authService, appSettings, constants, serviceHelper) {
          
            $state.go(constants.state.diNew);
        }]);