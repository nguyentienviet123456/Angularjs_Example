"use strict";


app.directive('onGoingTemporary', function ($compile) {
    return {
        replace: true,
        restrict: 'E',
        templateUrl: 'app/views/shared/directives/di/onGoingTemporaryDirective.html',
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