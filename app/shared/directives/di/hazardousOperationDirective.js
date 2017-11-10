"use strict";


app.directive('hazardousOperation', function ($compile) {
    return {
        replace: true,
        restrict: 'E',
        templateUrl: 'app/views/shared/directives/di/hazardousOperationDirective.html',      
        link: function (scope, element, attrs) {
            $(document).ready(function () {
               
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
        }
    };
});