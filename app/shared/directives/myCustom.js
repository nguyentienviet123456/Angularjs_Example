app.directive("myCustom", function () {
    return {
        templateUrl: function (elem, attr) { return attr.src; }
    };
});