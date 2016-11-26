var gulp = require('gulp');
var child_process = require('child_process');
var os = require('os');
var del = require('del');
var util = require('util');
var zip = require('gulp-zip');
var package = require('./package.json');

var distro = util.format('%s-%s-%s', package.name, package.version, os.platform());

gulp.task('clean', function() {
	return del(['dist'])
});

gulp.task('build', ['clean'], function() {
	console.log('building ' + distro + ' ...')

	// NWJS Binaries
	gulp.src(['bin/nwjs/**/*.*'])
		.pipe(gulp.dest('dist/' + distro));
	// Testrunners
	gulp.src(['bin/testrunner/**/*.*'])
		.pipe(gulp.dest('dist/' + distro + '/bin/testrunner'));
	// App
	gulp.src(['app/**/*.*'])
	 	.pipe(zip('package.nw'))
	 	.pipe(gulp.dest('dist/' + distro));

	// // Merge
	// if (os.platform() === 'win32') {
	// 	child_process.execSync('copy /b dist/' + distro + '/nw.exe+dist/' + distro + '/package.nw dist/' + distro + '/' + package.name + '.exe');
	// }

});

gulp.task('default', ['build']);