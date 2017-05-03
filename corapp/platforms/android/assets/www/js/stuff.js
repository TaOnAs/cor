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
    var data_ = {};
    console.log("Made it to request : url : " + url_ + '  -- -- : type : ' + type);
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

function GetRailways(handledata) {
    var api = "http://mark2017webmapping.herokuapp.com/railways";
    // var api = "http://127.0.0.1/railways"

    request(get, api, "json", handledata);
}

function GetLuas(handledata) {
    var api = "http://mark2017webmapping.herokuapp.com/luas";
    // var api = "http://127.0.0.1/luas"

    request(get, api, json, handledata);
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

function addStationTimesToMap(data)
{
    //TODO QUERY TRAIN STATION TIMES
    // console.log(data);
}

function getLuasStopInfo(data)
{
    var api = "http://luasforecasts.rpa.ie/xml/get.ashx?action=forecast&stop="+data[0].symbol+"&encrypt=false";
    request(get, api, xml, GetStationTimes);
}

function searchLuas(stopName)
{
    var api = "http://mark2017webmapping.herokuapp.com/luas/name/?name="+stopName;
    console.log(stopName);
    request(get, api, json, luasStop);

}

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

function RemoveAllMarkers() {
    $.each(markers, function (index) {
            var cur = markers[index];
            map.removeLayer(cur);
        });
    markers = [];
}

function onClick(e)
{
    var lat = e.latlng.lat;
    var lng = e.latlng.lng;

    // var api = "http://127.0.0.1:8000/luasStop/?lat="+lng+"&lng="+lat;
    var api = "http://mark2017webmapping.herokuapp.com/luasStop/?lat="+lng+"&lng="+lat;
    currentMarker = e;
    request(get, api, "json", getLuasStopInfo);
}







