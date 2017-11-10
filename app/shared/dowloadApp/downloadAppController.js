app.controller('downloadAppController', ['$rootScope', '$scope', '$location', 'constants', function ($rootScope, $scope, $location, constants) {

    $rootScope.$app.module = "login";
    $rootScope.$app.title = constants.titlePage.downloadApp;

    $scope.linkAndroid = constants.linkApp.android;
    $scope.linkIos = constants.linkApp.ios;
}]);