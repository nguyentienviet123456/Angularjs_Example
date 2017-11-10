app.factory('utilsService', ['apiHelper', '$q', 'constants', function (apiHelper, $q, constants) {

    var utilsServiceFactory = {};

    var _getIp = function () {
        var deferred = $q.defer();

        apiHelper.get(constants.utils.getIp).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    utilsServiceFactory.getIp = _getIp;

    return utilsServiceFactory;
}]);