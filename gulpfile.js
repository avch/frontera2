var gulp = require('gulp'),
	path = require('path'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	concat = require('gulp-concat'),
	autoprefixer = require('gulp-autoprefixer'),
	cssnano = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    babelify = require('babelify'),
	browserify = require('browserify'),
	buffer = require('vinyl-buffer'),
	source = require('vinyl-source-stream'),
    livereload = require('gulp-livereload'),
    sprity = require('sprity'),
    gulpif = require('gulp-if'),
    del = require('del');

var supported = [
    'last 2 versions',
    'safari >= 8',
    'ie >= 10',
    'ff >= 20',
    'ios 6',
    'android 4'
];

gulp.task('clean-css', function() {
    return del(['./assets/css']);
});

gulp.task('clean-js', function() {
    return del(['./assets/js']);
});

gulp.task('sprite', ['clean-css'], function () {
  return sprity.src({
    src: './src/images/icons/*.png',
    style: './assets/css/sprite.css',
    margin: 0
  })
  .pipe(gulpif('*.png', gulp.dest('./assets/images/'), gulp.dest('./assets/css/')))
});

gulp.task('styles-main', ['clean-css'], function() {
  return gulp.src('./src/scss/main.scss')
  		.pipe(sourcemaps.init({loadMaps: true}))
  		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./assets/css'))
		  .pipe(autoprefixer('last 2 version'))
		  .pipe(cssnano({
		    autoprefixer: {browsers: supported, add: true}
		  }))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./assets/css'));
});

gulp.task('styles-import', ['clean-css'], function() {
  return gulp.src('./src/scss/import.scss')
		    .pipe(sourcemaps.init({loadMaps: true}))
		    .pipe(sass().on('error', sass.logError))
  			.pipe(sourcemaps.write())
		    .pipe(autoprefixer('last 2 version'))
		    .pipe(cssnano({
		    	autoprefixer: {browsers: supported, add: true}
		    }))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./assets/css'));
});

gulp.task('styles', ['styles-main', 'styles-import', 'sprite'], function() {
  return gulp.src('./assets/css/*.css')
	    .pipe(sourcemaps.init({loadMaps: true}))
	    	.pipe(concat('merge.css'))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./assets/css'));
});

gulp.task('scripts', ['clean-js'], function() {
	var bundler = browserify({
        entries: 'src/js/main.js',
        debug: true
    });
    bundler.transform(babelify, {presets: ['es2015']});

    return bundler.bundle()
        .on('error', function (err) { console.error(err); })
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./assets/js'));
});

gulp.task('compile', [], function() {
    gulp.start('styles', 'scripts');
});

gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('./src/scss/**.scss', ['styles-merge']);

  // Watch .js files
  gulp.watch('./src/js/*.js', ['scripts']);

  // Create LiveReload server
  livereload.listen();

  // Watch any files in assets/, reload on change
  gulp.watch(['./assets/**']).on('change', livereload.changed);

});
