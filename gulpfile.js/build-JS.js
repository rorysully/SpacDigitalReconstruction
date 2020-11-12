let gulp = require('gulp');
let notify = require('gulp-notify');
let babelify = require('babelify');
let browserify = require('browserify');
let browserifyCss = require('browserify-css');
let sourceStream = require('vinyl-source-stream');
let sourcemaps = require('gulp-sourcemaps');
let buffer = require('vinyl-buffer');
let uglify = require('gulp-uglify');
let gutil = require('gulp-util');
let rename = require('gulp-rename');

const SOURCE = './source/';
const RELEASE = './release/';

var buildJS = function (cb) {

    let minified = null;

    if (gutil.env.minified === true) {
        console.warn("*******Setting NODE_ENV to 'production'******");
        process.env.NODE_ENV = 'production';
        minified = true;
    }

    let b = browserify({
        entries: SOURCE + 'js/main.jsx',
        debug: true,
        standalone: 'myapp'
    });

    b.transform(babelify)
        .transform({ global: true }, browserifyCss)
        .bundle()
        .on('error', notify.onError(function (error) {
            return "notifier message error: " + error;
        }))
        .pipe(sourceStream('app_' + '1.0.0' + '.js'))
        .pipe(buffer())

        .pipe(sourcemaps.init({ loadMaps: true }))
        // .pipe(minified ? uglify({ compress: { drop_console: true } }) : gutil.noop())
        .pipe(minified ? rename({ suffix: '.min' }) : gutil.noop())
        .pipe(sourcemaps.write('./'))

        .pipe(gulp.dest(RELEASE + 'js'));

    return cb();
}

gulp.task('build-js', buildJS);
module.exports = buildJS;