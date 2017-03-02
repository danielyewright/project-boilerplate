/* Plugins to load */
var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var del = require('del');
var zip = require('gulp-zip');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var packageJSON = require('./package.json');

/* Lists all files that should be copied
 * to the 'dist' folder for build tasks
 */
var dist = [
  './assets/js/main.min.js',
  './assets/css/style.css',
  './assets/images/**/*',
  './assets/fonts/**/*',
  './*.html',
  './*.+(png|jpg|txt|ico|pdf|md)'
];

/* Scripts task */
gulp.task('scripts', function() {
  return gulp.src([
    /* Add your JS files here, they will be combined in this order */
    'assets/libs/jquery/dist/jquery.js',
    'assets/libs/bootstrap/dist/js/bootstrap.js',
    'assets/js/plugins.js'
  ])
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(concat('main.js'))
  .pipe(gulp.dest('assets/js'))
  // .pipe(rename({suffix: '.min'}))
  .pipe(uglify())
  .pipe(gulp.dest('assets/js'));
});

/* Sass task */
gulp.task('sass', function() {
  return gulp.src('assets/scss/style.scss')
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(sass({includePaths: ['assets/scss']}))
  .pipe(gulp.dest('assets/css'))
  //.pipe(rename({suffix: '.min'}))
  .pipe(cleanCSS())
  .pipe(gulp.dest('assets/css'))
  /* Reload the browser CSS after every change */
  .pipe(reload({stream:true}));
});

gulp.task('styles', function() {
  return gulp.src([
    /* Add your CSS files here, they will be combined in this order */
    'assets/libs/bootstrap/dist/css/bootstrap.min.css',
    'assets/libs/font-awesome/css/font-awesome.min.css',
    'assets/css/style.css'
  ])
  .pipe(concat('style.css'))
  .pipe(gulp.dest('assets/css'))
  // .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('assets/css'))
  .pipe(reload({stream:true}));
});

/* Images task. Optimizes all PNG, JPG, and SVG images. */
gulp.task('images', function() {
  return gulp.src('assets/images/*')
  .pipe(imagemin({
    progressive: true,
    use: [pngquant()]
  }))
  .pipe(gulp.dest('assets/images'));
});

gulp.task('copyIconFonts', function() {
  gulp.src('assets/libs/font-awesome/fonts/**/*.{ttf,woff,woff2,eot,svg}')
  .pipe(gulp.dest('assets/fonts'));
});

gulp.task('copyFrameworkFonts', function() {
  gulp.src('assets/libs/bootstrap/fonts/**/*.{ttf,woff,,woff2,eot,svg}')
  .pipe(gulp.dest('assets/fonts'));
});

/* Prepare Browser-sync for localhost */
gulp.task('browser-sync', function() {
  browserSync.init(['assets/css/*.css', 'assets/js/*.js', '*.html'], {
    server: {
      baseDir: './'
    },
    open: false
  });
});

/* Reload task */
gulp.task('bs-reload', function() {
  browserSync.reload();
});

/* Deletes the entire 'dist' directory when running
 * the default task
 */
gulp.task('clean', function() {
  return del([
    'dist/'
  ]);
});

/* For production, deletes specific files from the
 * 'dist' directory. Also deletes the folder created
 * by the zipped file when unzipped
 */
gulp.task('clean:prod', function() {
  return del('dist/' + packageJSON.name + '-v' + packageJSON.version, [
    'dist/**/DS_Store',
    'dist/**/*.DS_Store'
  ]);
});

/* Adds all 'dist' files to a zip file for distribution
 * If you want to change the zipped filename, you'll have
 * to change 'name' and 'version' in package.json
 */
gulp.task('zip', function() {
  return gulp.src('dist/**/*')
  .pipe(zip(packageJSON.name + '-v' + packageJSON.version + '.zip'))
  .pipe(gulp.dest('dist'));
});

/* Build task for building the projet into a testable file structure */
gulp.task('build:dev', ['sass', 'styles', 'images', 'scripts'], function() {
  gulp.src(dist, {base: './'})
  .pipe(gulp.dest('dist/'));
});

/* Build task for production that deletes unwanted files,
 * and zips them for distribution
 */
gulp.task('build:prod', ['sass', 'images', 'scripts', 'clean:prod', 'zip'], function() {
  gulp.src(dist, {base: './'});
});

/* Default task. Watches scss, js, and html files for changes.
 * On file change, browserSync reloads HTML pages
 */
gulp.task('default', ['sass', 'styles', 'images', 'scripts', 'copyIconFonts', 'copyFrameworkFonts', 'clean', 'browser-sync'], function() {
  /* Watch scss, run the sass task on change. */
  gulp.watch(['assets/scss/*.scss', 'assets/scss/**/*.scss'], ['styles', 'sass'])
  /* Watch .js files, run the scripts task on change. */
  gulp.watch(['assets/js/*.js', '!assets/libs/jquery/**', '!assets/libs/bootstrap/**', '!assets/js/main.js', '!assets/js/main.min.js'], ['scripts'])
  /* Watch .jade files, run the bs-reload task on change. */
  gulp.watch(['*.html'], ['bs-reload']);
});
