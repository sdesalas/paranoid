var moment = require('moment');


App.history = {

	folder: App.resolve('results'),

	resolve: function(relativePath) {
		Array.prototype.unshift.call(arguments, this.folder);
		return (path) ? path.resolve.apply(path, arguments) : this.folder + '/' + relativePath;
	},

	init: function(browser, viewer) {

		this.browser = {
			dom: $(browser)[0],
			template: $(browser).html()
		}
		this.viewer = {
			dom: $(viewer)[0],
			template: $('script', viewer).text()
		}
		$(this.viewer.dom).html('');
		this.refresh();

	},

	refresh: function() {
		var folder, stat, infofile, info;
		var t, run, runs = this.runs = [];
		if (fs) {
			var contents = fs.readdirSync(this.folder);
			for(var i = 0; i < contents.length; i++) {
				folder = contents[i];
				stat = fs.lstatSync(this.resolve(folder));
				if (stat.isDirectory()) {
					info = this.readResults(this.resolve(folder));
					// Do we have some test info to report?
					if (info) {
						runs.push(info);
					}
				}
			}

			// Sort by date (DESC)
			this.runs.sort(function(a, b) {
				if (a.date > b.date) return -1;
				if (a.date < b.date) return 1;
				return 0;
			});

			// Render away
			$(this.browser.dom).render({runs: runs}, this.browser.template);

			// Add event listeners
			$('li > a', this.browser.dom).click(function(e) {
				if (e && e.currentTarget) {
					var a = e.currentTarget;
					var href = $(a).attr('href');
					if (href && href.length && href.substr(1)) {
						var folder = href.substr(1);
						App.history.view(folder);
					}
					// Highlight
					$('li > a', App.history.browser.dom).removeClass('active');
					$(a).addClass('active');
				}
			});

			// After refreshing, open the first (latest) link
			$('li:first-child > a', this.browser.dom).click();

		}

	},

	readResults: function(resultPath) {

		var result = {
			target: 'Untitled',
			folder: this.resolve(resultPath),
			date: new Date(),
			source: '',
			timeago: moment(new Date()).calendar(),
			testsuites: [],
			total: 0, 
			failures: 0,
			successes: 0,
			failed: function() {
				if (this.failures) return true;
				return false;
			}
		};

		var xunitfile = this.resolve(resultPath, 'latest.xunit.xml');

		// Start by reading the XUnit file
		if (DOMParser && fs && fs.existsSync(xunitfile)) {
			var xunit = fs.readFileSync(xunitfile);
			var parser = new DOMParser();
			var dom = parser.parseFromString(xunit, "application/xml");
			this.currentResult = this.resolve(resultPath);
			$('testsuite', dom).each(function(i, e) {
				//var node = $(e);
				var testsuite = $(e).getAttributes();
				testsuite.testcases = [];
				$('testcase', e).each(function(i, e) {
					var testcase = $(e).getAttributes();
					$('failure', e).each(function(i, e) {
						testcase.failure = $(e).getAttributes();
						testcase.failure.message = $(e).text();
						result.failures++;
					});
					testcase.success = function() {
						return !this.failure;
					}
					testcase.line = function() {
						var match = this.name.match(/line\s(\d+)\b/i);
						if (match && match.length > 1) {
							return match[1];
						}
						return "";
					}
					testcase.info = function() {
						var match = this.name.match(/^line\s\d+:(.*)$/i);
						if (match && match.length > 1) {
							return match[1];
						}
						return this.name;
					}
					// Populate result info
					if (!testcase.failure) { result.successes++; }
					result.total++;
					testsuite.testcases.push(testcase);
				})
				testsuite.timeago = function() {
					if (this.timestamp) {
						return moment(this.timestamp).calendar();
					}
					return 'Unknown'
				};
				// Track key info
				result.target = testsuite.name;
				result.timeago = testsuite.timeago();
				// Add to result
				result.testsuites.push(testsuite);
			});
			// Get some additional info from json file
			// We are particularly interested in the original source code
			// Which cannot be found in XUnit file
			var info, jsonfile = this.resolve(resultPath, 'latest.info.json');
			if (fs.existsSync(jsonfile)) {
				try {
					info = JSON.parse(fs.readFileSync(jsonfile));
				} catch (e) {info = null;}
				if (info) {
					result.target = info.target;
					result.tests = info.tests;
					for (var i = 0; i < result.tests.length; i++) {
						// Add function to display lines on screen
						result.tests[i].lines = function() {
							if (this.original) {
								return this.original.split('\n');
							}
							return [];
						}
					}
				}
			}
			return result;
		}

		// Could not parse file
		return null;

	},

	delete: function(result) {

		if (fs && fs.rmrfSync) {
			if (!result) {
				result = this.currentResult;
			}
			if (result && fs.existsSync(result)) {
				bootbox.confirm('Delete result from history?', function(ok) {
					if (ok) {
						fs.rmrfSync(result);
						App.history.refresh();
					}
				});
			}
		}

	},

	view: function(resultPath) {

		var xunitfile = this.resolve(resultPath, 'latest.xunit.xml');

		if (DOMParser && fs && fs.existsSync(xunitfile)) {

			var result = this.readResults(resultPath);

			// Add screenshots
			result.images = [];
			var imagefiles = fs.readdirSync(this.resolve(resultPath));
			$.each(imagefiles, function(i, filename) {
				if (filename.split('.').pop() === 'png') {
					var image = {};
					image.filename = filename;
					image.hash = filename.hashCode();
					image.src = App.history.resolve(resultPath, filename);
					var match = filename.match(/^line\-(\d+)\.screenshot\.png$/i);
					if (match && match.length > 1) {
						image.line = parseInt(match[1], 10);
					}
					result.images.push(image);
				}
			});

			// Render away
			$(this.viewer.dom).render(result, this.viewer.template);

			// Add event listeners
			$('#delete-result', this.viewer.dom).click(function() {
				App.history.delete();
			});

		}


	}

};