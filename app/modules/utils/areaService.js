app.factory('areaService', ['apiHelper', '$q', 'constants', function (apiHelper, $q, constants) {

    var areaServiceFactory = {};

    var _getAllAreaIsActive = function () {
        var deferred = $q.defer();

        apiHelper.get(constants.area.getAllAreaIsActive).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _getAreaByUserSubscription = function (userProfileId) {
        var deferred = $q.defer();

        var url = constants.area.getAreaByUserSubscription;
        url = url.format(userProfileId);

        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _getAreas = function () {
        var deferred = $q.defer();

        apiHelper.get(constants.ASM.getAreas).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    areaServiceFactory.getAllAreaIsActive = _getAllAreaIsActive;
    areaServiceFactory.getAreaByUserSubscription = _getAreaByUserSubscription;
    areaServiceFactory.getAreas = _getAreas;

    return areaServiceFactory;
}]);