var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    jade = require('gulp-jade'),
    slim = require('gulp-slim'),
    tsc = require('gulp-tsc'),
    compass = require('gulp-compass'),
    exec = require('child_process').exec;

gulp.task('run', function () {
  exec('nodewebkit');
});

gulp.task('slim', function () {
  gulp.src(["src/**/*.slim"])
    .pipe(plumber())
    .pipe(slim())
    .pipe(gulp.dest('./dist'));
});

gulp.task('jade', function () {
  gulp.src(["src/**/*.jade"])
    .pipe(plumber())
    .pipe(jade())
    .pipe(gulp.dest('./dist'));
});

gulp.task('tsc', function () {
  gulp.src(["src/**/*.ts"])
    .pipe(plumber())
    .pipe(tsc())
    .pipe(gulp.dest('./dist'));
});

gulp.task('compass', function () {
  gulp.src(["src/**/*.scss"])
    .pipe(plumber({
      errorHandler: function(error){
        console.log(error.message);
      }
    }))
    .pipe(compass({
      config_file: 'compass_config.rb',
      project: __dirname,
      css: 'tmp/css',
      sass: 'src'
    })).pipe(gulp.dest('./dist'));
});

gulp.task('default', ['build', 'run']);
gulp.task('build', ['slim', 'jade', 'tsc', 'compass']);
