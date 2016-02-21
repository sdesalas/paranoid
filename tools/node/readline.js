console.log('starting...');

var cp = require("child_process"),
    dir = cp.exec('..\\testrunner\\test\\run.bat ..\\..\\src\\app\\suites\\1.Echo.test', function() {console.log('done.')}),
    rl = require('readline').createInterface({input: dir.stdout, output: dir.stdin});

rl.on('line', function(data) {
	console.log('line:' + data)
});

dir.stderr.on('data', function(data) {
	console.error('error:' + data);
})