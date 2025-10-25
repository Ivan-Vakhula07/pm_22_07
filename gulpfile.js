const { src, dest, series, parallel, watch } = require('gulp');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify-es').default;
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

// === HTML ===
function html() {
  return src('src/app/**/*.html') // усі html у src/app і підпапках
    .pipe(fileInclude({ prefix: '@@', basepath: '@file' }))
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

// === SCSS ===
function scss() {
  return src('src/app/scss/**/*.scss') // усі scss
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(cleanCSS())
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream());
}

// === JS ===
function js() {
  return src('src/app/js/**/*.js') // усі js
    .pipe(concat('script.min.js'))
    .pipe(uglify())
    .pipe(dest('dist/js'))
    .pipe(browserSync.stream());
}

// === IMAGES ===
function imgs() {
  return src('src/imgs/**/*')
    .pipe(dest('dist/imgs'))
    .pipe(browserSync.stream());
}

// === SERVER ===
function serve(done) {
  browserSync.init({
    server: { baseDir: 'dist' },
    notify: false,
    open: true
  });
  done();
}

// === WATCH ===
function watcher() {
  watch('src/app/**/*.html', html); // усі html
  watch('src/app/scss/**/*.scss', scss); // усі scss
  watch('src/app/js/**/*.js', js); // усі js
  watch('src/imgs/**/*', imgs); // усі зображення
}

// === DEFAULT TASK ===
exports.default = series(
  parallel(html, scss, js, imgs),
  serve,
  watcher
);