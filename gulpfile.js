/*global require*/

var gulp = require('gulp'),
    cleancss = require('gulp-clean-css'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    changed = require('gulp-changed'),
    rev = require('gulp-rev'),
    browserSync = require('browser-sync'),
    del = require('del'),
    ngannotate = require('gulp-ng-annotate');

gulp.task('jshint', function () {

    'use strict';

    return gulp.src('app/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

// Clean
gulp.task('clean', function () {

    'use strict';

    return del(['dist']);
});

// Default task
gulp.task('default', ['clean'], function () {

    'use strict';

    gulp.start('usemin', 'imagemin', 'copyfonts');
});

// Main Page
gulp.task('usemin', ['jshint'], function () {

    'use strict';

    return gulp.src('./app/index.html')
        .pipe(usemin({
            css: [cleancss(), rev()],
            js: [ngannotate(), uglify(), rev()]
        }))
        .pipe(gulp.dest('dist/'));
});

// Images
gulp.task('imagemin', function () {

    'use strict';

    return del(['dist/images']), gulp.src('app/images/**/*')
        .pipe(cache(imagemin({ 
            optimizationLevel: 3, 
            progressive: true, 
            interlaced: true })))
        .pipe(gulp.dest('dist/images'))
        .pipe(notify({ message: 'Images task complete' }));
});

// Fonts
gulp.task('copyfonts', ['clean'], function() {
   gulp.src('./bower_components/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
   .pipe(gulp.dest('./dist/fonts'));
   gulp.src('./bower_components/bootstrap/dist/fonts/**/*.{ttf,woff,eof,svg}*')
   .pipe(gulp.dest('./dist/fonts'));
});
    
// Watch
gulp.task('watch', ['browser-sync'], function() {
    
    // Watch .js, .css, and .html files
    gulp.watch('{app/js/**/*.js, app/css/**/*.css, app/**/*.html}', ['usemin']);
    
    // Watch image files
    gulp.watch('app/images/**/*', ['imagemin']);
});

gulp.task('browser-sync', ['default'], function () {
   var files = [
      'app/**/*.html',
      'app/css/**/*.css',
      'app/images/**/*.png',
      'app/js/**/*.js',
      'dist/**/*'
   ];

   browserSync.init(files, {
       server: {
           baseDir: "dist",
           index: "index.html"
        }
   });
    
    // Watch any files in dist/, reload on change
    gulp.watch(['dist/**']).on('change', browserSync.reload);

});