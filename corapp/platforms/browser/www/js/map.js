/**
 * Created by Mark on 27/04/2017.
 */

//Event trigger when serach button clicked
$(document).on("click", '#searchButton', function(){
    //get text in the serach field
    var field = $('#searchField').val();
    searchLuas(field);
    searchRailway(field);
});

//Event triggered when me button clicked
//pans to users location
$(document).on("click", '#me', function(){
     map.panTo(currentUserMarker._latlng);
     map.setZoom(18);
});

//Event triggered when refresh button clicked
//Removes all markers and requeries api to re add markers
$(document).on("click", '#refresh', function(){
    RemoveAllMarkers();
    GetRailways(addRailwaysToMap);
    GetLuas(addLuasToMap);
    GetStationTimes(addStationTimesToMap);
});

//stores users location marker and circle radius
var currentUserMarker = null;
var userCircle = null;

//setup map, and markers
function readyPage() {
    //get devices current position
    navigator.geolocation.getCurrentPosition(onSuccess, onError);

    function onSuccess(position) {
        map = L.map('map').setView([position.coords.latitude, position.coords.longitude], 13);
        L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 20,
        }).addTo(map);

        var radius = position.coords.accuracy / 2;
        var latlng = L.latLng(position.coords.latitude, position.coords.longitude);

        var userMarker = L.AwesomeMarkers.icon({
            icon: 'user',
            prefix: 'fa',
            markerColor: 'blue'
          });

        //create user marker and accuracy circle
        currentUserMarker = L.marker(latlng,{icon: userMarker}).addTo(map).bindPopup("You are within " + radius + " meters from this point").openPopup();
        userCircle = L.circle(latlng, radius).addTo(map);
        map.locate({setView: true, maxZoom: 20});
        map.setZoom(18);

        //load markers
        RemoveAllMarkers();
        GetRailways(addRailwaysToMap);
        GetLuas(addLuasToMap);
        GetStationTimes(addStationTimesToMap);
    }

    function onError() {
        console.log("ERROR");
    }
    location.hash = "#pageContainer";
}

//Watch for change in user location
var watchID = navigator.geolocation.watchPosition(onSuccessful, onErrors, { timeout: 10000 });

//update user location
function onSuccessful(position) {
    var latlng = L.latLng(position.coords.latitude, position.coords.longitude);
    var radius = position.coords.accuracy / 2;
    console.log(currentUserMarker);
    currentUserMarker.setLatLng(latlng);
    userCircle.setLatLng(latlng);

    currentUserMarker._map._popup.setContent("You are within " + radius + " meters from this point");
}

function onErrors() {
    console.log("ERROR");
}

//event triggers on page load
$( document ).ready(function() {
        readyPage();
});


