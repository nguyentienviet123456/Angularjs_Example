app.factory('accessModule', ['$window', '$rootScope', '$state', 'constants', function ($window, $rootScope, $state, constants) {

    var accessModuleFactory = {};

    var _checkAccess = function (e, stateName) {
        if (stateName !== constants.state.accessdenied) {

            $rootScope.$broadcast('activeMenu', stateName);

            var isAccess = true;
            switch (stateName) {
                case constants.state.scenew: {
                    isAccess = _checkAccessModule(constants.module.sce, constants.allowAccess.allowWrite);
                    if (!isAccess) {
                        e.preventDefault();
                        $state.go(constants.state.accessdenied);
                    }
                    break;
                }
                case constants.state.sceedit:
                case constants.state.sceupdaterequire:
                case constants.state.scereview:
                case constants.state.sceendorse:
                case constants.state.sceapprove:
                case constants.state.sceacknowledge:
                case constants.state.scelive:
                case constants.state.scenormalized:
                case constants.state.scedetail:
                case constants.state.scelist:
                case constants.state.reviewupdaterequire:
                case constants.state.sceDashBoard:
                    {
                        isAccess = _checkAccessModule(constants.module.sce, constants.allowAccess.allowRead);
                        if (!isAccess) {
                            e.preventDefault();
                            $state.go(constants.state.accessdenied);
                        }
                        break;
                    }
                case constants.state.newUser:
                case constants.state.manageUser:
                    {
                        isAccess = $rootScope.$app !== null && $rootScope.$app !== undefined && $rootScope.$app.userProfile.isAdmin === true;
                        if (!isAccess) {
                            e.preventDefault();
                            $state.go(constants.state.accessdenied);
                        }
                        break;
                    }
                case constants.state.adminMessage:
                    {
                        isAccess = $rootScope.$app !== null && $rootScope.$app !== undefined && $rootScope.$app.userProfile.isAdmin === true;
                        if (!isAccess) {
                            e.preventDefault();
                            $state.go(constants.state.accessdenied);
                        }
                        break;
                    }
                case constants.state.raNew:
                    {
                        isAccess = _checkAccessModule(constants.module.sce, constants.allowAccess.allowWrite);
                        if (!isAccess) {
                            e.preventDefault();
                            $state.go(constants.state.accessdenied);
                        }
                        break;
                    }
                case constants.state.raEdit:
                case constants.state.raUpdateRequired:
                case constants.state.raReview:
                case constants.state.raEndorse:
                case constants.state.raApprove:
                case constants.state.raInfo:
                case constants.state.raDetail:
                case constants.state.raList:
                case constants.state.raMOC:
                    {
                        isAccess = _checkAccessModule(constants.module.sce, constants.allowAccess.allowRead);
                        if (!isAccess) {
                            e.preventDefault();
                            $state.go(constants.state.accessdenied);
                        }
                        break;
                    }
                case constants.state.asmDashBoard:
                    {
                        isAccess = _checkAccessModule(constants.module.asm, constants.allowAccess.allowRead);
                        if (!isAccess) {
                            e.preventDefault();
                            $state.go(constants.state.accessdenied);
                        }
                        break;
                    }
                case constants.state.diDashBoard:
                    {
                        isAccess = _checkAccessModule(constants.module.di, constants.allowAccess.allowRead);
                        if (!isAccess) {
                            e.preventDefault();
                            $state.go(constants.state.accessdenied);
                        }
                        break;
                    }
            }
        }
    };

    var _checkAccessModule = function (module, allowAccess) {
        if ($rootScope.$app === null || $rootScope.$app === undefined || $rootScope.$app.userProfile === null || $rootScope.$app.userProfile === undefined || $rootScope.$app.userProfile.moduleAccess === null || $rootScope.$app.userProfile.moduleAccess === undefined) {
            return false;
        }

        var accessModule = $rootScope.$app.userProfile.moduleAccess;

        var getAccessModuleItem = {};

        switch (allowAccess) {
            case constants.allowAccess.allowRead:
                {
                    getAccessModuleItem = _.filter(accessModule, function (item) {
                        return item.module === module && item.allowRead === true;
                    });

                    if (getAccessModuleItem.length === 0) {
                        return false;
                    }
                    break;
                }
            case constants.allowAccess.allowWrite:
                {
                    if (module === constants.module.sce && $rootScope.$app !== null && $rootScope.$app !== undefined && $rootScope.$app.userProfile !== null && $rootScope.$app.userProfile !== undefined && !$rootScope.$app.userProfile.isAdmin && ("," + $rootScope.$app.userProfile.rolesKeyString + ",").indexOf(",1,") < 0) {
                        return false;
                    }

                    getAccessModuleItem = _.filter(accessModule, function (item) {
                        return item.module === module && item.allowWrite === true;
                    });

                    if (getAccessModuleItem.length === 0) {
                        return false;
                    }
                    break;
                }
            case constants.allowAccess.allowDelete:
                {
                    getAccessModuleItem = _.filter(accessModule, function (item) {
                        return item.module === module && item.allowDelete === true;
                    });

                    if (getAccessModuleItem.length === 0) {
                        return false;
                    }
                    break;
                }
        }

        return true;
    };

    accessModuleFactory.checkAccess = _checkAccess;
    accessModuleFactory.checkAccessModule = _checkAccessModule;

    return accessModuleFactory;
}]);