(function() {


	// ADD TOP NAV
	App.navigation.renderTo('#top-nav');

	$(window).resize(function() {
		var height = $(window).height() - 255;
		$('#editor').height(height);
		$('#console').height(height);
		$('section nav.fullheight').height(height + 142);
	});

	$(window).resize();

	$('.tip').each(function(i, e) {
		var tooltip = $(e).attr('title');
		if (tooltip) {
			$(e).tooltip({gravity: 's'});
		}
	})


	// ADD WIKI (Requires NODE)
	//try {
		App.wiki.renderTo('#wiki');
	//} catch (e) {}

	// SETTINGS
	$('#settings\\.home').render({
		cwd: App.userhome
	});


	// ADD CONTEXT MENU BUTTONS (Requires NODE-WEBKIT)
	try {
		App.gui.init();
	} catch (e) {}


	// LOAD FILES
	//try {
		App.filebrowser.init('#file-browser', '#editor');
	//} catch (e) {}


	// INIT EDITOR
	App.editor.init('#editor', '#console');


	$("#mode-console").click(function(e) {
		App.editor.mode('console');
	});

	$("#mode-edit").click(function(e) {
		App.editor.mode('edit');
	});


	// HISTORY
	App.history.init('#results-browser', '#results-viewer');


	$(window).bind('keydown', function(e) {
		// Check if any modal windows are active
		var modal = $('.bootbox.modal');
		if (modal.length) {
			// Handle Enter (Ok) 
			if (e.keyCode == 13) { $('a.btn-primary', modal).click(); return false;}     // enter
		}
		// F5
		 if(e.which === 116) {
	       console.log('F5 keydown', e);
	       App.editor.execute();
	       return false;
	    }
	    // Ctrl+S
	    if(e.ctrlKey && e.which === 83) { 
	        console.log('Ctrl+S');
	        App.editor.save();
	        return false;
	    }
	    // Ctrl+M
	    if(e.ctrlKey && e.which === 77) { 
	        console.log('Ctrl+M');
	        App.editor.toggle('autocompletion');
	        return false;
	    }
	});

	$('#run-test').click(function() {App.editor.execute();});

	$('#splash').delay(2000).fadeOut();


})();


