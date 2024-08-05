const {src, dest} = require('gulp');
const gulp = require("gulp");
const del = require('del');
const uglify = require('gulp-uglify');
const rigger = require('gulp-rigger');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cssbeautify = require('gulp-cssbeautify');
const imagemin = require('gulp-imagemin');
const {stream} = require('browser-sync');
const notify = require('gulp-notify');
const fileinclude = require('gulp-file-include');
const browserSync = require('browser-sync').create();

/* Paths */
const srcPath = 'src/';
const distPath = 'dist/';

const path = {
    build: {
        html: distPath,
        css: distPath + 'css/',
        js: distPath + 'js/',
        img: distPath + 'img/',
        fonts: distPath + 'fonts/',
    },
    src: {
        html: srcPath + '*.html',
        css: srcPath + 'scss/*.scss',
        js: srcPath + 'js/*.js',
        img: srcPath + 'img/**/*.{jpg,png,svg,gif,webp,ico}',
        fonts: srcPath + '/fonts/**/*.{ttf, woff, woff2,svg,eot}',
    },
    watch: {
        html: srcPath + '**/*.html',
        css: srcPath + 'scss/**/*.scss',
        js: srcPath + 'js/**/*.js',
        img: srcPath + 'img/**/*.{jpg,png,svg,gif,webp,ico}',
        fonts: srcPath + '/fonts/**/*.{ttf, woff, woff2,svg,eot}',
    },
    clean: './' + distPath
}

function serve() {
    browserSync.init({
        server: {
            baseDir: './' + distPath + '/'
        },
        port: 3000,
        notify: false,
    })
}

function html() {
    return src(path.src.html)
        .pipe(plumber())
        .pipe(fileinclude())
        .pipe(dest(path.build.html))
        .pipe(browserSync.stream())
}

function css() {
    return src(path.src.css)
        .pipe(plumber({
            errorHandler: function(err) {
                notify.onError({
                    title: 'SCSS error',
                    message: 'Error: <%= error.message %>',
                })(err);
                this.emit('end');
            }
        }))
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(cssbeautify())
        .pipe(dest(path.build.css))
        .pipe(browserSync.stream())
}

function js() {
    return src(path.src.js)
        .pipe(plumber({
            errorHandler: function(err) {
                notify.onError({
                    title: 'JS error',
                    message: 'Error: <%= error.message %>',
                })(err);
                this.emit('end');
            }
        }))
        .pipe(rigger())
        .pipe(dest(path.build.js))
        .pipe(browserSync.stream())
}

function img() {
    return src(path.src.img)
        .pipe(dest(path.build.img))
        .pipe(browserSync.stream())
}

function fonts() {
    return src(path.src.fonts)
        .pipe(dest(path.build.fonts))
        .pipe(browserSync.stream())
}

function clean() {
    return del(path.clean)
}

function watchFiles() {
    gulp.watch([path.watch.html], html)
    gulp.watch([path.watch.css], css)
    gulp.watch([path.watch.js], js)
    gulp.watch([path.watch.img], img)
    gulp.watch([path.watch.fonts], img)
}

const build = gulp.series(clean, gulp.parallel(html, css, js, img, fonts));
const watch = gulp.parallel(build, watchFiles, serve)

exports.html = html
exports.css = css
exports.js = js
exports.img = img
exports.fonts = fonts
exports.clean = clean
exports.build = build
exports.watch = watch
exports.default = watch
