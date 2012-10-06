var AnonymousBar = function() {
  this.inactive = false;
  this.overlay = null;
}

AnonymousBar.prototype.createBar = function() {
  var canvas = document.getElementById('anonymous_canvas');
  var context = canvas.getContext('2d');
  
  context.fillStyle = "#000000";
  var bar = context.fillRect(0, 0, 290, 70);
  return canvas.toDataURL();
}

AnonymousBar.prototype.startTracking = function() {
  var image = gapi.hangout.av.effects.createImageResource(this.createBar());
  this.overlay = image.createFaceTrackingOverlay({
      'trackingFeature': gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT
    , 'scaleWithFace': true
    , 'rotateWithFace': true
    , 'scale': 2.1
    , 'offset': { 'x': 0, 'y': 0 }
  });
}

AnonymousBar.prototype.toggle = function() {
  this.inactive = !(this.inactive);
  this.overlay.setVisible(this.inactive);
  var btn = $('#toggle_anonymous');
  if(this.inactive == true) {
    btn.html('Turn off');
  } else {
    btn.html('Turn on');
  }
}

AnonymousBar.prototype.init = function() {
  var container = $('#app-anonymous');
  var that = this;
  var button = $('<button id="toggle_anonymous">Turn on</button>').click(function() {
    that.toggle();
  });
  container.append(button);
  container.append('<canvas id="anonymous_canvas" width="300" height="70" style="display: none;"></canvas>');
  this.startTracking();
}
