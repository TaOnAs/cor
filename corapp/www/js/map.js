/**
 * Created by Mark on 27/04/2017.
 */

$(document).on("click", '#searchButton', function(){
    var field = $('#searchField').val();
    searchLuas(field);
    searchRailway(field);
});

$(document).on("click", '#me', function(){
     map.panTo(currentUserMarker._latlng);
     map.setZoom(18);
});

$(document).on("click", '#refresh', function(){
    console.log("REFRESH");
    RemoveAllMarkers();
    GetRailways(addRailwaysToMap);
    GetLuas(addLuasToMap);
    GetStationTimes(addStationTimesToMap);
});

var currentUserMarker = null;
var userCircle = null;

function readyPage() {

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

        currentUserMarker = L.marker(latlng,{icon: userMarker}).addTo(map).bindPopup("You are within " + radius + " meters from this point").openPopup();

        userCircle = L.circle(latlng, radius).addTo(map);

        map.locate({setView: true, maxZoom: 20});
        map.setZoom(18);

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

var watchID = navigator.geolocation.watchPosition(onSuccessful, onErrors, { timeout: 10000 });

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

$( document ).ready(function() {
        readyPage();

});


