app.controller('rotfDashboardOverviewController',
    ['$rootScope', '$window', '$state', '$stateParams', '$scope', '$location', 'authService', 'appSettings',
        'constants', 'rotfServices',
        function($rootScope, $window, $state, $stateParams, $scope, $location, authService, appSettings, constants, rotfServices) {

            $scope.areasList = {};
            $scope.OEEList = {};
            
            loadOEEList();
            loadAreasList();

            $scope.onDrop = function (srcList, srcIndex, targetList, targetIndex) {
                // Copy the item from source to target.
                targetList.splice(targetIndex, 0, srcList[srcIndex]);
                // Remove the item from the source, possibly correcting the index first.
                // We must do this immediately, otherwise ng-repeat complains about duplicates.
                if (srcList === targetList && targetIndex <= srcIndex) srcIndex++;
                srcList.splice(srcIndex, 1);
                // By returning true from dnd-drop we signalize we already inserted the item.
                return true;
            };

            $scope.onSelected = function (list, index) {
                var item = list[index];
                console.log('Selected on item:' + item);

                // PUT logic go to operation page by area id here.
            }

            function loadOEEList() {
                rotfServices.getOEE().then(function (response) {
                    $scope.OEEList = response.data;
                }, function (error) {
                    utils.error.showErrorGet(error);
                });
            }

            function loadAreasList() {
                $scope.areasList =
                    [
                        {
                            areaName: '1A',
                            trophy: 2, // 1: gold, 2: silver, 3: Bronze
                            numOfGoodDayStreak: 48, // 
                            listOfUnits: [
                                {
                                    type: 'throughput_taget', // throughput_taget, pressure, on_off, percentage, number, TPD, MDW
                                    name: 'CRU-2',
                                    value: { throughput: 157.14, target: 156 }
                                },
                                {
                                    type: 'throughput_taget', // throughput_taget, pressure, on_off, percentage, number, TPD, MDW
                                    name: 'ISOM',
                                    value: { throughput: 157.14, target: 156 }
                                },
                                {
                                    type: 'throughput_taget', // throughput_taget, pressure, on_off, percentage, number, TPD, MDW
                                    name: 'DHT',
                                    value: { throughput: 153.14, target: 156 }
                                }
                            ]
                        },
                        // area
                        {
                            areaName: '1B',
                            trophy: 1, // 1: gold, 2: silver, 3: Bronze
                            numOfGoodDayStreak: 154, // 
                            listOfUnits: [
                                {
                                    type: 'throughput_taget', // throughput_taget, pressure, on_off, percentage, number, TPD, MDW
                                    name: 'CRU-1',
                                    value: { throughput: 157.14, target: 156 }
                                }
                            ]
                        },
                        // area
                        {
                            areaName: '2A',
                            trophy: 0, // 1: gold, 2: silver, 3: Bronze
                            numOfGoodDayStreak: 0, // 
                            listOfUnits: [
                                {
                                    type: 'throughput_taget', // throughput_taget, pressure, on_off, percentage, number, TPD, MDW
                                    name: 'CDU-2',
                                    value: { throughput: 157.14, target: 156 }
                                }
                            ]
                        },
                        // area
                        {
                            areaName: '2B',
                            trophy: 0, // 1: gold, 2: silver, 3: Bronze
                            numOfGoodDayStreak: 0, // 
                            listOfUnits: [
                                {
                                    type: 'throughput_taget', // throughput_taget, pressure, on_off, percentage, number, TPD, MDW
                                    name: 'CRU-2',
                                    value: { throughput: 157.14, target: 156 }
                                },
                                {
                                    type: 'throughput_taget', // throughput_taget, pressure, on_off, percentage, number, TPD, MDW
                                    name: 'ISOM',
                                    value: { throughput: 157.14, target: 156 }
                                },
                                {
                                    type: 'throughput_taget', // throughput_taget, pressure, on_off, percentage, number, TPD, MDW
                                    name: 'DHT',
                                    value: { throughput: 153.14, target: 156 }
                                }
                            ]
                        },
                        // area
                        {
                            areaName: '3A',
                            trophy: 0, // 0: none, 1: gold, 2: silver, 3: Bronze
                            numOfGoodDayStreak: 3, // 
                            listOfUnits: [
                                {
                                    type: 'throughput_taget', // throughput_taget, pressure, on_off, percentage, number, TPD, MDW
                                    name: 'HCK',
                                    value: { throughput: 153.14, target: 156 }
                                }
                            ]
                        },
                        // area
                        {
                            areaName: '3B',
                            trophy: 3, // 0: none, 1: gold, 2: silver, 3: Bronze
                            numOfGoodDayStreak: 14, // 
                            listOfUnits: [
                                {
                                    type: 'throughput_taget', // throughput_taget, pressure, on_off, percentage, number, TPD, MDW
                                    name: 'DCU',
                                    value: { throughput: 157.14, target: 156 }
                                }
                            ]
                        },
                        // area
                        {
                            areaName: '4AB',
                            trophy: 0, // 0: none, 1: gold, 2: silver, 3: Bronze
                            numOfGoodDayStreak: 20, // 
                            listOfUnits: [
                                {
                                    type: 'percentage', // throughput_taget, pressure, on_off, percentage, number, TPD, MDW
                                    name: 'B2S',
                                    value: 60
                                },
                                {
                                    type: 'number', // throughput_taget, pressure, on_off, percentage, number, TPD, MDW
                                    name: 'BERTH',
                                    value: 6
                                },
                                {
                                    type: 'percentage', // throughput_taget, pressure, on_off, percentage, number, TPD, MDW
                                    name: 'Blender',
                                    value: 90
                                }
                            ]
                        },
                        {
                            areaName: '4C',
                            trophy: 0, // 0: none, 1: gold, 2: silver, 3: Bronze
                            numOfGoodDayStreak: 12, // 
                            listOfUnits: [
                                {
                                    type: 'number', // throughput_taget, pressure, on_off, percentage, number, TPD, MDW
                                    name: 'RIB-1',
                                    value: 18.5
                                },
                                {
                                    type: 'on_off', // throughput_taget, pressure, on_off, percentage, number, TPD, MDW
                                    name: 'T6647',
                                    value: 'ON'
                                },
                                {
                                    type: 'on_off', // throughput_taget, pressure, on_off, percentage, number, TPD, MDW
                                    name: 'T6649',
                                    value: 'OFF'
                                },
                            ]
                        },
                        {
                            areaName: '5AC',
                            trophy: 0, // 0: none, 1: gold, 2: silver, 3: Bronze
                            numOfGoodDayStreak: 42, // 
                            listOfUnits: [
                                {
                                    type: 'TPD', // throughput_taget, pressure, on_off, percentage, number, TPD, MDW
                                    name: 'STEAM',
                                    value: { actual: 157.14, target: 156 }
                                },
                                {
                                    type: 'MDW', // throughput_taget, pressure, on_off, percentage, number, TPD, MDW
                                    name: 'BERTH',
                                    value: { actual: 157.14, target: 156 }
                                },
                                {
                                    type: 'pressure', // throughput_taget, pressure, on_off, percentage, number, TPD, MDW
                                    name: 'NG',
                                    value: { actual: 157.14, target: 156 }
                                }
                            ]
                        },
                        {
                            areaName: '5B',
                            trophy: 0, // 0: none, 1: gold, 2: silver, 3: Bronze
                            numOfGoodDayStreak: 12, // 
                            listOfUnits: [
                                {
                                    type: 'throughput_taget', // throughput_taget, pressure, on_off, percentage, number, TPD, MDW
                                    name: 'SRU-1',
                                    value: { actual: 157.14, target: 156 }
                                },
                                {
                                    type: 'throughput_taget', // throughput_taget, pressure, on_off, percentage, number, TPD
                                    name: 'SRU-2',
                                    value: { actual: 157.14, target: 156 }
                                },
                                {
                                    type: 'pressure', // throughput_taget, pressure, on_off, percentage, number, TPD, MDW
                                    name: 'NG',
                                    value: { actual: 157.14, target: 156 }
                                }
                            ]
                        },
                        {
                            areaName: '6',
                            trophy: 0, // 0: none, 1: gold, 2: silver, 3: Bronze
                            numOfGoodDayStreak: 42, // 
                            listOfUnits: [
                                {
                                    type: 'throughput_taget', // throughput_taget, pressure, on_off, percentage, number, TPD, MDW, TPD
                                    name: 'VDU-1',
                                    value: { actual: 157.14, target: 156 }
                                },
                                {
                                    type: 'throughput_taget', // throughput_taget, pressure, on_off, percentage, number, TPD, MDW, MDW
                                    name: 'POWER',
                                    value: { actual: 157.14, target: 156 }
                                }
                            ]
                        },
                    ];


            }
        }]);