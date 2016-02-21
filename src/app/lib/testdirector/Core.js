/*
* Core.js
*
*/
(function(GLOBAL, undefined) {

	// Adding shortcut so we can render mustache
	// templates from a jquery object
	// ie: $('#wiki').render({ title: 'Welcome to this Wiki', ... })
	$.fn.render = function(data, template) {
		var template = (typeof template === "string") ? template : this.html();
		this.html(Mustache.render(template, data));
	}

	// Creates a shallow copy of a DOM element into a JSON object
	// by copying all its attributes as JSON object properties
	$.fn.getAttributes = function() {
        var attributes = {}; 
        if( this.length ) {
            $.each(this[0].attributes, function( i, attr ) {
                attributes[ attr.name ] = attr.value;
            }); 
        }
        return attributes;
    };

    // Generate hash from string
    // @see http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
	String.prototype.hashCode = function() {
		var hash = 0, i, chr, len;
		if (this.length == 0) return hash;
		for (i = 0, len = this.length; i < len; i++) {
			chr   = this.charCodeAt(i);
			hash  = ((hash << 5) - hash) + chr;
			hash |= 0; // Convert to 32bit integer
		}
		return hash;
	};


	// Require function missing in browser
	// adding it to avoid errors when designing css
	// This will just return an empty object
	// which will postpone errors until its functions are called
	if (typeof require === 'undefined') {
		GLOBAL.require = function() { return null };
	}

})(this);

