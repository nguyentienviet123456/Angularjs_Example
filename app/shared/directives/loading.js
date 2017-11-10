app.directive('loading', function () {
    return {
        restrict: 'E',
        replace: true,
        template: '<div id="progress_loading" data-ng-show="isLoading"><div class="loading_content"> <i class="fa fa-spinner fa-pulse"></i><br/> Processing...</div></div>'
    };
});
