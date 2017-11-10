app.factory('rotfServices', ['apiHelper', '$q', 'constants', function (apiHelper, $q, constants) {
    var services = {};

    var _getNPAT = function () {
        var deferred = $q.defer();

        var url = constants.ROTF.getNPAT;

        apiHelper.get(url).then(function (response) {
                deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
            },
            function (error) {
                deferred.reject(error);
            });

        return deferred.promise;
    };

    var _getOEE = function () {
        var deferred = $q.defer();

        var url = constants.ROTF.getOEE;
        
        apiHelper.get(url).then(function (response) {
                deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
            },
            function (error) {
                deferred.reject(error);
            });

        return deferred.promise;
    };

    services.getOEE = _getOEE;
    services.getNPAT = _getNPAT;

    return services;
}]);