app.controller('diDucController',
    ['$rootScope', '$q', '$state', '$stateParams', '$scope', '$location', '$timeout', '$compile', 'constants', 'serviceHelper', 'diNewService',
        function ($rootScope, $q, $state, $stateParams, $scope, $location, $timeout, $compile, constants, serviceHelper, diNewService) {

            var tableIds = ['#hse', '#hazardous', '#operationRegister', '#productionPlanMode', '#ongoing'];

            // Define table
            var hse = $(tableIds[0]);
            var hazardous = $(tableIds[1]);
            var operationRegister = $(tableIds[2]);
            var productionPlan = $(tableIds[3]);
            var ongoing = $(tableIds[4]);

            var i = 0;

            // table data
            var hseData = [];
            var hazardousData = [];
            var operationRegisterData = [];
            var productionPlanData = [];
            var ongoingData = [];

            function getIndexById(data, id) {
                var idx,
                    l = data.length;

                for (var j = 0; j < l; j++) {
                    if (data[j].ProductID == id) {
                        return j;
                    }
                }
                return null;
            }
            //move addNew button to bottom
            function moveHeader(tableIds) {
                angular.forEach(tableIds, function (value, key) {
                    var tbl = $(value);
                    var toolBar = tbl.find('div.k-header.k-grid-toolbar').first();
                    var parentToolBar = toolBar.parent();
                    var childToolBar = toolBar.find('a').first();
                    var header = tbl.find('div.k-grid-header').first();
                    toolBar.insertAfter(parentToolBar.find('div').last());

                    //Set Css
                    parentToolBar.css('border-style', 'none');
                    toolBar.css({
                        "background": "#FFFFFF",
                        "padding-top": "1%"
                    });
                    childToolBar.addClass("btn btn-info");
                    childToolBar.css({
                        "float": "right",
                        "background": "#00A19C"
                    });

                    header.css({
                        "padding-right": "0"
                    });
                });
            }
            $q.all([
                diNewService.getDiHse()
            ]).then(function (results) {

                //HSE Response
                var hseResponse = results[0];
                if (hseResponse.data !== null && hseResponse.data !== undefined) {

                    angular.forEach(hseResponse.data, function (value, key) {
                        var obj = {
                            Proid: i,
                            no: value.no,
                            satefyHighlights: value.satefyHightlights,
                            actionStatus: { statusName: 'Open', statusID: '1' },
                            actionParties: { partyName: 'DucTT6', partyID: '1' },
                            estimateTc: new Date(),
                            createdDate: new Date(),
                            remarks: value.remarks
                        };
                        hseData.push(obj);
                        i++;
                    });

                } else {
                    utils.error.showErrorGet(error);
                }

                //HAZARDOUS Response
                var hazardousResponse = results[0];
                if (hazardousResponse.data !== null && hazardousResponse.data !== undefined) {

                    angular.forEach(hazardousResponse.data, function (value, key) {
                        var obj = {
                            Proid: i,
                            no: value.no,
                            task: value.satefyHightlights,
                            status: { statusName: 'Open', statusID: '1' },
                            createdDate: new Date(),
                            remarks: value.remarks
                        };
                        hazardousData.push(obj);
                        i++;
                    });

                } else {
                    utils.error.showErrorGet(error);
                }
                //OPERATION REGISTER Response
                var operationRegisterResponse = results[0];
                if (operationRegisterResponse.data !== null && operationRegisterResponse.data !== undefined) {

                    angular.forEach(operationRegisterResponse.data, function (value, key) {
                        var obj = {
                            Proid: i,
                            no: value.no,
                            task: value.satefyHightlights,
                            status: { statusName: 'Open', statusID: '1' },
                            createdDate: new Date(),
                            remarks: value.remarks
                        };
                        operationRegisterData.push(obj);
                        i++;
                    });

                } else {
                    utils.error.showErrorGet(error);
                }

                //ONGOING Response
                var ongoingResponse = results[0];
                if (ongoingResponse.data !== null && ongoingResponse.data !== undefined) {

                    angular.forEach(ongoingResponse.data, function (value, key) {
                        var obj = {
                            Proid: i,
                            no: value.no,
                            task: value.satefyHightlights,
                            status: { statusName: 'Open', statusID: '1' },
                            createdDate: new Date(),
                            remarks: value.remarks
                        };
                        ongoingData.push(obj);
                        i++;
                    });

                } else {
                    utils.error.showErrorGet(error);
                }

                //PRODUCTION PLAN Response
                var productionPlanResponse = results[0];
                if (ongoingResponse.data !== null && ongoingResponse.data !== undefined) {

                    angular.forEach(productionPlanResponse.data, function (value, key) {
                        var obj = {
                            Proid: i,
                            no: value.no,
                            remarks: value.remarks
                        };
                        productionPlanData.push(obj);
                        i++;
                    });

                } else {
                    utils.error.showErrorGet(error);
                }

                //kendo HSE
                var hseDataSource = new kendo.data.DataSource({
                    autoSync: true,
                    data: hseData,
                    batch: false,
                    schema: {
                        model: {
                            id: "Proid",
                            fields: {
                                Proid: { editable: false, nullable: true },
                                no: { type: "string", editable: false },
                                satefyHighlights: { validation: { required: true } },
                                actionStatus: { defaultValue: { statusName: 'Open', statusID: '1' } },
                                actionParties: { defaultValue: { partyName: 'DucTT6', partyID: '1' }, validation: { required: true } },
                                estimateTc: { type: "date" },
                                createdDate: { type: "date", validation: { min: 0, required: true } },
                                remarks: { type: "string", validation: { required: true } }
                            }
                        }
                    },
                    transport: {
                        read: function (e) {
                            e.success(hseData);
                            //
                            e.error("XHR hseResponse", "status code", "error message");
                        },
                        create: function (e) {
                            // assign an ID to the new item
                            e.data.Proid = i++;
                            // save data item to the original datasource
                            hseData.push(e.data);
                            // on success
                            e.success(e.data);

                            // on failure
                            //e.error("XHR hseResponse", "status code", "error message");
                        },
                        update: function (e) {
                            // locate item in original datasource and update it
                            hseData[getIndexById(hseData, e.data.Proid)] = e.data;
                            // on success
                            e.success();
                            // on failure
                            //e.error("XHR hseResponse", "status code", "error message");
                        }
                    }
                });
                hse.kendoGrid({
                    columns: [
                        {
                            field: "no",
                            title: "No.",
                            width: '6%',
                            headerAttributes: {
                                style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                            },
                            attributes: {
                                //"class": "table-cell"
                                style: "background: rgb(97,94,153); color: rgb(255,255,255);"
                            }
                        },
                        {
                            field: "satefyHighlights",
                            title: "Satefy Highlights",
                            width: '20%',
                            headerAttributes: {
                                style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                            },
                            attributes: {
                                //"class": "table-cell",
                                style: "text-align: left; font-size: 14px; font-weight: bold; border-width: 0 0 1px 0;"
                            }
                        },
                        {
                            field: "actionStatus",
                            title: "Action Status",
                            width: '13%',
                            headerAttributes: {
                                style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                            },
                            attributes: {
                                //"class": "table-cell",
                                style: "border-width: 0 0 1px 0;"
                            },
                            template: '#=actionStatus.statusName #',
                            editor: function (container, options) {
                                $('<input required name="' + options.field + '"/>')
                                    .appendTo(container)
                                    .kendoDropDownList({
                                        autoBind: false,
                                        dataTextField: "statusName",
                                        dataValueField: "statusID",
                                        dataSource: [{ statusName: 'Open', statusID: '1' }, { statusName: 'Pending', statusID: '2' }]
                                    });
                            }
                        },
                        {
                            field: "actionParties",
                            title: "Action Parties",
                            width: '13%',
                            headerAttributes: {
                                style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                            },
                            attributes: {
                                //"class": "table-cell",
                                style: "text-align: left; font-size: 14px; border-width: 0 0 1px 0;"
                            },
                            template: '#=actionParties.partyName #',
                            editor: function (container, options) {
                                $('<input required name="' + options.field + '"/>')
                                    .appendTo(container)
                                    .kendoDropDownList({
                                        autoBind: false,
                                        dataTextField: "partyName",
                                        dataValueField: "partyID",
                                        dataSource: [{ partyName: 'DucTT6', partyID: '1' }, { partyName: 'TuocVN', partyID: '2' }]
                                    });
                            }
                        },
                        {
                            field: "estimateTc",
                            title: "Estimate TC",
                            width: '13%',
                            headerAttributes: {
                                style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                            },
                            attributes: {
                                //"class": "table-cell",
                                style: "border-width: 0 0 1px 0;"
                            },
                            format: "{0: yyyy-MM-dd}"

                        },
                        {
                            field: "createdDate",
                            title: "Created Date",
                            width: '13%',
                            headerAttributes: {
                                style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                            },
                            attributes: {
                                //"class": "table-cell",
                                style: "border-width: 0 0 1px 0;"
                            },
                            format: "{0: yyyy-MM-dd}"
                        },
                        {
                            field: "remarks",
                            title: "Remarks",
                            headerAttributes: {
                                style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                            },
                            attributes: {
                                style: "border-width: 0 0 1px 0; text-align: center; color: rgb(0,159,154); font-weight: bold"
                            }
                        },
                        {
                            command: "edit",
                            headerAttributes: {
                                style: "width: 0px"
                            },
                            attributes: {
                                //"class": "table-cell",
                                style: "border-width: 0 0 1px 0; text-align: center; color: rgb(0,159,154); font-weight: bold"
                            }
                        }
                    ],
                    scrollable: true,
                    toolbar: [
                        {
                            name: "create",
                            text: "Add new"
                        }
                    ],
                    dataSource: hseDataSource,
                    editable: "inline"
                });

                //kendo HAZARDOUS
                var hazardousDataSource = new kendo.data.DataSource({
                    autoSync: true,
                    data: hazardousData,
                    batch: false,
                    schema: {
                        model: {
                            id: "Proid",
                            fields: {
                                Proid: { editable: false, nullable: true },
                                no: { type: "string", editable: false },
                                task: { validation: { required: true } },
                                status: { defaultValue: { statusName: 'Open', statusID: '1' } },
                                createdDate: { type: "date", validation: { min: 0, required: true } },
                                remarks: { type: "string", validation: { required: true } }
                            }
                        }
                    },
                    transport: {
                        read: function (e) {
                            e.success(hazardousData);
                            //
                            e.error("XHR hseResponse", "status code", "error message");
                        },
                        create: function (e) {
                            // assign an ID to the new item
                            e.data.Proid = i++;
                            // save data item to the original datasource
                            hazardousData.push(e.data);
                            // on success
                            e.success(e.data);
                            // on failure
                            //e.error("XHR hseResponse", "status code", "error message");
                        },
                        update: function (e) {
                            // locate item in original datasource and update it
                            hazardousData[getIndexById(hazardousData, e.data.Proid)] = e.data;
                            // on success
                            e.success();
                            // on failure
                            //e.error("XHR hseResponse", "status code", "error message");
                        }
                    }
                });
                hazardous.kendoGrid({
                    columns: [
                        {
                            field: "no",
                            title: "No.",
                            width: '6%',
                            headerAttributes: {
                                style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                            },
                            attributes: {
                                //"class": "table-cell"
                                style: "background: rgb(97,94,153); color: rgb(255,255,255);"
                            }
                        },
                        {
                            field: "task",
                            title: "Task",
                            width: '33%',
                            headerAttributes: {
                                style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                            },
                            attributes: {
                                //"class": "table-cell",
                                style: "text-align: left; font-size: 14px; font-weight: bold; border-width: 0 0 1px 0;"
                            }

                        },
                        {
                            field: "status",
                            title: "Status",
                            width: '13%',
                            headerAttributes: {
                                style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                            },
                            attributes: {
                                //"class": "table-cell",
                                style: "border-width: 0 0 1px 0;"
                            },
                            template: '#=status.statusName #',
                            editor: function (container, options) {
                                $('<input required name="' + options.field + '"/>')
                                    .appendTo(container)
                                    .kendoDropDownList({
                                        autoBind: false,
                                        dataTextField: "statusName",
                                        dataValueField: "statusID",
                                        dataSource: [{ statusName: 'Open', statusID: '1' }, { statusName: 'Pending', statusID: '2' }]
                                    });
                            }
                        },
                        {
                            field: "createdDate",
                            title: "Created Date",
                            width: '13%',
                            headerAttributes: {
                                style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                            },
                            attributes: {
                                //"class": "table-cell",
                                style: "text-align: left; font-size: 14px; border-width: 0 0 1px 0;"
                            },
                            format: "{0: yyyy-MM-dd}"
                        },
                        {
                            field: "remarks",
                            title: "Remarks",
                            headerAttributes: {
                                style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                            },
                            attributes: {
                                //"class": "table-cell",
                                style: "border-width: 0 0 1px 0; text-align: center; color: rgb(0,159,154); font-weight: bold"
                            }
                        },
                        {
                            command: "edit",
                            headerAttributes: {
                                style: "width: 0px"
                            },
                            attributes: {
                                //"class": "table-cell",
                                style: "border-width: 0 0 1px 0; text-align: center; color: rgb(0,159,154); font-weight: bold"
                            }
                        }
                    ],
                    scrollable: true,
                    toolbar: [
                        {
                            name: "create",
                            text: "Add new"
                        }
                    ],
                    editable: "inline",
                    dataSource: hazardousDataSource

                });

                //kendo OPERATION REGISTER
                var operationRegisterDataSource = new kendo.data.DataSource({
                    autoSync: true,
                    data: operationRegisterData,
                    batch: false,
                    schema: {
                        model: {
                            id: "Proid",
                            fields: {
                                Proid: { editable: false, nullable: true },
                                no: { type: "string", editable: false },
                                task: { validation: { required: true } },
                                status: { defaultValue: { statusName: 'Open', statusID: '1' } },
                                createdDate: { type: "date", validation: { min: 0, required: true } },
                                remarks: { type: "string", validation: { required: true } }
                            }
                        }
                    },
                    transport: {
                        read: function (e) {
                            e.success(operationRegisterData);
                            //
                            e.error("XHR hseResponse", "status code", "error message");
                        },
                        create: function (e) {
                            // assign an ID to the new item
                            e.data.Proid = i++;
                            // save data item to the original datasource
                            operationRegisterData.push(e.data);
                            // on success
                            e.success(e.data);
                            // on failure
                            //e.error("XHR hseResponse", "status code", "error message");
                        },
                        update: function (e) {
                            // locate item in original datasource and update it
                            operationRegisterData[getIndexById(operationRegisterData, e.data.Proid)] = e.data;
                            // on success
                            e.success();
                            // on failure
                            //e.error("XHR hseResponse", "status code", "error message");
                        }
                    }
                });
                operationRegister.kendoGrid({
                    columns: [
                        {
                            field: "no",
                            title: "No.",
                            width: '6%',
                            headerAttributes: {
                                style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                            },
                            attributes: {
                                //"class": "table-cell"
                                style: "background: rgb(97,94,153); color: rgb(255,255,255);"
                            }
                        },
                        {
                            field: "task",
                            title: "Task",
                            width: '33%',
                            headerAttributes: {
                                style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                            },
                            attributes: {
                                //"class": "table-cell",
                                style: "text-align: left; font-size: 14px; font-weight: bold; border-width: 0 0 1px 0;"
                            }

                        },
                        {
                            field: "status",
                            title: "Status",
                            width: '13%',
                            headerAttributes: {
                                style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                            },
                            attributes: {
                                //"class": "table-cell",
                                style: "border-width: 0 0 1px 0;"
                            },
                            template: '#=status.statusName #',
                            editor: function (container, options) {
                                $('<input required name="' + options.field + '"/>')
                                    .appendTo(container)
                                    .kendoDropDownList({
                                        autoBind: false,
                                        dataTextField: "statusName",
                                        dataValueField: "statusID",
                                        dataSource: [{ statusName: 'Open', statusID: '1' }, { statusName: 'Pending', statusID: '2' }]
                                    });
                            }
                        },
                        {
                            field: "createdDate",
                            title: "Created Date",
                            width: '13%',
                            headerAttributes: {
                                style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                            },
                            attributes: {
                                //"class": "table-cell",
                                style: "text-align: left; font-size: 14px; border-width: 0 0 1px 0;"
                            },
                            format: "{0: yyyy-MM-dd}"
                        },
                        {
                            field: "remarks",
                            title: "Remarks",
                            headerAttributes: {
                                style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                            },
                            attributes: {
                                //"class": "table-cell",
                                style: "border-width: 0 0 1px 0; text-align: center; color: rgb(0,159,154); font-weight: bold"
                            }
                        },
                        {
                            command: "edit",
                            headerAttributes: {
                                style: "width: 0px"
                            },
                            attributes: {
                                //"class": "table-cell",
                                style: "border-width: 0 0 1px 0; text-align: center; color: rgb(0,159,154); font-weight: bold"
                            }
                        }
                    ],
                    scrollable: true,
                    toolbar: [
                        {
                            name: "create",
                            text: "Add new"
                        }
                    ],
                    editable: "inline",
                    dataSource: operationRegisterDataSource

                });

                //kendo ONGOING
                var ongoingDataSource = new kendo.data.DataSource({
                    autoSync: true,
                    data: ongoingData,
                    batch: false,
                    schema: {
                        model: {
                            id: "Proid",
                            fields: {
                                Proid: { editable: false, nullable: true },
                                no: { type: "string", editable: false },
                                task: { validation: { required: true } },
                                status: { defaultValue: { statusName: 'Open', statusID: '1' } },
                                createdDate: { type: "date", validation: { min: 0, required: true } },
                                remarks: { type: "string", validation: { required: true } }
                            }
                        }
                    },
                    transport: {
                        read: function (e) {
                            e.success(ongoingData);
                            //
                            e.error("XHR hseResponse", "status code", "error message");
                        },
                        create: function (e) {
                            // assign an ID to the new item
                            e.data.Proid = i++;
                            // save data item to the original datasource
                            ongoingData.push(e.data);
                            // on success
                            e.success(e.data);
                            // on failure
                            //e.error("XHR hseResponse", "status code", "error message");
                        },
                        update: function (e) {
                            // locate item in original datasource and update it
                            ongoingData[getIndexById(ongoingData, e.data.Proid)] = e.data;
                            // on success
                            e.success();
                            // on failure
                            //e.error("XHR hseResponse", "status code", "error message");
                        }
                    }
                });
                ongoing.kendoGrid({
                    columns: [
                        {
                            field: "no",
                            title: "No.",
                            width: '6%',
                            headerAttributes: {
                                style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                            },
                            attributes: {
                                //"class": "table-cell"
                                style: "background: rgb(97,94,153); color: rgb(255,255,255);"
                            }
                        },
                        {
                            field: "task",
                            title: "Task",
                            width: '33%',
                            headerAttributes: {
                                style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                            },
                            attributes: {
                                //"class": "table-cell",
                                style: "text-align: left; font-size: 14px; font-weight: bold; border-width: 0 0 1px 0;"
                            }

                        },
                        {
                            field: "status",
                            title: "Status",
                            width: '13%',
                            headerAttributes: {
                                style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                            },
                            attributes: {
                                //"class": "table-cell",
                                style: "border-width: 0 0 1px 0;"
                            },
                            template: '#=status.statusName #',
                            editor: function (container, options) {
                                $('<input required name="' + options.field + '"/>')
                                    .appendTo(container)
                                    .kendoDropDownList({
                                        autoBind: false,
                                        dataTextField: "statusName",
                                        dataValueField: "statusID",
                                        dataSource: [{ statusName: 'Open', statusID: '1' }, { statusName: 'Pending', statusID: '2' }]
                                    });
                            }
                        },
                        {
                            field: "createdDate",
                            title: "Created Date",
                            width: '13%',
                            headerAttributes: {
                                style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                            },
                            attributes: {
                                //"class": "table-cell",
                                style: "text-align: left; font-size: 14px; border-width: 0 0 1px 0;"
                            },
                            format: "{0: yyyy-MM-dd}"
                        },
                        {
                            field: "remarks",
                            title: "Remarks",
                            headerAttributes: {
                                style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                            },
                            attributes: {
                                //"class": "table-cell",
                                style: "border-width: 0 0 1px 0; text-align: center; color: rgb(0,159,154); font-weight: bold"
                            }
                        },
                        {
                            command: "edit",
                            headerAttributes: {
                                style: "width: 0px"
                            },
                            attributes: {
                                //"class": "table-cell",
                                style: "border-width: 0 0 1px 0; text-align: center; color: rgb(0,159,154); font-weight: bold"
                            }
                        }
                    ],
                    scrollable: true,
                    toolbar: [
                        {
                            name: "create",
                            text: "Add new"
                        }
                    ],
                    editable: "inline",
                    dataSource: ongoingDataSource

                });

                //kendo ONGOING
                var productionPlanDataSource = new kendo.data.DataSource({
                    autoSync:true,
                    data: productionPlanData,
                    batch: false,
                    schema: {
                        model: {
                            id: "Proid",
                            fields: {
                                Proid: { editable: false, nullable: true },
                                no: { type: "string", editable: false },
                                remarks: { type: "string", validation: { required: true } }
                            }
                        }
                    },
                    transport: {
                        read: function (e) {
                            e.success(productionPlanData);
                            //
                            e.error("XHR hseResponse", "status code", "error message");
                        },
                        create: function (e) {
                            // assign an ID to the new item
                            e.data.Proid = i++;
                            // save data item to the original datasource
                            productionPlanData.push(e.data);
                            // on success
                            e.success(e.data);
                            // on failure
                            //e.error("XHR hseResponse", "status code", "error message");
                        },
                        update: function (e) {
                            // locate item in original datasource and update it
                            productionPlanData[getIndexById(productionPlanData, e.data.Proid)] = e.data;
                            // on success
                            e.success();
                            // on failure
                            //e.error("XHR hseResponse", "status code", "error message");
                        }
                    }
                });
                $scope.productionPlanModeGridOptions = {
                    columns: [
                        {
                            field: "no",
                            title: "No.",
                            width: '6%',
                            headerAttributes: {
                                style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                            },
                            attributes: {
                                //"class": "table-cell"
                                style: "background: rgb(97,94,153); color: rgb(255,255,255);"
                            }
                        },
                        {
                            field: "remarks",
                            title: "Remarks",
                            width: "84%",
                            headerAttributes: {
                                style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                            },
                            attributes: {
                                //"class": "table-cell",
                                style: "border-width: 0 0 1px 0; text-align: center; color: rgb(0,159,154); font-weight: bold"
                            }
                        },
                        //{
                            
                        //    width: "84%",
                        //    headerAttributes: {
                        //        style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                        //    },
                        //    attributes: {
                        //        //"class": "table-cell",
                        //        style: "border-width: 0 0 1px 0; text-align: center; color: rgb(0,159,154); font-weight: bold"
                        //    },
                        //    template: function (dataItem) {
                        //        console.log(dataItem);
                        //        return "<button class=\"btn-grid-item-menu\" type=\"button\" data-ng-click=\"openItemMenu($event)\"><i class=\"icon-dot-3 icon-btn-grid-item-menu\"></i></button>" +
                        //            "<ul data-id='" + dataItem.Proid + "' class=\"grid-item-menu\" style=\"display: none; background-color: #fff; border: 1px solid #ccc;\" >" +
                        //            "<li><a data-ng-click=\"Edit($event,dataItem)\">Edit</a></li>" +
                        //            "<li><a>Delete</a></li>" +
                        //            "<li><a>Clear All</a></li>" +
                        //            "</ul>";

                        //    }
                        //},
                        {
                            command: {
                                name: 'abc',
                                text: '',
                                imageClass: 'icon-dot-3 icon-btn-grid-item-menu',
                                click: function (e) {
                                    console.log('dfdf');
                                   
                                }
                            },
                            width: '10%',
                            headerAttributes: {
                                style: "border-left: none"
                            },
                            attributes: {
                                //"class": "table-cell",
                                style: "border-width: 0 0 1px 0; text-align: center; color: rgb(0,159,154); font-weight: bold"
                            }
                        }
                    ],
                    toolbar: [
                        {
                            name: "create",
                            text: "Add new"
                        }
                    ],
                    editable: {
                        mode: "inline"
                    },
                    dataSource: productionPlanDataSource
                };

                moveHeader(tableIds);
                });   
            $scope.openItemMenu = function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                var itemMenu = $(e.target).closest("td").find(".grid-item-menu");
                _.each($('.grid-item-menu'), function (item) {
                    if ($(item).attr("data-id") !== $(itemMenu).attr("data-id")) {
                        $(item).hide();
                    }
                    else {
                        $(itemMenu).slideToggle();
                    }
                });
            };

        }]);

