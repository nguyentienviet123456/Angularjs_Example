app.factory('asmServices', ['apiHelper', '$q', 'constants', function (apiHelper, $q, constants) {
    var asmServicesFactory = {};
    var _asmShelving = function(alarmId) {
        var deferred = $q.defer();

        var url = constants.ASM.shelveASM;
        url = url.format(alarmId);


        apiHelper.put(url).then(function(response) {
                deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
            },
            function(error) {
                deferred.reject(error);
            });

        return deferred.promise;
    };
    
    var _getAlarmClosureReason = function () {
        var deferred = $q.defer();

        apiHelper.get(constants.ASM.getAlarmClosureReason).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _getASMLog = function (data) {
        var deferred = $q.defer();

        apiHelper.post(constants.ASM.getAsmLog, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _asmClose = function(alarmId, data) {
        var deferred = $q.defer();

        var url = constants.ASM.closeASM;
        url = url.format(alarmId);

        apiHelper.put(url, data).then(function(response) {
                deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
            },
            function(error) {
                deferred.reject(error);
            });

        return deferred.promise;
    };

    var _getMocApprovers = function (keyword) {
        var deferred = $q.defer();
        var url = constants.ASM.getASMMOCApprovers;
        url = url.format([keyword]);
        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _getAsmListing = function (filter) {
        var deferred = $q.defer();

        apiHelper.post(constants.ASM.listAsm, filter).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _getTotalMyPedingAsm = function() {
        var deferred = $q.defer();

        apiHelper.get(constants.ASM.totalMyPendingAsm).then(function(response) {
                deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
            },
            function(error) {
                deferred.reject(error);
            });

        return deferred.promise;
    };

    var _reviewAsm = function (alarmId, data) {
        var deferred = $q.defer();

        var url = constants.ASM.reviewAsm;
        url = url.format(alarmId);

        apiHelper.put(url, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _cancelShelving = function(alarmId) {
        var deferred = $q.defer();

        var url = constants.ASM.cancelAsm;
        url = url.format(alarmId);

        apiHelper.put(url).then(function(response) {
                deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
            },
            function(error) {
                deferred.reject(error);
            });

        return deferred.promise;
    };

    var _createMOC = function (alarmId) {
        var deferred = $q.defer();
        var url = constants.ASM.createNewMOC;
        url = url.format(alarmId);
        apiHelper.post(url, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _getApplicantsForTransferInSameAreas = function (alarmId, keyword) {
        var deferred = $q.defer();
        var url = constants.ASM.getApplicantsForTransfer.format(alarmId, keyword);
        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _getPreData = function (controlName, parentId, keyword) {
        var deferred = $q.defer();

        var url = constants.ASM.getPreData;
        url = url.format(controlName, parentId === null || parentId === undefined ? '' : parentId, keyword === null || keyword === undefined ? '' : keyword);

        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _transferAsm = function (asmId, data) {
        var deferred = $q.defer();

        var url = constants.ASM.transferAsm;
        url = url.format(asmId);

        apiHelper.put(url, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _getPendingPeopleForTransferingRoles = function (alarmId) {
        var deferred = $q.defer();

        var url = constants.ASM.getPendingPeopleForTransferingRoles;
        url = url.format(alarmId);

        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _transferRoles = function (alarmId, data) {
        var deferred = $q.defer();

        var url = constants.ASM.asmTransferRoles;
        url = url.format(alarmId);
        apiHelper.post(url, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    asmServicesFactory.asmShelving = _asmShelving;
    asmServicesFactory.asmClose = _asmClose;
    asmServicesFactory.getAsmLog = _getASMLog;
    asmServicesFactory.getMocApprovers = _getMocApprovers;
    asmServicesFactory.getAsmListing = _getAsmListing;
    asmServicesFactory.getTotalMyPedingAsm = _getTotalMyPedingAsm;
    asmServicesFactory.reviewAsm = _reviewAsm;
    asmServicesFactory.cancelShelving = _cancelShelving;
    asmServicesFactory.createMOC = _createMOC;
    asmServicesFactory.getApplicantsForTransferInSameAreas = _getApplicantsForTransferInSameAreas;
    asmServicesFactory.transferAsm = _transferAsm;
    asmServicesFactory.getPendingPeopleForTransferingRoles = _getPendingPeopleForTransferingRoles;
    asmServicesFactory.getPreData = _getPreData;
    asmServicesFactory.transferRoles = _transferRoles;
    asmServicesFactory.getAlarmClosureReason = _getAlarmClosureReason

    return asmServicesFactory;

}])