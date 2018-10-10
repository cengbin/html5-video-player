var gulp = require('gulp');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');//文件重命名
var cleanCSS = require('gulp-clean-css');// cleancss 模块（用于压缩 CSS）

//发布
gulp.task('build',function(){
  //合并JS文件
  gulp.src([
    "src/util.js",
    "src/VideoPlayer.js",
    "src/VideoControl.js"])  //选择合并的JS
    .pipe(concat('videoplayer.js'))   //合并js
    .pipe(gulp.dest('dist'))   //输出
    .pipe(rename({suffix:'.min'}))     //重命名
    .pipe(uglify())                    //压缩
    .pipe(gulp.dest('dist'));  //输出

  //拷贝,压缩css文件
  gulp.src('src/video-player.css')
    .pipe(gulp.dest('dist'))
    .pipe(rename({suffix:'.min'}))
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist'));
});




