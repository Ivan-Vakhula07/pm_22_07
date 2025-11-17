// Імпорти: Всі необхідні модулі Gulp
const gulp = require('gulp');
const { src, dest } = require('gulp');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('cssnano');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const file_include = require('gulp-file-include');
const imageminOriginal = require('gulp-imagemin');
// Динамічний імпорт для gulp-imagemin (Ваш код, залишаємо для сумісності)
async function getImagemin() {
    const imagemin = await import('gulp-imagemin');
    return imagemin.default;
}


// =========================================================
// 🆕 ДОДАНІ ТАСКИ ДЛЯ BOOTSTRAP
// =========================================================

// 9. Таск Bootstrap CSS: Копіювання та мінімізація Bootstrap CSS
gulp.task('bootstrap-css', () => {
    // Припускаємо, що файл знаходиться у node_modules
    return src('node_modules/bootstrap/dist/css/bootstrap.min.css')
        .pipe(dest('dist/css'))
        .pipe(browserSync.stream());
});

// 10. Таск Bootstrap JS: Копіювання та мінімізація Bootstrap JS
gulp.task('bootstrap-js', () => {
    // Припускаємо, що файл знаходиться у node_modules
    return src('node_modules/bootstrap/dist/js/bootstrap.bundle.min.js')
        .pipe(dest('dist/js'))
        .pipe(browserSync.reload({stream: true}));
});

// =========================================================
// ⚙️ ОСНОВНІ ТАСКИ
// =========================================================

// 1. Таск Styles: Компіляція SCSS та мінімізація
gulp.task('styles', () => {
    return src('src/app/scss/index.scss')
        .pipe(sass().on('error', sass.logError)) // Компіляція SCSS
        .pipe(postcss([cssnano()])) // Мінімізація CSS
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('dist/css'))
        // Оновлення стилів без перезавантаження сторінки
        .pipe(browserSync.stream());
});

// 2. Таск Uglify: Об'єднання та мінімізація JS
gulp.task('uglify', () => {
    return src('src/app/js/*.js')
        .pipe(concat('all.min.js'))
        .pipe(uglify())
        .pipe(dest('dist/js'))
        // Перезавантаження після мінімізації JS
        .pipe(browserSync.reload({stream: true}));
});

// 3. Таск HTML: Копіювання HTML та include
gulp.task('html', () => {
    return src('src/app/index.html')
        .pipe(file_include({
            prefix: '@@',
            basepath: '@file'}))
        .pipe(dest('dist'))
        // Перезавантаження після оновлення HTML
        .pipe(browserSync.reload({stream: true}));
});

// 4. Таск Img: Мінімізація та копіювання зображень
gulp.task('img', async () => {
    // Використовуємо оригінальний require для стабільності
    return src('src/app/img/*', { encoding: false })
        .pipe(imageminOriginal())
        .pipe(dest('dist/img'))
        .pipe(browserSync.reload({stream: true}));
});

// 5. Таск Data: Копіювання data.json
gulp.task('data', () => {
    return src('src/data/data.json')
        .pipe(dest('dist/data'))
        // Перезавантаження після оновлення Data
        .pipe(browserSync.reload({stream: true}));
});

// 6. Watcher: Слідкує за змінами
gulp.task('watch', () => {
    gulp.watch('src/app/scss/**/*.scss', gulp.series('styles'));
    gulp.watch('src/app/js/*.js', gulp.series('uglify'));
    gulp.watch(['src/app/index.html', 'src/app/html/*.html'], gulp.series('html'));
    gulp.watch('src/data/data.json', gulp.series('data'));
    gulp.watch('src/app/img/*', gulp.series('img'));
    // Bootstrap файли не відстежуються, оскільки вони є зовнішніми бібліотеками
});

// 7. BrowserSync: Запуск сервера
gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: './dist', // Сервер обслуговує папку, куди компілюється весь код
        },
        // open: false
    });
});

// 8. Default task: Основна команда для збирання
gulp.task('default', gulp.series(
    // Збираємо всі ресурси, включаючи Bootstrap
    gulp.parallel('html', 'styles', 'uglify', 'img', 'data', 'bootstrap-css', 'bootstrap-js'),
    // Запускаємо сервер та спостереження
    gulp.parallel('browser-sync', 'watch')
))