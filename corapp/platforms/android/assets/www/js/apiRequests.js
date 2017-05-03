/**
 * Created by Mark on 27/04/2017.
 */

var get = 'GET';
var json = "json";
var xml = "xml";
var map;
var markers = [];
var currentMarker = null;


function request(type, url_, format, handledata) {
    return $.ajax({
      url:url_,
      type:type,
      headers: {
      },
      dataType:format
    }).done(function(data) {
         handledata(data);
    });
}

//get full list of railways stored in the database
function GetRailways(handledata) {
    var api = "http://mark2017webmapping.herokuapp.com/railways";
    // var api = "http://127.0.0.1/railways"
    request(get, api, "json", handledata);
}

//Create markers on map and set popup to stop name based on data retrieved from get request
function addRailwaysToMap(data) {
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

        var mark = L.marker(latlng, {icon: orangeMarker}).addTo(map).bindPopup("<B>" + data[index].namn1 + "</B>");
        markers.push(mark);
    });
}

//get full list of luas stops stored in the database
function GetLuas(handledata) {
    var api = "http://mark2017webmapping.herokuapp.com/luas";
    // var api = "http://127.0.0.1/luas"

    request(get, api, json, handledata);
}

//Create markers on map and set popup to stop name based on data retrieved from get request
//Check if luas line is green or red and reflect that in the marker icon
function addLuasToMap(data) {
        $.each(data, function (index) {

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


//Make request to luas forecasting API
function getLuasStopInfo(data)
{
    var api = "http://luasforecasts.rpa.ie/xml/get.ashx?action=forecast&stop="+data[0].symbol+"&encrypt=false";
    request(get, api, xml, GetStationTimes);
}

//Extract data from xml object returned from luas forecasting api and set popup with forecasting information
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

    var popup = "<B>" + stopName + "</B><br/> Status " + status + "<br/>" + inbound + " to " + inboundDest + " => " + inboundDue + "<br/>" + outbound + " to " + outboundDest + "  => " + outboundDue;
    currentMarker.target._popup.setContent(popup);
}



function addStationTimesToMap(data)
{
    //TODO QUERY TRAIN STATION TIMES
    // console.log(data);
}

//Retrieve a luas stop from the database by name
function searchLuas(stopName)
{
    var api = "http://mark2017webmapping.herokuapp.com/luas/name/?name="+stopName;
    request(get, api, json, luasStop);
}

//Retrieve a Railway station from the database by name
function searchRailway(stopName)
{
    var api = "http://mark2017webmapping.herokuapp.com/railways/name/?name="+stopName;
    request(get, api, json, railwayStop);
}

//Move to the marker on the map for the specified railway station name that has been searched if it exists
function railwayStop(data)
{
    var point = data[0].point.match(/\(([^)]+)\)/)[1];
    var lat_lng = point.split(" ");
    var lat = lat_lng[1];
    var lng = lat_lng[0];
    var latlng = L.latLng(lat, lng);

    map.panTo(latlng);
    map.setZoom(18);
}

//Move to the marker on the map for the specified luas stop name that has been searched if it exists
function luasStop(data)
{
    var point = data[0].point.match(/\(([^)]+)\)/)[1];
    var lat_lng = point.split(" ");
    var lat = lat_lng[1];
    var lng = lat_lng[0];
    var latlng = L.latLng(lat, lng);

    map.panTo(latlng);
    map.setZoom(18);
}

//Remove all markers from the map except the user icon
function RemoveAllMarkers() {
    $.each(markers, function (index) {
            var cur = markers[index];
            map.removeLayer(cur);
        });
    markers = [];
}

//Get the luas stop object from the database that matchs the latitude and longitude of the marker that is clicked
//Used to get the symbol for the stop used in the luas forecasting api call
function onClick(e)
{
    var lat = e.latlng.lat;
    var lng = e.latlng.lng;

    // var api = "http://127.0.0.1:8000/luasStop/?lat="+lng+"&lng="+lat;
    var api = "http://mark2017webmapping.herokuapp.com/luasStop/?lat="+lng+"&lng="+lat;
    currentMarker = e;
    request(get, api, "json", getLuasStopInfo);
}







