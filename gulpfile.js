let gulp = require('gulp');
let babel = require('gulp-babel');

gulp.task('js', () => {
    return gulp.src(['src/*.js', 'src/**/*.js'])
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['js'], () => {
    
});