 (function(){
 	/*
	 * @copyright
	 * Meme Face for Google+ Hangouts
	 * Copyright (c) 2012 Moritz Tolxdorff
	 * 
	 * Version: 0.0.1
	 *
	 * Meme Face for Google+ Hangouts is free software: you can redistribute it and/or modify
 	 * it under the terms of the GNU General Public License as published by
 	 * the Free Software Foundation, either version 3 of the License, or
 	 * (at your option) any later version.
	 * 
	 * Meme Face for Google+ Hangouts is distributed in the hope that it will be useful,
 	 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 	 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 	 * GNU General Public License for more details.
 	 * 
 	 * You should have received a copy of the GNU General Public License
 	 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
	 *
	*/	

	/**
	 * @MemeFace
	 * @constructor
	*/
	function MemeFace(){
		if(!gapi){
			throw "gapi not loaded!";
		}

		/**
		 * @MemeFace.DEBUGGING - defines if debugging is enabled
		 * @private
		 * @type {boolean}
		*/
		this.DEBUGGING = false;

		/**
		 * @MemeFace.maxHeight - defines the maximum window height
		 * @public
		 * @const 
		 * @type {Number}
		*/
		this.maxHeight = jQuery(window).height();

		/**
		 * @MemeFace.globalShow - defines the initial state of globalShow 
		 * @private
		 * @type {boolean}
		*/
		this.globalShow = false;
		this.customShow = false;

		/**
		 * @MemeFace.overlays - defines the canvasOverlay container 
		 * @private
		 * @type {Array}
		*/
		this.overlays = {};

		/**
		 * @MemeFace.canvas - defines the canvas container 
		 * @private
		 * @type {null | HTMLCanvasElement}
		*/
		this.canvas = null;

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
	MemeFace.prototype.buildDOM = function(){
		this.log("Building DOM");
		/*
		 * Create empty elements
		*/
		var div = this.createElement("div");
		var span = this.createElement("span");
		var cleardiv = this.createElement("div", {"class": "clear"});
		var inputText = this.createElement("input", {"class": "input", "type": "text"});

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

		var inputText_url 		= inputText.clone().attr({"id": "URL", "class": "box_text", "url": "url"});
		var button = this.createElement("button", {"id": "button"}).html("On/Off");

		var grid_container		= div.clone().attr({"class":"grid_container"});
		var grid_table			= this.createElement("table", {"class":"table_sound"});
		var content = "";
		for(var i = 0; i < faces.length; i++){
			if((i % 3) == 0){
				content += "<tr>";
			}
			content += "<td><a data-playable='" + faces[i].title + "' class='btn-faces' style='background-image: url(https://tolxdorff.appspot.com/a/memeface/i/small/" + faces[i].data + ");' title='" + faces[i].title + "'></a></td>";
			if((i % 3) == 2){
				content += "</tr>";
			}
		}

		grid_table.append(jQuery(content));
		grid_container.append(grid_table);
		jQuery("a[data-playable]").live("click",this.toggleFace.bind(this));

		/*
		 * Create the footer Div
		*/
		var footer = div.clone().attr({id: "footer"}).html("&copy 2012 ");
		footer.append(this.createElement("a",{"href": "https://google.me/+MoritzTolxdorff", "target": "_blank"}).html("+Moritz Tolxdorff"));
		footer.append(this.createElement("span", {"class":"version"}).text("v 0.0.1"));

		body.append(shadow, grid_container, inputText_url, button);

		/*
		 * Append DOM structure to container
		*/
		jQuery("#container").append(header, body, shadow_bottom, footer);

		button.click(this.LoadURL.bind(this));
	}

	/**
	 * @createImageResourceFromCanvas - Creates a image resource from a canvas element
	 * @private
	 * @param canvas {HTMLCanvasElement}
	*/
	MemeFace.prototype.createFacesResources = function(){
		for(var i = 0; i < faces.length; i++){
			this.overlays[faces[i].title] = gapi.hangout.av.effects.createImageResource('https://tolxdorff.appspot.com/a/memeface/i/' + faces[i].data)
			.createFaceTrackingOverlay(
				{'trackingFeature': gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT, 
				 'offset': {"x":0,"y":0},
				 'rotateWithFace': true, 
				 'scaleWithFace': true, 
				 'scale': faces[i].scale
				});
		}
		console.log("Faces generated!");
	}

	MemeFace.prototype.toggleFace = function(evt){
		var title = jQuery(evt.target).data("playable");
		console.log("Clicked Face: ", title);
		
		if(this.globalShow === false){
			this.overlays[title].setVisible(true);	
			this.globalShow = true;
		}else{
			this.overlays[title].setVisible(false);	
			this.globalShow = false;
		}
	}

	MemeFace.prototype.LoadURL = function(){
		var image_url = $('#URL').val();
		var image = gapi.hangout.av.effects.createImageResource(image_url);
		this.overlay = image.createFaceTrackingOverlay({
      		'trackingFeature': gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
      		'scaleWithFace': true,
      		'rotateWithFace': true,
      		'scale': 2.3,
      		'offset': { 'x': 0, 'y': 0 }
  		});

  		if(this.customShow === false){
			this.overlay.setVisible(true);	
			this.customShow = true;
		}else{
			this.overlay.setVisible(false);	
			this.customShow = false;
			this.overlay.dispose();
		}
	}

	/**
	 * @onWindowResize - Fired when window resizes
	 * @private
	 * @param evt {jQueryEventObject}
	*/
	MemeFace.prototype.onWindowResize = function(evt){
		this.log("Window resized");
		this.maxHeight = $(window).height();
		this.scale();
	}

	/**
	 * @scale - Scales the body for different resolutions
	 * @public
	*/
	MemeFace.prototype.scale = function(){
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
	MemeFace.prototype.bodyOnScroll = function(evt){
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
	MemeFace.prototype.createElement = function(type, attr){
		return jQuery("<" + type + ">").attr(attr || {});
	}

	/**
	 * @log - Writes to console.log if DEBUGGING is enabled
	 * this.log(...)
	 * @private
	 * @param {Mixed}
	*/
	MemeFace.prototype.log = function(){
		if(this.DEBUGGING === true){
			console.log(Array.prototype.slice.call(arguments))
		}
	}

	/**
	 * @onApiReady - Fired by gapi when it's ready
	 * @private
	 * @param event {gapi.hangout.apiReadyEvent}
	*/
	MemeFace.prototype.onApiReady = function(event){
		if(event.isApiReady){
			try {
				console.log("Meme Face loaded!");
				this.buildDOM();
				this.scale();
				this.createFacesResources();
			}	
			catch(err) {
				console.log(err);
			}
		}
	}

	// Export instantiated LowerThird to main window
	window["appController"] = new MemeFace();
})()