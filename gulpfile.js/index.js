'use strict';

var gulp = require('gulp');

/*********************** BUILD ***************************/
const buildJS = require('./build-JS');
const buildHTML = require('./build-HTML');
const { buildCSS, buildFontAwsome } = require('./build-CSS');
const { copyAssets, copyLibs } = require('./copyAssets');

const SOURCE = './source/';
const RELEASE = './release/';

gulp.task('build', gulp.series(copyAssets, copyLibs, buildHTML, buildFontAwsome, buildCSS, buildJS));

/********************* WATCH *********************/
const { browserSync, watchJS, watchCSS, watchHTML, watchJSON } = require('./browserSync');

gulp.task('watch', gulp.series(browserSync, watchJS, watchCSS, watchHTML, watchJSON));