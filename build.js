var NwBuilder = require('nw-builder');
var archiver = require('archiver');
var fs = require('fs-extra');
var package = require('./package.json');
var buildDir = './dist';
var buildType = package.name + '-' + package.version;
var destination = buildDir + '/' + buildType;

console.log('starting nw-builder..');

fs.removeSync(buildDir);

var nw = new NwBuilder({
    files: './app/**/*.*', // use the glob format
    platforms: ['win32'],
    version: '0.14.7',
    flavor: 'normal',
    buildDir: buildDir,
    buildType: function () {console.log(this, arguments); return buildType;},
    winIco: './design/logo.32x32.ico'
});

nw.build().then(function() {
	console.log('start zipping...');
	fs.readdirSync(destination)
		.filter(folder => fs.statSync(destination + '/' + folder).isDirectory())
		.forEach(platform => {
			var binary = fs.createWriteStream(destination + '-' + platform + '.zip');
			var archive = archiver('zip');
			archive.on('error', err => console.error(err));
			archive.on('end', () => {
				fs.removeSync(destination + '/' + platform);
				console.log('end zipping!')
			});
			archive.pipe(binary);
			archive.bulk([{
				expand: true,
				cwd: destination + '/' + platform,
				src: ['**/*'],
				dot: true
			}]);
			archive.finalize();
		})
});