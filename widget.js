(function() {

  // Localize jQuery variable
  var jQuery, map;

  /******** Load jQuery if not present *********/
  if (window.jQuery === undefined || window.jQuery.fn.jquery !== '2.1.1') {
    var jQueryScriptTag = document.createElement('script');
    jQueryScriptTag.setAttribute("type", "text/javascript");
    jQueryScriptTag.setAttribute("src", "http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js");
    if (jQueryScriptTag.readyState) {
      jQueryScriptTag.onreadystatechange = function() {
        // For old versions of IE
        if (this.readyState == 'complete' || this.readyState == 'loaded') {
            jQueryScriptLoadHandler();
        }
      };
    } else {
      jQueryScriptTag.onload = jQueryScriptLoadHandler;
    }
    (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(jQueryScriptTag);
  } else {
    // The jQuery version on the window is the one we want to use
    jQuery = window.jQuery;
    main();
  }

  /******** Called once jQuery has loaded ******/
  function jQueryScriptLoadHandler() {
    // Restore $ and window.jQuery to their previous values and store the
    // new jQuery in our local jQuery variable
    jQuery = window.jQuery.noConflict(true);

    // Call our main function
    main();
  }

  /******** Our main function ********/
  function main() {

    jQuery(document).ready(function($) {

      /******* Load Leaflet CSS *******/
      var leafletStylesheetTag = document.createElement('link');
      leafletStylesheetTag.setAttribute("rel", "stylesheet");
      leafletStylesheetTag.setAttribute("type", "text/css");
      leafletStylesheetTag.setAttribute("href", "http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css");
      (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(leafletStylesheetTag);

      /******* Load Leaflet JS *******/
      if (window.L === undefined) {
        var leafletScriptTag = document.createElement('script');
        leafletScriptTag.setAttribute("type", "text/javascript");
        leafletScriptTag.setAttribute("src", "http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js");
        if (leafletScriptTag.readyState) {
          leafletScriptTag.onreadystatechange = function () {
            if (this.readyState == 'complete' || this.readyState == 'loaded') {
                leafletScriptLoadHandler();
            }
          };
        } else {
          leafletScriptTag.onload = leafletScriptLoadHandler;
        }

        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(leafletScriptTag);
      }
        
    });

    function leafletScriptLoadHandler() {
      createForm();
      submitAddress();
    }
  }

  function createForm(){
    jQuery('body').prepend('<form id="addressForm"><input type="text" placeholder="Enter your UK address" id="address"><button>Submit</button></form>')
  }

  function submitAddress(){
    jQuery('#addressForm').on('submit', function(event){
      event.preventDefault();
      var address = jQuery('#address').val();
      getCoordinates(address);
    });
  }

  function getCoordinates(address) {
    var lat, lng, address_url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=AIzaSyC-Fq5EkRdM2TFI9a_G5MGbfirTmwmcWOg';
    jQuery.getJSON(address_url, function(coordinates){
      lat = coordinates.results[0].geometry.location.lat;
      lng = coordinates.results[0].geometry.location.lng;
    }).done(function(){
      loadMap(lat, lng);
      getCrimes(lat, lng);
    });
  }

  function loadMap(lat, lng) {
    if(map === undefined) {
      map = L.map('map').setView([lat, lng], 16);
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
    } else {
      map.setView([lat, lng], 16);
    }
  }

  function getCrimes(lat, lng){
    var crimes_url = 'http://data.police.uk/api/crimes-street/all-crime?lat=' + lat + '&lng=' + lng;
    jQuery.getJSON(crimes_url, function(crimes) {
      crimes.forEach(function(crime){
        L.marker([crime.location.latitude, crime.location.longitude]).addTo(map)
        .bindPopup(crime.category);
      });
    });
  }

})(); // We call our anonymous function immediately