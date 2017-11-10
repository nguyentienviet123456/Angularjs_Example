app.factory('raServices', ['apiHelper', '$q', 'constants', function (apiHelper, $q, constants) {

    var raServicesFactory = {};

    var _getInitialData = function (sceId) {
        var deferred = $q.defer();
        var url = constants.RA.getInitialData;
        url = url.format(sceId);
        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _getApplicants = function (keyword) {
        var deferred = $q.defer();
        var url = constants.RA.getApplicants;
        url = url.format(keyword);
        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _getRAFacilitators = function (keyword) {
        var deferred = $q.defer();
        var url = constants.RA.getRAFacilitator;
        url = url.format(keyword);
        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _getRAEndorsers = function (keyword) {
        var deferred = $q.defer();
        var url = constants.RA.getRAEndorsers;
        url = url.format(keyword);
        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _getRAApprovers = function (keyword) {
        var deferred = $q.defer();
        var url = constants.RA.getRAApprovers;
        url = url.format(keyword);
        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _getMocApprovers = function (keyword) {
        var deferred = $q.defer();
        var url = constants.RA.getMocApprovers;
        url = url.format(keyword);
        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _getSeverities = function (impactType) {
        var deferred = $q.defer();
        var url = constants.RA.getSeveritiesByImpactGroup;
        url = url.format(impactType);
        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _getLikeliHoods = function () {
        var deferred = $q.defer();
        var url = constants.RA.getLikelihoods;
        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _getRiskIdentification = function (impactValue, likelihoodValue) {
        var deferred = $q.defer();
        var url = constants.RA.getRiskIdentification;
        url = url.format(impactValue, likelihoodValue);
        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _getTeamMembers = function (keyword) {
        var deferred = $q.defer();
        var url = constants.RA.getTeamMembers.format(keyword);
        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _getRATeamMembers = function (raId) {
        var deferred = $q.defer();
        var url = constants.RA.getRATeamMembers;
        url = url.format(raId);
        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _createRA = function (sceId, data) {
        var deferred = $q.defer();
        var url = constants.RA.createRA;
        url = url.format(sceId);
        apiHelper.post(url, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _getRADetail = function (sceId, raId) {
        var deferred = $q.defer();
        var url = constants.RA.getRADetail;
        url = url.format(sceId, raId);
        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _getRaListing = function (data) {
        var deferred = $q.defer();
        var url = constants.RA.raListing;
        apiHelper.post(url, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    // service get Log'RA
    var _getRALog = function (raId) {
        var deferred = $.defer();
        var url = constants.RA.getRALog;
        url = url.format(raId);
        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _getRABasic = function (raId) {
        var deferred = $q.defer();
        var url = constants.RA.getRABasic;
        url = url.format(raId);
        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _getTotalMyRaListing = function () {
        var deferred = $q.defer();
        apiHelper.get(constants.RA.getTotalMyRaListing).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _updateRA = function (sceId, raId, data) {
        var deferred = $q.defer();
        var url = constants.RA.updateRA;
        url = url.format(sceId, raId);
        apiHelper.put(url, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _updateMOC = function (sceId, raId, data) {
        var deferred = $q.defer();
        var url = constants.RA.updateMOC;
        url = url.format(sceId, raId);
        apiHelper.post(url, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _reviewRA = function (sceId, raId, data) {
        var deferred = $q.defer();
        var url = constants.RA.reviewRA;
        url = url.format(sceId, raId);
        apiHelper.post(url, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _endorseRA = function (sceId, raId, data) {
        var deferred = $q.defer();
        var url = constants.RA.endorseRA;
        url = url.format(sceId, raId);
        apiHelper.post(url, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _approveRA = function (sceId, raId, data) {
        var deferred = $q.defer();
        var url = constants.RA.approveRA;
        url = url.format(sceId, raId);
        apiHelper.post(url, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _approveMOC = function (sceId, raId, data) {
        var deferred = $q.defer();
        var url = constants.RA.approveMOC;
        url = url.format(sceId, raId);
        apiHelper.post(url, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _cancelRA = function (sceId, raId) {
        var deferred = $q.defer();
        var url = constants.RA.cancelRA;
        url = url.format(sceId, raId);
        apiHelper.post(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _cancelMOC = function (sceId, raId) {
        var deferred = $q.defer();
        var url = constants.RA.cancelMOC;
        url = url.format(sceId, raId);
        apiHelper.post(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _transferRole = function (sceId, raId, data) {
        var deferred = $q.defer();
        var url = constants.RA.transferRoles;
        url = url.format(sceId, raId);
        apiHelper.post(url, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _getPendingPerson = function (sceId, raId) {
        var deferred = $q.defer();
        var url = constants.RA.getPendingPerson;
        url = url.format(sceId, raId);
        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _checkRaCopy = function (sceId) {
        var deferred = $q.defer();
        var url = constants.RA.checkRaCopy;
        url = url.format(sceId);
        apiHelper.post(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, message: response.data.message, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }

    var _getInfoRaCopy = function (sceId) {
        var deferred = $q.defer();
        var url = constants.RA.getRaCopy;
        url = url.format(sceId);
        apiHelper.get(url).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, message: response.data.message, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _getRaLog = function (data) {
        var deferred = $q.defer();

        apiHelper.post(constants.RA.getRALog, data).then(function (response) {
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    raServicesFactory.getInitialData = _getInitialData;
    raServicesFactory.getApplicants = _getApplicants;
    raServicesFactory.getRAFacilitors = _getRAFacilitators;
    raServicesFactory.getRAEndorsers = _getRAEndorsers;
    raServicesFactory.getRAApprovers = _getRAApprovers;
    raServicesFactory.getMocApprovers = _getMocApprovers;
    raServicesFactory.getSeverities = _getSeverities;
    raServicesFactory.getLikelihoods = _getLikeliHoods;
    raServicesFactory.getRiskIdentification = _getRiskIdentification;
    raServicesFactory.getTeamMembers = _getTeamMembers;
    raServicesFactory.getRATeamMembers = _getRATeamMembers;
    raServicesFactory.createRA = _createRA;
    raServicesFactory.getRADetail = _getRADetail;
    raServicesFactory.getRaListing = _getRaListing;
    raServicesFactory.getRALog = _getRALog;
    raServicesFactory.getTotalMyRaListing = _getTotalMyRaListing;
    raServicesFactory.getRABasic = _getRABasic;
    raServicesFactory.updateRA = _updateRA;
    raServicesFactory.reviewRA = _reviewRA;
    raServicesFactory.endorseRA = _endorseRA;
    raServicesFactory.approveRA = _approveRA;
    raServicesFactory.approveMOC = _approveMOC;
    raServicesFactory.cancelRA = _cancelRA;
    raServicesFactory.cancelMOC = _cancelMOC;
    raServicesFactory.updateMOC = _updateMOC;
    raServicesFactory.transferRoles = _transferRole;
    raServicesFactory.getPendingPerson = _getPendingPerson;
    raServicesFactory.checkRaCopy = _checkRaCopy;
    raServicesFactory.getInfoRaCopy = _getInfoRaCopy;
    raServicesFactory.getRaLog = _getRaLog;

    return raServicesFactory;
}]);