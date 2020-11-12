const gulp = require('gulp');
const concat = require('gulp-concat');

const SOURCE = './source/';
const RELEASE = './release/';
const FONT_AWSOME = './source/libs/fontawesome-free-5.12.1-web';

var buildCSS = function (cb) {
    return gulp.src([SOURCE + '**/[^_]*.css'])
        .pipe(concat("main.css"))
        .pipe(gulp.dest(RELEASE + '/css'));
};

var buildFontAwsome = function (cb) {
    return gulp.src([FONT_AWSOME + '**/[^_]*/**'])
        .pipe(gulp.dest(RELEASE + 'css'))
};

gulp.task('build-css', buildCSS);
gulp.task('build-font', buildFontAwsome);
module.exports = { buildCSS, buildFontAwsome };