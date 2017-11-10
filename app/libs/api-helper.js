var apiHelper = angular.module('apiHelper', []);

apiHelper.factory("apiHelper", ['$http', '$q', '$window', '$state', '$location', 'appSettings', 'constants', function ($http, $q, $window, $state, $location, appSettings, constants) {

    var apiHelperFactory = {};

    var _get = function (url, dataJson, headers) {

        if (_isTimeOut(url)) {
            _returnLogin();
        }

        var options = {
            url: url,
            method: 'GET',
            data: dataJson === null || dataJson === undefined ? null : JSON.stringify(dataJson),
            params: {
                token: _getSecret()
            }
        };

        if (headers !== null && headers !== undefined) {
            options = {
                url: url,
                method: 'GET',
                data: dataJson === null || dataJson === undefined ? null : JSON.stringify(dataJson),
                params: {
                    token: _getSecret()
                },
                headers: headers
            };
        }

        var deferred = $q.defer();

        $http(options).then(function (response) {
            if (response !== null && response !== undefined && response.data !== null && response.data.statusCode !== null && response.data.statusCode === 201) {
                deferred.resolve(response);
            }
            else {
                if (response !== null && response !== undefined && response.data !== null && response.data !== undefined && (response.data.statusCode === null || response.data.statusCode === undefined)) {
                    deferred.resolve(response);
                }
                else {
                    deferred.reject({ status: false, message: '' });
                }
            }
        }, function (error) {
            if (error.data !== null && error.data.statusCode === 190 && _islogined()) {
                _returnLogin();
            }
            else {
                deferred.reject(_getError(error));
            }
        });

        return deferred.promise;
    };

    var _post = function (url, dataJson, headers) {

        if (_isTimeOut(url)) {
            _returnLogin();
        }

        var options = {
            url: url,
            method: 'POST',
            data: dataJson === null || dataJson === undefined ? null : JSON.stringify(dataJson),
            params: {
                token: _getSecret()
            },
            headers: {
                'Content-type': 'application/json;charset=utf-8'
            }
        };

        if (headers !== null && headers !== undefined) {
            options = {
                url: url,
                method: 'POST',
                data: dataJson === null || dataJson === undefined ? null : JSON.stringify(dataJson),
                params: {
                    token: _getSecret()
                },
                headers: headers
            };
        }

        var deferred = $q.defer();

        $http(options).then(function (response) {
            if (response !== null && response !== undefined && response.data.statusCode !== null && response.data.statusCode !== undefined && response.data.statusCode === 201) {
                deferred.resolve(response);
            }
            else {
                if (response !== null && response !== undefined && (response.data.statusCode === null || response.data.statusCode === undefined)) {
                    deferred.resolve(response);
                }
                else {
                    deferred.reject({ status: false, message: response.data.message });
                }
            }
        }, function (error) {
            if (error.data !== null && error.data !== undefined && error.data.statusCode === 190 && _islogined()) {
                _returnLogin();
            }
            else {
                deferred.reject(_getError(error));
            }
        });

        return deferred.promise;
    };

    var _put = function (url, dataJson, headers) {

        if (_isTimeOut(url)) {
            _returnLogin();
        }

        var options = {
            url: url,
            method: 'PUT',
            data: dataJson === null || dataJson === undefined ? null : JSON.stringify(dataJson),
            params: {
                token: _getSecret()
            },
            headers: {
                'Content-type': 'application/json;charset=utf-8'
            }
        };

        if (headers !== null && headers !== undefined) {
            options = {
                url: url,
                method: 'PUT',
                data: dataJson === null || dataJson === undefined ? null : JSON.stringify(dataJson),
                params: {
                    token: _getSecret()
                },
                headers: headers
            };
        }

        var deferred = $q.defer();

        $http(options).then(function (response) {
            if (response !== null && response !== undefined && response.data.statusCode !== null && response.data.statusCode !== undefined && response.data.statusCode === 201) {
                deferred.resolve(response);
            }
            else {
                if (response !== null && response !== undefined && (response.data.statusCode === null || response.data.statusCode === undefined)) {
                    deferred.resolve(response);
                }
                else {
                    deferred.reject({ status: false, message: response.data.message });
                }
            }
        }, function (error) {
            if (error.data !== null && error.data !== undefined && error.data.statusCode === 190 && _islogined()) {
                _returnLogin();
            }
            else {
                deferred.reject(_getError(error));
            }
        });

        return deferred.promise;
    };

    var _delete = function (url, dataJson, headers) {

        if (_isTimeOut(url)) {
            _returnLogin();
        }

        var options = {
            url: url,
            method: 'DELETE',
            data: dataJson === null || dataJson === undefined ? null : JSON.stringify(dataJson),
            params: {
                token: _getSecret()
            },
            headers: {
                'Content-type': 'application/json;charset=utf-8'
            }
        };

        if (headers !== null && headers !== undefined) {
            options = {
                url: url,
                method: 'DELETE',
                data: dataJson === null || dataJson === undefined ? null : JSON.stringify(dataJson),
                params: {
                    token: _getSecret()
                },
                headers: headers
            };
        }

        var deferred = $q.defer();

        $http(options).then(function (response) {
            if (response !== null && response !== undefined && response.data.statusCode !== null && response.data.statusCode !== undefined && response.data.statusCode === 201) {
                deferred.resolve(response);
            }
            else {
                if (response !== null && response !== undefined && (response.data.statusCode === null || response.data.statusCode === undefined)) {
                    deferred.resolve(response);
                }
                else {
                    deferred.reject({ status: false, message: response.data.message });
                }
            }
        }, function (error) {
            if (error.data !== null && error.data !== undefined && error.data.statusCode === 190 && _islogined()) {
                _returnLogin();
            }
            else {
                deferred.reject(_getError(error));
            }
        });

        return deferred.promise;
    };

    var _getError = function (error) {

        var status = error.status;

        if (error.data !== null && error.data.statusCode !== null && error.data.statusCode !== undefined) {
            return { status: false, statusCode: error.data.statusCode, message: error.data.message };
        }

        if (error.data !== null && error.data.errorCode !== null && error.data.errorCode !== undefined) {
            return { status: false, statusCode: error.data.statusCode, message: error.data.errorMessage };
        }

        switch (status) {
            default:
                return { status: false, statusCode: -1, message: constants.messages.networkError };
        }
    };

    var _getSecret = function () {
        return $window.localStorage.getItem(constants.localStorage.userSecret);
    };

    var _islogined = function () {
        return $window.localStorage.getItem(constants.localStorage.logined) === null || $window.localStorage.getItem(constants.localStorage.logined) === undefined ? false : $window.localStorage.getItem(constants.localStorage.logined) === "true";
    };

    var _isTimeOut = function (url) {

        if (url === constants.singleSignOn.login || url === constants.loginApp.login) {
            return false;
        }

        var timeNow = new Date().getTime();

        var dateTimeOld = $window.localStorage.getItem(constants.localStorage.timeOld);

        var timeOld = 0;

        if (dateTimeOld === null || dateTimeOld === undefined || dateTimeOld === "") {
            $window.localStorage.setItem(constants.localStorage.timeOld, timeNow);
            return false;
        }
        else {
            timeOld = parseInt(dateTimeOld);
            if (timeOld === "NaN" || timeOld === "") {
                $window.localStorage.setItem(constants.localStorage.timeOld, timeNow);
                return false;
            }
        }

        var seconds = (timeNow - timeOld) / 1000;
        var hours = Math.floor(seconds / 3600);
        var minutes = Math.floor((seconds - hours * 3600) / 60);

        $window.localStorage.setItem(constants.localStorage.timeOld, timeNow);

        if (minutes > appSettings.timeOut) {
            $window.localStorage.removeItem(constants.localStorage.userProfile);
            $window.localStorage.removeItem(constants.localStorage.userSecret);
            $window.localStorage.setItem(constants.localStorage.logined, false);
            $window.localStorage.setItem(constants.localStorage.accessToken, "");
            return true;
        }
        else {
            return false;
        }

    };

    var _returnLogin = function () {
        if (($location.path() + '').toLowerCase() !== "/login" && ($location.path() + '').toLowerCase() !== "/download/app") {
            $window.location.href = "/login?returnUrl=" + $location.path();
        } else {
            $window.location.href = "/login";
        }
        return;
    };

    var _includeToken = function (url) {
        if (url.indexOf('?') > -1) {
            return url + "&token=" + _getSecret();
        } else {
            return url + "?token=" + _getSecret();
        }
    }
    apiHelperFactory.get = _get;
    apiHelperFactory.post = _post;
    apiHelperFactory.delete = _delete;
    apiHelperFactory.put = _put;
    apiHelperFactory.includeToken = _includeToken;

    return apiHelperFactory;
}]);