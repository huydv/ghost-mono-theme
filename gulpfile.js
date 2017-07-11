var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var cleancss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var prettify = require('gulp-jsbeautifier');
var runSequence = require('run-sequence');
var del = require('del');

// Create a browser sync instance
var bs = require('browser-sync').create(); 

// Source path
var src = {
    css: ['scripts/css/**/*.scss', '!scripts/css/lib'],
    js: ['scripts/js/**/*.js', '!scripts/js/lib'],
    hbs: '**/*.hbs'
}

// Library source path
var srcLib = {
    css: ['scripts/css/lib/**/*.css'],
    js: ['scripts/js/lib/**/*.js']
}

// Dest path
var dest = {
    css: 'assets/css/',
    js: 'assets/js/',
}

// Library Dest path
var destLib = {
    css: 'assets/css/lib',
    js: 'assets/js/lib',
}

// Convert sass -> css files with sourcemaps
gulp.task('sass:dev', function() {
    return gulp
        .src(src.css)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dest.css))
        .pipe(bs.reload({stream: true}));
});

// Copy css library files into dest
gulp.task('css:copylib', function() {
    return gulp
        .src(srcLib.css)
        .pipe(gulp.dest(destLib.css));
});

// Copy js files into dest
gulp.task('js:dev', function() {
    return gulp
        .src(src.js)
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dest.js))
        .pipe(bs.reload({stream: true}));
});

// Copy js library files into dest
gulp.task('js:copylib', function() {
    return gulp
        .src(srcLib.js)
        .pipe(gulp.dest(destLib.js));
});

// Convert sass -> css files without sourcemaps + minify
gulp.task('sass:production', function() {
    return gulp
        .src(src.css)
        .pipe(sass().on('error', sass.logError))
        .pipe(cleancss())
        .pipe(gulp.dest(dest.css))
        .pipe(bs.reload({stream: true}));
});

// Copy js files into dest + minify
gulp.task('js:production', function() {
    return gulp
        .src(src.js)
        .pipe(uglify())
        .pipe(gulp.dest(dest.js))
        .pipe(bs.reload({stream: true}));
});

// init browser sync
gulp.task('browser-sync', function() {
    bs.init({
        proxy: 'http://localhost:2368'
    });
});

// Format CSS code
gulp.task('pretitify:css', function() {
    return gulp
        .src(src.css)
        .pipe(prettify())
        .pipe(gulp.dest('./'));
});

// Format Js code
gulp.task('pretitify:js', function() {
    return gulp
        .src(src.js)
        .pipe(prettify())
        .pipe(gulp.dest('./'));
});

// Format CSS + Js code
gulp.task('pretitify', ['pretitify:css', 'pretitify:js']);

// Delete dest CSS dir files
gulp.task('cleanDir:css', function() {
    return del(dest.css);
});

// Delete dest JS dir files
gulp.task('cleanDir:js', function() {
    return del(dest.js);
});

// Delete dest CSS + JS dir files
gulp.task('cleanDir', ['cleanDir:css', 'cleanDir:js']);

// Watch files change event to reload browser(develop mode)
gulp.task('watch:dev', ['browser-sync'], function() {
    gulp.watch(src.css, ['sass:dev']);
    gulp.watch(src.js, ['js:dev']);
    gulp.watch(src.hbs).on('change', bs.reload);
});

// Watch files change event to reload browser(production mode)
gulp.task('watch:production', ['browser-sync'], function() {
    gulp.watch(src.css, ['sass:production']);
    gulp.watch(src.js, ['js:production']);
    gulp.watch(src.hbs).on('change', bs.reload);
});

// Develop task
gulp.task('dev', function(callback) {
    runSequence('cleanDir',
             ['css:copylib', 'js:copylib'],
             ['sass:dev', 'js:dev'],
             'watch:dev',
             callback)
}); 

// Release production task
gulp.task('production', function(callback) {
    runSequence('cleanDir',
                ['css:copylib', 'js:copylib'],
                ['sass:production', 'js:production'],
                'watch:production',
                callback)
});

