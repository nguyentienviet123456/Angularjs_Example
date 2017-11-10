app.factory('asmNewServices', ['apiHelper', '$q', 'constants', function (apiHelper, $q, constants) {

    var asmNewServicesFactory = {};

    var _creatAsm = function (data) {
        var deferred = $q.defer();

        apiHelper.post(constants.ASM.creatAsm, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _cancelAsm = function (asmId) {
        var deferred = $q.defer();

        var url = constants.ASM.cancelAsm;
        url = url.format(asmId);

        apiHelper.delete(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
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


    var _getUnitByArea = function (areaId) {
        var deferred = $q.defer();

        var url = constants.ASM.getUnitByArea;
        url = url.format(areaId);

        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _getTagNoByUnit = function (unitId) {
        var deferred = $q.defer();

        var url = constants.ASM.getTagNoByUnit;
        url = url.format(unitId);

        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _getAlarmClasses = function () {
        var deferred = $q.defer();

        apiHelper.get(constants.ASM.getAlarmClasses).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _getAlarmTypes = function () {
        var deferred = $q.defer();

        apiHelper.get(constants.ASM.getAlarmTypes).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _getAsmReviewers = function (keyWord, take) {
        var deferred = $q.defer();

        var url = constants.ASM.getAsmReviewers;
        url = url.format(keyWord, take);

        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _getAsmDetail = function (alarmId) {
        var deferred = $q.defer();

        var url = constants.ASM.getAsmDetail;
        url = url.format(alarmId);

        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    }

    var _editAsm = function (alarmId, data) {
        var deferred = $q.defer();

        var url = constants.ASM.editAsm;
        url = url.format(alarmId);

        apiHelper.put(url, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _asmUpdatesRequires = function (alarmId, data) {
        var deferred = $q.defer();

        var url = constants.ASM.requiresUpdateAsm;
        url = url.format(alarmId);

        apiHelper.put(url, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    }

    asmNewServicesFactory.getAreas = _getAreas;
    asmNewServicesFactory.getUnitByArea = _getUnitByArea;
    asmNewServicesFactory.getTagNoByUnit = _getTagNoByUnit;
    asmNewServicesFactory.getAlarmClasses = _getAlarmClasses;
    asmNewServicesFactory.getAlarmTypes = _getAlarmTypes;
    asmNewServicesFactory.getAsmReviewers = _getAsmReviewers;
    asmNewServicesFactory.creatAsm = _creatAsm;
    asmNewServicesFactory.cancelAsm = _cancelAsm;
    asmNewServicesFactory.getAsmDetail = _getAsmDetail;
    asmNewServicesFactory.editAsm = _editAsm;
    asmNewServicesFactory.asmUpdatesRequires = _asmUpdatesRequires;

    return asmNewServicesFactory;
}]);