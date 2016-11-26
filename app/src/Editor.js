
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
		cwd: path.join('node_modules', 'paranoid-phantom'),
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
