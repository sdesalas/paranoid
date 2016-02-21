(function() {


	var fs = require('fs');
	var system = require('system');
	var async = require('./async');
	var compiler = require('./compiler');

	var Runner = {};

	Runner.init = function() {
		// Setup
		var arg, argname, argvalue;
		// Determine file target to run tests against
		for(var i = 0; i < system.args.length; i++) {
			if (system.args[i].indexOf('--testrunner-target=') === 0) {
				this.target = system.args[i].substr(20);
			}
			if (system.args[i].indexOf('--xunit=') === 0) {
				var resultsfile = fs.absolute(system.args[i].substr(8));
				this.resultsfolder = resultsfile.substr(0, resultsfile.lastIndexOf('/'));
			}
			if (system.args[i].indexOf('--silent') === 0) {
				this.silent = true;
			}
			if (system.args[i].indexOf('--@') == 0) {
				arg = system.args[i].substr(3);
				argname = arg.split('=')[0];
				argvalue = arg.split('=')[1];
				//runner.log('LOADING ARGUMENT: ' + arg);
				if (argname && typeof argvalue !== 'undefined') {
					this.args[argname] = argvalue;
				}
			}
		}
	}

	Runner.silent = false;

	Runner.args = {};

	Runner.tests = [];

	Runner.log = function() {
		if (!this.silent) {
			console.log.apply(console, arguments);
		}
	}

	Runner.resolve = function(path) {
		if (fs && this.resultsfolder) {
			return fs.absolute(this.resultsfolder + '/' + path);
		}
		return path;
	}

	Runner.queueTest = function(file) {
		var fullpath = fs.absolute(file);
		var name = fullpath.split('/').pop();
		var extension = fullpath.split('.').pop();
		var original = fs.read(fullpath);
		if (fs.exists(fullpath) && extension === 'test') {
			runner.log('Test suite found! ' + file);
			var test = {
				name: name, 
				file: file, 
				fullpath: fullpath, 
				original: original
			};
			this.tests.push(test);
			// Try compile
			try {
				test.compiled = compiler.compile(name, fullpath, this.args);
			} catch(e) {
				test.error = e;
			}
			return true;
		}
	}

	Runner.queueSuite = function(directory) {
		var path = fs.absolute(directory);
		var files = fs.list(fullPath);
		for(var i = 0; i < files.length; i++) {
			this.queueTest(path + '/' + files[i]);
		}
	}

	Runner.execute = function() {
		var test, n, lines = [];
		for(var i = 0; i < this.tests.length; i++) {
			var test = this.tests[i];
			if (test.compiled) {
				// Add to lines
				lines.push('// ' + test.name);
				lines = lines.concat(test.compiled.split('\n'));
			} else {
				// No compiled test? 
				// There was a compilation error
				this.saveInfo();
				throw test.error;
			}
		}
		// Show on screen
		runner.log('----------------------------');
		runner.log('Executing.. ');
		runner.log('----------------------------');
		runner.log('Total ' + lines.length + ' lines.');
		runner.log('----------------------------');
		for (n = 0; n < lines.length; n++) {
			runner.log(('0'+(n+1)).slice(-2) + '  ' + lines[n]);
		}
		// Check if we have anything queued up
		if (lines.length > 0) {
			// Save test info to results folder
			this.saveInfo();
			// GO! 
			(new Function(lines.join('\n'))).call(this);
			// Save results
			casper.on('exit', function() {
				Runner.saveResults();
			})
		} else if (casper) {
			runner.log('Nothing to execute. Exiting... ');
			casper.exit(-1); 
		}
	};


	Runner.saveInfo = function() {
		if (fs && this.resultsfolder) {
			var target = fs.absolute(this.target);
			var data = {
				target: target.substr(target.lastIndexOf('/')),
				date: (new Date()),
				tests: this.tests
			};
			fs.write(this.resolve('latest.info.json'), JSON.stringify(data));
		}
	};


	Runner.saveResults = function() {
		if (fs && this.resultsfolder) {
			var data = null;
			try {
				// Read the info file
				// so we can append to it
				data = JSON.parse(fs.read(this.resolve('latest.info.json')));
			} catch(e) {}
			if (data) {
				data.results = { planned: 0, successes: 0, failures: 0, warnings: 0 };
				if (casper.test.suiteResults) {
					for(var i = 0; i < casper.test.suiteResults.length; i++) {
						data.results.planned += casper.test.suiteResults[i].planned || 0;
						data.results.successes += casper.test.suiteResults[i].passes.length;
						data.results.failures += casper.test.suiteResults[i].failures.length;
						data.results.warnings += casper.test.suiteResults[i].warnings.length;
					}
				}
				fs.write(this.resolve('latest.info.json'), JSON.stringify(data));
			}
		}
	};

	Runner.selftest = function() {
		if (casper) {
			runner.log('Exiting casper..');
			casper.exit();
		}
	}


	if (exports) {

		// Initialise 
		Runner.init();

		// Copy properties
		for(var prop in Runner) {
			exports[prop] = Runner[prop];
		}

	}


})();

