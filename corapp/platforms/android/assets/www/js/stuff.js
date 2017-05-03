/**
 * Created by Mark on 27/04/2017.
 */
//
//  Helper Functions
//
//
//
// REQUEST TYPES //
var get = 'GET';
var post = 'POST';
var update = 'UPDATE';
var del = 'DELETE';
var currentData = false;

// EXTERNAL API LINKS
var currentEarthquakes = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson';
var oldcurrents = [];
var map;
var markers = [];
var format='/?format=json';
var where = 'local';

var currentMarker = null;
// http://127.0.0.1:8000/luasStop/?lat=-6.37458888888889&lng=53.287494444444398


function request(type, url_, handledata) {
    var data_ = {};
    console.log("Made it to request : url : " + url_ + '  -- -- : type : ' + type);
    return $.ajax({
      url:url_,
      type:type,
      headers: {
      },
      dataType:"json"
    }).done(function(data) {
         handledata(data);
    });
}

function requestXML(type, url_, handledata) {
    var data_ = {};
    console.log("Made it to request : url : " + url_ + '  -- -- : type : ' + type);
    return $.ajax({
      url:url_,
      type:type,
      headers: {
      },
      dataType:"xml"
    }).done(function(data) {
         handledata(data);
    });
}

function GetRailways(handledata) {
    var api = "http://mark2017webmapping.herokuapp.com/railways";
    // var api = "http://127.0.0.1/railways"

    request(get, api, handledata);
}

function GetLuas(handledata) {
    var api = "http://mark2017webmapping.herokuapp.com/luas";
    // var api = "http://127.0.0.1/luas"

    request(get, api, handledata);
}

function GetStationTimes(data){

    var y = data.getElementsByTagName("stopInfo");
    var stopName = y[0].attributes[1].nodeValue;
    var status = y[0].childNodes[0].innerHTML;

    var inbound = y[0].childNodes[1].attributes[0].nodeValue;
    var inboundDue = y[0].childNodes[1].firstChild.attributes[0].nodeValue;
    var inboundDest = y[0].childNodes[1].firstChild.attributes[1].nodeValue;

    var outbound = y[0].childNodes[2].attributes[0].nodeValue;
    var outboundDue = y[0].childNodes[2].firstChild.attributes[0].nodeValue;
    var outboundDest = y[0].childNodes[2].firstChild.attributes[1].nodeValue;

    var popup = stopName + "<br/> Status " + status + "<br/>" + inbound + " to " + inboundDest + " => " + inboundDue + "<br/>" + outbound + " to " + outboundDest + "  => " + outboundDue;
    currentMarker.target._popup.setContent(popup);
}


function addRailwaysToMap(data) {
        markers = [];
        $.each(data, function (index) {

            var point = data[index].point.match(/\(([^)]+)\)/)[1];
            var lat_lng = point.split(" ");
            var lat = lat_lng[1];
            var lng = lat_lng[0];

            var latlng = L.latLng(lat, lng);

            var orangeMarker = L.AwesomeMarkers.icon({
                icon: 'train',
                prefix: 'fa',
                markerColor: 'orange'
              });

            var mark = L.marker(latlng,{icon: orangeMarker}).addTo(map).bindPopup(data[index].namn1);
            markers.push(mark);
        });
}


function addLuasToMap(data) {
        markers = [];
        console.log(data);
        $.each(data, function (index) {
            console.log(data[index].line);
            var point = data[index].point.match(/\(([^)]+)\)/)[1];
            var lat_lng = point.split(" ");
            var lat = lat_lng[1];
            var lng = lat_lng[0];
            var latlng = L.latLng(lat, lng);

            var greenMarker = L.AwesomeMarkers.icon({
                icon: 'subway',
                prefix: 'fa',
                markerColor: 'green'
              });

            var redMarker = L.AwesomeMarkers.icon({
                icon: 'subway',
                prefix: 'fa',
                markerColor: 'red'
              });

            if(data[index].line == "Red")
            {
                var mark = L.marker(latlng, {icon: redMarker}).addTo(map).bindPopup(data[index].name).on('click', onClick);
                markers.push(mark);
            }
            else
            {
                var mark = L.marker(latlng, {icon: greenMarker}).addTo(map).bindPopup(data[index].name).on('click', onClick);
                markers.push(mark);
            }


        });
}

function addStationTimesToMap(data)
{
    console.log(data);
}

function getLuasStopInfo(data)
{
    console.log(data);

    var api = "http://luasforecasts.rpa.ie/xml/get.ashx?action=forecast&stop="+data[0].symbol+"&encrypt=false";

    requestXML(get, api, GetStationTimes);
}

function RemoveAllMarkers() {
    $.each(markers, function (index) {
            var cur = markers[index];
            map.removeLayer(cur);
        });
    markers = [];
}

// REQUESTS

function onClick(e)
{
    var lat = e.latlng.lat;
    var lng = e.latlng.lng;

    // var api = "http://127.0.0.1:8000/luasStop/?lat=-6.37458888888889&lng=53.287494444444398"
    var api = "http://mark2017webmapping.herokuapp.com/luasStop/?lat="+lng+"&lng="+lat;
    console.log(e);

    currentMarker = e;
    request(get, api, getLuasStopInfo);

}


function GetRailwaysToMap() {
    GetRailways(addRailwaysToMap);
}

function GetLuasToMap() {
    GetLuas(addLuasToMap);
}

function GetStationTimesToMap() {
    GetStationTimes(addStationTimesToMap);
}







