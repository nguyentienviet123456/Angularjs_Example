app.factory('riskService', ['apiHelper', '$q', 'constants', function (apiHelper, $q, constants) {

    var riskServiceFactory = {};

    var _getAllRiskLevel = function () {
        var deferred = $q.defer();

        apiHelper.get(constants.risk.getAllRiskLevel).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    riskServiceFactory.getAllRiskLevel = _getAllRiskLevel;

    return riskServiceFactory;
}]);