app.controller('rotfDashBoardController',
    ['$rootScope', '$window', '$state', '$stateParams', '$scope', '$sce', '$location', 'authService', 'appSettings',
        'constants', 'rotfServices',
        function ($rootScope, $window, $state, $stateParams, $scope, $sce, $location, authService, appSettings, constants, rotfServices) {
            
            $scope.NPATList = {};
            
            loadNPATList();


            $scope.isTabActived = function(name) {
                return $state.includes(name);
            }

            $scope.goTo = function(name)
            {
                switch (name) {
                case 'overview':
                    $state.go(constants.state.rotfDashboardOverview);
                    
                    break;
                case 'operation':
                    $state.go(constants.state.rotfDashboardOperation);

                    break;
                default:
                }
            }


            function loadNPATList() {
                rotfServices.getNPAT().then(function (response) {
                    $scope.NPATList = response.data;
                }, function (error) {
                    utils.error.showErrorGet(error);
                });
            }

            
        }
    ]);