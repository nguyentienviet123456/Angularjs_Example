"use strict";


app.directive('hseIssue', function ($compile) {
    return {
        replace: true,
        restrict: 'E',
        templateUrl: 'app/views/shared/directives/di/hseIssueDirective.html',
        link: function (scope, element, attrs) {
            $(document).ready(function () {            
                // create DateTimePicker from input HTML element
                $("#hse .estimatePicker").last().kendoDateTimePicker({                 
                    dateInput: true
                });
               
            });
            scope.statuses =
                [
                    {
                        id: '1',
                        name: 'Open'
                    },
                    {
                        id: '2',
                        name: 'Pending'
                    },
                    {
                        id: '3',
                        name: 'Closed'
                    }
                ];
            scope.users =
            [
                {
                    id: '1',
                    name: 'DuctTT6'
                },
                {
                    id: '2',
                    name: 'TuocVN'
                },
                {
                    id: '3',
                    name: 'MinhNT24'
                }
            ];
        }
    };
});