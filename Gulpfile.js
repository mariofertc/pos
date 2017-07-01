var gulp = require('gulp'),
	browserSync = require('browser-sync'),
	browserify = require('gulp-browserify'),
	uglify = require('gulp-uglify'),
	gulpif = require('gulp-if'),
	connect = require('gulp-connect-php')
	reload = browserSync.reload;

var env=process.env.NODE_ENV || 'development';
var host = "localhost";
var puerto = 6666;

var url_actual = '/pos/web/Carts';

gulp.task('js',function(){
	return gulp.src(['assets/web/js/**/*.js','!assets/web/js/dev/main.js'])
		.pipe(gulpif(env === "production",uglify()))
		.pipe(gulp.dest('assets/web/js_min/'))
		.pipe(reload({stream:true}));
});

gulp.task('browsy',function(){
	return gulp.src(['assets/web/js/dev/main.js'])
		.pipe(browserify({ debug : env === 'development' }))
		.pipe(gulpif(env === "production",uglify()))
		.pipe(gulp.dest('assets/web/js_min/'))
		.pipe(reload({stream:true}));
});

gulp.task('css',function(){
	return gulp.src(['assets/web/css/**/*.css'])
		.pipe(gulpif(env === "production",uglify()))
		.pipe(gulp.dest('assets/web/css_min/'))
		.pipe(reload({stream:true}));
});

gulp.task('connect-sync',function(){
	connect.server({host:host},function(){
		browserSync({
			proxy:{
				target: host+url_actual
			}
		});
	})
});

gulp.task('php',function(){
	gulp.src(['**/*.php'])
		.pipe(reload({stream:true}));	
});

gulp.task('views',function(){
	gulp.src(['**/*.twig'])
		.pipe(reload({stream:true}));	
});

gulp.task('watch',function(){
	gulp.watch(['assets/web/js/**/*.js','!assets/web/js/dev/main.js'],['js']);
	gulp.watch(['assets/web/js/dev/**/*.js'],['browsy']);
	gulp.watch(['assets/web/css/**/*.css','!assets/web/css_min/**/*.css'],['css']);
	gulp.watch('**/*.php',['php']);
	gulp.watch('**/*.twig',['views']);
});

gulp.task('default',['js','browsy','css','connect-sync','watch']);