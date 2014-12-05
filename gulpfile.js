var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    jade = require('gulp-jade'),
    slim = require('gulp-slim'),
    tsc = require('gulp-tsc'),
    compass = require('gulp-compass'),
    exec = require('child_process').exec;

var error_option = {
  errorHandler: function(error){
    console.log(error.message);
  }
}
gulp.task('run', function () {
  exec('nodewebkit');
});

gulp.task('slim', function () {
  gulp.src(["src/**/*.slim"])
    .pipe(plumber(error_option))
    .pipe(slim({
      pretty: true
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('jade', function () {
  gulp.src(["src/**/*.jade"])
    .pipe(plumber(error_option))
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
    .pipe(plumber(error_option))
    .pipe(compass({
      config_file: 'compass_config.rb',
      project: __dirname,
      css: 'tmp/css',
      sass: 'src'
    })).pipe(gulp.dest('./dist'));
});

gulp.task('default', ['build', 'run']);
gulp.task('build', ['slim', 'jade', 'tsc', 'compass']);
