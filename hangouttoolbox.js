 (function(){
 	/*
	 * @copyright
	 * Hangout Toolbox for Google+ Hangouts
	 * Copyright (c) 2012 Moritz Tolxdorff & Martin Thielecke
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
		header.append(this.createElement("span", {"class": "header-icon"}));
		header.append(this.createElement("span", {"class": "header-title"}).html("Hangout Toolbox"));
		
		/*
		 * Create pane body
		*/
		var mainbody = div.clone().attr({"id": "mainbody"}).css({"height": (this.maxHeight-152)+"px"});

		/*
		 * Create Accordion
		*/
		var accordion = div.clone().attr({"id":"accordion"});
		accordion.append(this.createElement("h3",{"class":"ui-accordion-header"}).html("<a href='#'>Lower Third</a>"));
		accordion.append(div.clone().attr({"id":"app-lowerthird"}));
		accordion.append(this.createElement("h3",{"class":"ui-accordion-header"}).html("<a href='#'>Volume Control</a>"));
		accordion.append(div.clone().attr({"id":"app-volumecontrol"})); 
		accordion.append(this.createElement("h3",{"class":"ui-accordion-header"}).html("<a href='#'>De-Face</a>"));
		accordion.append(div.clone().attr({"id":"app-memeface"}));
		accordion.append(this.createElement("h3",{"class":"ui-accordion-header"}).html("<a href='#'>Soundboard</a>"));
		accordion.append(div.clone().attr({"id":"app-soundboard"}));
		accordion.append(this.createElement("h3",{"class":"ui-accordion-header"}).html("<a href='#'>Anonymous</a>"));
		accordion.append(div.clone().attr({"id":"app-anonymous"}));
		accordion.append(this.createElement("h3",{"class":"ui-accordion-header"}).html("<a href='#'>About & Support</a>"));
		accordion.append(div.clone().attr({"id":"app-about"}).html("A Hangout Extension with several features.<br /><br />This toolbox provides several apps/extensions to improve your Hangout experience.<br /><br />It contains:<br /><ul><li>Lower Third</li><li>Volume Control</li><li>De-Face</li><li>Anonymous</li><li>Soundboard</li></ul><br /><br />Please visit our page on <a href='https://plus.google.com/110344475746210074770/about' target='_blank'>Google+</a> or on our <a href='https://code.google.com/p/hangout-toolbox/' target='_blank'>project page</a><br /><br /><a href='https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=3YRQBKYGF38ZL' class='general-button-blue' target='_blank'>Fund Development</a>"));

		/*
		 * Create the footer Div
		*/
		var date = new Date();
		year = date.getFullYear();
		var footer = div.clone().attr({id: "footer"}).html("&copy " + year + " ");
		footer.append(this.createElement("a",{"href": "https://google.me/+MoritzTolxdorff", "target": "_blank"}).html("+Moritz"));
		footer.append(this.createElement("span").html(" &amp; "));
		footer.append(this.createElement("a",{"href": "https://plus.google.com/104514437420477125478", "target": "_blank"}).html("+Martin"));
		footer.append(this.createElement("span", {"class":"version"}).text("v " + version));

		mainbody.append(accordion);

		/*
		 * Append DOM structure to container
		*/
		jQuery("#extension").append(header, mainbody, footer);
	}

	/**
	 * @onWindowResize - Fired when window resizes
	 * @private
	 * @param evt {jQueryEventObject}
	*/
	HangoutToolbox.prototype.onWindowResize = function(evt){
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
		jQuery("#mainbody").height(this.maxHeight-54);
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
		jQuery("#mainbody").scrollTop() > 0 ? jQuery(".shadow", "#extension").show() : jQuery(".shadow", "#extension").hide(); 
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
				$("#accordion").accordion({
					collapsible: true,
					autoHeight: false,
					active: false
				});
				this.scale();
				var anonymousbar = new AnonymousBar();
				anonymousbar.init();
			}	
			catch(err) {
				console.log(err);
			}
		}
	}

	// Export instantiated HangoutToolBox to main window
	window["appController"] = new HangoutToolbox();
})()
