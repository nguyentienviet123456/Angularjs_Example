/// <binding BeforeBuild='app' />
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var minifyCss = require('gulp-csso');
var merge = require('merge-stream');
var del = require('del');
var less = require('gulp-less');
var cssmin = require('gulp-cssmin');
var gutil = require('gulp-util');

var config = {
    path: {
        dev: "build",
        test: "release/test",
        staging: "release/staging",
        preProduction: "release/production"
    }
};

var path = config.path.dev;
var isUglify = false;

var pathBuild = "build";

gulp.task('run_startup', function () {
    var index = gulp.src(['index.html', 'print.html', 'files.html']).pipe(gulp.dest(path));

    var js = gulp.src(['app/app.js', 'app/app.routes.js']).pipe(concat('app.min.js')).pipe(ngAnnotate());
    if (isUglify) {
        js.pipe(uglify()).on('error', gutil.log);
    }

    js.pipe(gulp.dest(path + '/app'));

    var webConfig = gulp.src(['web.config']).pipe(gulp.dest(path));

    return merge(index, js, webConfig);
});

gulp.task('run_shared', function () {
    var appJs = gulp.src(['app/shared/*.js', 'app/shared/directives/*.js', 'app/shared/directives/**/**/*.js']).pipe(concat('shared.min.js'));

    if (isUglify) {
        appJs.pipe(uglify()).on('error', gutil.log);
    }

    return appJs.pipe(gulp.dest(path + '/app'));
});

gulp.task('run_libcustoms', function () {
    var appJs = gulp.src(['app/libs/*.js']).pipe(concat('libs.min.js'));

    if (isUglify) {
        appJs.pipe(uglify()).on('error', gutil.log);
    }

    return appJs.pipe(gulp.dest(path + '/app'));
});

gulp.task('run_lib', function run_lib() {
    var appJs = gulp.src(['content/libs/*.js', 'content/libs/*.map']);
    return appJs.pipe(gulp.dest(path + '/content/libs'));
});

gulp.task('run_kendo_ui', function () {
    var css = gulp.src(['content/libs/kendo-ui/styles/**/**/*']).pipe(gulp.dest(path + '/content/libs/styles/kendo-ui'));
    var js = gulp.src(['content/libs/kendo-ui/**/*']).pipe(gulp.dest(path + '/content/libs/kendo-ui'));
    return merge(css, js);
});

gulp.task('run_services', function run_services() {
    var appJs = gulp.src(['app/**/*Service*.js', 'app/**/**/*Service*.js', 'app/**/**/**/*Service*.js']).pipe(concat('services.min.js'));
    if (isUglify) {
        appJs.pipe(uglify()).on('error', gutil.log);
    }
    return appJs.pipe(gulp.dest(path + '/app')), { name: 'services.min' };
});

gulp.task('run_controllers', function run_controllers() {
    var appJs = gulp.src(['app/**/*Controller*.js', 'app/**/**/*Controller*.js', 'app/**/**/**/*Controller*.js']).pipe(concat('controllers.min.js'));
    if (isUglify) {
        appJs.pipe(uglify()).on('error', gutil.log);
    }

    return appJs.pipe(gulp.dest(path + '/app')), { name: 'controllers.min' };
});

gulp.task('run_views', function () {
    var appHtml = gulp.src(['app/**/*.html']);
    return appHtml.pipe(gulp.dest(path + '/app/views'));
});

gulp.task('run_content', function run_content() {
    var appCss = gulp.src(['content/css/*.css']).pipe(minifyCss()).pipe(gulp.dest(path + '/content/css'));

    var appFonts = gulp.src(['content/fonts/**/**/*']).pipe(gulp.dest(path + '/content/fonts'));

    var images = gulp.src(['content/images/**/**/*']).pipe(gulp.dest(path + '/content/images'));

    return merge(appCss, appFonts, images);
});

gulp.task('run_less', function run_less() {
    var appCss = gulp.src(['content/css/*.less', '!content/css/print.less', '!content/css/print-out.less'])
                    .pipe(less())
                    .pipe(cssmin())
                    .pipe(concat('app.min.css'))
                    .pipe(gulp.dest(path + '/content/css'));

    var printCss = gulp.src(['content/css/print.less', 'content/css/loading-screen.less'])
                    .pipe(less())
                    .pipe(cssmin())
                    .pipe(concat('print.min.css'))
                    .pipe(gulp.dest(path + '/content/css'));

    var printOutCss = gulp.src('content/css/print-out.less')
                .pipe(less())
                .pipe(cssmin())
                .pipe(concat('print-out.min.css'))
                .pipe(gulp.dest(path + '/content/css'));

    return merge(appCss, printCss, printOutCss);

});

function run_clean() {
    return del(path + '/*', {
        force: true
    });
}

gulp.task('1.dev-build', function () {
    path = config.path.dev;    
    run_clean().then(function () {
        gulp.start('run_startup');
        gulp.start('run_views');
        gulp.start('run_lib');
        gulp.start('run_libcustoms');
        gulp.start('run_shared');
        gulp.start('run_kendo_ui');
        gulp.start('run_controllers');
        gulp.start('run_services');
        gulp.start('run_content');
        gulp.start('run_less');
    });
});

gulp.task('2.test-build', function () {
    path = config.path.test;
    run_clean().then(function () {
        gulp.start('run_startup');
        gulp.start('run_views');
        gulp.start('run_lib');
        gulp.start('run_libcustoms');
        gulp.start('run_shared');
        gulp.start('run_kendo_ui');
        gulp.start('run_controllers');
        gulp.start('run_services');
        gulp.start('run_content');
        gulp.start('run_less');
    });
});

gulp.task('3.staging-build', function () {
    path = config.path.staging;
    isUglify = true;
    run_clean().then(function () {
        gulp.start('run_startup');
        gulp.start('run_views');
        gulp.start('run_lib');
        gulp.start('run_libcustoms');
        gulp.start('run_shared');
        gulp.start('run_kendo_ui');
        gulp.start('run_controllers');
        gulp.start('run_services');
        gulp.start('run_content');
        gulp.start('run_less');
    });
});

gulp.task('4.production-build', function () {
    path = config.path.preProduction;
    isUglify = true;
    run_clean().then(function () {
        gulp.start('run_startup');
        gulp.start('run_views');
        gulp.start('run_lib');
        gulp.start('run_libcustoms');
        gulp.start('run_shared');
        gulp.start('run_kendo_ui');
        gulp.start('run_controllers');
        gulp.start('run_services');
        gulp.start('run_content');
        gulp.start('run_less');
    });
});