app.factory('asmWorkflowServices', ['apiHelper', '$q', 'constants', function (apiHelper, $q, constants) {
    var asmWorkflowServicesFactory = {};
    // Get Detailed Information of Alarm records
    var _getAsmDetail = function (alarmId) {
        var deferred = $q.defer();
        var url = constants.ASM.getAsmDetail;
        url = url.format(alarmId);
        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode,message:response.data.message });
        }, function (error) {
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


    var _endorseAsm = function (alarmId, data) {
        var deferred = $q.defer();

        var url = constants.ASM.endorseAsm;
        url = url.format(alarmId);

        apiHelper.put(url, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _approveAsm = function (alarmId, data) {
        var deferred = $q.defer();

        var url = constants.ASM.approveAsm;
        url = url.format(alarmId);

        apiHelper.put(url, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _transferRoles = function (asmId, data) {
        var deferred = $q.defer();

        var url = constants.ASM.asmTransferRoles;
        url = url.format(asmId);
        apiHelper.post(url, data).then(function (response) {
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

    var _getApplicantsForTransfer = function (keyword) {
        var deferred = $q.defer();
        var url = constants.ASM.getApplicants.format(keyword);
        apiHelper.get(url).then(function (response) {
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

    var _cancelAsm = function (alarmId) {
        var deferred = $q.defer();

        var url = constants.ASM.cancelAsm;
        url = url.format(alarmId);

        apiHelper.put(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _getReviewers = function (keyword) {
        var deferred = $q.defer();
        var url = constants.ASM.getReviewers.format(keyword);
        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };
    var _getEndorsers = function (keyword) {
        var deferred = $q.defer();
        var url = constants.ASM.getEndorsers.format(keyword);
        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };
    var _getApprovers = function (keyword) {
        var deferred = $q.defer();
        var url = constants.ASM.getApprovers.format(keyword);
        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _getAsmCopy = function (alarmId) {
        var deferred = $q.defer();

        var url = constants.ASM.getAsmCopy;
        url = url.format(alarmId);

        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    }

    var _getUnitByAreaId = function (alarmId) {
        var deferred = $q.defer();

        var url = constants.ASM.getUnitByArea;
        url = url.format(alarmId);

        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _getTagNoByUnitId = function (unitId) {
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

    var _submitMOC = function (alarmId, data) {
        var deferred = $q.defer();
        var url = constants.ASM.submitMOC;
        url = url.format(alarmId);
        apiHelper.put(url, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
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

    var _cancelMOC = function (alarmId) {
        var deferred = $q.defer();

        var url = constants.ASM.cancelMOC;
        url = url.format(alarmId);

        apiHelper.put(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _requireUpdateMOC = function (alarmId, data) {
        var deferred = $q.defer();
        var url = constants.ASM.requireUpdateMOC;
        url = url.format(alarmId);
        apiHelper.put(url, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _approveMoc = function (alarmId, data) {
        var deferred = $q.defer();

        var url = constants.ASM.approveMoc;
        url = url.format(alarmId);

        apiHelper.post(url, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _getAsmApprovalExtension = function (data) {
        var deferred = $q.defer();

        var url = constants.ASM.getAsmApprovalExtension;

        apiHelper.post(url, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _getAsmReShelvingSchedule = function (data) {
        var deferred = $q.defer();

        var url = constants.ASM.getAsmReShelvingSchedule;

        apiHelper.post(url, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _reApproveAsm = function (alarmId) {
        var deferred = $q.defer();

        var url = constants.ASM.reApproveAsm;
        url = url.format(alarmId);

        apiHelper.put(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    }

    var _reShelveAsm = function (alarmId) {
        var deferred = $q.defer();

        var url = constants.ASM.reShelveAsm;
        url = url.format(alarmId);

        apiHelper.put(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    }


    var _getAsmPrintingDetail = function (alarmId) {
        var deferred = $q.defer();

        var url = constants.ASM.getAsmPrintingDetail;
        url = url.format(alarmId);

        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    asmWorkflowServicesFactory.getAsmDetail = _getAsmDetail;
    asmWorkflowServicesFactory.reviewAsm = _reviewAsm;
    asmWorkflowServicesFactory.endorseAsm = _endorseAsm;
    asmWorkflowServicesFactory.approveAsm = _approveAsm;
    asmWorkflowServicesFactory.transferRoles = _transferRoles;
    asmWorkflowServicesFactory.transferAsm = _transferAsm;
    asmWorkflowServicesFactory.getApplicantsForTransfer = _getApplicantsForTransfer;
    asmWorkflowServicesFactory.getApplicantsForTransferInSameAreas = _getApplicantsForTransferInSameAreas;
    asmWorkflowServicesFactory.cancelAsm = _cancelAsm;
    asmWorkflowServicesFactory.getReviewers = _getReviewers;
    asmWorkflowServicesFactory.getEndorsers = _getEndorsers;
    asmWorkflowServicesFactory.getApprovers = _getApprovers;
    asmWorkflowServicesFactory.getAsmCopy = _getAsmCopy;
    asmWorkflowServicesFactory.getUnitByAreaId = _getUnitByAreaId;
    asmWorkflowServicesFactory.getTagNoByUnitId = _getTagNoByUnitId;
    asmWorkflowServicesFactory.submitMOC = _submitMOC;
    asmWorkflowServicesFactory.getMocApprovers = _getMocApprovers;
    asmWorkflowServicesFactory.cancelMOC = _cancelMOC;
    asmWorkflowServicesFactory.requireUpdateMOC = _requireUpdateMOC;
    asmWorkflowServicesFactory.approveMoc = _approveMoc;
    asmWorkflowServicesFactory.getAsmApprovalExtension = _getAsmApprovalExtension;
    asmWorkflowServicesFactory.getAsmReShelvingSchedule = _getAsmReShelvingSchedule;
    asmWorkflowServicesFactory.reApproveAsm = _reApproveAsm;
    asmWorkflowServicesFactory.reShelveAsm = _reShelveAsm;
    asmWorkflowServicesFactory.getAsmPrintingDetail = _getAsmPrintingDetail;

    return asmWorkflowServicesFactory;
}]);