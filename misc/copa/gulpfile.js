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
 * ----------------------------------------------------
 **/
var rootDirectory = path.resolve('./');
var sourceDirectory = path.join(rootDirectory, './src');

/**
 * Run tests once and exit
 * ----------------------------------------------------
 */
gulp.task('test-src', function (done) {
  karma.start({
    configFile: __dirname + '/karma-src.conf.js',
    singleRun: true
  }, done);
});

gulp.task('test-dist-concatenated', function (done) {
  karma.start({
    configFile: __dirname + '/karma-dist-concatenated.conf.js',
    singleRun: true
  }, done);
});

gulp.task('test-dist-minified', function (done) {
  karma.start({
    configFile: __dirname + '/karma-dist-minified.conf.js',
    singleRun: true
  }, done);
});

/*
 * Functionality inserted inside liferay theme
 * ----------------------------------------------------
 */

var themeSourceFiles = [
  path.join(sourceDirectory, '/**/*.module.js'), // Make sure module files are handled first
  path.join('!' + sourceDirectory, '/**/*-portlet.js'), // Ignore independent portlet files
  path.join(sourceDirectory, '/**/*.js') // Then add all JavaScript files
];

gulp.task('build', function() {
  gulp.src(themeSourceFiles)
    .pipe(plumber())
    .pipe(concat('copa.js'))
    .pipe(gulp.dest('./dist/'))
    .pipe(gulp.dest('../../themes/copa-theme/src/main/webapp/js'))
    .pipe(uglify())
    .pipe(rename('copa.min.js'))
    .pipe(gulp.dest('./dist'))
    .pipe(gulp.dest('../../themes/copa-theme/src/main/webapp/js'));
});

/**
 * Functionality inserted inside individual portlets
 * ----------------------------------------------------
 */

//Proof of concept: B portlet
var bPortletName = 'b-portlet';
var bPortletSourceFiles = path.join(sourceDirectory, '/**/' + bPortletName + '.js');
gulp.task('build-b-portlet', function() {
  gulp.src(bPortletSourceFiles)
    .pipe(plumber())
    .pipe(concat(bPortletName + '.js'))
    .pipe(gulp.dest('./dist/'))
    .pipe(uglify())
    .pipe(rename(bPortletName + '.min.js'))
    .pipe(gulp.dest('./dist'))
    .pipe(gulp.dest('../../portlets/test-portlets/src/main/webapp/js'));
});

/**
 * Execute for all
 * ----------------------------------------------------
 */

// Validate source JavaScript
var lintFiles = [
  'gulpfile.js',
  'karma-*.conf.js',
  bPortletSourceFiles
].concat(themeSourceFiles);

gulp.task('jshint', function () {
  return gulp.src(lintFiles)
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

// Group tasks
gulp.task('process-all', function (done) {
  runSequence('jshint', 'test-src', 'build', 'build-b-portlet', done);
});

// Make default
gulp.task('default', function () {
  runSequence('process-all');
});
