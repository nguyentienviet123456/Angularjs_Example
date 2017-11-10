"use strict";


app.directive('productionPlanMode', function ($compile) {
    return {
        restrict: 'E',
        templateUrl: 'app/views/shared/directives/di/productionPlanModeDirective.html',
        scope: {
            items: '=dropdownData',
            doSelect: '&selectVal',
            selectedItem: '=preselectedItem'
        },
        link: function (scope, element, attrs) {
           
        }
    };
});