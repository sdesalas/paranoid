var fs = require('fs-extra');
var path = require('path');

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