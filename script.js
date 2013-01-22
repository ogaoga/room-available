if (Meteor.isClient) {

  var gMap;
  
  var mapInitialize = function(position) {
    var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var myOptions = {
      zoom: 14,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    gMap = new google.maps.Map(document.getElementById("map_canvas"),
                               myOptions);
  };

  var plotHotels = function(d) {
    var hotels = d.Body.hotel;
    for ( var i = 0, len = hotels.length ; i < len ; i++ ) {
      var hotelBasicInfo = hotels[i].hotelInfo[0].hotelBasicInfo;
      var latLng = new google.maps.LatLng(hotelBasicInfo.latitude, 
                                          hotelBasicInfo.longitude);
      var marker = new google.maps.Marker({
        position: latLng, 
        map: gMap,
        title: hotelBasicInfo.hotelName
      });   
    }
  }

  var queryRooms = function(position) {
    var today = new Date();
    var todayString = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();
    var tomorrow = new Date();
    tomorrow.setTime(today.getTime() + 86400000);
    var tomorrowString = tomorrow.getFullYear() + '-' + (tomorrow.getMonth()+1) + '-' + tomorrow.getDate();
    var url = 'http://api.rakuten.co.jp/rws/3.0/json';
    var params = {
      developerId: '1068117367232104228',
      affiliateId: '0fd292a6.ef3ce835.0fd292a7.a4c3c04e',
      operation: 'VacantHotelSearch',
      version: '2009-10-20',
      //checkinDate: todayString,
      checkinDate: '2013-01-22',
      //checkoutDate: tomorrowString,
      checkoutDate: '2013-01-23',
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      datumType: 1,
      searchRadius: 3,
    };
    console.log(params);
    // request json 
    $.ajax({
      url : url,
      data : params,
      dataType : 'jsonp',
      jsonp : 'callBack',
      success : function(data, status){
        console.log(data);
        plotHotels(data);
      },
    });
  }

  Template.hello.greeting = function () {
    return "Welcome to room-available.";
  };

  Template.hello.events({
    'click input' : function() {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });

  //
  Meteor.startup(function() {
    // geo location
    navigator.geolocation.getCurrentPosition(
      function(position){
        mapInitialize(position);
        queryRooms(position);
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
