var gulp = require('gulp'),
	browserSync = require('browser-sync'),
	browserify = require('gulp-browserify'),
	uglify = require('gulp-uglify'),
	gulpif = require('gulp-if'),
	connect = require('gulp-connect-php'),
	replace = require('gulp-replace'),
	reload = browserSync.reload;
var concat = require('gulp-concat');

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

gulp.task('js_back',function(){
	return gulp.src(['assets/bower_components/jquery/dist/jquery.js',
		'assets/bower_components/jquery-validation/dist/jquery.validate.js',
		'assets/bower_components/bootstrap/dist/js/bootstrap.js',
		'js/common.js',
		'assets/bower_components/pnotify/dist/pnotify.js',
		'assets/bower_components/jquery-ui/jquery-ui.js',
		'assets/bower_components/gentelella/build/js/custom.js'
		])
		.pipe(concat('back.js'))
		.pipe(gulpif(env === "production",uglify()))
		.pipe(gulp.dest('assets'))
		.pipe(reload({stream:true}));
});

gulp.task('css_back',function(){
	return gulp.src(['assets/bower_components/bootstrap/dist/css/bootstrap.css',
		'assets/bower_components/jquery-ui/themes/ui-lightness/jquery-ui.css',
		'assets/bower_components/pnotify/dist/pnotify.css',
		'assets/bower_components/pnotify/dist/pnotify.brighttheme.css',
		'css/bootstrap.css',
		'assets/bower_components/gentelella/build/css/custom.css',
		'assets/bower_components/font-awesome/css/font-awesome.css'
		])
		.pipe(concat('back.css'))
		//.pipe(replace('../fonts/','../fonts/'))
		.pipe(replace('sourceMappingURL=bootstrap.css.map','xxxoxooo'))
		.pipe(gulpif(env === "production",uglify()))
		.pipe(gulp.dest('assets'))
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

// Fonts
gulp.task('fonts', function() {
    return gulp.src([
                    'assets/bower_components/gentelella/vendors/bootstrap/dist/fonts/glyphicons-*.*',
                    'assets/bower_components/font-awesome/fonts/fontawesome-*.*'
                    ])
            .pipe(gulp.dest('fonts/'));
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

gulp.task('back',['js_back','css_back']);