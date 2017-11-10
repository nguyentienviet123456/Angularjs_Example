app.controller('statusLogController', ['$rootScope', '$window', '$state', '$stateParams', '$scope', '$location', 'constants', 'sceServices', 'raServices', 'asmServices',
    function ($rootScope, $window, $state, $stateParams, $scope, $location, constants, sceServices, raServices, asmServices) {
        // Set page title
        $rootScope.$app.title = constants.titlePage.statusLog;
        // Item number model
        $scope.itemNumber = "";
        $scope.goToDetail = "";

        // Initializing grid
        $scope.statusLog = {
            dataSource: {
                transport: {
                    read: function (options) {
                        if ($state.current.name === constants.state.sceStatusLog) {
                            sceServices.getSceLog({
                                itemId: $stateParams.sceId,
                                skip: (options.data.page - 1) * options.data.pageSize,
                                take: options.data.take
                            }).then(function (response) {
                                $scope.itemNumber = 'Status log SCE ';
                                if (response.data !== null && response.data !== undefined) {
                                    options.success(response.data);
                                    if (response.data.length > 0) {
                                        $scope.itemNumber = 'Status log SCE ' + response.data[0].itemNumber;
                                        $scope.goToDetail = "goToSce()";
                                    }
                                } else {
                                    options.success([]);
                                }
                                $rootScope.isLoading = false;
                            }, function (error) {
                                options.error([]);
                                utils.error.showErrorGet(error);
                                $rootScope.isLoading = false;
                            });
                        };
                        if ($state.current.name === constants.state.raStatusLog) {
                            raServices.getRaLog({
                                itemId: $stateParams.raId,
                                skip: (options.data.page - 1) * options.data.pageSize,
                                take: options.data.take
                            }).then(function (response) {
                                $scope.itemNumber = 'Status log RA ';
                                if (response.data !== null && response.data !== undefined) {
                                    options.success(response.data);
                                    if (response.data.length > 0) {
                                        $scope.itemNumber = 'Status log RA ' + response.data[0].itemNumber;
                                        $scope.goToDetail = "goToRa()";
                                    }
                                } else {
                                    options.success([]);
                                }
                                $rootScope.isLoading = false;
                            }, function (error) {
                                options.error([]);
                                utils.error.showErrorGet(error);
                                $rootScope.isLoading = false;
                            });
                        };

                        if ($state.current.name === constants.state.asmStatusLog) {
                            asmServices.getAsmLog({
                                itemId: $stateParams.alarmId,
                                skip: (options.data.page - 1) * options.data.pageSize,
                                take: options.data.take
                            }).then(function (response) {
                                $scope.itemNumber = 'Status log ASM ';
                                if (response.data !== null && response.data !== undefined) {
                                    options.success(response.data);
                                    if (response.data.length > 0) {
                                        $scope.itemNumber = 'Status log ASM ' + response.data[0].itemNumber;
                                        $scope.goToDetail = "#";
                                    }
                                } else {
                                    options.success([]);
                                }
                                $rootScope.isLoading = false;
                            }, function (error) {
                                options.error([]);
                                utils.error.showErrorGet(error);
                                $rootScope.isLoading = false;
                            });
                        };


                    }
                },
                schema: {
                    model: {
                        fields: {
                            itemId: { type: "string" },
                            itemNumber: { type: "string" },
                            userName: { type: "string" },
                            assignedUserName: { type: "string" },
                            message: { type: "string" },
                            createdDate: { type: "date" }
                        }
                    },
                    total: function (response) {
                        return response === null || response === undefined || response.length === 0 ? 0 : response[0].total;
                    }
                },
                pageSize: 20,
                serverPaging: true,
                serverFiltering: false,
                serverSorting: false
            },
            scrollable: false,
            sortable: false,
            pageable: {
                pageSizes: true,
                buttonCount: 5
            },
            columns: [{
                field: "message",
                title: "Status Log",
                width: "65%",
                headerAttributes: {
                    style: "line-height: 200%; text-align: left; font-size:13px; font-weight:bold; background-color: white; border: none; color: #898989;"
                },
                template: function (dataItem) {
                    var result = '';
                    if (dataItem.message == '' || dataItem.message == null) {
                        console.log("message have no content");
                    }
                    if (dataItem.assignedUserName == null && dataItem.comment == null)
                        result = kendo.format(dataItem.message, "<a href data-ng-click='" + $scope.goToDetail + "'><strong>" + dataItem.userName + "</strong></a>");
                    if (dataItem.assignedUserName == null && dataItem.comment != null)
                        result = kendo.format(dataItem.message, "<a href data-ng-click='" + $scope.goToDetail + "'><strong>" + dataItem.userName + "</strong></a>", dataItem.comment);
                    if (dataItem.assignedUserName != null)
                        result = kendo.format(dataItem.message, "<a href data-ng-click='" + $scope.goToDetail + "'><strong>" + dataItem.userName + "</strong></a>", "<a href data-ng-click='" + $scope.goToDetail + "'><strong>" + dataItem.assignedUserName + "</strong></a>");
                    return result;
                }
            }, {
                field: "createdDate",
                title: "Date & Time",
                width: "35%",
                headerAttributes: {
                    style: "line-height: 200%; text-align: left; font-size:13px; font-weight:bold; background-color: white; border: none; color: #898989;"
                },
                template: function (dataItem) {
                    return kendo.toString(new Date(dataItem.createdDate), "dd MMM yyyy at h:mm tt");
                }
            }],
            noRecords: true,
            messages: {
                noRecords: "There is no data on current page"
            }
        };

        // Go to RA detail page
        $scope.goToRa = function () {
            $state.go(constants.state.raDetail, { sceId: $stateParams.sceId, raId: $stateParams.raId });
        }
        // Go to SCE detail page
        $scope.goToSce = function () {
            $state.go(constants.state.sceDetail, { sceId: $stateParams.sceId });
        }
        // Go to ASM detail page
        //$scope.goToAsm = function () {
        //    $state.go(constants.state.asmDetail, { alarmId: $stateParams.alarmId });
        //}
    }
]);