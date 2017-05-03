/**
 * Created by Mark on 27/04/2017.
 */

$(document).on("click", '#datesearch-but', function(){
    // GetBySingleDateAndAddToMap($('#searchdate').val());
    RemoveAllMarkers();
    GetRailwaysToMap();
    GetLuasToMap();
    GetStationTimesToMap();
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

$(document).on("click", '#today', function() {
    console.log("Found my way here");
    GetUpToDate();
    currentData = true;
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

            L.marker(latlng,{icon: userMarker}).addTo(map)
                .bindPopup("You are within " + radius + " meters from this point").openPopup();

             L.circle(latlng, radius).addTo(map);

            map.locate({setView: true, maxZoom: 20});
            map.setZoom(20);

            RemoveAllMarkers();
            GetRailwaysToMap();
            GetLuasToMap();
            GetStationTimesToMap();
        }

        function onError() {
            console.log("Sad times");
        }

        location.hash = "#mapp";

}
$( document ).ready(function() {
        readyPage();

});


function onLocationFound(e) {

    console.log("FOUND");
    var radius = e.accuracy / 2;

    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

    L.circle(e.latlng, radius).addTo(map);
}

$(document).on('locationfound', onLocationFound);

function onLocationError(e) {
    alert(e.message);
}

$(document).on('locationerror', onLocationError);

$(document).on('pagebeforeshow', '#mainpage', function(){
    $('#searchdate').mobipick({
        dateFormat: "MM-dd-yyyy"
    });
});