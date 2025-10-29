const { src, dest, series, parallel, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const fileInclude = require('gulp-file-include');
const { rm } = require('fs/promises');

// 🧹 Clean
const clean = async (cb) => {
    try {
        await rm('dist', { recursive: true, force: true });
        console.log('Папка dist успішно видалена.');
    } catch (err) {
        if (err.code !== 'ENOENT') {
            console.error('Помилка при видаленні папки dist:', err);
        }
    }
    cb();
};

// 📄 HTML
// ВИПРАВЛЕНО: Включаємо index.html та всі компоненти
const html = () => src(['src/app/*.html', 'src/app/components/**/*.html'])
    .pipe(fileInclude({ prefix: '@@', basepath: '@file' }))
    .pipe(dest('dist'))
    .pipe(browserSync.stream());

// 🎨 Styles
// ВИПРАВЛЕНО: Шлях до scss у src/app/
const styles = () => src('src/app/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cssnano())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream());

// 💻 Scripts
// ВИПРАВЛЕНО: Шлях до js у src/app/
const scripts = () => src('src/app/js/**/*.js')
    .pipe(concat('main.min.js'))
    .pipe(uglify().on('error', e => {
        console.log(e.toString());
        this.emit('end');
    }))
    .pipe(dest('dist/js'))
    .pipe(browserSync.stream());

// 🖼 Images - ТУТ УЖЕ ПРАВИЛЬНО
const images = () => src('src/app/images/**/*')
    .pipe(imagemin())
    .pipe(dest('dist/images'));

// 🌟 Favicon
const favicon = () => src('src/favicon.ico', { allowEmpty: true })
    .pipe(dest('dist'));

// === ТАСКИ ДЛЯ BOOTSTRAP ===

const bootstrapCSS = () => src('node_modules/bootstrap/dist/css/bootstrap.min.css')
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream());

const bootstrapJS = () => src('node_modules/bootstrap/dist/js/bootstrap.bundle.min.js')
    .pipe(dest('dist/js'))
    .pipe(browserSync.stream());

// 🔄 Server
const sync = done => {
    browserSync.init({ server: { baseDir: 'dist' } });
    done();
};

// 👀 Watcher
const watcher = () => {
    // ВИПРАВЛЕНО: Спостерігаємо за всіма HTML-файлами в src/app/
    watch('src/app/**/*.html', html);
    // ВИПРАВЛЕНО: Спостерігаємо за scss у src/app/
    watch('src/app/scss/**/*.scss', styles);
    // ВИПРАВЛЕНО: Спостерігаємо за js у src/app/
    watch('src/app/js/**/*.js', scripts);
    // ТУТ УЖЕ ПРАВИЛЬНО
    watch('src/app/images/**/*', images);
};

// 🏁 Default
exports.default = series(
    clean,
    parallel(html, styles, scripts, images, favicon, bootstrapCSS, bootstrapJS),
    sync,
    watcher
);