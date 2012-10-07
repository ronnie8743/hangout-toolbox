(function(){
	/**
	 * @LowerThird
	 * @constructor
	*/
	function LowerThird(){
		/**
		 * @LowerThird.maxHeight - defines the maximum window height
		 * @public
		 * @const 
		 * @type {Number}
		*/
		this.maxHeight = $(window).height();

		/**
		 * @LowerThird.globalShow - defines the initial state of globalShow 
		 * @private
		 * @type {boolean}
		*/
		this.globalShow = false;

		this.globalShowCustom = false;

		this.globalShowClock = false;

		this.globalShowSaved = false;

		/**
		 * @LowerThird.overlays - defines the canvasOverlay container 
		 * @private
		 * @type {Array}
		*/
		this.overlays = {};

		/**
		 * @LowerThird.clockIntervalID - defines the clock interval
		 * @private
		 * @type {boolean}
		*/
		this.clockIntervalID = null;
		this.currentTimestamp = new Date();

		/**
		 * @LowerThird.canvas - defines the canvas container 
		 * @private
		 * @type {null | HTMLCanvasElement}
		*/
		this.canvas = null;
		this.canvas_clock = null;

		/**
		 * @LowerThird.canvas_screen - defines the fullscreen canvas container 
		 * @private
		 * @type {null | HTMLCanvasElement}
		*/
		this.canvas_screen = null;

		/**
		 * @LowerThird.name - defines the name variable used as an overlay on the canvas
		 * @protected
		 * @type {String}
		*/
		this.name = "";

		this.fullcanvas = "";
		this.customcanvas = "";
		this.loadedoverlay = "";

		/**
		 * @LowerThird.fileReader - Create  a new HTML5 file reader
		 * @protected
		 * @type {String}
		*/
		if(typeof FileReader !== "undefined"){
			this.fileReader = new FileReader();
		}
		
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
	 * @onWindowResize - Fired when window resizes
	 * @private
	 * @param evt {jQueryEventObject}
	*/
	LowerThird.prototype.onWindowResize = function(evt){
		this.maxHeight = $(window).height();
		this.scale();
	}

	/**
	 * @readImageFromInput - Fired when the #body is scrolled
	 * @private
	*/
	LowerThird.prototype.readImageFromInput = function(input, callback){
		if(input.files.length == 0){
			callback.call(this, false);
			return false;
		}

		this.fileReader.onloadend = function(evt){
			callback.call(this, evt.target)
		}.bind(this);
		/*
		 * @TODO Validate file input
		*/
		return this.fileReader.readAsDataURL(input.files[0]);
	}
	
	/**
	 * @buildDOM - Building the DOM structure
	 * @private
	*/
	LowerThird.prototype.buildDOM = function(){		
		/*
		 * Create empty elements
		*/ 
		var div = this.createElement("div");
		var label = this.createElement("label");
		var span = this.createElement("span");
		var option = this.createElement("option");
		var inputText = this.createElement("input", {"class": "input", "type": "text"});
		var inputCheckbox = this.createElement("input", {"class": "input", "type": "checkbox", "disabled": "disabled"});
		var cleardiv = this.createElement("div", {"class": "clear"});
		
		/*
		 * Create pane body
		*/
		var body = div.clone().attr({"id": "body"});

		/*
		 * Creates the form element
		*/
		var form = this.createElement("form", {"id": "form"});

		/*
		 * Creates the form element
		*/
		var fieldset_lowerthird	= this.createElement("fieldset", {"class": "fieldset"});
		var fieldset_clock		= this.createElement("fieldset", {"class": "fieldset"});
		var fieldset_custom		= this.createElement("fieldset", {"class": "fieldset"});
		var fieldset_presets	= this.createElement("fieldset", {"class": "fieldset"});

		var legend_lowerthird	= this.createElement("legend", {"class": "legend"}).text("Lower Third").appendTo(fieldset_lowerthird);
		var legend_clock		= this.createElement("legend", {"class": "legend"}).text("Display clock").appendTo(fieldset_clock);
		var legend_custom	 	= this.createElement("legend", {"class": "legend"}).text("Custom Overlay").appendTo(fieldset_custom);
		var legend_preset 		= this.createElement("legend", {"class": "legend"}).text("Presets").appendTo(fieldset_presets);

		var switch_lowerthird	= this.createElement("a",{"id": "switch_lowerthird", "class": "onoffswitch"});
		var switch_clock		= this.createElement("a",{"id": "switch_clock", "class": "onoffswitch"});
		var switch_custom		= this.createElement("a",{"id": "switch_custom", "class": "onoffswitch"});

		var button_save			= this.createElement("a", {"id": "button_save", "class": "button_save"}).html("Save");

		var radio_left			= this.createElement("input", {"type": "radio", "id":"radio_left", "name":"clock", "checked":"checked"});
		var radio_left_text		= label.clone().attr({"for": "name", "class":"radio_text"}).text("Left");
		var radio_right			= this.createElement("input", {"type": "radio", "name":"clock", "id":"radio_right"});
		var radio_right_text	= label.clone().attr({"for": "name"}).text("Right");

		var nopresets			= span.clone().text("No saved presets!");

		var inputText_name 		= inputText.clone().attr({"id": "Name", "class": "box_text", "name": "name"});
		var inputText_tagline 	= inputText.clone().attr({"id": "Tag", "class": "box_text", "name": "tagline", "value":""}).css({"font-color":"#c0c0c0"});
		var inputColor  		= inputText.clone().attr({"id": "Color", "class": "box_text color", "name": "color", "value": "dd4b39"});
		var inputSelect 		= this.createElement("select", {"id": "Select", "class": "box_select"});
		var inputText_preset	= inputText.clone().attr({"id": "PreName", "class": "box_text2", "name": "preset"});

		var inputFile_logo 		= this.createElement("input", {"type": "file", "id": "iconfile", "class": "box", "name": "logo"});
		var inputFile_custom	= this.createElement("input", {"type": "file", "id": "customfile", "class": "box", "name": "custom"});
		var optionRed 			= option.clone().attr({"value": "red"}).text("Red");
		var optionBlue 			= option.clone().attr({"value": "blue"}).text("Blue");
		var optionGreen 		= option.clone().attr({"value": "green"}).text("Green");
		var optionYellow 		= option.clone().attr({"value": "yellow"}).text("Yellow");
		var optionPink			= option.clone().attr({"value": "pink"}).text("Pink");
		var optionGrey			= option.clone().attr({"value": "grey"}).text("Grey");
		var optionOrange		= option.clone().attr({"value": "orange"}).text("Orange");

		var spacer 				= div.clone().css({"margin-left":"25px", "margin-top":"10px"});

		var donate 				= this.createElement("a", {"href": "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=3YRQBKYGF38ZL", "class":"button","target":"_blank", "title":"Any donation is much appreciated. \n\n With a donation you support the development of this and other Hangout apps. Thank you!"}).html("Fund Development");

		var hr_line				= this.createElement("hr", {"class":"line"});

		var presetlist			= this.createElement("ul", {"id":"presetlist", "class":"presetlist"});
		
		/*
		 * Append all elements
		*/
		inputSelect.append(optionRed, optionBlue, optionGreen, optionPink, optionYellow, optionGrey, optionOrange);

		fieldset_lowerthird.append(switch_lowerthird, inputText_name,inputText_tagline,inputColor,inputFile_logo);
		fieldset_clock.append(switch_clock, radio_left, radio_left_text, radio_right, radio_right_text);
		fieldset_custom.append(switch_custom, inputFile_custom);
		fieldset_presets.append(inputText_preset, button_save,presetlist);

		form.append(fieldset_lowerthird,fieldset_clock,fieldset_custom,fieldset_presets, spacer);
		body.append(form);

		/*
		 * Create canvas elements for the lower third
		*/
		this.canvas = this.createElement("canvas", {"id":"canvas"}).height("75").width("640")[0];
		this.canvas_custom = this.createElement("canvas", {"id":"canvas_custom"}).height("360").width("640")[0];
		this.canvas_clock = this.createElement("canvas", {"id":"canvas_clock"}).height("360").width("640")[0];

		/*
		 * Append DOM structure to container
		*/
		jQuery("#app-lowerthird").append(body);

        new jscolor.color(document.getElementById('Color'), {});
		/*
		 * Bind click event to the On/Off switch
		*/	
		switch_lowerthird.click(this.toggleShow.bind(this));
		switch_clock.click(this.toggleShowClock.bind(this));
		switch_custom.click(this.toggleShowCustom.bind(this));
		inputText_tagline.click(this.clearTagline.bind(this));
		inputText_tagline.focus(this.clearTagline.bind(this));
		button_save.click(this.SavePreset.bind(this));

		/*
		 * Bind scroll event to toggle shadow
		*/
		body.on("scroll", this.bodyOnScroll.bind(this));
	}

	/**
	 * @getCanvas - Get canvas from DOM
	 * @private
	 * @returns {HTMLCanvasElement}
	*/
	LowerThird.prototype.getCanvas = function(){
		return this.canvas;
	}

	LowerThird.prototype.clearTagline = function(){

		jQuery("#inputText_tagline").value = '';
	}

		/**
	 * @toggleShow - Fired when #button is clicked
	 * @public
	 * @see LowerThird.buildDOM
	*/
	LowerThird.prototype.toggleShow = function(){
		if(this.overlays[this.loadedoverlay]){
			this.overlays[this.loadedoverlay].setVisible(false);
			this.overlays[this.loadedoverlay].dispose();
			delete this.overlays[this.loadedoverlay];
			this.globalShowSaved = false;
		}
		if(this.globalShow === false){
			jQuery("#switch_lowerthird").removeClass("onoffswitch").addClass("onoffswitch_active");
			jQuery("#Name").attr({"disabled": "disabled"});
			jQuery("#Tag").attr({"disabled": "disabled"});
			jQuery("#Color").attr({"disabled": "disabled"});
			jQuery("#iconfile").attr({"disabled": "disabled"});
			this.globalShow = true;
			this.createCanvas();
			return;
		}

		jQuery("#switch_lowerthird").removeClass("onoffswitch_active").addClass("onoffswitch");
		jQuery("#Name").removeAttr("disabled");
		jQuery("#Tag").removeAttr("disabled");
		jQuery("#Color").removeAttr("disabled");
		jQuery("#iconfile").removeAttr("disabled");
		this.globalShow = false;

		this.overlays['lowerthird'].setVisible(false);
		this.overlays['lowerthird'].dispose();
		delete this.overlays['lowerthird'];
		
	}

	/**
	 * @toggleShow - Fired when #button is clicked
	 * @public
	 * @see LowerThird.buildDOM
	*/
	LowerThird.prototype.toggleShowClock = function(){
		if(this.globalShowClock === false){
			jQuery("#switch_clock").removeClass("onoffswitch").addClass("onoffswitch_active");
			this.globalShowClock = true;
			jQuery("#radio_left").attr({"disabled": "disabled"});
			jQuery("#radio_right").attr({"disabled": "disabled"});
			this.drawClock();
			return;
		}
		jQuery("#switch_clock").removeClass("onoffswitch_active").addClass("onoffswitch");
		this.globalShowClock = false;
		jQuery("#radio_left").removeAttr("disabled");
		jQuery("#radio_right").removeAttr("disabled");
		if("clock" in this.overlays){
			this.overlays['clock'].setVisible(false);
			this.overlays['clock'].dispose();
			delete this.overlays['clock'];
		}

	}

	/**
	 * @toggleShowCustom - Fired when #button2 is clicked
	 * @public
	 * @see LowerThird.buildDOM
	*/
	LowerThird.prototype.toggleShowCustom = function(){
		if(this.globalShowCustom === false){
			jQuery("#switch_custom").removeClass("onoffswitch").addClass("onoffswitch_active");
			this.globalShowCustom = true;
			this.readImageFromInput(document.getElementById("customfile"), function(data){

				this.overlayImage = data.result;
				this.customcanvas = data.result;
				var img = new Image();
				img.src = data.result;
				img.onload = function(){
					this.overlayResource = gapi.hangout.av.effects.createImageResource(this.overlayImage);
					this.overlays['custom'] = this.overlayResource.createOverlay({});
					this.overlays['custom'].setPosition(0, 0);
					if(img.height > img.width){
						var scale = img.height/360;
						if(scale >= 1){scale = 1}
						this.overlays['custom'].setScale(scale, gapi.hangout.av.effects.ScaleReference.HEIGHT);
					}else{
						var scale = img.width/640;
						if(scale >= 1){scale = 1}
						this.overlays['custom'].setScale(scale, gapi.hangout.av.effects.ScaleReference.WIDTH);
					}
					this.overlays['custom'].setVisible(true);
					jQuery("#customfile").attr({"disabled": "disabled"});
				}.bind(this);				
			}.bind(this));	
			return;
		}

		jQuery("#switch_custom").removeClass("onoffswitch_active").addClass("onoffswitch");
		this.globalShowCustom = false;
		this.overlays['custom'].setVisible(false);
		this.overlays['custom'].dispose();
		delete this.overlays['custom'];
		jQuery("#customfile").removeAttr("disabled");
	}

	/**
	 * @getCanvasClock - Get clock canvas from DOM
	 * @private
	 * @returns {HTMLCanvasElement}
	*/
	LowerThird.prototype.getCanvasClock = function(){
		return this.canvas_clock;
	}

	/**
	 * @createImageResourceFromCanvas - Creates a image resource from a canvas element
	 * @private
	 * @param canvas {HTMLCanvasElement}
	*/
	LowerThird.prototype.createImageResourceFromCanvas = function(canvas){
		return gapi.hangout.av.effects.createImageResource(canvas.toDataURL());
	}

	/**
	 * @createClock - Creates the Clock with current time
	 * @private
	*/
	LowerThird.prototype.createClock = function(currentTime){
		var currentHours = currentTime.getHours();
  		var currentMinutes = currentTime.getMinutes();
  		currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
  		var timeOfDay = ( currentHours < 12 ) ? "AM" : "PM";
  		currentHours = ( currentHours > 12 ) ? currentHours - 12 : currentHours;
  		currentHours = ( currentHours == 0 ) ? 12 : currentHours;
  		var currentTimeString = currentHours + ":" + currentMinutes + " " + timeOfDay;
  		return currentTimeString;
	}

	/**
	 * @prepareCanvasContext - Prepares a canvas for manipulation
	 * @private
	 * @param canvas {HTMLCanvasElement}
	*/
	LowerThird.prototype.prepareCanvasContext = function(canvas,h,w){
		canvas.canvas.width = w;
		canvas.canvas.height = h;
		canvas.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);
		canvas.textAlign = "left";
		canvas.textBaseline = "top";
	}

		/**
	 * @createCanvas - Creates the canvas
	 * @private
	*/
	LowerThird.prototype.createCanvas = function(){
		/*
		 * Get 2d context for canvas elements
		*/	
		var canvasContext = this.getCanvas().getContext("2d");
		
		/*
		 * Prepare canvas elements for manipulation
		*/
		this.prepareCanvasContext(canvasContext,75,640);
		var template_1 = "data:image/png;base64,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";
		var template_2 = "data:image/png;base64,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";
		var template_3 = "data:image/png;base64,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";
		var template_4 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAABLCAYAAADgfTZ9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAABlBJREFUeNrs3D9snGcdwPFfokbKgJQMHSI1YmSIGBhS23X8p66dQOMQOVSplSgqFFVpJYTioZVbqWVhQ4gZJiYGkJBYqe/8N7HBSWck6MKCkFiw784SAulheF7bl3NCQnKXu/fuY+mz+M/57rn33ufr33tJpJQCAIDBYREAAAQgAAACEAAAAQgAgAAEAEAAAgAgAAEAEIAAAAhAAAAEIAAAbQnAiHgFAICuOxMRL0fE6Yg4GREvFdofgDsPFtPOFz8qvX8+59d5Hp/16G314u8DaD33fNZX+223bqsXf99zebCYdrdup/rG9fTl735Yb3sANirjqb46m2p3b6bdrQ/Szv3FtPPgk/523333/A7gY3LsOE47fp8/9rx27fiw9t1dm4+f/2fuL6bdrQ9S7e7NVF+dTY3KeNr7/Hza+/x8+stvvldrewDu3/i+RnUyB+HGfKptvpd2txfSzv2PSuLDJ3/P9kclejxPabuPnh8YCAP0Wth+ljX40HljUPavAV6D3e2FVNt8L9U25nPwVSdTa5O90AA8EoSVC6mxcinV1+aKKeHttPvHhWd0p9D6uQV62E6p7/+dDn3voKzJgjXp6mvsTunPHTt9dT6h119zO728t23dztO9tbnUWLmUGpUL6UkN1tUAfHQUjjdF4Y1U23w37f7hBwAAA6+2+W6q3b3RFHvj6Vl66yAAf/3d3gjAx04Kl6dTfXU21dffSrW7N3MYbt0GAOg7OfRupvr6W/ky7vL0/zXZe1p/7uUAfKSl4TwtXJ5J9dXLqb5+Lb+38N47qbb5fVrsPuXnoB+ObXD8UBr33snv1Vu/luqrl1NjeSZP9ZaGU0c7qrQB+NgwHMoTw+pUvpS8eiUv6sZ8qt27lRcaAOCFuZXqB5F3JV+6rU7lid7SUOpKL/VdAP7POBxJjcpYXvTli3lyuHY1X1bemM+XlmGg3bAGDMhxdcM6014b8/ly7drVYpJ3sYi8sbS3NJJ6rokGKgCfMDncWxpNjepEaizvTw/fLALxWqqvX0/1jbdpg5r75DHhOYKyWb+ee2DtaqqvvpmneMtTqVGdSHtLo12f5AnATgdiZSw1qq/nN2PuR+LqlVRfm0v19e8AAGW0Npf384O4m877fWW81IEnADvu1fyGzaXR/I9TqpP5L4PlmaZQnM1/OQAAL87qbFPYzRSTu8mmuBvO+/hAdYsA7MIkcSTtVfZDcaKYKL5xEIuNlSIWAYDHaqx8qynq3sj7aXUih11lNO+3fTq5E4B9P1Hcj8Wxw8lideowGJcvFtH4TQAouUt5XzsIusNJXaMy1hR1gzuxE4C0xGIxWVwaKS5DX2iJxuZwnC5eXADQSdMPh1xTzOX/AmW0ae8aEnUCkI4H45FofO1oOB5cop4sxupTAAys14v9YOJwj3go5F57RMwJOgFI/4TjQTwOtwRkjsh8yXo/JJtiEoAeMHYYbpXRpnhrDrjhlogTcgJQANK2gNyPyOaQbInJIigPoxJgMO2fCw/OjUeibaTpnDok4BCA9HFItjoIy+a4fFRkArxoreekoceE2qvCDQEIPRGWT+uhAAVKox2vf+dRBKAABAAQgAAACEAAAAQgAAACEAAAAQgAgAAEAEAAAgAgAAEAEIAAAAJQAAIACEABCAAgAAUgAIAAPBKAx44dSwAAZRAR/+lD/46If0VEPSL+HhFfRMQvI+L9iPhGRJxuewAeP348AQCUQUTs9aFGROxGxD8i4suIqEbEzyLiVkR8PSK+0vYAPHHiRAIAKINiQtZv/hYRf42IP0XEvYj4VUQsRsTliPhaRJxsewCeOnUqAQCUQUSs9aGViPh9RPw2In4eEZ9GxNsRcT4izkTES20PwLNnzyYAgDKIiJ/2oZ9ExI+Lqd/7ETEXEcMR8dWION2RADx37lwCACiDIo76zbeLy70zETEaEeci4pUi/k52JACHhoYSAEAZFGHUr85ExMvN4VeItgfgxMREAgAogxjQDwEIAAhAASgAAYCB0fYYGkQCEAAQgAIQAEAACkAAAAEoAAEABKAABAAQgAIQAEAACkAAAAEoAAEABKAABAAQgB0MwF8AAJSEgGtHAFoEAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAQBv8FwAA//8DAFflNgnJDTQoAAAAAElFTkSuQmCC";
		var template_5 = "data:image/png;base64,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";
		var template_6 = "data:image/png;base64,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";
		var template_7 = "data:image/png;base64,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";
		switch(this.getInputValue("Select option:selected")){
			case "red":
				var logo = template_1;
				break;
			case "blue":
				var logo = template_2;
				break;
			case "green":
				var logo = template_3;
				break;
			case "yellow":
				var logo = template_4;
				break;
			case "pink":
				var logo = template_5;
				break;
			case "grey":
				var logo = template_6;
				break;
			case "orange":
				var logo = template_7;
				break;
			default:
				var logo = template_1;
		}

		var finish = function(){

            var text_top_color = "black";
            if($('#Color').css('color') != '') {
              text_top_color = $('#Color').css('color');
            }
			if(gapi.hangout.onair.isOnAirHangout() === true) {
				this.drawTextToCanvas(this.getInputValue("Name"), 110, 13, 28, text_top_color);
				this.drawTextToCanvas(this.getInputValue("Tag"), 110, 47, 15, "white");
			}else{
				this.drawTextToCanvas(this.getInputValue("Name"), 110, 13, 28, text_top_color);
				this.drawTextToCanvas(this.getInputValue("Tag"), 110, 47, 15, "white");
			}

			/*
			 * Convert canvas elements to image resources
			*/
			var canvasImage = this.createImageResourceFromCanvas(canvasContext.canvas);
			
			/*
			 * Create face tracking overlay from image resource
			*/
			this.overlays['lowerthird'] = canvasImage.createOverlay({
			});

			/*
			 * Set face tracking overlay parameters and toggle between Show/Hide
			*/
			this.overlays['lowerthird'].setScale(1, gapi.hangout.av.effects.ScaleReference.WIDTH);
			this.overlays['lowerthird'].setPosition(0, 0.40);
			var overlayCanvas = canvasContext.canvas;
			this.fullcanvas = overlayCanvas.toDataURL();
			var overlayData = overlayCanvas.toDataURL();
			if(this.globalShow === true){
				this.overlays['lowerthird'].setVisible(true);
			}else{
				this.overlays['lowerthird'].setVisible(false);
				this.overlays['lowerthird'].dispose();
				delete this.overlays['lowerthird'];
			}
		}.bind(this)

		//this.drawImageToCanvas(canvasContext, logo, 0, 0, 10, 70, function(){
		this.drawShape(canvasContext, function(){
			this.readImageFromInput(document.getElementById("iconfile"), function(data){
				if(data === false || data.result === false){
					finish();
					return;
				}
				if(gapi.hangout.onair.isOnAirHangout() === true) {
					var logo_x = "10";
				}else{
					var logo_x = "10";
				}
					this.drawImageToCanvas(canvasContext, data.result, logo_x, 3, 70, 70, function(){
					finish();
					
				}, function(img, w, h){
					//resizing
					var newSize = this.scaleSize(70, img.width, img.height);
					img.width = newSize[0];
					img.height = newSize[1];
				});		
			});
		});	
	}

	/**
	 * @drawImageToCanvas - Draws an image to a canvas
	 * @private
	 * @param context, data {string}, x {int}, y {int}, w {int}, h {int}, 
	*/
	LowerThird.prototype.drawImageToCanvas = function(context, data, x, y, w, h, callback, prepcall){
		var img = new Image();

		img.onload = function(){
			(prepcall || function(){}).call(this, img, w, h);
			context.drawImage(img, x, y, img.width, img.height);
			callback.call(this);
		}.bind(this)
		img.src = data;
	}

	/**
	 * @drawTextToCanvas - Draws text to a canvas
	 * @private
	 * @param data {string}, x {int}, y {int}, w {int}, h {int}, 
	*/
	LowerThird.prototype.drawTextToCanvas = function(text, x, y, size, color, font){
		var canvasContext = this.getCanvas().getContext("2d");
		canvasContext.font = size + "px " + (font ? font : "Arial");
		canvasContext.fillStyle = color || "black";
		canvasContext.fillText(text, x, y);
	}

	/**
	 * @drawClockToCanvas - Draws text to a canvas
	 * @private
	 * @param data {string}, x {int}, y {int}, w {int}, h {int}, 
	*/
	LowerThird.prototype.drawClockToCanvas = function(text, x, y, size, color, font){
		var canvasContext = this.getCanvasClock().getContext("2d");
		canvasContext.font = size + "px " + (font ? font : "Arial");
		canvasContext.fillStyle = color || "black";
		canvasContext.fillText(text, x, y);
	}

		/**
	 * @drawClock - Draws the clock to the canvas
	 * @private
	*/
	LowerThird.prototype.drawClock = function(){
		if(this.globalShowClock === true){
			this.clockIntervalID = setTimeout(this.drawClock.bind(this), 30 * 1000);
			if("clock" in this.overlays){
				if((new Date()).getMinutes() == this.currentTimestamp.getMinutes()){
					return;
				}
				this.overlays['clock'].setVisible(false);
				this.overlays['clock'].dispose();
				delete this.overlays['clock'];
			}
			var selected_id = $("input[name=clock]:checked").attr('id');
			if(selected_id === "radio_left"){
				var clockbg = "data:image/png;base64,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";
				x_text = 5;
				x_bg = 0;
			}
			if(selected_id === "radio_right"){
				var clockbg = "data:image/png;base64,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";
				x_text = 577;
				x_bg = 570;
			}
			var clockContext = this.getCanvasClock().getContext("2d");
			this.prepareCanvasContext(clockContext,360,640);
			this.currentTimestamp = new Date();
			this.drawImageToCanvas(clockContext, clockbg, x_bg, 38, 250, 20, function(){
				this.drawClockToCanvas(this.createClock(this.currentTimestamp), x_text, 39, 15, "black");
				var canvasImage = this.createImageResourceFromCanvas(clockContext.canvas);
				this.overlays['clock'] = canvasImage.createOverlay({});
				this.overlays['clock'].setScale(1, gapi.hangout.av.effects.ScaleReference.WIDTH);
				this.overlays['clock'].setPosition(0, 0);
				this.overlays['clock'].setVisible(true);
			}.bind(this));
		}
	}

	/**
	 * @loadSaved - Loads the last used Overlay
	 * @private
	*/
	LowerThird.prototype.generatePresets = function(){
		var storage = jQuery.jStorage.index();
		ul = jQuery("#presetlist");
		jQuery("li",ul).remove();
		var presets = jQuery.grep(storage, function(a){
			return (a != "notice");
		});
		presets_out = jQuery.grep(presets, function(a, b){
			return (a != "overlay");
		});
		if(presets_out.length === 0){
			nopresets = this.createElement("li").text("No saved presets!");
			jQuery("#presetlist").append(nopresets);
		}else{
			var i = 0;
			for(i = 0; i < presets_out.length; i++){
				var li = this.createElement("li", {"class":"presetlist_li", "id": presets_out[i]}).text(presets_out[i].substring(4));
				var deleteButton = this.createElement("a",{"class":"delete"});
				var loadButton = this.createElement("a",{"class":"load"});
				deleteButton.click(this.DeletePreset.bind(this));
				loadButton.click(this.loadPreset.bind(this));
				li.click(this.loadPresetText.bind(this));
				li.append(deleteButton,loadButton);
				jQuery("#presetlist").append(li);
			}
		}
	}

	/**
	 * @loadSaved - Loads the last used Overlay
	 * @private
	*/
	LowerThird.prototype.loadPresetText = function(evt){
		value = evt.target.textContent;
		//console.log(evt);
		jQuery("#PreName").val(value);
	}

	/**
	 * @loadSaved - Loads the last used Overlay
	 * @private
	*/
	LowerThird.prototype.SavePreset = function(){
		var name = this.getInputValue("PreName");
		if(name === ""){
			$.modal('<div><h1>Alert</h1><h4>Please enter a name for your preset first!</h4></div>');
			//alert("Please enter a name for your preset first!");
			return;
			name = "default";
		}
		if(this.globalShow == false){
			$.modal('<div><h1>Alert</h1><h4>Nothing to save. <br />Enable Lower Third first.</h4></div>');
			//alert("Nothing to save! \nEnable Lower Third first.");
			return;
		}
		var data = this.fullcanvas;
		//console.log(jQuery.jStorage.storageSize()/1024/1024 + "MB");
		//$.jStorage.storageAvailable();
		try{
			jQuery.jStorage.set("pre_"+name, data);
		}catch(e){
			if(e.code === 22 || e.code === 1014){
				alert("No space left in local storage! Please delete presets!");
			}
		}
		jQuery("#PreName").val("");
		this.generatePresets();
	}

	/**
	 * @loadSaved - Loads the last used Overlay
	 * @private
	*/
	LowerThird.prototype.DeletePreset = function(evt){
		id = evt.target.parentNode.id;
		console.log(evt);
		jQuery.jStorage.deleteKey(id);
		this.generatePresets();
	}

		/**
	 * @loadSaved - Loads the last used Overlay
	 * @private
	*/
	LowerThird.prototype.loadPreset = function(evt){
		id = evt.target.parentNode.id;
		if(this.overlays[this.loadedoverlay]){
			this.overlays[this.loadedoverlay].setVisible(false);
			this.overlays[this.loadedoverlay].dispose();
			delete this.overlays[this.loadedoverlay];

		}
		if (this.loadedoverlay != id) {
			this.globalShowSaved = false;
		};
		if(this.overlays['lowerthird']){
			this.globalShow = false;
			jQuery("#switch_lowerthird").removeClass("onoffswitch_active").addClass("onoffswitch");
			this.overlays['lowerthird'].setVisible(false);
			this.overlays['lowerthird'].dispose();
			delete this.overlays['lowerthird'];
			jQuery("#Name").removeAttr("disabled");
			jQuery("#Tag").removeAttr("disabled");
			jQuery("#Select").removeAttr("disabled");
			jQuery("#iconfile").removeAttr("disabled");
		}
		if(this.globalShowSaved === false){
			this.globalShowSaved = true;
			this.loadedoverlay = id;
			var storedImage = gapi.hangout.av.effects.createImageResource($.jStorage.get(id));
			this.overlays[id] = storedImage.createOverlay({
			});
			this.overlays[id].setScale(1, gapi.hangout.av.effects.ScaleReference.WIDTH);
			this.overlays[id].setPosition(0, 0.39);
			this.overlays[id].setVisible(true);
		}else{
			this.globalShowSaved = false;
			this.loadedoverlay = "";
			if(this.overlays[id]){
				this.overlays[id].setVisible(false);
				this.overlays[id].dispose();
				delete this.overlays[id];
			}
		}
	}
	
	/**
	 * @scaleSize - Scales the size of something
	 * @public
	*/
	LowerThird.prototype.scaleSize = function(maxHeight, width, height){
		var ratio = maxHeight / height;
		width = width * ratio;
		height = maxHeight;
		return[width, height];
	}

	/**
	 * @scale - Scales the body for different resolutions
	 * @public
	*/
	LowerThird.prototype.scale = function(){
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
	LowerThird.prototype.bodyOnScroll = function(evt){
		/*
		 * Hide/Show shadow depending on scroll position
		*/
		jQuery("#body").scrollTop() > 0 ? jQuery(".shadow", "#container").show() : jQuery(".shadow", "#container").hide(); 
	}
	
	/**
	 * @getInputValue - Get Input values from form
	 * @public
	 * @param id {string}
	 * @returns {String}
	*/
	LowerThird.prototype.getInputValue = function(id){
		return jQuery("#" + id).val();
	}

	/**
	 * @getParticipant - Get Input values from form
	 * @public
	 * @returns {String}
	*/
	LowerThird.prototype.getParticipant = function(){
		var uid = gapi.hangout.getLocalParticipantId();
		var p = gapi.hangout.getParticipants();
		for(i = 0; i < p.length; i++) {
			if(p[i].id == uid){
				jQuery("#Name").attr({"value":p[i].person.displayName});
			}
		}
	}
	
	/**
	 * @createElement - Creates a new element
	 * @public
	 * @param type {String} 
	 * @param attr {Object} 
	*/
	LowerThird.prototype.createElement = function(type, attr){
		return jQuery("<" + type + ">").attr(attr || {});
	}

    LowerThird.prototype.Rectangle = function(x, y, width, height, color, shadow) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.color = color;
      this.shadow = shadow;
    }

    LowerThird.prototype.Rectangle.prototype.draw = function(context) {
      context.restore();
      context.fillStyle = this.color;

      if(typeof(this.shadow) != 'undefined') {
        context.shadowColor = '#000';
        context.shadowBlur = 7;
        context.shadowOffsetX = -4;
        context.shadowOffsetY = 4;
      }
      context.fillRect(this.x, this.y, this.width, this.height);
      context.shadowColor = null;
      context.shadowBlur  = null;
      context.shadowOffsetX = null;
      context.shadowOffsetY = null;
    }

    LowerThird.prototype.drawPlastic = function(context, targetColor) {
      context.beginPath();
      context.moveTo(0, 12);
      context.quadraticCurveTo(290, 38, 580, 12);
      context.lineTo(0, 12);
      var lingrad = context.createLinearGradient(290, -3, 290, 39);
      lingrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      lingrad.addColorStop(1, 'rgba('+ parseInt(targetColor.substring(1,3),16) +', '+ parseInt(targetColor.substring(3,5),16) +', '+ parseInt(targetColor.substring(5,7),16) +', 0)');
      context.fillStyle = lingrad;
      context.fill();
    }

    LowerThird.prototype.drawShape = function(context, callback) {
      var canvas = context.canvas;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.save();

      var color = [221, 75, 57];

      var box_bottom = new this.Rectangle(0, 45, 450, 20, '#3e3e3e');
      box_bottom.draw(context);

      var color_top = 'rgba('+ color[0] +', '+ color[1] +', '+ color[2]+', 1)';
      if($('#Color').val() != '') {
        color_top = '#'+ $('#Color').val();
      }

      var box_top = new this.Rectangle(0, 12, 580, 33, color_top, true);
      box_top.draw(context);

//      var color_text_top = '#000000';
//      if($('#color_top').css('color') != '') {
//        color_text_top = $('#color_top').css('color');
//      }

      this.drawPlastic(context, color_top);
	  callback.call(this);
    }


	/**
	 * @onApiReady - Fired by gapi when it's ready
	 * @private
	 * @param event {gapi.hangout.apiReadyEvent}
	*/
	LowerThird.prototype.onApiReady = function(event){
		if(event.isApiReady){
			try {
				this.buildDOM();
				this.scale();
				this.getParticipant();
				this.generatePresets();
				console.log("Lower Third App loaded!");
				if($.jStorage.get("notice") != "true"){
					$.modal('<div><h1>Notice</h1><h4>The overlay is mirrored. <br />It looks fine for everyone else!</h4></div>');
					$.jStorage.set("notice", "true");
				}	
			}
			catch(err) {
				console.log(err);
			}
		}
	}

	// Export instantiated LowerThird to main window
	window["appController"] = new LowerThird();
})()
