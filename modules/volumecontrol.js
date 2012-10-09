(function(){
	/**
	 * @VolumeControl
	 * @constructor
	*/
	function VolumeControl(){
		/**
		 * @VolumeControl.globalShow - defines the initial state of globalShow 
		 * @private
		 * @type {boolean}
		*/
		this.globalMuted = false;

		/**
		 * @ApllicationController.overlays - defines the overlay container 
		 * @private
		 * @type {Array}
		*/
		this.overlays = [];
		this.overlayImage = "https://mthangout.appspot.com/a/hangouttoolbox/i/HangoutMuted.png";
		this.overlayResource = gapi.hangout.av.effects.createImageResource(this.overlayImage);

		/**
		 * @VolumeControl.volumeColorEnum - defines colors for volume levels
		 * @public
		 * @enum
		 * @type {object}
		*/
		this.volumeColorEnum = {
			1 : "#11b012",
			2 : "#4f9022",
			3 : "#847430",
			4 : "#a6623a",
			5 : "#cf4c44"
		}
		
		/*
		 * Bind gapi events when API is ready
		*/
		gapi.hangout.onApiReady.add(this.onApiReady.bind(this));
		gapi.hangout.onParticipantsChanged.add(this.onParticipantsChanged.bind(this));
	}
	
	/**
	 * @onParticipantsChanged - Fired participants changed
	 * @private
	 * @param evt {gapi.hangout.ParticipantsChangedEvent}
	*/
	VolumeControl.prototype.onParticipantsChanged = function(evt){
		this.generateControlls();
		if(this.globalMuted == true){
			var p = gapi.hangout.getParticipants();
			for(var i=0; i<p.length; i++) {
				gapi.hangout.av.setParticipantAudioLevel(p[i].id, 0)
			}
		}
	}
	   
	/**
	 * @buildDOM - Building the DOM structure
	 * @private
	*/
	VolumeControl.prototype.buildDOM = function(){
		var div = this.createElement("div");
		var span = this.createElement("span");
		var a = this.createElement("a", {"target": "_blank"});
		
		/*
		 * Create pane body
		*/
		var volumecontrolbody = div.clone().attr({"id": "volumecontrolbody"});
		var button = this.createElement("button", {"class": "volumecontrol-mute-all-button"}).appendTo(volumecontrolbody);
		var ul = this.createElement("ul", {"id": "participants"}).appendTo(volumecontrolbody);
				
		/*
		 * Bind click event to the On/Off button
		*/	
		button.click(this.toggleMute.bind(this));
		
		/*
		 * Append DOM structure to container
		*/
		jQuery("#app-volumecontrol").append(volumecontrolbody);
	}
	
	/**
	 * @onSliderChange - Fired when a slider input[type=range] is moved
	 * @private
	 * @param evt {jQueryEventObject}
	*/
	VolumeControl.prototype.onSliderChange = function(evt){
		var li = jQuery(evt.target.parentNode);
		var data = li.data("participant");
		var level = evt.target.value;

		if(level < 1){
			level = parseFloat(level);
			gapi.hangout.av.setParticipantAudioLevel(data.id, [level,level]);
		}else{
			if(level < 1.9){
				level = ((level - 1) * 10) + 1;	
			}else{
				level = ((level - 1) * 10);
			}
			gapi.hangout.av.setParticipantAudioLevel(data.id, [level,level]);
		}

		/*
		 * Switch between button styles depending on the mute state
		*/
		level < 0.1 ? jQuery(".volumecontrol-mute-button",li).addClass("muted") : jQuery(".volumecontrol-mute-button",li).removeClass("muted");
	}
	
	/**
	 * @muteAllParticipants - mutes all participants in the hangout
	 * @public
	 * @param volume {int}
	*/
	VolumeControl.prototype.setVolumeForAllParticipants = function(volume){
		p = gapi.hangout.getParticipants();
		for(i = 0; i < p.length; i++) {
			gapi.hangout.av.setParticipantAudible(p[i].id, volume)
		}
	}
	
	/**
	 * @toggleMute - Fired when #button is clicked
	 * @public
	 * @see VolumeControl.buildDOM
	*/
	VolumeControl.prototype.toggleMute = function(){
		var muteButtons = jQuery("#participants li .volumecontrol-mute-button");
		var rangeSliders = jQuery("#participants li input[type=range]");
		var lis = jQuery("#participants li");

		if(this.globalMuted === false){
			/*
			 * Create overlay from image resource
			*/
			this.overlays['overlay'] = this.overlayResource.createOverlay({
				});
			this.overlays['overlay'].setPosition(0, 0);
			this.overlays['overlay'].setScale(1, gapi.hangout.av.effects.ScaleReference.WIDTH);
			this.overlays['overlay'].setVisible(true);
			this.setVolumeForAllParticipants(false);
			rangeSliders.each(function(i, s){
 				jQuery(s).parent().data("oldLevel", s.value);
			})
			
			muteButtons.addClass("muted");
			rangeSliders.val(0);
			gapi.hangout.layout.displayNotice("You've muted the whole hangout. This only applies for yourself!");
			gapi.hangout.av.setMicrophoneMute(true);
			jQuery(".volumecontrol-mute-all-button").addClass("volumecontrol-mute-all-button-muted");
			muteButtons.attr({"disabled": "disabled"});
			rangeSliders.attr({"disabled": "disabled"});
			this.globalMuted = true;
		}else{
			this.setVolumeForAllParticipants(true);
			rangeSliders.each(function(i, s){
				var js = jQuery(s);
				var p = js.parent().data("participant");
				js[0].value = js.parent().data("oldLevel") || 1;
				gapi.hangout.av.setParticipantAudioLevel(p.id, parseFloat(js[0].value));
			})
			muteButtons.removeClass("muted");
			gapi.hangout.layout.displayNotice("You've unmuted the whole hangout.");
			gapi.hangout.av.clearMicrophoneMute();
			gapi.hangout.av.clearCameraMute();
			jQuery(".volumecontrol-mute-all-button").removeClass("volumecontrol-mute-all-button-muted");
			muteButtons.removeAttr("disabled");
			rangeSliders.removeAttr("disabled");
			this.globalMuted = false;
			this.overlays['overlay'].setVisible(false);
			delete this.overlays['overlay'];
		}
	}
	
	/**
	 * @toggleMuteParticipant - Fired when the participant mute button is clicked
	 * @public
	 * @param evt {jQueryEventObject}
	*/
	VolumeControl.prototype.toggleMuteParticipant = function(evt){
		var li = jQuery(evt.target.parentNode);
		var oldValue = jQuery("input[type=range]",li)[0].value;
		if(jQuery(evt.target).hasClass("muted")){
			var level = li.data("oldLevel") || 1;
			jQuery("input[type=range]",li)[0].value = level;
			jQuery(evt.target).removeClass("muted");
		}else{
			jQuery("input[type=range]",li)[0].value = 0;
			jQuery(evt.target).addClass("muted");
		}

		jQuery("input[type=range]",li).trigger("change");
		li.data("oldLevel", oldValue);
	}
	
	VolumeControl.prototype.getVolumes = function() {
		
	};

	/**
	 * @generateControlls - Generates the slider and mute controlls for the participants
	 * @private
	*/
	VolumeControl.prototype.generateControlls = function(){
		var uid = gapi.hangout.getLocalParticipantId();
		var p = gapi.hangout.getParticipants();
		var ul = jQuery("#participants");

		/*
		 * Creates an empty div element
		*/
		var div = this.createElement("div");

		jQuery("li",ul).remove();

		/*
		 * Loop through all participants
		*/
		for(i = 0; i < p.length; i++) {
			/*
		 	 * Ignore this itteration for current user
			*/
			if(p[i].id == uid){
				continue;
			}
			if(p[i].id.match("broadcast-conference.google.com") == "broadcast-conference.google.com" || p[i].id.match("secondary-broadcast-conference.google.com") == "secondary-broadcast-conference.google.com")
			{
				i = i+1;
				continue;
			}

			var cUser = p[i];

			/*
	 		 * Setting all needed variables for participant volume level, placeHolder image and audio levels
			*/
			var volume_level = gapi.hangout.av.getParticipantVolume(cUser.id);
			//var placeholderImage = "https://mthangout.appspot.com/a/hangouttoolbox/i/bluehead.jpg";
			var levels = gapi.hangout.av.getParticipantAudioLevel(cUser.id);

			/*
	 		 * Creating li element for each participant
			*/
			var li = this.createElement("li", {"id": "participant_" + cUser.id}).data("participant",cUser);

			/*
	 		 * Creating the profile image
			*/
			//var image = this.createElement("img", {"src": placeholderImage, "title": "Unknown"}).appendTo(li);
			if(cUser.person){
				//image.attr({"src": cUser.person.image.url, "title": cUser.person.displayName});
				var image = this.createElement("img", {"src": cUser.person.image.url, "title": cUser.person.displayName}).appendTo(li);
			}
			/*
	 		 * Creating the slider element
			*/
			var slider = this.createElement("input", {"type": "range", "min": "0", "max": "2", "step": "0.1", "value": gapi.hangout.av.getParticipantAudioLevel(cUser.id)[0]}).appendTo(li);

			/*
	 		 * Creating the participant mute button
			*/
			var muteButton = this.createElement("input", {"type": "button", "class": "volumecontrol-mute-button", "value": ""});
			
			/*
	 		 * Checking if the slider is below 0.1 or 0 to set the button to muted
			*/
			if(levels[0] < 0.1 || levels[0] === 0){
				muteButton.addClass("muted");
			}

			/*
	 		 * Binding the change and click event to elements
			*/
			slider.bind("change", this.onSliderChange.bind(this));
			muteButton.click(this.toggleMuteParticipant.bind(this));

			/*
	 		 * If a participant is using the app use their profile picture and name instead of the placholders
			*/
			

			/*
	 		 * Appending the mute button to the li element and the li to the ul element
			*/
			li.append(muteButton);
			ul.append(li);
		}
	}

	/**
	 * @createElement - Creates a new element
	 * @public
	 * @param type {String} 
	 * @param attr {Object} 
	*/
	VolumeControl.prototype.createElement = function(type, attr){
		return jQuery("<" + type + ">").attr(attr || {});
	}

	/**
	 * @onApiReady - Fired by gapi when it's ready
	 * @private
	 * @param event {gapi.hangout.apiReadyEvent}
	*/
	VolumeControl.prototype.onApiReady = function(event){
		if(event.isApiReady){
			try {
				this.buildDOM();
				this.generateControlls();
				
			}
			catch(err) {
				console.log(err);
			}
		}
	}

	// Export instantiated VolumeControl to main window
	window["appController"] = new VolumeControl();
})()