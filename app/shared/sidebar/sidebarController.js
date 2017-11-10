app.controller('sidebarController', ['$rootScope', '$scope', '$state', '$location', '$timeout', 'accessModule', 'constants', function ($rootScope, $scope, $state, $location, $timeout, accessModule, constants) {
    var currentUser = $rootScope.$app.userProfile;
    
    $scope.isAdmin = currentUser.isAdmin || currentUser.isAsmAdmin;
    $scope.asmApplicant = checkUserHasRoleKey(currentUser.rolesKeyString, constants.role.roleKeys.asmApplicant);
    
    function activMenu(menu) {
        if (menu === 'homeId') {
            $("#homeId").addClass('active');
        } else {
            $("#cssmenu ul li ul li[id='" + menu + "']").addClass('active');
            $("#cssmenu ul li ul li[id='" + menu + "']").parent().parent().addClass('active');
        }

    }

    function onload() {
        var stateName = $state.current.name;
        switch (stateName) {
            case constants.state.sceDashBoard:
                activMenu("sceDashBoardId");
                $rootScope.bigModuleTitle = "Safety Critical Equipment (SCE)";
                break;
            case constants.state.scenew:
                activMenu("sceNewId");
                $rootScope.bigModuleTitle = "Safety Critical Equipment (SCE)";
                break;
            case constants.state.scelist:
                activMenu("sceAllId");
                $rootScope.bigModuleTitle = "Safety Critical Equipment (SCE)";
                break;
            case constants.state.raList:
                activMenu("raAllId");
                $rootScope.bigModuleTitle = "Safety Critical Equipment (SCE)";
                break;
            case constants.state.manageUser:
                activMenu("manageUserId");
                $rootScope.bigModuleTitle = "ADMIN";
                break;
            case constants.state.manageMessage:
                activMenu("manageUserId");
                $rootScope.bigModuleTitle = "ADMIN";
                break;
            case constants.state.asmList:
                activMenu("asmAllId");
                $rootScope.bigModuleTitle = "Alarm Shelving Application (ASM)";
                break;
            case constants.state.asmNewState:
                    activMenu("asmNewdId");
                    $rootScope.bigModuleTitle = "Alarm Shelving Application (ASM)";                               
                break;
            case constants.state.asmDashBoard:
                activMenu("asmDashBoardId");
                $rootScope.bigModuleTitle = "Alarm Shelving Application (ASM)";
                break;
            case constants.state.diList:
                activMenu("diAllId");
                $rootScope.bigModuleTitle = "Daily Instruction (DI)";
                break;
            case constants.state.diNew:
                activMenu("diNewId");
                $rootScope.bigModuleTitle = "Daily Instruction (DI)";
                break;
            case constants.state.diDashBoard:
                activMenu("diDashBoardId");
                $rootScope.bigModuleTitle = "Daily Instruction (DI)";
                break;
            case constants.state.default:
                activMenu("homeId");
                break;
        }
    };

    function removeMenu(menu) {
        $("#cssmenu ul li ul li[data-module='" + menu + "']").removeClass("active");
        $("#cssmenu ul li a[data-module='" + menu + "']").removeClass("active");
    };
    $(window).ready(function () {
        onload();
    });
    $scope.goPage = function (menu) {

        switch (menu) {
            case constants.menu.sceDashBoard:
                $state.go(constants.state.sceDashBoard);
                $rootScope.bigModuleTitle = "Safety Critical Equipment (SCE)";
                break;
            case constants.menu.sceNew:
                $state.go(constants.state.scenew);
                $rootScope.bigModuleTitle = "Safety Critical Equipment (SCE)";
                break;
            case constants.menu.sceList:
                $state.go(constants.state.scelist);
                $rootScope.bigModuleTitle = "Safety Critical Equipment (SCE)";
                break;
            case constants.menu.manageUser:
                $state.go(constants.state.manageUser);
                $rootScope.bigModuleTitle = "ADMIN";
                break;
            case constants.menu.manageMessage:
                $state.go(constants.state.adminMessage);
                $rootScope.bigModuleTitle = "ADMIN";
                break;
            case constants.menu.raList:
                $state.go(constants.state.raList);
                $rootScope.bigModuleTitle = "Safety Critical Equipment (SCE)";
                break;
            case constants.menu.asmList:
                $state.go(constants.state.asmlist);
                $rootScope.bigModuleTitle = "Alarm Shelving Application (ASM)";
                break;
            case constants.menu.asmNew:
                    $state.go(constants.state.asmNewState);
                    $rootScope.bigModuleTitle = "Alarm Shelving Application (ASM)";
                break;
            case constants.menu.asmDashBoard:
                $state.go(constants.state.asmDashBoard);
                $rootScope.bigModuleTitle = "Alarm Shelving Application (ASM)";
                break;
            case constants.menu.diList:
                $state.go(constants.state.diList);
                $rootScope.bigModuleTitle = "Daily Instruction (DI)";
                break;
            case constants.menu.diNew:
                $state.go(constants.state.diNew);
                $rootScope.bigModuleTitle = "Daily Instruction (DI)";
                break;
            case constants.menu.diDashBoard:
                $state.go(constants.state.diDashBoard);
                $rootScope.bigModuleTitle = "Daily Instruction (DI)";
                break;
            case constants.menu.rotfDashboard:
                $state.go(constants.state.rotfDashboardOverview);
                $rootScope.bigModuleTitle = "Refinery Of The Future (ROTF)";
                break;
        }

        $("#homeId").removeClass("active");
        $("#cssmenu ul li ul li").removeClass("active");
        $("#cssmenu ul li").removeClass("active");
        $("#cssmenu ul li ul > li[data-module='" + menu + "']").addClass("active");
        $("#cssmenu ul li ul  li[data-module='" + menu + "']").parent().parent().addClass("active");
        $('#MainPanel').scrollTop(0);
    };
}]);