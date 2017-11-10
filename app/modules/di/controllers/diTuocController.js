app.controller('diTuocController',
    ['$rootScope', '$q', '$state', '$stateParams', '$scope', '$location', '$timeout', 'constants', 'serviceHelper', 'diNewService',
function ($rootScope, $q, $state, $stateParams, $scope, $location, $timeout, constants, serviceHelper, diNewService) {

    var copSolData = [];
    var unitStatusCopData = [];

    var i = 0;

    function getIndexById(data, id) {
        var idx,
            l = data.length;

        for (var j = 0; j < l; j++) {
            if (data[j].copId == id) {
                return j;
            }
        }
        return null;
    }


    $q.all([
        diNewService.getDiHse()
    ]).then(function (results) {
        var copSolResponse = results[0];
        if (copSolResponse.data !== null && copSolResponse.data !== undefined) {

            angular.forEach(copSolResponse.data, function (res, key) {
                var obj = {
                    copId: i,
                    unit: "Unit 11",
                    tag: res.tag,
                    description: res.description,
                    value: res.value,
                    uom: res.uom,
                    min: res.min,
                    max: res.max,
                    status: { statusName: 'Ongoing', statusID: '1' },
                    count: res.count,
                    createdDate: new Date(),
                    remarks: res.remarks
                };
                copSolData.push(obj);
                i++;
            });

        } else {
            utils.error.showErrorGet(error);
        }

        var dataSource = new kendo.data.DataSource({
            pageSize: 10,
            data: copSolData,
            autoSync: true,
            batch: false,
            height: 600,
            scrollable: true,
            editable: "inline",
            schema: {
                model: {
                    id: "copId",
                    fields: {
                        copId: { editable: false, nullable: true },
                        unit: { type: "string", defaultValue: { Unit: "Unit 1" } },
                        tag: { type: "string" },
                        description: { type: "string" },
                        value: { type: "string" },
                        uom: { type: "string" },
                        min: { type: "string" },
                        max: { type: "string" },
                        status: { defaultValue: { statusName: 'Ongoing', statusID: '1' } },
                        count: { type: "string" },
                        document: { editable: false },
                        createdDate: { type: "date" },
                        remarks: { type: "string" }
                    }
                }
            },
            transport: {
                read: function (e) {
                    e.success(copSolData);
                    //
                    e.error("XHR copSolResponse", "status code", "error message");
                },
                create: function (e) {
                    // assign an ID to the new item
                    e.data.copId = i++;
                    // save data item to the original datasource
                    copSolData.push(e.data);
                    // on success
                    e.success(e.data);

                    // on failure
                    //e.error("XHR copSolResponse", "status code", "error message");
                },
                update: function (e) {
                    // locate item in original datasource and update it
                    copSolData[getIndexById(copSolData, e.data.copId)] = e.data;
                    // on success
                    e.success();
                    // on failure
                    //e.error("XHR hseResponse", "status code", "error message");
                }
            }
        });

        $scope.copSolGridOptions = {
            dataBound: function (e) {
                $("input[type='file']").kendoUpload({
                    multiple: true,
                    async: {
                        saveUrl: "save",
                        removeUrl: "remove",
                        autoUpload: false
                    },
                    localization: {
                        select: 'Browse..',

                    },
                    dropZone: false,
                    //template: '<div style="background-    : url(../app/modules/di/pdf_icon.png)"></div>'
                });
            },
            toolbar: ["create"],
            pageable: true,
            dataSource: dataSource,
            editable: {
                editable: true,
                createAt: "bottom",
                mode: "inline"
            },
            columns: [
                {
                    field: "unit",
                    title: "Unit",
                    width: "6%",
                    headerAttributes: {
                        style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                    },
                    attributes: {
                        //"class": "table-cell"
                        style: "background: rgb(97,94,153); color: rgb(255,255,255); font-weight: bold;"
                    }
                },
                {
                    field: "tag",
                    title: "Tag",
                    width: "8%",
                    headerAttributes: {
                        style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                    },
                    attributes: {
                        //"class": "table-cell",
                        style: "text-align: left; font-weight: bold; border-width: 0 0 1px 0;"
                    }
                },
                {
                    field: "description",
                    title: "Description",
                    width: "12%",
                    headerAttributes: {
                        style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                    },
                    attributes: {
                        //"class": "table-cell",
                        style: "border-width: 0 0 1px 0;"
                    }
                },
                {
                    field: "value",
                    title: "Value",
                    width: "6%",
                    headerAttributes: {
                        style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                    },
                    attributes: {
                        //"class": "table-cell",
                        style: "text-align: left; border-width: 0 0 1px 0;"
                    }
                },
                {
                    field: "uom",
                    title: "UOM",
                    width: "6%",
                    headerAttributes: {
                        style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                    },
                    attributes: {
                        //"class": "table-cell",
                        style: "border-width: 0 0 1px 0;"
                    }
                },
                {
                    title: "Region 1",
                    headerAttributes: {
                        style: "text-align: center; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                    },
                    columns: [
                        {
                            field: "min",
                            title: "Min",
                            width: "5%",
                            headerAttributes: {
                                style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                            },
                            attributes: {
                                //"class": "table-cell",
                                style: "border-width: 0 0 1px 0;"
                            }
                        }, {
                            field: "max",
                            title: "Max",
                            width: "5%",
                            headerAttributes: {
                                style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                            },
                            attributes: {
                                //"class": "table-cell",
                                style: "border-width: 0 0 1px 0;"
                            }
                        }
                    ]

                },
                {
                    field: "status",
                    title: "Status",
                    width: "9%",
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
                                dataSource: [{ statusName: 'Ongoing', statusID: '1' }, { statusName: 'Plan', statusID: '2' }, { statusName: 'Completed', statusID: '3' }]
                            });
                    }
                },
                {
                    field: "count",
                    title: "Count",
                    width: "6%",
                    headerAttributes: {
                        style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                    },
                    attributes: {
                        //"class": "table-cell",
                        style: "border-width: 0 0 1px 0; text-align: center; color: rgb(0,159,154); font-weight: bold"
                    }
                },
                {
                    field: "document",
                    title: "Document",
                    width: "8%",
                    headerAttributes: {
                        style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                    },
                    attributes: {
                        //"class": "table-cell",
                        style: "border-width: 0 0 1px 0;"
                    },
                    template: function () {
                        return '<form method="post" action="#"><input name="upload" type="file" /></form>';
                    }
                },
                {
                    field: "createdDate",
                    title: "Created Date",
                    width: "10%",
                    headerAttributes: {
                        style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                    },
                    attributes: {
                        //"class": "table-cell",
                        style: "border-width: 0 0 1px 0;"
                    },
                    template: function (dataItem) {
                        return "<button class=\"btn-grid-item-menu\" type=\"button\" data-ng-click=\"openItemMenu($event)\"><i class=\"icon-dot-3 icon-btn-grid-item-menu\"></i></button>" +
                            "<ul class=\"grid-item-menu\" style=\"display: none; background-color: #fff; border: 1px solid #ccc;\" >" +
                            "<li><a>View</a></li>" +
                            "<li><a>View</a></li>" +
                            "<li><a>View</a></li>" +
                            "</ul>";
                    },
                    format: "{0: yyyy-MM-dd}"

                },
                {
                    command: "edit"
                },
                {
                    field: "remarks",
                    title: "Remarks",
                    headerAttributes: {
                        style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                    },
                    attributes: {
                        //"class": "table-cell",
                        //style: "border-width: 0 0 1px 0;"

                    },
                    template: function () {
                        return '<textarea type="text" class="form-control" id="copRemarks" style="max-width: 90%; height: 100%">zzzzzzzzzzz</textarea>';
                    }
                }
            ]
        };


        // Unit Status COP
        var unitStatusCopResponse = results[0];
        if (unitStatusCopResponse.data !== null && unitStatusCopResponse.data !== undefined) {

            angular.forEach(unitStatusCopResponse.data, function (value, key) {
                var obj = {
                    unitCopId: i,
                    unit: "Unit 11",
                    cop: value.satefyHightlights,
                    value: value.actionStatus,
                    min: value.actionStatus,
                    max: value.actionStatus,
                    remarks: value.remarks
                };
                unitStatusCopData.push(obj);
                i++;
            });

        } else {
            utils.error.showErrorGet(error);
        }
        var unitStatusCopDataSource = new kendo.data.DataSource({
            autoSync: true,
            data: unitStatusCopData,
            batch: false,
            schema: {
                model: {
                    id: "Proid",
                    fields: {
                        Proid: { editable: false, nullable: true },
                        unit: { type: "string" },
                        cop: { type: "string" },
                        value: { type: "string" },
                        min: { type: "string" },
                        max: { type: "string" },
                        remarks: { type: "string", validation: { required: true } }
                    }
                }
            },
            transport: {
                read: function (e) {
                    e.success(unitStatusCopData);
                    //
                    e.error("XHR hseResponse", "status code", "error message");
                },
                create: function (e) {
                    // assign an ID to the new item
                    e.data.Proid = i++;
                    // save data item to the original datasource
                    unitStatusCopData.push(e.data);
                    // on success
                    e.success(e.data);
                    // on failure
                    //e.error("XHR hseResponse", "status code", "error message");
                },
                update: function (e) {
                    // locate item in original datasource and update it
                    unitStatusCopData[getIndexById(unitStatusCopData, e.data.Proid)] = e.data;
                    // on success
                    e.success();
                    // on failure
                    //e.error("XHR hseResponse", "status code", "error message");
                }
            }
        });
        $scope.unitStatusCopGridOptions = {
            toolbar: [
               {
                   name: "create",
                   text: "Add new"
               }
            ],
            editable: {
                mode: "inline"
            },
            dataSource: unitStatusCopDataSource,
            columns: [
                {
                    field: "unit",
                    title: "Unit",
                    width: '6%',
                    headerAttributes: {
                        "class": "header-cell"
                    },
                    attributes: {
                        "class": "cell-unit"
                    }
                },
                {
                    field: "cop",
                    title: "COP",
                    width: "20%",
                    headerAttributes: {
                        "class": "header-cell"
                    },
                    attributes: {
                        "class": "cell-cop"
                    }
                },
                {
                    field: "value",
                    title: "Value",
                    width: "10%",
                    headerAttributes: {
                        "class": "header-cell"
                    },
                    attributes: {
                        "class": "cell-value",
                        //style: "border-width: 0 0 1px 0; text-align: center; color: rgb(0,159,154); font-weight: bold"
                    }
                },
                {
                    title: "Specification",
                    headerAttributes: {
                        style: "text-align: center; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                    },
                    columns: [
                        {
                            field: "min",
                            title: "Min",
                            width: "6%",
                            headerAttributes: {
                                "class": "header-cell"
                            },
                            attributes: {
                                "class": "cell-min",
                                //style: "border-width: 0 0 1px 0;"
                            }
                        }, {
                            field: "max",
                            title: "Max",
                            width: "6%",
                            headerAttributes: {
                                "class": "header-cell"
                            },
                            attributes: {
                                "class": "cell-max",
                                //style: "border-width: 0 0 1px 0;"
                            }
                        }
                    ]

                },
                {
                    field: "remarks",
                    title: "Remarks",
                    headerAttributes: {
                        "class": "header-cell"
                    },
                    attributes: {
                        "class": "cell-remarks",
                        //style: "border-width: 0 0 1px 0; text-align: center; color: rgb(0,159,154); font-weight: bold"
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
            ]
        };

    });

    $scope.openItemMenu = function (e) {
        console.log("okk");
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

    //$(document).ready(function () {
    //    //$("input[type='file']").kendoUpload({
    //    //    template: '<div style="background-image: url(../app/modules/di/PDF.png)"></div>'
    //    //});        
    //});

    // merge cell
    function mergeCommonRows(table, columnIndexToMerge) {
        var previous = null;
        var cellToExtend = null;
        var col1 = null;
        var bac = table.find("td:nth-child(" + columnIndexToMerge + ")");
        table.find("td:nth-child(" + columnIndexToMerge + ")").each(function () {
            var jthis = $(this);
            var content1 = jthis.parent('tr').children().first().text();
            if (col1 !== content1) {
                previous = null;
                col1 = content1;
            }
            var content = jthis.text();
            if (previous == content && content !== "") {
                jthis.remove();
                if (cellToExtend.attr("rowspan") == undefined) {
                    cellToExtend.attr("rowspan", 2);
                }
                else {
                    currentrowspan = parseInt(cellToExtend.attr("rowspan"));
                    cellToExtend.attr("rowspan", currentrowspan + 1);
                }
            }
            else {
                previous = content;
                cellToExtend = jthis;
            }
        });
    }

    mergeCommonRows($('#copSol'), 13);
    mergeCommonRows($('#copSol'), 1);






    // IOW region
    var text1 = 'Unit 1';
    var text8 = 'Unit 2';
    var text2 = 'Pump number 123XYZ will be on naintenance. Mechanic team please prepare the SCE and PTW. Pump to be fixed ASAP.';
    var text3 = 'Open';
    var text4 = 'Truong Thi Duc';
    var text5 = new Date();
    var text6 = new Date();
    var text7 = 'Done fixed';
    $scope.copStatus = ['Plan', 'Ongoing', 'Completed'];
    $("#iow").kendoGrid({
        columns: [
                {
                    field: "unit",
                    title: "Unit",
                    width: "6%",
                    headerAttributes: {
                        style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                    },
                    attributes: {
                        //"class": "table-cell"
                        style: "background: rgb(97,94,153); color: rgb(255,255,255); font-weight: bold;"
                    }
                },
                {
                    field: "tag",
                    title: "Tag",
                    width: "8%",
                    headerAttributes: {
                        style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                    },
                    attributes: {
                        //"class": "table-cell",
                        style: "text-align: left; font-weight: bold; border-width: 0 0 1px 0;"
                    }
                },
                {
                    field: "description",
                    title: "Description",
                    width: "12%",
                    headerAttributes: {
                        style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                    },
                    attributes: {
                        //"class": "table-cell",
                        style: "border-width: 0 0 1px 0;"
                    }
                },
                {
                    field: "value",
                    title: "Value",
                    width: "6%",
                    headerAttributes: {
                        style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                    },
                    attributes: {
                        //"class": "table-cell",
                        style: "text-align: left; border-width: 0 0 1px 0;"
                    }
                },
                {
                    field: "uom",
                    title: "UOM",
                    width: "6%",
                    headerAttributes: {
                        style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                    },
                    attributes: {
                        //"class": "table-cell",
                        style: "border-width: 0 0 1px 0;"
                    }
                },
                {
                    title: "Region 1",
                    headerAttributes: {
                        style: "text-align: center; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                    },
                    columns: [
                        {
                            field: "min",
                            title: "Min",
                            width: "5%",
                            headerAttributes: {
                                style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                            },
                            attributes: {
                                //"class": "table-cell",
                                style: "border-width: 0 0 1px 0;"
                            }
                        }, {
                            field: "max",
                            title: "Max",
                            width: "5%",
                            headerAttributes: {
                                style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                            },
                            attributes: {
                                //"class": "table-cell",
                                style: "border-width: 0 0 1px 0;"
                            }
                        }
                    ]

                },
                {
                    field: "Category",
                    title: "Status",
                    width: "9%",
                    headerAttributes: {
                        style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                    },
                    attributes: {
                        //"class": "table-cell",
                        style: "border-width: 0 0 1px 0;"
                    },
                    //editor: categoryDropDownEditor,
                    template: function (dataItem) {
                        var optionStr = '';
                        if ($scope.copStatus != null) {
                            $.each($scope.copStatus, function (index, value) {
                                optionStr += '<option>' + value + '</option>';
                            });
                        }

                        return '<select class="form-control row-control">' + optionStr + '</select>';
                    }
                },
                {
                    field: "count",
                    title: "Count",
                    width: "6%",
                    headerAttributes: {
                        style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                    },
                    attributes: {
                        //"class": "table-cell",
                        style: "border-width: 0 0 1px 0; text-align: center; color: rgb(0,159,154); font-weight: bold"
                    }
                },
                {
                    field: "document",
                    title: "Document",
                    width: "8%",
                    headerAttributes: {
                        style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                    },
                    attributes: {
                        //"class": "table-cell",
                        style: "border-width: 0 0 1px 0;"
                    },
                    template: function () {
                        return '<label for="file" type="button" id="documentBtn" class="btn btn-default" style="height: 28px; border-radius: 1px;">Browse..</label>' +
                            '<input type="file" style="display:none;" id="file" name="file"/>';
                    }
                },
                {
                    field: "createdDate",
                    title: "Created Date",
                    width: "8%",
                    headerAttributes: {
                        style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                    },
                    attributes: {
                        //"class": "table-cell",
                        style: "border-width: 0 0 1px 0;"
                    }
                },
                {
                    field: "remarks",
                    title: "Remarks",
                    headerAttributes: {
                        style: "vertical-align: top; font-size: 14px; color:rgb(117,117,117); font-weight: bold"
                    },
                    attributes: {
                        //"class": "table-cell",
                        //style: "border-width: 0 0 1px 0;"

                    },
                    template: function () {
                        return '<textarea type="text" class="form-control" id="copRemark" style="max-width: 90%; height: 100%">zzzzzzzzzzz</textarea>';
                    }
                }
        ],
        height: 400,
        scrollable: true,
        dataSource: [
            { unit: text1, tag: text3, description: text3, value: "100", uom: text7, min: "1", max: "2", status: text7, count: "1", document: text7, createdDate: "11", remarks: "22" },
            { unit: text1, tag: text3, description: text3, value: "100", uom: text7, min: "1", max: "2", status: text7, count: "1", document: text7, createdDate: "11", remarks: "22" },
            { unit: text8, tag: text3, description: text3, value: "100", uom: text7, min: "1", max: "2", status: text7, count: "1", document: text7, createdDate: "11", remarks: "22" },
            { unit: text8, tag: text3, description: text3, value: "100", uom: text7, min: "1", max: "2", status: text7, count: "1", document: text7, createdDate: "11", remarks: "22" },
            { unit: text8, tag: text3, description: text3, value: "100", uom: text7, min: "1", max: "2", status: text7, count: "1", document: text7, createdDate: "11", remarks: "22" }

        ]

    });
    mergeCommonRows($('#iow'), 12);
    mergeCommonRows($('#iow'), 1);
}]);