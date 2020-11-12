var gulp = require('gulp');
let replace = require('gulp-replace');
let gutil = require('gulp-util');

const SOURCE = './source/';
const RELEASE = './release/';

var buildHTML = function (cb) {
    return gulp.src(SOURCE + '**/*.html')
        .pipe(replace('src="js/app.js"', 'src="js/app_' + '1.0.0' + (gutil.env.minified === true ? ".min" : "") + '.js"'))
        .pipe(gulp.dest(RELEASE, { overwrite: true }));
}

gulp.task('build-html', buildHTML);
module.exports = buildHTML;

