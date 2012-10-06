 (function(){
 	/*
	 * @copyright
	 * Hangout Toolbox for Google+ Hangouts
	 * Copyright (c) 2012 Moritz Tolxdorff & Martin Thielecke
	 * 
	 * Version: 0.0.1
	 *
	 * Hangout Toolbox for Google+ Hangouts is free software: you can redistribute it and/or modify
 	 * it under the terms of the GNU General Public License as published by
 	 * the Free Software Foundation, either version 3 of the License, or
 	 * (at your option) any later version.
	 * 
	 * Hangout Toolbox for Google+ Hangouts is distributed in the hope that it will be useful,
 	 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 	 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 	 * GNU General Public License for more details.
 	 * 
 	 * You should have received a copy of the GNU General Public License
 	 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
	 *
	*/	

	/**
	 * @HangoutToolbox
	 * @constructor
	*/
	function HangoutToolbox(){
		if(!gapi){
			throw "gapi not loaded!";
		}

		/**
		 * @MemeFace.maxHeight - defines the maximum window height
		 * @public
		 * @const 
		 * @type {Number}
		*/
		this.maxHeight = jQuery(window).height();

		/*
		 * Bind gapi events when API is ready
		*/
		gapi.hangout.onApiReady.add(this.onApiReady.bind(this));

		/*
		 * Bind window events when window size has changed
		*/
		jQuery(window).resize(this.onWindowResize.bind(this));
	}

	/**
	 * @buildDOM - Building the DOM structure
	 * @private
	*/
	HangoutToolbox.prototype.buildDOM = function(){
		this.log("Building DOM");
		/*
		 * Create empty elements
		*/
		var div = this.createElement("div");
		var span = this.createElement("span");
		var cleardiv = this.createElement("div", {"class": "clear"});

		/*
		 * Create pane header
		*/
		var header = this.createElement("div", {"id": "header"});
		header.append(this.createElement("span", {"class": "header_icon"}));
		header.append(this.createElement("span", {"class": "header_title"}).html("Meme Face"));

		/*
		 * Creates the shadow Div
		*/
		var shadow = div.clone().attr({"class":"shadow"}).css({"opacity": "1"});
		var shadow_bottom = div.clone().attr({"class":"shadow_bottom"}).css({"opacity": "1"});
		
		/*
		 * Create pane body
		*/
		var body = div.clone().attr({"id": "body"}).css({"height": (this.maxHeight-162)+"px"});

		/*
		 * Create the footer Div
		*/
		var footer = div.clone().attr({id: "footer"}).html("&copy 2012 ");
		footer.append(this.createElement("a",{"href": "https://google.me/+MoritzTolxdorff", "target": "_blank"}).html("+Moritz Tolxdorff"));
		footer.append(this.createElement("span", {"class":"version"}).text("v 0.0.1"));

		body.append(shadow);

		/*
		 * Append DOM structure to container
		*/
		jQuery("#extension").append(header, body, shadow_bottom, footer);
	}

	/**
	 * @onWindowResize - Fired when window resizes
	 * @private
	 * @param evt {jQueryEventObject}
	*/
	HangoutToolbox.prototype.onWindowResize = function(evt){
		this.log("Window resized");
		this.maxHeight = $(window).height();
		this.scale();
	}

	/**
	 * @scale - Scales the body for different resolutions
	 * @public
	*/
	HangoutToolbox.prototype.scale = function(){
		/*
		 * Set the maximum height of the body minus header, input div and footer
		*/
		jQuery("#body").height(this.maxHeight-84);
	}

	/**
	 * @bodyOnScroll - Fired when the #body is scrolled
	 * @private
	 * @param evt {jQueryEventObject}
	*/
	HangoutToolbox.prototype.bodyOnScroll = function(evt){
		/*
		 * Hide/Show shadow depending on scroll position
		*/
		jQuery("#body").scrollTop() > 0 ? jQuery(".shadow", "#container").show() : jQuery(".shadow", "#container").hide(); 
	}

	/**
	 * @createElement - Creates a new element
	 * @public
	 * @param type {String} 
	 * @param attr {Object} 
	*/
	HangoutToolbox.prototype.createElement = function(type, attr){
		return jQuery("<" + type + ">").attr(attr || {});
	}

	/**
	 * @onApiReady - Fired by gapi when it's ready
	 * @private
	 * @param event {gapi.hangout.apiReadyEvent}
	*/
	HangoutToolbox.prototype.onApiReady = function(event){
		if(event.isApiReady){
			try {
				console.log("Hangout Toolbox loaded!");
				this.buildDOM();
				this.scale();
			}	
			catch(err) {
				console.log(err);
			}
		}
	}

	// Export instantiated HangoutToolBox to main window
	window["appController"] = new HangoutToolbox();
})()
