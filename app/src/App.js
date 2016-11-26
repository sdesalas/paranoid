/*
* App.js
*
*/
(function(GLOBAL, undefined) {

	var fs = require('fs-extra');
	var gui = require('nw.gui');
	var path = require('path');
	var markdown = require('markdown');

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
				var tdHome = path.resolve(homepath, '.Paranoid');
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

	App.navigation.init();



})(this);
