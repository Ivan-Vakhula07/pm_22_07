/*
// gulpfile.js (ФІНАЛЬНА ВЕРСІЯ: Готова до запуску)

var gulp = require('gulp');
// ІМПОРТУЄМО ФУНКЦІЇ GULP 4
var { series, parallel } = gulp;

// ВИПРАВЛЕНО: Явно встановлюємо компілятор Dart Sass
const sassCompiler = require('sass');
const sass = require('gulp-sass')(sassCompiler);

var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var mq4HoverShim = require('mq4-hover-shim');
var rimraf = require('rimraf').sync;
var browser = require('browser-sync');
var panini = require('panini');
var concat = require('gulp-concat');
var merge = require('merge-stream');

var port = process.env.SERVER_PORT || 8080;
var nodepath =  'node_modules/';
var assetspath =  'assets/';

// Starts a BrowerSync instance
gulp.task('server', function(){
    browser.init({server: './_site', port: port});
});

// Watch files for changes
gulp.task('watch', function() {
    gulp.watch('scss/!**!/!*', gulp.series('compile-scss', browser.reload));
    gulp.watch('sass/!**!/!*', gulp.series('compile-sass', browser.reload));
    gulp.watch('js/!**!/!*', gulp.series('copy-js', browser.reload));
    gulp.watch('images/!**!/!*', gulp.series('copy-images', browser.reload));
    gulp.watch('html/pages/!**!/!*', gulp.series('compile-html'));
    gulp.watch(['html/{layouts,includes,helpers,data}/!**!/!*'], gulp.series('compile-html:reset','compile-html'));
    gulp.watch(['./src/{layouts,partials,helpers,data}/!**!/!*'], panini.refresh);
});

// Erases the dist folder
gulp.task('reset', function(done) {
    rimraf('bulma/!*');
    rimraf('scss/!*');
    rimraf('assets/css/!*');
    rimraf('assets/fonts/!*');
    rimraf('images/!*');
    done();
});

// Erases the dist folder
gulp.task('clean', function(done) {
    rimraf('_site');
    done();
});

// Copy Bulma filed into Bulma development folder
gulp.task('setupBulma', function() {
    var streams = merge();
    streams.add(gulp.src([nodepath + 'bulma/!*.sass']).pipe(gulp.dest('bulma/')));
    streams.add(gulp.src([nodepath + 'bulma/!**!/!*.sass']).pipe(gulp.dest('bulma/')));
    return streams;
});

// Copy static assets
gulp.task('copy', function(done) {
    // Copy other external font and data assets
    gulp.src(['assets/fonts/!**!/!*'], {allowEmpty: true}).pipe(gulp.dest('_site/assets/fonts/'));
    // Копіювання шрифтів Slick
    gulp.src([nodepath + 'slick-carousel/slick/fonts/!**!/!*'], {allowEmpty: true}).pipe(gulp.dest('_site/assets/css/fonts/'));
    done();
});

//Theme Sass variables
var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'compressed',
    includePaths: [nodepath + 'bulma/sass']
};

//Theme Scss variables
var scssOptions = {
    errLogToConsole: true,
    outputStyle: 'compressed',
    includePaths: ['./scss/partials']
};

// Compile Bulma Sass
gulp.task('compile-sass', function () {
    var processors = [
        mq4HoverShim.postprocessorFor({ hoverSelectorPrefix: '.is-true-hover ' }),
        autoprefixer()
    ];
    // ✅ ФІКС БЛОКУВАННЯ: дозволяємо пустий потік
    return gulp.src('./bulma/bulma.sass', {allowEmpty: true})
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./_site/assets/css/'));
});

// Compile Theme Scss
gulp.task('compile-scss', function () {
    var processors = [
        mq4HoverShim.postprocessorFor({ hoverSelectorPrefix: '.is-true-hover ' }),
        autoprefixer()
    ];
    // ✅ ФІНАЛЬНИЙ ФІКС: дозволяємо пустий потік для core.scss, якщо він відсутній
    return gulp.src('./scss/core.scss', {allowEmpty: true})
        .pipe(sourcemaps.init())
        .pipe(sass(scssOptions).on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./_site/assets/css/'));
});

// Compile Html
gulp.task('compile-html', function() {
    return gulp.src('html/pages/!**!/!*.html')
        .pipe(panini({
        root: 'html/pages/',
        layouts: 'html/layouts/',
        partials: 'html/includes/',
        helpers: 'html/helpers/',
        data: 'html/data/'
    }))
        .pipe(gulp.dest('_site'))
        .on('finish', browser.reload);
});

// Gulp 4: Використовуємо колбек (done) для асинхронних функцій
gulp.task('compile-html:reset', function(done) {
    panini.refresh();
    done();
});

// Compile css from node modules
gulp.task('compile-css', function() {
    return gulp.src([
        nodepath + 'slick-carousel/slick/slick.css',
        nodepath + 'slick-carousel/slick/slick-theme.css',
        nodepath + 'wallop/css/wallop.css',
        //Additional static css assets
        assetspath + 'css/icons.min.css',
    ], {allowEmpty: true})
        .pipe(concat('app.css'))
        .pipe(gulp.dest('./_site/assets/css/'));
});

// Compile js from node modules
gulp.task('compile-js', function() {
    return gulp.src([
        nodepath + 'jquery/dist/jquery.min.js',
        nodepath + 'slick-carousel/slick/slick.min.js',
        nodepath + 'scrollreveal/dist/scrollreveal.min.js',
        nodepath + 'jquery-waypoints/waypoints.min.js',
        nodepath + 'jquery.counterup/jquery.counterup.min.js',
        nodepath + 'wallop/js/Wallop.min.js',
        //Additional static js assets
        assetspath + 'js/ggpopover/ggpopover.min.js',
        assetspath + 'js/ggpopover/ggtooltip.js',
        assetspath + 'js/embed/embed.js',
        assetspath + 'js/gmap/gmap.min.js',
    ], {allowEmpty: true})
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./_site/assets/js/'));
});

//Copy Theme js to production site
gulp.task('copy-js', function() {
    return gulp.src('js/!**!/!*.js')
        .pipe(gulp.dest('./_site/assets/js/'));
});

//Copy images to production site
gulp.task('copy-images', function() {
    return gulp.src('images/!**!/!*')
        .pipe(gulp.dest('./_site/assets/images/'));
});

// ---------------------------------------------------------------------
// --- КОМПОЗИЦІЯ ЗАВДАНЬ GULP 4 ---
// ---------------------------------------------------------------------

// init
gulp.task('init', series('setupBulma'));

// build
gulp.task('build',
    series(
        'clean',
        'setupBulma', // Копіює файли
        function(done) { // ✅ ЗАЛИШАЄМО: 1-секундна затримка для синхронізації
            console.log('Почекайте 1 секунду для синхронізації файлової системи...');
            setTimeout(function() {
                done();
            }, 1000); // 1000 мс = 1 секунда
        },
        'copy',
        'compile-html',
        parallel(
            'compile-js',
            'compile-css',
            'copy-js',
            'compile-sass',
            'compile-scss', // Тепер не впаде
            'copy-images'
        )
    )
);

// default
gulp.task('default', series('build', parallel('server', 'watch')));*/

const {src, dest, series, parallel, watch} = require('gulp');
const fileInclude = require('gulp-file-include');
const browserSync = require('browser-sync').create();


const html_task = () => {
    return src('src/app/index.html')
        .pipe(fileInclude({prefix: '@@', basepath: '@file'}))
        .pipe(dest('dist'));
}

const serve_task = (done) => {
    browserSync.init({
        server: {baseDir: 'dist'},
        open: true,
        notify: false
    });
    done();
}

const reload = (done) => {
    browserSync.reload();
    done();
}

const watch_task = () => {
    watch('src/app/**/*.html', series(html_task, reload));
    /*watch(paths.scss, series(scss_task, reload));
    watch(paths.js, series(js_task, reload));
    watch(paths.imgs, series(imgs_task, reload));*/
}

const build = series(
    html_task,
    /*series(bootstrapCSS, bootstrapJS),
    parallel(scss_task, js_task, imgs_task)*/
);

exports.build = build;
exports.default = series(build, serve_task, watch_task);
