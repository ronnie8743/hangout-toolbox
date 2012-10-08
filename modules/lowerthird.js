(function(){
	/**
	 * @LowerThird
	 * @constructor
	*/
	function LowerThird(){
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
		this.customfullcanvas = "";
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
		var lowerbody = div.clone().attr({"id": "lowerbody"});

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

		var button_save			= this.createElement("a", {"id": "lowerthird-save-button", "class": "general-button-blue"}).html("Save");

		var radio_left			= this.createElement("input", {"type": "radio", "id":"radio-button-left", "name":"clock", "checked":"checked"});
		var radio_left_text		= label.clone().attr({"for": "name"}).text("Left");
		var radio_right			= this.createElement("input", {"type": "radio", "name":"clock", "id":"radio-button-right"});
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

		var presetlist			= this.createElement("ul", {"id":"lowerthird-preset-list"});

		var dialog 				= this.createElement("div", {"id":"dialog-message","title":"First run notice","class":"dialog"}).html("<p>You are running the Hangout Toolbox for the first time. Please be aware that all overlays of Lower Third will appear mirrored for you! <br />Everyone else in the Hangout will see the overlays correctly!</p>");
		var error1 				= this.createElement("div", {"id":"dialog-error1","title":"No name entered","class":"error"}).html("<p>Please enter a name for your preset first!</p>");
		
		/*
		 * Append all elements
		*/
		inputSelect.append(optionRed, optionBlue, optionGreen, optionPink, optionYellow, optionGrey, optionOrange);

		fieldset_lowerthird.append(switch_lowerthird, inputText_name,inputText_tagline,inputColor,inputFile_logo);
		fieldset_clock.append(switch_clock, radio_left, radio_left_text, radio_right, radio_right_text);
		fieldset_custom.append(switch_custom, inputFile_custom);
		fieldset_presets.append(inputText_preset, button_save,presetlist);

		form.append(fieldset_lowerthird,fieldset_clock,fieldset_custom,fieldset_presets, spacer);
		lowerbody.append(form,dialog,error1);

		/*
		 * Create canvas elements for the lower third
		*/
		this.canvas = this.createElement("canvas", {"id":"canvas"}).height("75").width("640")[0];
		this.canvas_custom = this.createElement("canvas", {"id":"canvas_custom"}).height("360").width("640")[0];
		this.canvas_clock = this.createElement("canvas", {"id":"canvas_clock"}).height("360").width("640")[0];

		/*
		 * Append DOM structure to container
		*/
		jQuery("#app-lowerthird").append(lowerbody);

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
			jQuery("#radio-button-left").attr({"disabled": "disabled"});
			jQuery("#radio-button-right").attr({"disabled": "disabled"});
			this.drawClock();
			return;
		}
		jQuery("#switch_clock").removeClass("onoffswitch_active").addClass("onoffswitch");
		this.globalShowClock = false;
		jQuery("#radio-button-left").removeAttr("disabled");
		jQuery("#radio-button-right").removeAttr("disabled");
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
				this.customfullcanvas = data.result;
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
			if(selected_id === "radio-button-left"){
				var clockbg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAAUCAYAAAAwaEt4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAAEFJREFUeNrs0DERACAMALFq7YB/B8+MBO4yxECm2urw2BEjRowYMWLEiBEjRowYEWLEiBEjRoyY/2IuAAAA//8DAGNShddjAFzSAAAAAElFTkSuQmCC";
				x_text = 5;
				x_bg = 0;
			}
			if(selected_id === "radio-button-right"){
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
		ul = jQuery("#lowerthird-preset-list");
		jQuery("li",ul).remove();
		var presets = jQuery.grep(storage, function(a){
			return (a != "notice");
		});
		presets_out = jQuery.grep(presets, function(a, b){
			return (a != "overlay");
		});
		if(presets_out.length === 0){
			nopresets = this.createElement("li").text("No saved presets!");
			jQuery("#lowerthird-preset-list").append(nopresets);
		}else{
			var i = 0;
			for(i = 0; i < presets_out.length; i++){
				var label = presets_out[i].split("_");
				var li = this.createElement("li", {"id": presets_out[i]}).text(label[1]);
				var deleteButton = this.createElement("a",{"class":"lowerthird-delete-preset"});
				var loadButton = this.createElement("a",{"class":"lowerthird-load-preset"});
				deleteButton.click(this.DeletePreset.bind(this));
				loadButton.click(this.loadPreset.bind(this));
				li.click(this.loadPresetText.bind(this));
				li.append(deleteButton,loadButton);
				jQuery("#lowerthird-preset-list").append(li);
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
		if(this.globalShow === true){
			var name = this.getInputValue("PreName");
			if(name === ""){
				$( "#dialog-error1" ).dialog({
						modal: true,
						draggable: false,
						resizable: false,
						buttons: {
							Ok: function() {
								$( this ).dialog( "close" );
							}
						}
					});
				return;
				name = "default";
			}
			var data = this.fullcanvas;
			try{
				jQuery.jStorage.set("pre_"+name, data);
			}catch(e){
				if(e.code === 22 || e.code === 1014){
					alert("No space left in local storage! Please delete presets!");
				}
			}
		}
		if(this.globalShowCustom === true){
			var name = this.getInputValue("PreName");
			if(name === ""){
				$( "#dialog-error1" ).dialog({
						modal: true,
						draggable: false,
						resizable: false,
						buttons: {
							Ok: function() {
								$( this ).dialog( "close" );
							}
						}
					});
				return;
			}
			var data = this.customfullcanvas;
			try{
				jQuery.jStorage.set("precustom_"+name, data);
			}catch(e){
				if(e.code === 22 || e.code === 1014){
					alert("No space left in local storage! Please delete presets!");
				}
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
		var confirm_result = confirm("Do you want to delete this preset?");
		id = evt.target.parentNode.id;
		if(confirm_result == true){
			jQuery.jStorage.deleteKey(id);
			this.generatePresets();
		}else{
			this.generatePresets();
		}
		
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
			var type = id.split("_",1);
			if(type[0] === "pre"){
				var offset = 0.39;
			}else{
				var offset = 0;
			}
			var storedImage = gapi.hangout.av.effects.createImageResource($.jStorage.get(id));
			this.overlays[id] = storedImage.createOverlay({
			});
			this.overlays[id].setScale(1, gapi.hangout.av.effects.ScaleReference.WIDTH);
			this.overlays[id].setPosition(0, offset);
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
				this.getParticipant();
				this.generatePresets();
				
				if($.jStorage.get("notice") != "true"){
					$( "#dialog-message" ).dialog({
						modal: true,
						draggable: false,
						resizable: false,
						buttons: {
							Ok: function() {
								$( this ).dialog( "close" );
							}
						}
					});
					
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
