var gulp = require('gulp');

var browser_sync = require('browser-sync').create();

var buildJS = require('./build-JS');
var { buildCSS } = require('./build-CSS');
var buildHTML = require('./build-HTML');

const SOURCE = './source/';
const RELEASE = './release/';

var browserSync = function (cb) {
    browser_sync.init({
        server: {
            baseDir: "./release",
            index: "index.html",
            directory: false
        },
        files: ["./release/js/*.js", "./release/html/*.html"]
    });
    return cb();
};

var buildCompleted = function (cb) {
    console.log('BUILD-completed... reaload');
    browser_sync.reload();
    return cb();
}

var watchJS = function (cb) {
    console.log('watching JS...');
    gulp.watch([SOURCE + '**/*.js', SOURCE + '**/*.jsx'], gulp.series(buildJS, buildCompleted));
    return cb();
}

var watchCSS = function (cb) {
    console.log('watching CSS...');
    gulp.watch(SOURCE + '**/*.css', gulp.series(buildCSS, buildCompleted));
    return cb();
}

var watchHTML = function (cb) {
    console.log('watching HTML...');
    gulp.watch(SOURCE + '**/*.html', gulp.series(buildHTML, buildCompleted));
    return cb();
}

var watchJSON = function (cb) {
    console.log('watching JSON...');
    gulp.watch(SOURCE + '**/*.json', gulp.series(buildJS, buildCompleted));
    return cb();
}

gulp.task('watch', gulp.series(browserSync, watchJS, watchCSS, watchHTML));

gulp.task('browser-sync', gulp.series(browserSync, watchJS));
module.exports = { browserSync, watchJS, watchCSS, watchHTML, watchJSON };