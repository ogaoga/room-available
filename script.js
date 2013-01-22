if (Meteor.isClient) {
  
  var mapInitialize = function(position) {
    var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var myOptions = {
      zoom: 14,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map_canvas"),
                                  myOptions);
  };

  Template.hello.greeting = function () {
    return "Welcome to room-available.";
  };

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });

  //
  Meteor.startup(function () {
    // geo location
    navigator.geolocation.getCurrentPosition(
      function(position){
        mapInitialize(position);
      },
      function(error){
        alert(error.message);
      }
    );

  });  
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
