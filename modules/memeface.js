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
	}

	/**
	 * @buildDOM - Building the DOM structure
	 * @private
	*/
	MemeFace.prototype.buildDOM = function(){
		/*
		 * Create empty elements
		*/
		var div = this.createElement("div");
		var span = this.createElement("span");
		var cleardiv = this.createElement("div", {"class": "clear"});
		
		/*
		 * Create pane body
		*/
		var fieldset_memefaces	= this.createElement("fieldset", {"class": "fieldset"});
		var legend_lowerthird	= this.createElement("legend", {"class": "legend"}).text("Meme Faces").appendTo(fieldset_memefaces);
		var switch_memefaces	= this.createElement("a",{"id": "switch_memefaces", "class": "onoffswitch"});
		var memebody = div.clone().attr({"id": "memebody"});
		var form = this.createElement("form", {"id": "form"});

		var grid_container		= div.clone().attr({"class":"grid_container"});
		var grid_table			= this.createElement("table", {"class":"table_faces"});
		var content = "";
		for(var i = 0; i < faces.length; i++){
			if((i % 3) == 0){
				content += "<tr>";
			}
			content += "<td><a data-face='" + faces[i].title + "' class='btn-faces' style='background-image: url(https://s3.amazonaws.com/MT_Cloud/images/small/" + faces[i].data + ");' title='" + faces[i].title + "'></a></td>";
			if((i % 3) == 2){
				content += "</tr>";
			}
		}

		fieldset_memefaces.append(switch_memefaces, content);

		form.append(fieldset_memefaces);
		grid_table.append(form);
		grid_container.append(grid_table);
		jQuery("a[data-face]").live("click",this.toggleFace.bind(this));

		switch_memefaces.click(this.toggleShow.bind(this));
		memebody.append(grid_container);

		/*
		 * Append DOM structure to container
		*/
		jQuery("#app-memeface").append(memebody);
	}

	/**
	 * @createImageResourceFromCanvas - Creates a image resource from a canvas element
	 * @private
	 * @param canvas {HTMLCanvasElement}
	*/
	MemeFace.prototype.createFacesResources = function(){
		for(var i = 0; i < faces.length; i++){
			this.overlays[faces[i].title] = { 'resource': gapi.hangout.av.effects.createImageResource('https://s3.amazonaws.com/MT_Cloud/images/' + faces[i].data), 'active': false };

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
	 * @see LowerThird.buildDOM
	*/
	MemeFace.prototype.toggleShow = function(){
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
			return;
		} else {
		    this.globalShow = false;
        }
	}


	MemeFace.prototype.toggleFace = function(evt){
		var title = jQuery(evt.target).data("face");
        var that = this;

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
				console.log("Meme Face loaded!");
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
