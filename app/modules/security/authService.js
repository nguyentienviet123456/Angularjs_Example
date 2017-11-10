app.factory('authService', ['apiHelper', '$window', '$location', '$q', 'appSettings', 'constants', 'utilsService', function (apiHelper, $window, $location, $q, appSettings, constants, utilsService) {

    var authServiceFactory = {};

    var loginData = {
        "id": constants.singleSignOn.id,
        "userId": "",
        "password": "",
        "domain": "",
        "applicationId": constants.singleSignOn.applicationId,
        "client": {
            "ip": "",
            "hostname": $location.host(),
            "userAgent": navigator.userAgent
        }
    };

    var _login = function (data) {

        var deferred = $q.defer();
        loginData.userId = data.userId;
        loginData.password = data.password;
        loginData.domain = data.domain;

        if (constants.singleSignOn.disabled === true) {

            $window.localStorage.setItem(constants.localStorage.accessToken, loginData.userId);
            loginInApp(loginData.userId).then(function (dataoutput) {

                var userProfile = dataoutput.data.result.userProfile;
                userProfile.moduleAccess = dataoutput.data.result.moduleAccess;

                deferred.resolve({ status: true, secret: dataoutput.data.result.secret, userProfile: userProfile });
            }, function (error) {
                deferred.reject(error);
            });
        }
        else {

            var callLogin = function () {
                apiHelper.post(constants.singleSignOn.login, loginData).then(function (response) {

                    if (response !== null && response.data !== null && response.data.accessToken !== "00000000-0000-0000-0000-000000000000") {
                        $window.localStorage.setItem(constants.localStorage.accessToken, response.data.accessToken);
                        loginInApp(response.data.accessToken).then(function (dataoutput) {
                            var userProfile = dataoutput.data.result.userProfile;
                            userProfile.moduleAccess = dataoutput.data.result.moduleAccess;
                            deferred.resolve({ status: true, secret: dataoutput.data.result.secret, userProfile: userProfile });
                        }, function (error) {
                            deferred.reject(error);
                        });
                    }
                    else {
                        deferred.reject({ status: false, message: constants.messages.invalidEnterprise });
                    }
                }, function (error) {
                    deferred.reject(error);
                });
            };

            utilsService.getIp().then(function (response) {
                loginData.client.ip = response.data;
                callLogin();
            }, function () {
                loginData.client.ip = "";
                callLogin();
            });
        }

        return deferred.promise;
    };

    var loginInApp = function (accessToken) {
        var deferred = $q.defer();

        apiHelper.post(constants.loginApp.login, { tokenSingleSignOn: accessToken, client: appSettings.client }).then(function (response) {
            deferred.resolve(response);
        },
        function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var _signOn = function (accessToken) {
        var deferred = $q.defer();

        if (constants.singleSignOn.disabled === true) {
            loginInApp(accessToken).then(function (dataoutput) {
                if (dataoutput !== null && dataoutput !== undefined && dataoutput.data.statusCode === 201) {

                    var userProfile = dataoutput.data.result.userProfile;
                    userProfile.moduleAccess = dataoutput.data.result.moduleAccess;

                    $window.localStorage.setItem(constants.localStorage.userSecret, dataoutput.data.result.secret);
                    $window.localStorage.setItem(constants.localStorage.userProfile, JSON.stringify(userProfile));
                    deferred.resolve({ status: true, secret: dataoutput.data.result.secret });
                }
                else {
                    $window.localStorage.removeItem(constants.localStorage.userProfile);
                    $window.localStorage.removeItem(constants.localStorage.userSecret);
                    deferred.resolve({ status: false });
                }
            }, function (error) {
                deferred.reject(error);
            });
        }
        else {
            apiHelper.get(constants.singleSignOn.signOn, null, { 'Access-Token': accessToken }).then(function (response) {
                var username = response === null || response === undefined || response.data === null || response.data === undefined ? null : response.data.username;
                if (username !== null && username !== "") {
                    loginInApp(accessToken).then(function (dataoutput) {
                        var userProfile = dataoutput.data.result.userProfile;
                        userProfile.moduleAccess = dataoutput.data.result.moduleAccess;

                        $window.localStorage.setItem(constants.localStorage.userSecret, dataoutput.data.result.secret);
                        $window.localStorage.setItem(constants.localStorage.userProfile, JSON.stringify(userProfile));
                        deferred.resolve({ status: true, secret: dataoutput.data.result.secret });
                    }, function (error) {
                        $window.localStorage.removeItem(constants.localStorage.userProfile);
                        $window.localStorage.removeItem(constants.localStorage.userSecret);
                        deferred.reject(error);
                    });
                }
                else {
                    deferred.resolve({ status: false });
                }
            },
            function (error) {
                deferred.reject(error);
            });
        }

        return deferred.promise;
    };

    var _logoutSingleSignOn = function (accessToken) {
        var deferred = $q.defer();
        if (constants.singleSignOn.disabled !== true) {

            apiHelper.get(constants.singleSignOn.logout, null, { 'Access-Token': accessToken}).then(function (response) {
                deferred.resolve({ status: true, message: "" });
            }, function (error) {
                deferred.reject(error);
            });
        }
        else {
            deferred.resolve({ status: true, message: "" });
        }
        return deferred.promise;
    };

    authServiceFactory.login = _login;
    authServiceFactory.signOn = _signOn;
    authServiceFactory.logoutSingleSignOn = _logoutSingleSignOn;

    return authServiceFactory;
}]);