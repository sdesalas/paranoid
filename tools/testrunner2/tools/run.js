

var target, argname, argvalue, arg, args = {};
var fs = require('fs');
var system = require('system');
var compiler = require('./compiler');
var async = require('./async');
var runner = require('./runner');
var args = 



runner.log('');
runner.log('---------------------------------');
runner.log(' RUN.JS ');
runner.log('---------------------------------');
runner.log(' Working Directory:' + fs.workingDirectory);	


var executeFile = function(fullPathToFile) {
	// Point working directory to existing file location
	var workingDir = fullPathToFile.split('/');
	workingDir.pop();
	fs.changeWorkingDirectory(workingDir.join('/'));
	// Determine name of the file
	var filename = fullPathToFile.split('/').pop();
	runner.log('executing file.. ' + filename);
	runner.log('working path.. ' + fs.workingDirectory);
	var src = fs.read(filename);
	var code = compiler.compile(filename, src, runner.args);
	var lines = code.split('\n');
	casper.echo('End result is ' + lines.length + ' lines..');
	casper.echo('');
	for (var i = 0; i < lines.length; i ++) casper.echo( (i + 1) + '    ' + lines[i]);
	(new Function(code)).call(casper);
}


var executeDirectory = function(fullPath) {
	runner.log('executing directory.. ' + fullPath);
	runner.log('working path.. ' + fs.workingDirectory);
	runner.log('directory exists.. ' + fs.exists(fullPath));
	// Execute all files in order
	async.mapSeries(fs.list(fullPath), function(file, callback) {

		try {
			console.log('Trying... ' + file);
			var filepath = fullPath + '/' + file;
			if (file.split('.').pop() === "suite") {
				console.log('Test suite found! ' + filepath);
				executeFile(filepath);
			}
		} catch (e) {callback(e); }

		callback(null, true);

	}, function(results) {
		casper.echo('');
		casper.echo('---------------------------------');
		casper.echo(' FINISHED COMPILING DIRECTORY ');
		casper.echo('---------------------------------');
		casper.echo('');
	});
}

//runner.log('STEP 1: Load arguments');


//runner.log('STEP 2: Compile & Execute tests');

/*
var files = fs.list('./suites');
for(var i = 0; i < files.length; i++) {
	var file = 
}*/

//runner.log('TARGET: ' + target);
//runner.log('ARGS: ' + JSON.stringify(args));


if (fs.isDirectory(runner.target)) {
	runner.log('');
	runner.log('---------------------------------');
	runner.log(' COMPILING DIRECTORY ..');
	runner.log('---------------------------------');
	runner.log('');	
	executeDirectory(fs.absolute(runner.target));
} else if (fs.isFile(runner.target)) {
	runner.log('');
	runner.log('---------------------------------');
	runner.log(' COMPILING SINGLE FILE..');
	runner.log('---------------------------------');
	runner.log('');
	//executeFile(fs.absolute(runner.target));
	runner.queueTest(runner.target);
	runner.execute();
	casper.echo('');
	casper.echo('---------------------------------');
	casper.echo(' FINISHED COMPILING, EXECUTING ..');
	casper.echo('---------------------------------');
	casper.echo('');
} else if (runner.target === '-t') {
	casper.echo('');
	casper.echo('---------------------------------');
	casper.echo(' EXECUTE SELF TEST..');
	casper.echo('---------------------------------');
	casper.echo('');
	runner.selftest();
} else {
	console.log('');
	console.log('---------------------------------');
	console.log(' TEST RUNNER ');
	console.log(' By: Steven de Salas');
	console.log('---------------------------------');
	console.log('');
	console.log('This process compiles *.suite files into CasperJS test suites');
	console.log('and then executes them.');
	console.log('');
	console.log('See usage examples below:');
	console.log('');
	console.log('SINGLE FILE:');
	console.log('');
	console.log('  run.bat MyTests\\Login.suite');
	console.log('');
	console.log('SINGLE FILE (WITH PARAMETERS):');
	console.log('');
	console.log('  run.bat MyTests\\Login.suite @username=bob @pass=password');
	console.log('');
	console.log('DIRECTORY (WILL RUN ALL .suite FILES):');
	console.log('');
	console.log('  run.bat MyTests');
	console.log('');
	console.log('DIRECTORY (WITH PARAMETERS):');
	console.log('');
	console.log('  run.bat MyTests @username=bob @pass=password');
	console.log('');
	console.log('');
	console.log('NOTE:  Please ensure you point to *suite files and directories ');
	console.log('       relative to your working directory.');
	console.log('');
	console.log('NOTE2: Any @argument=blah you pass into the command line will');
	console.log('       overwrite variables inside your tests scripts');
	console.log('');
	console.log('  To exit press Ctrl+C (twice).');
}


// TIMEOUT AFTER 30 MINUTES
// THIS IS TO AVOID BACKGROUND PROCESSES LEFT HANGING
window.setTimeout(function() {casper.exit();}, 1000 * 60 * 30);