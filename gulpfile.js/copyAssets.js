let gulp = require('gulp');
let merge = require('merge-stream');

const SOURCE = './source/';
const RELEASE = './release/';

let copyAssets = function (cb) {
    merge(
        gulp.src(SOURCE + 'assets/*')
            .pipe(gulp.dest(RELEASE + 'assets'))
    );
    return cb();
}

let copyLibs = function (cb) {
    merge(
        gulp.src(SOURCE + 'libs/**/[^_]*/**')
            .pipe(gulp.dest(RELEASE + 'libs'))
    );
    return cb();
}

gulp.task('copyAssets', gulp.series(copyAssets));
gulp.task('copyLibs', gulp.series(copyLibs));
module.exports = { copyAssets, copyLibs };