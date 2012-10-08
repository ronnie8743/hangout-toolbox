 (function(){
	/**
	 * @MemeFace
	 * @constructor
	*/
	function MemeFace(){
		/**
		 * @MemeFace.globalShow - defines the initial state of globalShow 
		 * @private
		 * @type {boolean}
		*/
		this.globalShow = false;
		this.globalShowOwnFace = false;
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
		this.overlayOwnFace = null;

		/*
		 * Bind gapi events when API is ready
		*/
		gapi.hangout.onApiReady.add(this.onApiReady.bind(this));
	}

	/**
	 * @buildDOM - Building the DOM structure
	 * @private
	*/
	MemeFace.prototype.buildDOM = function(){
		/*
		 * Create empty elements
		*/
        var that = this;
		var div = this.createElement("div");
		var span = this.createElement("span");
		var cleardiv = this.createElement("div", {"class": "clear"});
		var inputText = this.createElement("input", {"class": "input", "type": "text"});
		
		/*
		 * Create pane body
		*/
		var fieldset_memefaces	= this.createElement("fieldset", {"class": "fieldset"});
		var fieldset_ownface	= this.createElement("fieldset", {"class": "fieldset"});
		var legend_lowerthird	= this.createElement("legend", {"class": "legend"}).text("Meme Faces").appendTo(fieldset_memefaces);
		var legend_ownface  	= this.createElement("legend", {"class": "legend"}).text("URL Face").appendTo(fieldset_ownface);
		var switch_memefaces	= this.createElement("a",{"id": "switch_memefaces", "class": "onoffswitch"});
		var switch_ownface  	= this.createElement("a",{"id": "switch_ownface", "class": "onoffswitch"});

		var memebody = div.clone().attr({"id": "memebody"});
		var form = this.createElement("form", {"id": "form"});

		var inputText_url 		= inputText.clone().attr({"id": "Url", "class": "box_text", "name": "url"});
        var inputScale          = div.clone().attr({'id': "Scale"});
		
		var spacer 				= div.clone().css({"margin-left":"25px", "margin-top":"10px"});

        var grid_container		= div.clone().attr({"class":"grid_container"});
		var grid_table			= this.createElement("table", {"class":"table_faces"});
		var content = "";
		for(var i = 0; i < faces.length; i++){
			if((i % 3) == 0){
				content += "<tr>";
			}
			content += "<td><a data-face='" + faces[i].title + "' class='btn-faces' style='background-image: url(https://mthangout.appspot.com/a/hangouttoolbox/i/small/" + faces[i].data + ");' title='" + faces[i].title + "'></a></td>";
			if((i % 3) == 2){
				content += "</tr>";
			}
		}

		fieldset_memefaces.append(switch_memefaces, content);
        fieldset_ownface.append(switch_ownface, inputText_url, inputScale);

		form.append(fieldset_memefaces, fieldset_ownface);
		grid_table.append(form);
		grid_container.append(grid_table);
		jQuery("a[data-face]").live("click",this.toggleFace.bind(this));

		switch_memefaces.click(this.toggleShow.bind(this));
		switch_ownface.click(this.toggleShowOwnFace.bind(this));
		memebody.append(grid_container);

		/*
		 * Append DOM structure to container
		*/
		jQuery("#app-memeface").append(memebody);
        $('#Scale').slider({ 'orientation': 'horizontal', 'step': 0.1, 'min': 0, 'max': 4, 'value': 2, 'change': function() { that.rescale(); } });
	}

	/**
	 * @createImageResourceFromCanvas - Creates a image resource from a canvas element
	 * @private
	 * @param canvas {HTMLCanvasElement}
	*/
	MemeFace.prototype.createFacesResources = function(){
		for(var i = 0; i < faces.length; i++){
			this.overlays[faces[i].title] = { 'resource': gapi.hangout.av.effects.createImageResource('https://mthangout.appspot.com/a/hangouttoolbox/i/' + faces[i].data), 'active': false };

			this.overlays[faces[i].title]['overlay'] = this.overlays[faces[i].title]['resource'].createFaceTrackingOverlay(
				{'trackingFeature': gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT, 
				 'offset': {"x":0,"y":faces[i].offset},
				 'rotateWithFace': true, 
				 'scaleWithFace': true, 
				 'scale': faces[i].scale
				});
		}
	}

	/**
	 * @toggleShow - Fired when #button is clicked
	 * @public
	 * @see MemeFace.buildDOM
	*/
	MemeFace.prototype.toggleShow = function(){
        var that = this;
		if(this.globalShow === true) {
            if(this.globalShowOwnFace === true) {
                this.globalShowOwnFace = false;
                this.overlayOwnFace.dispose();
                jQuery("#switch_ownface").addClass("onoffswitch").removeClass("onoffswitch_active");
            }
            $.each(this.overlays, function(key, val) {
                if(val['active'] == true) {
                    that.overlays[key]['overlay'].setVisible(false);	
                    that.overlays[key]['active'] = false;
                    that.globalShow = false;
                }
            });
			jQuery("#switch_memefaces").addClass("onoffswitch").removeClass("onoffswitch_active");
			this.globalShow = false;
			return;
		} else {
		    this.globalShow = false;
        }
	}

	/**
	 * @toggleShowOwnFace - Fired when #button is clicked
	 * @public
	 * @see MemeFace.buildDOM
	*/
	MemeFace.prototype.toggleShowOwnFace = function(){
        var that = this;

        if(this.globalShow === true) {
            $.each(this.overlays, function(key, val) {
                if(val['active'] == true) {
                    that.overlays[key]['overlay'].setVisible(false);	
                    that.overlays[key]['active'] = false;
                    that.globalShow = false;
                }
            });
            jQuery("#switch_memefaces").addClass("onoffswitch").removeClass("onoffswitch_active");
            this.globalShow = false;
        }

 		if(this.globalShowOwnFace === false) {
            var url = $('#Url').val();
            if(url != '') {
                this.overlayOwnFace = gapi.hangout.av.effects.createImageResource(url).createFaceTrackingOverlay(
                    {'trackingFeature': gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT, 
                     'offset': {"x":0,"y":faces[i].offset},
                     'rotateWithFace': true, 
                     'scaleWithFace': true, 
                     'scale': $('#Scale').slider('value')
                    });
                this.overlayOwnFace.setVisible(true);
                jQuery("#switch_ownface").removeClass("onoffswitch").addClass("onoffswitch_active");
                this.globalShowOwnFace = true;
            }
        } else {
            this.overlayOwnFace.dispose();
            this.globalShowOwnFace = false;
            jQuery("#switch_ownface").addClass("onoffswitch").removeClass("onoffswitch_active");
        }
	}

    MemeFace.prototype.rescale = function() {
        if(this.globalShowOwnFace === true) {
            this.overlayOwnFace.setScale($('#Scale').slider('value'));
        }
    }

	MemeFace.prototype.toggleFace = function(evt){
		var title = jQuery(evt.target).data("face");
        var that = this;

        if(this.globalShowOwnFace === true) {
            this.globalShowOwnFace = false;
            this.overlayOwnFace.dispose();
            jQuery("#switch_ownface").addClass("onoffswitch").removeClass("onoffswitch_active");
        }

        $.each(this.overlays, function(key, val) {
          if(key != title && val['active'] == true) {
                that.overlays[key]['overlay'].setVisible(false);	
                that.overlays[key]['active'] = false;
            that.globalShow = false;
          }
        });
            
		if(this.globalShow === false) {
			jQuery("#switch_memefaces").removeClass("onoffswitch").addClass("onoffswitch_active");
			this.overlays[title]['overlay'].setVisible(true);	
			this.overlays[title]['active'] = true;
			this.globalShow = true;
		}else{
			jQuery("#switch_memefaces").addClass("onoffswitch").removeClass("onoffswitch_active");
			this.overlays[title]['overlay'].setVisible(false);	
			this.overlays[title]['active'] = false;
			this.globalShow = false;
		}
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
	 * @onApiReady - Fired by gapi when it's ready
	 * @private
	 * @param event {gapi.hangout.apiReadyEvent}
	*/
	MemeFace.prototype.onApiReady = function(event){
		if(event.isApiReady){
			try {
				
				this.buildDOM();
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
