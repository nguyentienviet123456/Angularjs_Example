app.factory('roleService', ['$q', 'apiHelper', 'constants', function ($q, apiHelper, constants) {

    var roleServiceFactory = {};

    var _getAllRoleIncludeNumberUser = function () {
        var deferred = $q.defer();

        apiHelper.get(constants.role.getAllRoleIncludeNumberUser).then(function (dataOutput) {
            deferred.resolve({ status: true, data: dataOutput.data.result });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _getRolesIncludeModule = function () {
        var deferred = $q.defer();

        apiHelper.get(constants.role.getRolesIncludeModule).then(function (dataOutput) {
            deferred.resolve({ status: true, data: dataOutput.data.result });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    roleServiceFactory.getAllRoleIncludeNumberUser = _getAllRoleIncludeNumberUser;
    roleServiceFactory.getRolesIncludeModule = _getRolesIncludeModule;

    return roleServiceFactory;

}]);