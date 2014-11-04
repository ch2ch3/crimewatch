(function() {

// Localize jQuery variable
var jQuery;

/******** Load jQuery if not present *********/
if (window.jQuery === undefined || window.jQuery.fn.jquery !== '2.1.1') {
    var jQueryScriptTag = document.createElement('script');
    jQueryScriptTag.setAttribute("type","text/javascript");
    jQueryScriptTag.setAttribute("src",
        "http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js");
    if (jQueryScriptTag.readyState) {
      jQueryScriptTag.onreadystatechange = function () { // For old versions of IE
          if (this.readyState == 'complete' || this.readyState == 'loaded') {
              scriptLoadHandler();
          }
      };
    } else {
      jQueryScriptTag.onload = scriptLoadHandler;
    }
    // Try to find the head, otherwise default to the documentElement
    (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(jQueryScriptTag);
} else {
    // The jQuery version on the window is the one we want to use
    jQuery = window.jQuery;
    main();
}

/******** Called once jQuery has loaded ******/
function scriptLoadHandler() {
    // Restore $ and window.jQuery to their previous values and store the
    // new jQuery in our local jQuery variable
    jQuery = window.jQuery.noConflict(true);

    // Call our main function
    main();
}

/******** Our main function ********/
function main() {

  jQuery(document).ready(function($) {
    /******* Load CSS *******/
    var css_link = document.createElement('link');
    css_link.setAttribute("rel", "stylesheet");
    css_link.setAttribute("type", "text/css");
    css_link.setAttribute("href", "http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css");
    (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(css_link);

    /******* Load Leaflet JS *******/
    if (window.L === undefined) {
      var leafletScriptTag = document.createElement('script');
      leafletScriptTag.setAttribute("type","text/javascript");
      leafletScriptTag.setAttribute("src",
          "http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js");
      if (leafletScriptTag.readyState) {
        leafletScriptTag.onreadystatechange = function () { // For old versions of IE
            if (this.readyState == 'complete' || this.readyState == 'loaded') {
                mapScriptLoadHandler();
            }
        };
      } else {
        leafletScriptTag.onload = mapScriptLoadHandler;
      }

      // Try to find the head, otherwise default to the documentElement
      (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(leafletScriptTag);
    }
      
  });

  function mapScriptLoadHandler() {
    jQuery('#submitButton').on('click', function(e){
      e.preventDefault();
      var postcode = jQuery('#postcode').val();
      var postcode_url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + postcode + '&key=AIzaSyC-Fq5EkRdM2TFI9a_G5MGbfirTmwmcWOg';
      jQuery.getJSON(postcode_url, function(coordinates){
        console.log(coordinates.results[0].geometry.location.lat);
        var lat = coordinates.results[0].geometry.location.lat;
        var lng = coordinates.results[0].geometry.location.lng;
        loadMap(lat,lng);
      });
    });
    function loadMap(lat,lng) {
      var map = L.map('map').setView([lat, lng], 16);
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      var jsonp_url = 'http://data.police.uk/api/crimes-street/all-crime?lat=' + lat + '&lng=' + lng;
      jQuery.getJSON(jsonp_url, function(data) {
        data.forEach(function(event){
          L.marker([event.location.latitude, event.location.longitude]).addTo(map)
          .bindPopup(event.category);
        });
      });
    };
  }

}

})(); // We call our anonymous function immediately