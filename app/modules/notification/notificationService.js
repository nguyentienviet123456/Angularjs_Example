app.factory('notificationService', ['apiHelper', '$q', 'constants', function (apiHelper, $q, constants) {

    var notificationServiceFactory = {};

    var _getTopNotification = function () {
        var deferred = $q.defer();
        apiHelper.post(constants.notification.getTopNotification).then(function (dataOutput) {
            deferred.resolve({ status: true, data: dataOutput.data.result });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _getListNotification = function (data) {
        var deferred = $q.defer();
        apiHelper.post(constants.notification.getListNotification, data).then(function (response) {
            // Need repair response.data.result for group
            var today = new Date();
            today.setHours(0, 0, 0, 0);
            var yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            if (response.data.result != undefined && response.data.result != null) {
                $.each(response.data.result, function (index, value) {
                    var createdDateTime = new Date(value.createdDateTime);
                    if (createdDateTime >= today) {
                        response.data.result[index]['groupField'] = "1_Today";
                    } else if (createdDateTime >= yesterday) {
                        response.data.result[index]['groupField'] = "2_Yesterday";
                    } else {
                        response.data.result[index]['groupField'] = "3_Date (earlier)";
                    }
                });
            }
            deferred.resolve({ status: true, data: response.data.result, statusCode: response.data.statusCode });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _countUnreadNotification = function () {
        var deferred = $q.defer();
        apiHelper.get(constants.notification.getCountUnreadNotification).then(function (dataOutput) {
            deferred.resolve({ status: true, data: dataOutput.data.result });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }

    var _countNotification = function () {
        var deferred = $q.defer();
        apiHelper.get(constants.notification.getCountNotification).then(function (dataOutput) {
            deferred.resolve({ status: true, data: dataOutput.data.result });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }

    // Start action
    var _markAsAllReadNotification = function () {
        var deferred = $q.defer();
        apiHelper.post(constants.notification.markAsAllReadNotification).then(function (dataOutput) {
            deferred.resolve({ status: true, data: dataOutput.data.result });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var _markAsReadNotification = function (notificationId) {
        var deferred = $q.defer();
        apiHelper.post(constants.notification.markAsReadNotification, { "notificationId": notificationId }).then(function (dataOutput) {
            deferred.resolve({ status: true, data: dataOutput.data.result, message: dataOutput.data.message });
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };
    // End action

    notificationServiceFactory.getTopNotification = _getTopNotification;
    notificationServiceFactory.getListNotification = _getListNotification;
    notificationServiceFactory.countUnreadNotification = _countUnreadNotification;
    notificationServiceFactory.countNotification = _countNotification;
    notificationServiceFactory.markAsAllReadNotification = _markAsAllReadNotification;
    notificationServiceFactory.markAsReadNotification = _markAsReadNotification;
    return notificationServiceFactory;
}]);