// gulp
var gulp = require('gulp');
var { parallel, task, watch, src, dest } = gulp;
 
//plugins
var server = require('gulp-express');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var reload = browserSync.reload;
var del = require('del');

sass.compiler = require('node-sass');
 
task('scripts', function () {
  src(['public/js/*.js','!public/js/all.js'])
    .pipe(concat('all.js'))
    .pipe(dest('public/js/'))
});
 
task('sass', function() {
    return src('public/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('public/css'))
        .pipe(reload({stream:true}));
});

task('clean', () => {
    return del([
        'public/css/main.css'
    ]);
});
 
task('browser-sync', function() {
    browserSync({
        proxy: "http://localhost:6500",
        ghostMode: false,
        port: 3000
    });
});
 
task('reload',function(){
       src('public/scss/*.scss')
     .pipe(reload({stream:true}));
});
 
task('watch', function() {
    watch('public/scss/*.scss', function() {
        cb();
    });
    watch(['public/js/*.js','!public/js/all.js'], function() {
        cb();
    });
});
 
task('server', function () {
    // Start the server at the beginning of the task
    server.run({
        file: 'app'
    });
 
 // Restart the server when file changes
    watch(['public/**/*.html'], reload);
    watch(['app.js', 'routes/**/*.js'], server);
    watch(['app.js', 'views/**/*.jade'], reload);
});
 
exports.default = parallel('server', 'clean', 'sass', 'scripts', 'watch', 'browser-sync');