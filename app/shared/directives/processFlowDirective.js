app.directive('processFlow', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'app/views/shared/directives/ProcessFlowDirective.html',
        scope: {
            status: '@',
            title: '@'
        },
        link: function (scope, el, attrs) {
            var tmp = {
                "Shelving Process Flow": [
                    "Application",
                    "Review",
                    "Endorsement",
                    "Approval",
                    "ApprovalClose",
                    "Shelving",
                    "Live",
                    "NoReShelvingOrReApproval",
                    "MOC",
                    "MOC Approval",
                    "finish"
                ]
            };

            scope.allStatus = tmp[scope.title];

            scope.getStatus = function (idx) {
                var currentIdx = scope.allStatus.indexOf(scope.status);
                var statusCount = scope.allStatus.length;
                if (currentIdx > idx || currentIdx === (statusCount - 1)) {
                    return "completed";
                } else if (currentIdx === idx) {
                    return "current";
                }else {
                    return "";
                }
            }
        }
    };
});





