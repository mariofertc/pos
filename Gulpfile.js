var gulp = require('gulp'),
	browserSync = require('browser-sync'),
    //browserify = require('gulp-browserify'),
    browserify = require('browserify'),
	uglify = require('gulp-uglify'),
	gulpif = require('gulp-if'),
	connect = require('gulp-connect-php'),
	replace = require('gulp-replace'),
	reload = browserSync.reload,
	mainBower = require('main-bower-files'),
    filter = require('gulp-filter'),
    source = require('vinyl-source-stream');
var concat = require('gulp-concat');

var env=process.env.NODE_ENV || 'development';
var host = "localhost";
var puerto = 6666;

var config = {
    sassPath: './resources/sass',
    bowerDir: './assets/bower_components',
    bowerJson: './assets/bower.json'
}

var url_actual = '/pos/web/market';

gulp.task('js', () =>
  gulp.src(['assets/web/js/**/*.js','!assets/web/js/dev/main.js'])
    	.pipe(gulpif(env === "production",uglify()))
		.pipe(gulp.dest('assets/web/js_min/'))
		.pipe(reload({stream:true}))
);

gulp.task('js-bower', () => {
    return gulp.src(mainBower({
        paths: {
            bowerDirectory: config.bowerDir,
            bowerJson: config.bowerJson
        },
        overrides: {
            bootstrap4: {
                main: [
                    './dist/js/bootstrap.js'
                ]
            },
            "jquery-validation":{
                main:[
                    './dist/additional-methods.js',
                    "./dist/jquery.validate.js"
                ]
            },
            "startbootstrap-sb-admin":{
                main:[
                    './js/sb-admin-2.js'
                ]
            },
            "tempusdominus-bootstrap-4":{
                main:[
                    './build/js/tempusdominus-bootstrap-4.js'
                ]
            },
            "summernote":{
            	main:[
            		'./dist/summernote.js',
            		'./lang/summernote-es-ES.js'
            	]
            }
        },
        debugging: true, includeDev: true,// checkExistence: true,
    }))
            .pipe(filter('**/*.js'))
            .pipe(gulpif(env === "production", uglify({'comments': false})))
            .pipe(gulp.dest('./assets/js/min'));
});


gulp.task('js_back', () =>
  gulp.src(['assets/bower_components/jquery/dist/jquery.js',
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
		.pipe(reload({stream:true}))
);

gulp.task('js_market', () =>
  gulp.src(['assets/bower_components/jquery/dist/jquery.js',
        'assets/bower_components/jquery-validation/dist/jquery.validate.js',
        'assets/bower_components/bootstrap/dist/js/bootstrap.js',
        'assets/bower_components/pnotify/dist/pnotify.js',
        'assets/bower_components/custombox/dist/legacy.min.js',
        'assets/bower_components/custombox/dist/custombox.min.js',
        'assets/bower_components/bootstrap-star-rating/js/star-rating.min.js',
        'assets/web/js_min/jquery.scrollUp.min.js',
        'assets/web/js_min/price-range.js',
        //'assets/web/js_min/jquery.prettyPhoto.js',
        'assets/web/js_min/main.js',
        ])
        .pipe(concat('market.js'))
        .pipe(gulpif(env === "production",uglify()))
        .pipe(gulp.dest('assets'))
        .pipe(reload({stream:true}))
);


gulp.task('js_upload_images', () =>
  gulp.src(['assets/bower_components/blueimp-tmpl/js/tmpl.min.js',
        'assets/bower_components/blueimp-load-image/js/load-image.all.min.js',
        'assets/bower_components/blueimp-gallery/js/jquery.blueimp-gallery.min.js',
        'assets/bower_components/jquery-file-upload/js/jquery.iframe-transport.js',
        'assets/bower_components/jquery-file-upload/js/jquery.fileupload.js',
        'assets/bower_components/jquery-file-upload/js/jquery.fileupload-process.js',
        'assets/bower_components/jquery-file-upload/js/jquery.fileupload-image.js',
        'assets/bower_components/jquery-file-upload/js/jquery.fileupload-audio.js',
        'assets/bower_components/jquery-file-upload/js/jquery.fileupload-video.js',
        'assets/bower_components/jquery-file-upload/js/jquery.fileupload-validate.js',
        'assets/bower_components/jquery-file-upload/js/jquery.fileupload-ui.js',        
        ])
        .pipe(concat('upload_images.js'))
        .pipe(gulpif(env === "production",uglify()))
        .pipe(gulp.dest('assets'))
        .pipe(reload({stream:true}))
);

gulp.task('css-bower', function () {
    return gulp.src(mainBower({
        paths: {
            bowerDirectory: config.bowerDir,
            bowerJson: config.bowerJson
        },
        overrides: {
            bootstrap4: {
                main: [
                    './dist/css/bootstrap.css',
                    /*'./dist/js/bootstrap.js',
                    './dist/pnotify.js',
                    './dist/jquery.validate.js',
                    './dist/jquery.form.js',*/
                ]
            },
            "jquery-validation":{
                main:[
                    './dist/additional-methods.js',
                    "./dist/jquery.validate.js"
                ]
            },
            "startbootstrap-sb-admin":{
                main:[
                    './css/sb-admin-2.css'
                ]
            },
            "tempusdominus-bootstrap-4":{
                main:[
                    './build/css/tempusdominus-bootstrap-4.css'
                ]
            },
            "summernote":{
            	main:[
            		'./dist/summernote.css'
            	]
            }
        },
        debugging: true, includeDev: true,// checkExistence: true,
    }))
            .pipe(filter('**/*.css'))
            .pipe(gulpif(env === "production", uglify({'comments': false})))
            .pipe(gulp.dest('./assets/css/min'));
});

gulp.task('css_back', () =>
  gulp.src(['assets/bower_components/bootstrap/dist/css/bootstrap.css',
		'assets/bower_components/jquery-ui/themes/ui-lightness/jquery-ui.css',
		'assets/bower_components/pnotify/dist/pnotify.css',
		'assets/bower_components/pnotify/dist/pnotify.brighttheme.css',
		'css/bootstrap.css',
		'assets/bower_components/gentelella/build/css/custom.css',
		'assets/bower_components/font-awesome/css/font-awesome.css'])
    	.pipe(concat('back.css'))
		//.pipe(replace('../fonts/','../fonts/'))
		.pipe(replace('sourceMappingURL=bootstrap.css.map','xxxoxooo'))
		.pipe(gulpif(env === "production",uglify()))
		.pipe(gulp.dest('assets'))
		.pipe(reload({stream:true}))
);

//Eshopper CSS
gulp.task('css_market', () =>
  gulp.src(['assets/bower_components/bootstrap/dist/css/bootstrap.css',
        'assets/bower_components/font-awesome/css/font-awesome.css',
        'assets/bower_components/pnotify/dist/pnotify.css',
        'assets/bower_components/pnotify/dist/pnotify.brighttheme.css',
        'assets/bower_components/bootstrap-star-rating/css/star-rating.min.css',
        'assets/bower_components/custombox/dist/custombox.min.css',
        'assets/web/css/prettyPhoto.css',
        'assets/web/css/price-range.css',
        'assets/web/css/animate.css',
        'assets/web/css/main.css',
        'assets/web/css/responsive.css',])
        .pipe(concat('market.css'))
        //.pipe(replace('../fonts/','../fonts/'))
        //.pipe(replace('sourceMappingURL=bootstrap.css.map','xxxoxooo'))
        .pipe(gulpif(env === "production",uglify()))
        .pipe(gulp.dest('assets'))
        .pipe(reload({stream:true}))
);

gulp.task('css_upload_images', () =>
  gulp.src(['assets/bower_components/blueimp-gallery/css/blueimp-gallery.min.css',
        'assets/bower_components/jquery-file-upload/css/jquery.fileupload.css',
        'assets/bower_components/jquery-file-upload/css/jquery.fileupload-ui.css',])
        .pipe(concat('upload_images.css'))
        //.pipe(replace('../fonts/','../fonts/'))
        //.pipe(replace('sourceMappingURL=bootstrap.css.map','xxxoxooo'))
        .pipe(gulpif(env === "production",uglify()))
        .pipe(gulp.dest('assets'))
        .pipe(reload({stream:true}))
);

gulp.task('browserify', function() {
    return browserify('assets/web/js/dev/main.js')
        .bundle()
        //Pass desired output filename to vinyl-source-stream
        .pipe(source('main.js'))
        // Start piping stream to tasks!
        .pipe(gulp.dest('assets/web/js_min/'));
});

/*gulp.task('browsy', () =>
  gulp.src(['assets/web/js/dev/main.js'])
    	.pipe(browserify({ debug : env === 'development' }))
		.pipe(gulpif(env === "production",uglify()))
		.pipe(gulp.dest('assets/web/js_min/dev'))
		.pipe(reload({stream:true}))
);*/

gulp.task('css', () =>
  gulp.src(['assets/web/css/**/*.css'])
    	.pipe(gulpif(env === "production",uglify()))
		.pipe(gulp.dest('assets/web/css_min/'))
		.pipe(reload({stream:true}))
);

// Fonts
gulp.task('fonts', () =>
  gulp.src(['assets/bower_components/gentelella/vendors/bootstrap/dist/fonts/glyphicons-*.*',
                    'assets/bower_components/font-awesome/fonts/fontawesome-*.*'])
    	 .pipe(gulp.dest('fonts/'))
);

gulp.task('connect-sync', () =>
  connect.server({host:host},function(){
		browserSync({
			proxy:{
				target: host+url_actual
			}
		});
	})
);


gulp.task('php', () =>
  gulp.src(['**/*.php'])
    	.pipe(reload({stream:true}))
);

gulp.task('views', () =>
  gulp.src(['**/*.twig'])
    .pipe(reload({stream:true}))
);

gulp.task('watch', () => {
  	gulp.watch(['assets/web/js/**/*.js','!assets/web/js/dev/main.js'],['js']);
	gulp.watch(['assets/web/js/dev/**/*.js'],['browserify','js_market']);
	gulp.watch(['assets/web/css/**/*.css','!assets/web/css_min/**/*.css'],['css']);
	gulp.watch('**/*.php',['php']);
	gulp.watch('**/*.twig',['views'])
	}
);
gulp.task('default', gulp.series('js','browserify', 'js_market','css','connect-sync','watch'));
gulp.task('back', gulp.series('js_back','css_back'));
gulp.task('get_bower', gulp.series('js-bower','css-bower'));
gulp.task('all', gulp.series('js', 'js_back', 'css_back', 'browserify', 'css', 
    'css_upload_images', 'js_upload_images','css_market', 'js_market'));