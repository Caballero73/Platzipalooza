var gulp = require('gulp')
var postcss = require('gulp-postcss')
var mixins = require('postcss-mixins')
var atImport = require ('postcss-import')
var cssnested = require('postcss-nested')
var mqpacker = require('css-mqpacker')
var rucksack = require('rucksack-css')
var fileinclude = require('gulp-file-include')
var cssnext = require('postcss-cssnext')
var browserSync = require('browser-sync').create()

// Servidor de desarrollo
gulp.task('serve', function () {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  })
})

// Tarea para procesar el CSS
gulp.task('css', function () {
  var processors = [
    mixins(),
    atImport(),
    cssnested,
    rucksack(),
    cssnext({browsers:'last 5 versions'}),
    mqpacker
  ]
  return gulp.src('./src/app.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest('./dist/assets/css'))
    .pipe(browserSync.stream())
})

// Tarea para utilizar fileinclude
gulp.task('fileinclude', function() {
  gulp.src('./src/*.html')
    .pipe(fileinclude({
      prefix: '@',
      basepath: './src'
    }))
    .pipe(gulp.dest('./dist'));
});


// Tarea para vigilar los cambios
gulp.task('watch', function () {
  gulp.watch('./src/*.css', ['css']).on('change', browserSync.reload)
  gulp.watch('./src/*.html', ['fileinclude']).on('change', browserSync.reload)
})

gulp.task('default', ['watch', 'fileinclude', 'css', 'serve'])
