app.factory('diNewService', ['apiHelper', '$q', 'constants', function (apiHelper, $q, constants) {

    var diServicesFactory = {};

    var _getDiHse = function () {
        var deferred = $q.defer();
        var url = constants.DI.getHseIssue;
        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data, statusCode: response.data.status });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _getDiCopSol = function () {
        var deferred = $q.defer();
        var url = constants.DI.getCopSol;
        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data, statusCode: response.data.status });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    diServicesFactory.getDiHse = _getDiHse;
    diServicesFactory.getDiCopSol = _getDiCopSol;
   
    return diServicesFactory;
}]);