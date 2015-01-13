// gulp
var gulp = require('gulp');
 
//plugins
var server = require('gulp-express');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var reload = browserSync.reload;
 
gulp.task('scripts', function() {
  gulp.src(['public/js/*.js','!public/js/all.js'])
    .pipe(concat('all.js'))
    .pipe(gulp.dest('public/js/'))
});
 
gulp.task('sass', function() {
    return gulp.src('public/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('public/css'))
        .pipe(reload({stream:true}));
});
 
gulp.task('browser-sync', function() {
    browserSync({
        proxy: "http://localhost:6500",
        ghostMode: false,
        port: 3000
    });
});
 
gulp.task('reload',function(){
       gulp.src('public/scss/*.scss')
     .pipe(reload({stream:true}));
});
 
gulp.task('watch', function() {
    gulp.watch('public/scss/**/*.scss', ['sass']);
    gulp.watch(['public/js/*.js','!public/js/all.js'], ['scripts']);
});
 
gulp.task('server', function () {
    // Start the server at the beginning of the task
    server.run({
        file: 'app'
    });
 
 // Restart the server when file changes
    gulp.watch(['public/**/*.html'], ['reload']);
    gulp.watch(['app.js', 'routes/**/*.js'], ['server']);
    gulp.watch(['app.js', 'views/**/*.jade'], ['reload']);
});
 
gulp.task('default', ['server','sass','scripts','watch','browser-sync']);