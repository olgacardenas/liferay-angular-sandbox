var gulp = require('gulp');
var karma = require('karma').server;
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var path = require('path');
var plumber = require('gulp-plumber');
var runSequence = require('run-sequence');
var jshint = require('gulp-jshint');

/**
 * File patterns
 **/

// Root directory
var rootDirectory = path.resolve('./');

// Source directory for build process
var sourceDirectory = path.join(rootDirectory, './src');

/*
 * Section for global functionality
 * ----------------------------------------------------
 */

var sourceFiles = [

  // Make sure module files are handled first
  path.join(sourceDirectory, '/**/*.module.js'),

  // Ignore independent portlet files
  path.join('!' + sourceDirectory, '/**/*-portlet.js'),

  // Then add all JavaScript files
  path.join(sourceDirectory, '/**/*.js')
];

var lintFiles = [
  'gulpfile.js',
  // Karma configuration
  'karma-*.conf.js'
].concat(sourceFiles);

gulp.task('build', function() {
  gulp.src(sourceFiles)
    .pipe(plumber())
    .pipe(concat('copa.js'))
    .pipe(gulp.dest('./dist/'))
    .pipe(uglify())
    .pipe(rename('copa.min.js'))
    .pipe(gulp.dest('./dist'));
});

/**
 * Validate source JavaScript
 */
gulp.task('jshint', function () {
  return gulp.src(lintFiles)
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

/**
 * Run test once and exit
 */
gulp.task('test-src', function (done) {
  karma.start({
    configFile: __dirname + '/karma-src.conf.js',
    singleRun: true
  }, done);
});

/**
 * Run test once and exit
 */
gulp.task('test-dist-concatenated', function (done) {
  karma.start({
    configFile: __dirname + '/karma-dist-concatenated.conf.js',
    singleRun: true
  }, done);
});

/**
 * Run test once and exit
 */
gulp.task('test-dist-minified', function (done) {
  karma.start({
    configFile: __dirname + '/karma-dist-minified.conf.js',
    singleRun: true
  }, done);
});

/**
 * Copy distribution files to liferay theme
 */
gulp.task('copy-to-theme', function() {
  gulp.src('./dist/copa.js')
    .pipe(gulp.dest('../../themes/copa-theme/src/main/webapp/js'));
  gulp.src('./dist/copa.min.js')
    .pipe(gulp.dest('../../themes/copa-theme/src/main/webapp/js'));
});

/**
 * Section for individual portlet js
 * ----------------------------------------------------
 */

//Proof of concept: B portlet
gulp.task('build-b-portlet', function() {
  gulp.src(path.join(sourceDirectory, '/**/b-portlet.js'))
    .pipe(plumber())
    .pipe(concat('b-portlet.js'))
    .pipe(gulp.dest('./dist/'))
    .pipe(uglify())
    .pipe(rename('b-portlet.min.js'))
    .pipe(gulp.dest('./dist'));
});
gulp.task('copy-to-b-portlet', function() {
  gulp.src('./dist/b-portlet.min.js')
    .pipe(gulp.dest('../../portlets/test-portlets/src/main/webapp/js'));
});

/**
 * All
 * ----------------------------------------------------
 */

gulp.task('copy-to-liferay', function (done) {
  runSequence('copy-to-theme', 'copy-to-b-portlet', done);
});

gulp.task('process-all', function (done) {
  runSequence('jshint', 'test-src', 'build', 'build-b-portlet', 'copy-to-liferay', done);
});

gulp.task('default', function () {
  runSequence('process-all');
});
