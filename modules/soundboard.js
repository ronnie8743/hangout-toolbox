(function(){
	/**
	 * @Soundboard
	 * @constructor
	*/
	function Soundboard(){

		this.sounds = {};
		
		/*
		 * Bind gapi events when API is ready
		*/
		gapi.hangout.onApiReady.add(this.onApiReady.bind(this));
	}
	
	/**
	 * @buildDOM - Building the DOM structure
	 * @private
	*/
	Soundboard.prototype.buildDOM = function(){
		
		/*
		 * Create empty elements
		*/
		var div = this.createElement("div");
		var label = this.createElement("label");
		var span = this.createElement("span");
		var cleardiv = this.createElement("div", {"class": "clear"});

		/*
		 * Create pane body
		*/
		var soundbody = div.clone().attr({"id": "soundbody"});
		var stopbutton = this.createElement("button", {"id": "stop"}).text("Stop All").appendTo(soundbody);		
		/*
		 * Creates the form element
		*/
		var grid_container		= div.clone().attr({"class":"grid_container_sound"});
		var grid_table			= this.createElement("table", {"class":"table_sound"});
		var content = "";

		for(var i = 0; i < sounds.length; i++){
			if((i % 3) == 0){
				content += "<tr>";
			}
			content += "<td><a data-playable='" + sounds[i].source + "' class='effect' title='" + sounds[i].title + "'>" + sounds[i].title + "</a></td>";
			if((i % 3) == 2){
				content += "</tr>";
			}
		}
		grid_table.append(jQuery(content));
		grid_container.append(grid_table);
		jQuery("a[data-playable]").live("click",this.playSound.bind(this));
		stopbutton.click(this.stopAll.bind(this));


		/*
		 * Append all elements
		*/
		soundbody.append(grid_container);

		/*
		 * Append DOM structure to container
		*/
		jQuery("#app-soundboard").append(soundbody);
	}

	/**
	 * @createSoundEffect - Creates a image resource from a canvas element
	 * @private
	 * @param canvas {HTMLCanvasElement}
	*/
	Soundboard.prototype.createSoundEffects = function(){
		for(var i = 0; i < sounds.length; i++){
			this.sounds[sounds[i].source] = gapi.hangout.av.effects.createAudioResource("https://mthangout.appspot.com/a/hangouttoolbox/s/" + sounds[i].source)
			.createSound({loop: sounds[i].loop || false, localOnly: false, volume: sounds[i].volume || 0.3});
		}
	}

	Soundboard.prototype.playSound = function(event){
		var file = jQuery(event.target).data("playable");
		this.sounds[file] && this.sounds[file].play();
	}

	Soundboard.prototype.stopAll = function(event){
		var that = this;
		jQuery.each(this.sounds, function(key, val){
			if(typeof(that.sounds[key]) != "undefined"){
				that.sounds[key].stop();
			}
		});
	}

	/**
	 * @createElement - Creates a new element
	 * @public
	 * @param type {String} 
	 * @param attr {Object} 
	*/
	Soundboard.prototype.createElement = function(type, attr){
		return jQuery("<" + type + ">").attr(attr || {});
	}

	/**
	 * @onApiReady - Fired by gapi when it's ready
	 * @private
	 * @param event {gapi.hangout.apiReadyEvent}
	*/
	Soundboard.prototype.onApiReady = function(event){
		if(event.isApiReady){
			try {
				this.buildDOM();
				console.log("Soundboard loaded!");
				this.createSoundEffects();
			}
			catch(err) {
				console.log(err);
			}
		}
	}
	// Export instantiated Soundboard to main window
	window["appController"] = new Soundboard();
})()
