const gulp = require('gulp'); // імпорт Gulp
const { src, dest } = require('gulp');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('cssnano');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const file_include = require('gulp-file-include');
const imagemin = require('gulp-imagemin');

// Dynamic import for gulp-imagemin
async function getImagemin() {
    const imagemin = await import('gulp-imagemin');
    return imagemin.default; // Use default export
}
gulp.task('styles', () => {
    // 💥 Вихідні SCSS файли знаходяться у src/app/scss
    return src('src/app/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError)) // Компілює SCSS у CSS
        .pipe(postcss([cssnano()])) // Мінімізує CSS
        .pipe(rename({ suffix: '.min' })) // Додає суфікс '.min' до файлу
        .pipe(dest('dist/css')); // Зберігає в папку dist/css
});

// Minify JS
gulp.task('uglify', () => {
    return src('src/app/js/*.js')
        .pipe(concat('all.min.js'))
        .pipe(uglify())
        .pipe(dest('dist/js'))
});

// Include HTML files together
gulp.task('html', () => {
    return src('src/app/index.html')
        .pipe(file_include({
            prefix: '@@',
            basepath: '@file'}))
        .pipe(dest('dist'));
});

// Compress images
gulp.task('img', async () => {
    const imagemin = await getImagemin();
    // 🟢 ФІКС 1: Шлях до вихідних зображень змінено на img/**/* (корінь)
    return src('src/app/img/**/*', { encoding: false })
        .pipe(imagemin())
        // Зберігаємо в папку dist/img
        .pipe(dest('dist/img'));
});

// Watcher
gulp.task('watch', () => {
    gulp.watch('src/app/scss/**/*.scss', gulp.series('styles'));
    gulp.watch('src/app/js/*.js', gulp.series('uglify'));
    gulp.watch('src/app/index.html', gulp.series('html'));
    gulp.watch('src/app/html/*.html', gulp.series('html'));
    // 🟢 ФІКС 2: Шлях для відстеження зображень змінено на img/**/* (корінь)
    gulp.watch('src/app/img/**/*', gulp.series('img'));

});

// Update browser
gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: './dist',
        }
    });
    gulp.watch('./dist').on('change', browserSync.reload);
    gulp.watch('./data').on('change', browserSync.reload);
});

// Default task
gulp.task('default', gulp.series('html', 'styles', 'uglify', 'img', gulp.parallel('browser-sync', 'watch')));
