app.factory('sceServices', ['apiHelper', '$q', 'constants', function (apiHelper, $q, constants) {

    var sceServicesFactory = {};

    var _addNewSce = function (data) {
        var deferred = $q.defer();

        apiHelper.post(constants.SCE.insertSce, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _transferSce = function (sceId, data) {
        var deferred = $q.defer();

        var url = constants.SCE.transferSce;
        url = url.format(sceId);

        apiHelper.put(url, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _transferRoles = function (sceId, data) {
        var deferred = $q.defer();

        var url = constants.SCE.sceTransferRoles;
        url = url.format(sceId);
        apiHelper.post(url, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _getApplicantsForTransfer = function (keyword) {
        var deferred = $q.defer();
        var url = constants.RA.getApplicants.format(keyword);
        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };
    var _getApplicantsForTransferInSameAreas = function (sceId, keyword) {
        var deferred = $q.defer();
        var url = constants.SCE.getApplicantsForTransfer.format(sceId, keyword);
        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };
    var _getPreData = function (controlName, parentId, keyword) {
        var deferred = $q.defer();

        var url = constants.SCE.getPreData;
        url = url.format(controlName, parentId === null || parentId === undefined ? '' : parentId, keyword === null || keyword === undefined ? '' : keyword);

        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _getSceListing = function (filter) {
        var deferred = $q.defer();

        apiHelper.post(constants.SCE.getSceListing, filter).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _getSceDetail = function (sceId) {
        var deferred = $q.defer();

        var url = constants.SCE.getSceDetail;
        url = url.format(sceId);

        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _cancelSce = function (sceId) {
        var deferred = $q.defer();

        var url = constants.SCE.cancelSce;
        url = url.format(sceId);

        apiHelper.delete(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _reviewSce = function (sceId, data) {
        var deferred = $q.defer();

        var url = constants.SCE.reviewSce;
        url = url.format(sceId);

        apiHelper.put(url, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _endorseSce = function (sceId, data) {
        var deferred = $q.defer();

        var url = constants.SCE.endorseSce;
        url = url.format(sceId);

        apiHelper.put(url, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _approveSce = function (sceId, data) {
        var deferred = $q.defer();

        var url = constants.SCE.approveSce;
        url = url.format(sceId);

        apiHelper.put(url, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _getPTWListing = function (sceId) {
        var deferred = $q.defer();
        var url = constants.SCE.GetPTWListing;
        url = url.format(sceId);
        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _deletePTW = function (sceId, ptwData) {
        var deferred = $q.defer();
        var url = constants.SCE.DeletePTW;
        url = url.format(sceId);
        apiHelper.delete(url, ptwData).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _updatePTW = function (sceId, ptwData) {
        var deferred = $q.defer();
        var url = constants.SCE.UpdatePTW;
        url = url.format(sceId);
        apiHelper.put(url, ptwData).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _addNewPTW = function (sceId, ptwData) {
        var deferred = $q.defer();
        var url = constants.SCE.AddNewPTW;
        url = url.format(sceId);
        apiHelper.post(url, ptwData).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _acknowledgeSce = function (sceId, isReAcknowledge) {
        var deferred = $q.defer();

        var url = constants.SCE.acknowledgeSce;
        url = url.format(sceId);

        apiHelper.put(url, isReAcknowledge).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _getTotalMySceListing = function () {
        var deferred = $q.defer();

        apiHelper.get(constants.SCE.getTotalMySceListing).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _editSce = function (sceId, data) {
        var deferred = $q.defer();

        var url = constants.SCE.editSce;
        url = url.format(sceId);

        apiHelper.put(url, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _normalizeSce = function (sceId, data) {
        var deferred = $q.defer();

        var url = constants.SCE.normalizeSce;
        url = url.format(sceId);

        apiHelper.put(url, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        },
            function (error) {
                deferred.reject(error);
            });

        return deferred.promise;
    };

    var _getSceExtApproval = function (data) {
        var deferred = $q.defer();

        var url = constants.SCE.getSceExtApproval;

        apiHelper.post(url, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _getAcknowledgeSchedule = function (data) {
        var deferred = $q.defer();

        var url = constants.SCE.getSceAcknowledgeSchedule;

        apiHelper.post(url, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _getAllUnit = function () {
        var deferred = $q.defer();

        apiHelper.get(constants.SCE.getAllUnit).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _getAllTag = function () {
        var deferred = $q.defer();

        apiHelper.get(constants.SCE.getAllTag).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _getUnitByArea = function (areaId, isActive) {
        var deferred = $q.defer();

        var url = "";
        if (isActive === null || isActive === undefined) {
            url = constants.SCE.getUnitByAreaId;
            url = url.format(areaId);
        }
        else {
            url = constants.SCE.getUnitByAreaIdAndStatus;
            url = url.format(areaId, isActive);
        }

        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _getTagNoByUnit = function (unitId, isActive) {
        var deferred = $q.defer();

        var url = "";
        if (isActive === null || isActive === undefined) {
            url = constants.SCE.getTagNoByUnitId;
            url = url.format(unitId);
        }
        else {
            url = constants.SCE.getTagNoByUnitIdAndStatus;
            url = url.format(unitId, isActive);
        }

        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };
    var _getSilIdByTagId = function (tagId) {
        var deferred = $q.defer();
        url = constants.SCE.getSilIdByTagId;
        url = url.format(tagId);
        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _getScePrintingDetail = function (sceId) {
        var deferred = $q.defer();

        var url = constants.SCE.getScePrintingDetail;
        url = url.format(sceId);

        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _getPendingPeopleForTransferingRoles = function (sceId) {
        var deferred = $q.defer();

        var url = constants.SCE.getPendingPeopleForTransferingRoles;
        url = url.format(sceId);

        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _getSCELog = function (data) {
        var deferred = $q.defer();

        apiHelper.post(constants.SCE.getSCELog, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _getSceCopied = function (id) {
        var deferred = $q.defer();

        var url = constants.SCE.getSceCopy;
        url = url.format(id);

        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    }

    var _buildUploadUrl = function (sceId, group) {
        var url = constants.SCE.uploadFiles;
        return apiHelper.includeToken(url.format(sceId, group));
    }

    var _getUploadedFiles = function (sceId) {
        var deferred = $q.defer();

        var url = constants.SCE.getUploadedFiles;
        url = url.format(sceId);

        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    }

    var _viewFile = function (sceId, fileId) {
        var url = constants.SCE.viewFile;
        url = url.format(sceId, fileId);
        return apiHelper.includeToken(url.format(sceId, fileId));
    }

    var _exportFile = function () {
        var deferred = $q.defer();

        var url = constants.SCE.exportFile;

        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    }

    var _approverTransfer = function (sceId, data) {
        var deferred = $q.defer();
        var url = constant.SCE.approverTransfer;
        url = url.format(sceId);
        apiHelper.post(url, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }

    sceServicesFactory.addNewSCE = _addNewSce;
    sceServicesFactory.transferSce = _transferSce;
    sceServicesFactory.getPreData = _getPreData;
    sceServicesFactory.getApplicantsForTransfer = _getApplicantsForTransfer;
    sceServicesFactory.getSceListing = _getSceListing;
    sceServicesFactory.getSceDetail = _getSceDetail;
    sceServicesFactory.cancelSce = _cancelSce;
    sceServicesFactory.reviewSce = _reviewSce;
    sceServicesFactory.GetPTWListing = _getPTWListing;
    sceServicesFactory.endorseSce = _endorseSce;
    sceServicesFactory.approveSce = _approveSce;
    sceServicesFactory.AddNewPTW = _addNewPTW;
    sceServicesFactory.UpdatePTW = _updatePTW;
    sceServicesFactory.DeletePTW = _deletePTW;
    sceServicesFactory.acknowledgeSce = _acknowledgeSce;
    sceServicesFactory.getTotalMySceListing = _getTotalMySceListing;
    sceServicesFactory.editSce = _editSce;
    sceServicesFactory.normalizeSce = _normalizeSce;
    sceServicesFactory.getSceExtApproval = _getSceExtApproval;
    sceServicesFactory.getAcknowledgeSchedule = _getAcknowledgeSchedule;
    sceServicesFactory.getAllUnit = _getAllUnit;
    sceServicesFactory.getAllTag = _getAllTag;
    sceServicesFactory.getUnitByArea = _getUnitByArea;
    sceServicesFactory.getTagNoByUnit = _getTagNoByUnit;
    sceServicesFactory.getSilIdByTagId = _getSilIdByTagId;
    sceServicesFactory.getScePrintingDetail = _getScePrintingDetail;
    sceServicesFactory.transferRoles = _transferRoles;
    sceServicesFactory.getPendingPeopleForTransferingRoles = _getPendingPeopleForTransferingRoles;
    sceServicesFactory.getApplicantsForTransferInSameAreas = _getApplicantsForTransferInSameAreas;
    sceServicesFactory.getSceLog = _getSCELog;
    sceServicesFactory.getSceCopied = _getSceCopied;
    sceServicesFactory.buildUploadUrl = _buildUploadUrl;
    sceServicesFactory.getUploadedFiles = _getUploadedFiles;
    sceServicesFactory.viewFile = _viewFile;
    sceServicesFactory.exportFile = _exportFile;
    sceServicesFactory.approverTransfer = _approverTransfer;

    return sceServicesFactory;
}]);