app.factory('diDashBoardService', ['apiHelper', '$q', 'constants', function (apiHelper, $q, constants) {


    var _getSampleData = function() {
        //var deferred = $q.defer();
        //var url = constants.ASMDashBoard.getEEMUAData;
        //url = url.format(year);
        //apiHelper.get(url).then(function (response) {
        //    deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        //}, function (error) {
        //    deferred.reject(error);
        //});
        //return deferred.promise;

        return "OK";
    }

    return {
        getSampleData: _getSampleData
    };
}]);