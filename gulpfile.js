var gulp = require("gulp");
var browserSync = require("browser-sync");
var reload = browserSync.reload;
var sass = require('gulp-sass');
var runSequence = require('run-sequence');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var wait = require('gulp-wait');
var notify = require('gulp-notify');

const AUTOPREFIXER_BROWSERS = [
  'last 2 version',
  '> 1%',
  'ie >= 9',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4',
  'bb >= 10'
];

gulp.task("serve", [], function () {
  browserSync({
    notify: false,
    server: {
      directory: true,
      baseDir: ".",
    },
  });
});

gulp.task('sass', function() {
  return gulp
    .src('css/*.scss')
    .pipe(sourcemaps.init())
    .pipe(
      plumber({
        errorHandler: notify.onError('Error: <%= error.message %>')
      })
    )
    .pipe(wait(500))
    .pipe(
      sass({
        outputStyle: 'compressed'
      }).on('error', sass.logError)
    )
    .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('css'))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});

// Watchers
gulp.task('watch', function() {
  gulp.watch('css/*.scss', ['sass']);
  gulp.watch('*.html', browserSync.reload);
  gulp.watch('*.js', browserSync.reload);
});

// Build Sequences
// ---------------

gulp.task('default', function(callback) {
  runSequence(['sass', 'serve'], 'watch', callback);
});