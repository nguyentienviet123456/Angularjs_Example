app.factory('fileService', ['apiHelper', '$q', 'constants', function (apiHelper, $q, constants) {

    var fileServicesFactory = {};

    var _checkExistFile = function (fileId) {

        var deferred = $q.defer();

        var url = constants.viewFile.checkExistFileSce.format(fileId);

        apiHelper.post(url).then(function (dataOutput) {
            deferred.resolve({ status: true, data: dataOutput.data.result });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    fileServicesFactory.checkExistFile = _checkExistFile;

    return fileServicesFactory;
}]);