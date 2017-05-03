/**
 * Created by Mark on 27/04/2017.
 */

$(document).on("click", '#searchButton', function(){
    // GetBySingleDateAndAddToMap($('#search').val());
    // RemoveAllMarkers();
    // GetRailways(addRailwaysToMap);
    // GetLuas(addLuasToMap);
    // GetStationTimes(addStationTimesToMap);
    console.log("AYO");
    var field = $('#searchField').val();
    console.log("FIELD " + field);
    searchLuas(field);
});

$('#dateform').submit(function() {
    // Get all the forms elements and their values in one step
    var values = $(this).serialize();
    console.log(values);
    location.reload();
});

$(document).on("click", "#submit-log", function() {
    $.post(BuildUserApiVar(), $('#loginform').serialize())
        .done(function(data) {
            console.log(data);
            if(data['token'] != null) {
                var token = data['token'];

                console.log(token);
                window.localStorage.setItem('token', token);
                location.hash = "#mapp";
                readyPage();
            } else {
                alert("Incorrect credentials");
            }

        });
});


$(document).on("click", '#logout', function() {
    //console.log("Happening");
    //window.localStorage.clear();
    //currentData = false;
    //markers = [];
    //location.hash="#loginorcreate";
    console.log("Click occurred");
    GetNearMe();
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

    location.hash = "#mapp";

}

var watchID = navigator.geolocation.watchPosition(onSuccessful, onErrors, { timeout: 10000 });

function onSuccessful(position) {
    var latlng = L.latLng(position.coords.latitude, position.coords.longitude);
    var radius = position.coords.accuracy / 2;

    currentUserMarker.setLatLng(latlng);
    userCircle.setLatLng(latlng);

    console.log("{P{" + currentUserMarker._map._popup);
    currentUserMarker._map._popup.setContent("You are within " + radius + " meters from this point");
}

function onErrors() {
    console.log("ERROR");
}

$( document ).ready(function() {
        readyPage();

});


