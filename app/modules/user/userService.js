app.factory('userService', ['$q', 'apiHelper', 'constants', function ($q, apiHelper, constants) {

    var userServiceFactory = {};

    var _getListUser = function (data) {
        var deferred = $q.defer();

        apiHelper.post(constants.user.getListUser, data).then(function (dataOutput) {
            deferred.resolve({ status: true, data: dataOutput.data.result });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _deactivateListUser = function (listUserProfileId) {
        var deferred = $q.defer();

        apiHelper.put(constants.user.deactivateListUser, listUserProfileId).then(function (dataOutput) {
            deferred.resolve({ status: true, data: dataOutput.data.result });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _deactivateUser = function (userProfileId) {
        var deferred = $q.defer();

        var url = constants.user.deactivateUser;
        url = url.format(userProfileId);

        apiHelper.put(url).then(function (dataOutput) {
            deferred.resolve({ status: true, data: dataOutput.data.result });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _activeUser = function (userProfileId) {
        var deferred = $q.defer();

        var url = constants.user.activeUser;
        url = url.format(userProfileId);

        apiHelper.put(url).then(function (dataOutput) {
            deferred.resolve({ status: true, data: dataOutput.data.result });
        }, function (error) {
            deferred.reject({ status: false, message: error.data.Message });
        });

        return deferred.promise;
    };

    var _adFindUser = function (userName) {
        var deferred = $q.defer();
        var url = constants.user.adFindUser;
        url = url.format(userName);

        apiHelper.get(url).then(function (dataOutput) {
            deferred.resolve({ status: true, data: dataOutput.data.result });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _create = function (model) {
        var deferred = $q.defer();

        apiHelper.post(constants.user.create, model).then(function (dataOutput) {
            deferred.resolve({ status: true, data: dataOutput.data.result });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _edit = function (userProfileId, model) {
        var deferred = $q.defer();

        var url = constants.user.edit;
        url = url.format(userProfileId);

        apiHelper.put(url, model).then(function (dataOutput) {
            deferred.resolve({ status: true, data: dataOutput.data.result });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _getDetail = function (userProfileId) {
        var deferred = $q.defer();

        var url = constants.user.detail;
        url = url.format(userProfileId);

        apiHelper.get(url).then(function (dataOutput) {
            deferred.resolve({ status: true, data: dataOutput.data.result });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _getRoleEdit = function (userProfileId) {
        var deferred = $q.defer();

        var url = constants.user.getRoleEdit;
        url = url.format(userProfileId);

        apiHelper.get(url).then(function (dataOutput) {
            deferred.resolve({ status: true, data: dataOutput.data.result });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _manageRole = function (userProfileId, listRoleIds) {
        var deferred = $q.defer();

        var url = constants.user.manageRole;

        url = url.format(userProfileId);

        apiHelper.put(url, listRoleIds).then(function (dataOutput) {
            deferred.resolve({ status: true, data: dataOutput.data.result });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _manageRoles = function (model) {
        var deferred = $q.defer();

        apiHelper.put(constants.user.manageRoles, model).then(function (dataOutput) {
            deferred.resolve({ status: true, data: dataOutput.data.result });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _getMyProfile = function () {
        var deferred = $q.defer();

        apiHelper.get(constants.user.myProfile).then(function (dataOutput) {
            deferred.resolve({ status: true, data: dataOutput.data.result });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _updateMyProfile = function (model) {
        var deferred = $q.defer();

        apiHelper.put(constants.user.updateMyProfile, model).then(function (dataOutput) {
            deferred.resolve({ status: true, data: dataOutput.data.result });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _getProfile = function (userProfileId) {
        var deferred = $q.defer();

        var url = constants.user.profile;
        url = url.format(userProfileId);

        apiHelper.get(url).then(function (dataOutput) {
            deferred.resolve({ status: true, data: dataOutput.data.result });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    userServiceFactory.getProfile = _getProfile;
    userServiceFactory.getMyProfile = _getMyProfile;
    userServiceFactory.updateMyProfile = _updateMyProfile;
    userServiceFactory.manageRoles = _manageRoles;
    userServiceFactory.manageRole = _manageRole;
    userServiceFactory.getRoleEdit = _getRoleEdit;
    userServiceFactory.getDetail = _getDetail;
    userServiceFactory.deactivateListUser = _deactivateListUser;
    userServiceFactory.edit = _edit;
    userServiceFactory.create = _create;
    userServiceFactory.adFindUser = _adFindUser;
    userServiceFactory.deactivateUser = _deactivateUser;
    userServiceFactory.activeUser = _activeUser;
    userServiceFactory.getListUser = _getListUser;

    return userServiceFactory;

}]);