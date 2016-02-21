/*
* App.js
*
*/
(function(GLOBAL, undefined) {

	var fs = require('fs.extra');
	var gui = require('nw.gui');
	var path = require('path');
	var markdown = require('markdown');
	var moment = require('moment');

	var App = this.App = {

		install: {

			isPacked: (GLOBAL.process && process.execPath) ? (process.execPath.substr(-7) == 'app.exe') : false,

			directory: (GLOBAL.process && process.cwd && path) ? path.resolve(process.cwd()) : "/",

			resolve: function(relativePath) {
				Array.prototype.unshift.call(arguments, this.directory);
				return (path) ? path.resolve.apply(path, arguments) : this.directory + '/' + relativePath;
			}

		},

		userhome: (function() {
			if (GLOBAL.process && process.env && path && fs) {
				var homepath = process.env.HOME || process.env.USERPROFILE;
				//prompt('process.env', JSON.stringify(process.env));
				var tdHome = path.resolve(homepath, '.TestDirector');
				if (!fs.existsSync(tdHome)) { fs.mkdirSync(tdHome); }
				var suites = path.resolve(tdHome, 'suites');
				if (!fs.existsSync(suites)) { fs.mkdirSync(suites); }
				var results = path.resolve(tdHome, 'results');
				if (!fs.existsSync(results)) { fs.mkdirSync(results); }				
				return tdHome;
			}
			return "";
		})(),

		resolve: function(relativePath) {
			Array.prototype.unshift.call(arguments, this.userhome);
			return (path) ? path.resolve.apply(path, arguments) : this.userhome + '/' + relativePath;
		}

	};

	App.navigation = {
		items: [{
			name: "Browse",
			description: "Open Test Editor",
			thumb: "img/icon-filecabinet.32x32.png",
			cls: "active"
		},{
			name: "History",
			description: "",
			thumb: "img/icon-clock.32x32.png"
		},{
			name: "Schedule Tests",
			description: "",
			thumb: "img/icon-calendar.32x32.png"
		}, {
			name: "Import/Export",
			description: "",
			thumb: "img/icon-upload.32x32.png"
		}, {
			name: "Wiki",
			description: "",
			thumb: "img/icon-docs.32x32.png"
		}, {
			name: "Settings",
			description: "",
			thumb: "img/icon-settings.32x32.png"
		}],
		renderTo: function(selector) {
			var id, item;
			$(selector).render(this);
			// Add events
			for(var i = 0; i < this.items.length; i++) {
				item = this.items[i];
				$("#" + item.id).click($.proxy(item.click, item));
			}
		},
		hideEverything: function() {
			for(var i = 0; i < this.items.length; i++) {
				$("#" + this.items[i].target).hide();
				$("#" + this.items[i].id).removeClass('active');
			}
		},
		init: function() {
			// Add extra properties to navigation items 
			var item;
			for(var i = 0; i < this.items.length; i++) {
				item = this.items[i];
				item.target = item.name.replace(/[^\w]/g, '-').toLowerCase();
				item.id = 'nav-' + item.target;
				item.click = function() {
					if (this.target) {
						App.navigation.goto(this.target);
					}
				};
			}
		},
		goto: function(target) {
			if (target) {
				this.hideEverything();
				$("#" + target).show();
				$("#nav-" + target).addClass('active');
			}
		}
	};


	App.wiki = {

		renderTo: function(selector) {

			if (!fs) { return; }

			var files = fs.readdirSync(App.install.resolve('wiki'));
			var home = fs.readFileSync(App.install.resolve('wiki/Home.md'), {encoding: 'utf8'});
			var pages = [];

			for (var i = 0; i < files.length; i++) {
				if (files[i] !== 'Home.md' && path.extname(files[i]).toLowerCase() === '.md') {
					pages.push(files[i].substr(0, files[i].length-3));
				}
			}

			$(selector).render({
				pages: pages,
				content: function() {
					return markdown.markdown.toHTML(home);
				}
			});

			$('nav li a', selector).click(function(e) {
				var target = e.currentTarget;
				if (target) {
					var src = $(target).data('src');
					if (src) {
						var md = fs.readFileSync(App.install.resolve(src), {encoding: 'utf8'});
						$('.main', selector).html(markdown.markdown.toHTML(md));
						$('nav li', selector).removeClass('active');
						$(target).parent().addClass('active');
					}
				}
			});

		}

	};

	App.gui = {

		init: function() {

			if (!gui) { return; }

			// Create an empty menu
			var menu = new gui.Menu();
			var win = gui.Window.get();

			menu.append(new gui.MenuItem({
				label: 'Reload',
				icon: 'img/icon-uparrowgrey.16x16.gif',
				click: function() {
				  win.reload();
				}
			}));

			menu.append(new gui.MenuItem({
				label: 'Developer Tools',
				icon: 'img/icon-uparrowgrey.16x16.gif',
				click: function() {
				  win.showDevTools();
				}
			}));

			// Popup as context menu
			document.body.addEventListener('contextmenu', function(ev) { 
			  ev.preventDefault();
			  // Popup at place you click
				  menu.popup(ev.x, ev.y);
			  return false;
			}, false);

		}

	};


	App.filebrowser = {

		home: "/",

		resolve: function(relativePath) {
			Array.prototype.unshift.call(arguments, this.cwd);
			return (path) ? path.resolve.apply(path, arguments) : this.cwd + '/' + relativePath;
		},

		navigate: function(directory) {

			if (!fs) { return; }

			var j, contents, subcontents;
			var lstat, tests = 0, files = [], folders = [];

			// Set current working path (for filebrowser)
			this.cwd = this.resolve(directory);

			// Get directory contents
			var contents = fs.readdirSync(this.cwd);

			for(var i = 0; i < contents.length; i++) {
				lstat = fs.lstatSync(this.resolve(contents[i]));
				if (lstat.isDirectory()) {
					subcontents = fs.readdirSync(this.resolve(contents[i]));
					tests = 0;
					for (j = 0; j < subcontents.length; j++) {
						if (path.extname(subcontents[j]) === '.test') {
							tests++;
						}
					}
					folders.push({name: contents[i], tests: tests});
				}
				if (lstat.isFile() && path.extname(contents[i]) === '.test') {
					files.push({name: contents[i], displayname: contents[i].replace(/\.test$/i, '')});
				}
			}

			var displaypath = this.cwd.replace(this.home, '');

			$(this.dom).render({
				cwd: ('HOME' + displaypath).split(path.sep),
				//cwd: this.cwd,
				folders: folders,
				files: files,
				up: function(text,render) {
					if (App.filebrowser.cwd === App.filebrowser.home) {
						return false;
					}
					return true;
				}
			}, this.template);

			var activate = function(item) {
				$('li a', App.filebrowser.dom).removeClass('active');
				$(item).addClass('active');
			}

			// Add event listeners
			$('li a.up').dblclick(function() {
				App.filebrowser.navigate('..');
			});
			$('li a', this.dom).click(function(e) {
				if (e && e.currentTarget) {
					var a = e.currentTarget;
					activate(a);
					var target = $(a).attr('href');
					return false;
				}
			});
			$('li a.file', this.dom).dblclick(function(e) {
				if (e && e.currentTarget) {
					var target = $(e.currentTarget).attr('href');
					if (target && target.indexOf("#") === 0) {
						// Open file
						App.editor.open(App.filebrowser.resolve(target.slice(1)));
					}
				}
			});
			$('li a.folder', this.dom).dblclick(function(e) {
				if (e && e.currentTarget) {
					var target = $(e.currentTarget).attr('href');
					if (target && target.indexOf("#") === 0)
						App.filebrowser.navigate(target.slice(1));
				}
			});
			$('li a.newfile', this.dom).dblclick(function(e) {
				App.editor.newfile();
			});
			$('li a.newfolder', this.dom).dblclick(function(e) {
				App.editor.newfolder();
			});
		},

		refresh: function() {
			this.navigate('.');
		},

		init: function(selector, target) {
			this.dom = $(selector)[0];
			this.target = $(target)[0];
			if (this.dom) {
				this.template = $(this.dom).html();
				this.home = this.cwd = App.userhome;
				// Look for the suites folder.. 
				// is it in the current path?
				if (fs && fs.readdirSync(App.userhome).indexOf('suites') > -1) {
					this.home = this.cwd = App.resolve('suites');
				}
				this.navigate('.');
			}
		}

	};


	App.editor = {


		init: function(selector, console) {

			this.dom = $(selector)[0];
			this.console = {
				dom: $(console)[0]
			}
			this.location = {
				dom: $('#browse-filename')[0],
				change: function(e) {
					var name = $(App.editor.location.dom).val();
					App.editor.rename(name);
				}
			}

		},

		newfile: function() {
			delete this.file;
			delete this.filename;
			if (this.ace && this.ace.getSession()) {
				this.ace.getSession().setValue('');
				$(this.location.dom).val('Untitled');
				$(this.location.dom).css({ 'font-style': 'italic'});
			}
		},

		newfolder: function() {
			bootbox.prompt('New Suite..', function(result) {
				if (fs && result && !result.match(/[^\w\d\s\.]/)) {
					fs.mkdirSync(App.filebrowser.resolve(result));
					App.filebrowser.refresh();
				} else if (result !== null) {
					bootbox.alert('Invalid name');
				}
			});
		},

		open: function(pathToFile) {

			if (fs && pathToFile) {

				this.file = pathToFile;
				this.filename = this.file.split(path.sep).pop();

				$(this.location.dom).off('change')
				//$(this.location.dom).val(this.filename.replace(/\.test$/i, ''));
				$(this.location.dom).val(this.filename);
				$(this.location.dom).on('change', this.location.change);
				$(this.location.dom).css({'font-style': 'normal'});

				var code = new String(fs.readFileSync(this.file, {encoding: 'utf8'}));

				if (this.ace) {

					this.mode('edit');
					this.ace.setValue(code);
					this.ace.selection.clearSelection();

				}
			}

		},

		rename: function(name) {

			var newfile = App.filebrowser.resolve(name + '.test');

			if (fs) {
				// Are we currently browsing anything?
				if (this.file) {
					App.editor.save();
					fs.renameSync(this.file, newfile);
				} else {
					// No?
					// Check the current folder so we dont ovewrite
					// an existing file.
					if (fs.readdirSync(App.filebrowser.cwd).indexOf(name + '.test') !== -1) {
						bootbox.alert('That filename is taken already.');
						return;
					} else {
						// All ok?
						// Create new file.
						this.file = newfile;
						App.editor.save();
					}
				}
				App.filebrowser.refresh();
				App.editor.open(newfile);
			}

		},

		save: function(callback) {

			if (!this.file) {

				var filename = $(this.location.dom).val();
				if (filename && !filename.match(/^untitled$/i)) {
					this.file = filename;
					App.editor.save(callback);
					App.filebrowser.refresh();
				} else {
					bootbox.prompt('Save as.. ', function(result) {
						if (fs && result && !result.match(/[^\w\d\s\.]/)) {
							App.editor.file = result + '.test';
							$(App.editor.location.dom).val(App.editor.file);
							App.editor.save(callback);
							App.filebrowser.refresh();
						} else if (result != null) {
							bootbox.alert('Invalid file name');
						}
					});
				}
				// async popup: we'll handle 
				// the results on the second pass
				return;

			}

			if (this.ace && this.ace.getSession()) {

				// Read editor and save to file
				var code = this.ace.getSession().getValue();
				fs.writeFileSync(App.filebrowser.resolve(this.file), code);

				// Show UI
				var activefile = $('li a.active', App.filebrowser.dom);
				activefile.tooltip({title: 'Saving..', placement: 'right'}).tooltip('show');
				window.setTimeout(function() {activefile.tooltip('destroy'); }, 1000);
				$(this.location.dom).css({ 'font-style': 'normal'});

			}

			// Execute callback
			if (callback) {
				callback.call(App.editor);
			}

		},

		executable: {
			cwd: App.install.resolve('..\\..\\tools\\testrunner'),
			name: 'run.bat',
			getPath: function() {
				return path.resolve(this.cwd, this.name);
			}
		},

		execute: function() {

			var editor = this;
			var executable = editor.executable;

			// Save file first,
			// Then execute it
			this.save(function() {

				editor.mode('console');

				$('#mode-console').popover({ placement: 'top', title: 'Running Test', content: 'Entering Console Mode...' }).popover('show');

				window.setTimeout(function() {
					$('#mode-console').popover('destroy');
				}, 1500);

				$(editor.console.dom).text('');


				if (fs && fs.existsSync(executable.getPath())) {

					var cp = require('child_process');
					var batch = cp.exec(
						executable.name + ' "' + this.file + '" silent', 
						{ cwd: executable.cwd }, 
						function() {
							// Completed BATCH
							window.setTimeout(function() {
								App.history.refresh();
							}, 500);
						}
					);
					var rl = require('readline').createInterface({input: batch.stdout, output: batch.stdin});

					// Add event listeners
					rl.on('line', function(data) {
						$(editor.console.dom).append(data + '\n')
						$(editor.console.dom).scrollTop($(editor.console.dom)[0].scrollHeight);
					});

					batch.stderr.on('data', function(data) {
						console.error('error:' + data);
					})


				} else {

					$(editor.console.dom).text('> Error: Could not find ' + executable.getPath());

				}

			});

		},

		toggle: function(mode) {

			if (this.ace && mode === 'autocompletion') {

				this.toggle[mode] = (this.toggle[mode] === undefined) ? true : !this.toggle[mode];

			    this.ace.setOptions({
			        enableBasicAutocompletion: this.toggle[mode],
			        enableLiveAutocompletion: this.toggle[mode]
			    });

			}

		},

		mode: function(mode) {

			switch(mode) {

				case 'console':
					if (!$("#mode-console").hasClass('btn-inverse')) {
						$(this.dom).hide();
						$(this.console.dom).show();
						$("#mode-edit").toggleClass('btn-inverse');
						$("#mode-console").toggleClass('btn-inverse');
					}
					break;

				case 'edit':
					if (!$("#mode-edit").hasClass('btn-inverse')) {
						$(this.dom).show();
						$(this.console.dom).hide();
						$("#mode-edit").toggleClass('btn-inverse');
						$("#mode-console").toggleClass('btn-inverse');
					}
					break;

			}


		}

	};


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


	App.navigation.init();



})(this);
