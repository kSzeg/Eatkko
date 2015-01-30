
// var mapOptions = {
//     center: new google.maps.LatLng(37.7831,-122.4039),
//     zoom: 12,
//     mapTypeId: google.maps.MapTypeId.ROADMAP
// };

// var map = new google.maps.Map(document.getElementById('map'), mapOptions);
// var acOptions = {
//   types: ['establishment']
// };
// var autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'),acOptions);
// autocomplete.bindTo('bounds',map);
// var infoWindow = new google.maps.InfoWindow();
// var marker = new google.maps.Marker({
//   map: map
// });

// google.maps.event.addListener(autocomplete, 'place_changed', function() {
//   infoWindow.close();
//   var place = autocomplete.getPlace();
//   if (place.geometry.viewport) {
//     map.fitBounds(place.geometry.viewport);
//   } else {
//     map.setCenter(place.geometry.location);
//     map.setZoom(17);
//   }
//   marker.setPosition(place.geometry.location);
//   infoWindow.setContent('<div><strong>' + place.name + '</strong><br>');
//   infoWindow.open(map, marker);
//   google.maps.event.addListener(marker,'click',function(e){

//     infoWindow.open(map, marker);

//   });
// });

var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;

function initialize() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  var chicago = new google.maps.LatLng(49.259769, -123.184510);
  var mapOptions = {
    zoom:10,
    center: chicago
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  directionsDisplay.setMap(map);
}

function calcRoute() {
  //var lat_lngs = response.routes[0].legs[0].steps.lat_lngs[0]

  var start = document.getElementById('start').value;
  var end = document.getElementById('end').value;
  var request = {
      origin:start,
      destination:end,
      travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(response, status) {
    
    var route = response.routes[0].legs[0];
    var distance = route.distance.value; // distance in meters
    var waypoints = [];
    
    if (distance < 10000) {//sets the YELP API distance for radius of restaurants
      var radius = 0.3;
    }else{
      var radius = 1;
    }

    for (var i=0; i < route.steps.length; i++){//populates array of coordinates in total trip
      var step = route.steps[i];
      for (var j=0; j < step.lat_lngs.length; j++){
        waypoints.push(step.lat_lngs[j]);
      }
    }

    //based on distance, make an array of waypoints whose radius depends on distance
    //longer has less waypoints, shorter has more 
    var num_waypoints = waypoints.length;
    var latlngs_to_check = [];
    var threshold = parseInt(distance/num_waypoints);
    var capacity = parseInt(num_waypoints/threshold) - 1;

    latlngs_to_check.push(waypoints[0]);
    for(var i=1;i < capacity; i++) {
      latlngs_to_check.push(waypoints[i*threshold]);
    }
    latlngs_to_check.push(waypoints[-1]);

    console.log(waypoints);
    console.log(distance)
    console.log({'radius':radius, 'waypoints': latlngs_to_check});

    //if less than 10km then
    // }
    //response.routes[0].legs[0].steps      step.lat_lngs[0]
    //get the first route's first leg steps
    //then loop through the legs steps
    //for each step, get the middle lat_lngs
    //return lat_lngs stop_lat stop_lng
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });
//debugger;
}

google.maps.event.addDomListener(window, 'load', initialize);