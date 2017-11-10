app.factory('statusService', ['apiHelper', '$q', 'constants', function (apiHelper, $q, constants) {

    var statusServiceFactory = {};

    var _getStatusBySce = function () {
        var deferred = $q.defer();

        apiHelper.get(constants.status.getStatusBySce).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _getListStatusOfRa = function () {
        var deferred = $q.defer();

        apiHelper.get(constants.status.getListStatisOfRa).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _getListStatusByModuleName = function (moduleName) {
        var deferred = $q.defer();

        var url = constants.status.getListStatusByModuleName.format(moduleName);

        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    }

    statusServiceFactory.getStatusBySce = _getStatusBySce;
    statusServiceFactory.getListStatusOfRa = _getListStatusOfRa;
    statusServiceFactory.getListStatusByModuleName = _getListStatusByModuleName;

    return statusServiceFactory;
}]);