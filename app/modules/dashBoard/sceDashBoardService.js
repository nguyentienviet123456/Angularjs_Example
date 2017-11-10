app.factory('sceDashBoardService', ['apiHelper', '$q', 'constants', function (apiHelper, $q, constants) {

    var sceDashBoardServicesFactory = {};

    var _getSCEDashBoard = function (data) {
        var deferred = $q.defer();
        apiHelper.post(constants.SCEDashBoard.getSCEDashBoard, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _getActiveAreas = function () {
        var deferred = $q.defer();
        apiHelper.get(constants.SCEDashBoard.getActiveAreas).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _getSubscribedAreas = function () {
        var deferred = $q.defer();
        apiHelper.get(constants.SCEDashBoard.getSubscribedAreas).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _getScePendingInDashboard = function (data) {
        var deferred = $q.defer();
        apiHelper.post(constants.SCE.getScePendingInDashboard, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _getRaPendingInDashboard = function (data) {
        var deferred = $q.defer();
        apiHelper.post(constants.SCE.getRaPendingInDashBoard, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _getSCELiveStatistic = function (data) {
        var deferred = $q.defer();
        var url = constants.SCEDashBoard.getSceLiveStatistic;
        apiHelper.post(url, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    sceDashBoardServicesFactory.getSCEDashBoard = _getSCEDashBoard;
    sceDashBoardServicesFactory.getActiveAreas = _getActiveAreas;
    sceDashBoardServicesFactory.getScePendingInDashboard = _getScePendingInDashboard;
    sceDashBoardServicesFactory.getRaPendingInDashboard = _getRaPendingInDashboard;
    sceDashBoardServicesFactory.getSubscribedAreas = _getSubscribedAreas;
    sceDashBoardServicesFactory.getSCELiveStatistic = _getSCELiveStatistic;
    return sceDashBoardServicesFactory;
}]);