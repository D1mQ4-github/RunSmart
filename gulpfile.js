const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sass = require('gulp-sass');

function serve() {
    browserSync.init({
        server: './src'
    });

    gulp.watch('./src/sass/**/*.scss', gulp.series(css));
    gulp.watch('./src/*.html').on('change', browserSync.reload);
}

function css() {
    return gulp.src('./src/sass/**/*.scss')
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(gulp.dest('./src/styles/'))
        .pipe(browserSync.stream());
}

module.exports.start = gulp.series(serve);