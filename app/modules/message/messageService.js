app.factory('messageService', ['apiHelper', '$q', 'constants', function (apiHelper, $q, constants) {

    var messageServiceFactory = {};

    var _getListMessageDashBoard = function (data) {

        var deferred = $q.defer();

        var url = constants.message.getListMessageDashBoard;
        url = url.format(data.moduleName, data.areaId, data.messageId, data.scroll);

        apiHelper.get(url).then(function (dataOutput) {
            deferred.resolve({ status: true, data: dataOutput.data.result });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _sendMessage = function (data) {

        var deferred = $q.defer();

        apiHelper.post(constants.message.create, data).then(function (dataOutput) {
            deferred.resolve({ status: true, data: dataOutput.data.result });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _getListOfArea = function () {
        var deferred = $q.defer();

        apiHelper.get(constants.message.getListOfArea).then(function (dataOutput) {
            deferred.resolve({ status: true, data: dataOutput.data.result });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _getListMessageAdmin = function (data) {

        var deferred = $q.defer();

        var url = constants.message.getListMessageAdmin;
        url = url.format(data.moduleId, data.areaId, data.messageId, data.keyWord, data.scroll);

        apiHelper.get(url).then(function (dataOutput) {
            deferred.resolve({ status: true, data: dataOutput.data.result });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _deleteMessages = function (arrayMessageId) {
        var deferred = $q.defer();

        apiHelper.delete(constants.message.deleteMessages, arrayMessageId).then(function (dataOutput) {
            deferred.resolve({ status: true, data: dataOutput.data.result });
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    messageServiceFactory.deleteMessages = _deleteMessages;
    messageServiceFactory.getListOfArea = _getListOfArea;
    messageServiceFactory.sendMessage = _sendMessage;
    messageServiceFactory.getListMessageAdmin = _getListMessageAdmin;
    messageServiceFactory.getListMessageDashBoard = _getListMessageDashBoard;

    return messageServiceFactory;
}]);