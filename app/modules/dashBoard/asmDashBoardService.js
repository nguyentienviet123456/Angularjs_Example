app.factory('asmDashBoardService', ['apiHelper', '$q', 'constants', function (apiHelper, $q, constants) {
    var asmDashBoardServicesFactory = {};

    var _getAsmDashBoard = function (data) {
        var deferred = $q.defer();
        apiHelper.post(constants.ASMDashBoard.getASMDashBoard, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _getActiveAreas = function () {
        var deferred = $q.defer();
        apiHelper.get(constants.ASMDashBoard.getActiveAreas).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };


    var _getSubscribedAreas = function () {
        var deferred = $q.defer();
        apiHelper.get(constants.ASMDashBoard.getSubscribedAreas).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _getAsmPendingInDashboard = function (data) {
        var deferred = $q.defer();
        apiHelper.post(constants.ASMDashBoard.getAsmPendingInDashboard, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };


    var _getEEMUAData = function (year) {
        var deferred = $q.defer();
        var url = constants.ASMDashBoard.getEEMUAData;
        url = url.format(year);
        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };
    var _saveEEMUAData = function (data, year) {
        var deferred = $q.defer();
        var url = constants.ASMDashBoard.saveEEMUAData;
        url = url.format(year);
        apiHelper.post(url, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };


    asmDashBoardServicesFactory.getAsmDashBoard = _getAsmDashBoard;
    asmDashBoardServicesFactory.getActiveAreas = _getActiveAreas;
    asmDashBoardServicesFactory.getAsmPendingInDashboard = _getAsmPendingInDashboard;
    asmDashBoardServicesFactory.getSubscribedAreas = _getSubscribedAreas;
    asmDashBoardServicesFactory.getEEMUAData = _getEEMUAData;
    asmDashBoardServicesFactory.saveEEMUAData = _saveEEMUAData;
    return asmDashBoardServicesFactory;
}]);