//  Created by Nauman Qazi (itsnomihere@gmail.com)
//  Copyright (c) 2016 Nauman Qazi. All rights reserved.
var layerCounter = 0;
var map;
var featureLabelNames = [];
var zoomLvl = 10;
var totalDistance = 0;
var lat = '-37.81361100000001';
var lng = '144.96305600000005';
var routeGeometry = [];
var arcGeometry = [];
var penColor = '#376B67';
var markerColor = '#609B96';
var penWidth = 2;
var selectedSize = "L";
var _DEBUG_ = (location.hostname === "localhost" || location.hostname === "127.0.0.1");
var oldBounds;
var cities = [];
var filtered_cities = () => { return cities.filter( c => !c.archived );}
var scaleFactor = 1;
var style_name= 'cjdsigxek0yxx2ss2d29xfatn';
var isFlightPath = false;
mapboxgl.accessToken = 'pk.eyJ1IjoidGhpanNzb25kYWciLCJhIjoiY2phOHI2MXNuMDh3dzMzanVhZXlzanU4byJ9.L3vNl1ehNadAt1JWPJqgiA';

function deleteLocation(city_name) {
    for (var i = filtered_cities().length - 1; i >= 0; --i) {
        if (filtered_cities()[i].city_name == city_name) {
            filtered_cities()[i].archived = true;
            break;
        }
    }
    for (var i = featureLabelNames.length - 1; i >= 0; --i) {
        if (featureLabelNames[i].properties.title == city_name) {
            featureLabelNames.splice(i, 1);
            break;
        }
    }
    completeRedraw(map);
}

function changeOrder(direction, city_name) {
    for (var i = cities.length - 1; i >= 0; --i) {
        if (cities[i].city_name == city_name) {
            var tmp = cities[i];
            if (direction === 'up' && cities[i - 1]) {
                cities[i] = cities[i - 1];
                cities[i - 1] = tmp;
            } else if (direction === 'down' && cities[i + 1]) {
                cities[i] = cities[i + 1];
                cities[i + 1] = tmp;
            }
            break;
        }
    }
    console.log(cities);
    completeRedraw(map);
}

function getCity(layer_id) { 
    var city_name = layer_id.replace("points_", "");

		for (var j = cities.length - 1; j >= 0; --j) {
                    if (cities[j].city_name == city_name) {
                        return cities[j];
                    }
                }
                return 0;

}

function changePosition(city_name ) {
    var layer_id = "points_" + city_name;
    if (map.getLayer(layer_id)) {
        var pos = [
            { position:'right', offset: [-1.3, 0]},
            { position:'bottom', offset: [0, 1.3]},
            { position:'left', offset: [1.3, 0]},
            { position:'top', offset: [0, -1.3]}
        ];
        for (var i = 0; i < pos.length; i++) {
            if (pos[i].position == map.getLayoutProperty(layer_id, 'text-anchor')) {
                var nextP =  pos[(i + 1) % 4];
                map.setLayoutProperty(layer_id, 'text-anchor',nextP.position);
                map.setLayoutProperty(layer_id, 'text-offset', nextP.offset);
                for (var j = cities.length - 1; j >= 0; --j) {
                    if (cities[j].city_name == city_name) {
                        cities[j].city_anchor = nextP.position;
                        cities[j].city_offset = nextP.offset;
                        break;
                    }
                }
                break;
            }
        }
    }
}


function changeName(city_name) {
    var layer_id = "points_" + city_name;
    var allFeature = map.querySourceFeatures('source_point' + city_name);
    
    if (allFeature.length > 0 && map.getLayer(layer_id)) {
        for (var j = cities.length - 1; j >= 0; --j) {
            if (cities[j].city_name == city_name) {
                var new_city_name = prompt("Please enter the location name", cities[j].city_name);
                if (new_city_name !== null && new_city_name !== "") {
                    cities[j].city_alias = new_city_name;
                    allFeature[0].properties.title = cities[j].city_alias;
                }
                break;
            }
        }
    }
    completeRedraw(map);

}

function changeFontSize(operation, city_name ) {
    var isPlus = operation === '+';
    var layer_id = "points_" + city_name;
    if (map.getLayer(layer_id)) {
        var text_size = map.getLayoutProperty(layer_id, 'text-size');
        text_size = isPlus? text_size + 1 : text_size - 1;
        map.setLayoutProperty(layer_id, 'text-size',text_size);
        for (var j = cities.length - 1; j >= 0; --j) {
            if (cities[j].city_name == city_name) {
                cities[j].city_textsize = text_size;
                break;
            }
        }
    }
    
    city_name = city_name.replace(new RegExp(' ', 'g'),  '_');
    $('#tsize_'+ city_name).text(text_size + 'pt');
}

function completeRedraw(currentMap) {
    routeGeometry = [];
    arcGeometry = [];
    var printMap = currentMap !== map;

    if(!printMap){
        document.getElementById('locationName').innerHTML = '';
    }
        var layers = currentMap.getStyle().layers;
        for (let layer of layers) {
            if (layer.id.match(/markers.*/) || (layer.id.match(/points.*/)) || layer.id.match(/route.*/) || layer.id.match(/arc.*/)) {
                currentMap.removeLayer(layer.id);
            }
        }
    var i = 0;
    filtered_cities().forEach(currentCity => {
        var city_name = currentCity.city_alias.length > 0 ? currentCity.city_alias : currentCity.city_name;
        placeNameFeature(currentMap, currentCity, printMap);
        if(!printMap){
            document.getElementById('locationName').innerHTML += `<li>
                <div class="updown">
                <img class="up" onclick="changeOrder('up','` + currentCity.city_name + `')" src="images/up.png">
                <img class="down" onclick="changeOrder('down','` + currentCity.city_name + `')" src="images/down.png">
                <img src="images/destination-map.png">
                <span>` 
                 +
                 city_name
                + 
        	`</span>
                    <div class="pull-right">
                    `
                    + (i === 0 ? '' : currentCity.city_flight_path === true ? `<img class=\'travel_flight_path\' />` : `<img class=\'travel_car_path\' />`)
                    +'<span id=\'tsize_' + currentCity.city_name.replace(new RegExp(' ', 'g'),  '_') + '\'>16 pt</span>'
                    +
                    `   <span onclick="changeFontSize('+','` + currentCity.city_name + `')"> + </span>
                        <span onclick="changeFontSize('-','` + currentCity.city_name + `')"> - </span>
                        <img onclick="changePosition('` + currentCity.city_name + `')" src="images/rotator.png">
                        <img onclick="changeName('` + currentCity.city_name + `')" src="images/edit.png">
                        <img onclick="deleteLocation('` + currentCity.city_name + `')" src="images/cancel.png">
                    </div>
                </div>
                </li>`;
                i++
        }
    });
    for (let index = 0; index < filtered_cities().length; index++) {
        if (filtered_cities().length <= 1 || index + 1 === filtered_cities().length) {
            break;
        }
        const src = filtered_cities()[index];
        const dest = filtered_cities()[index + 1];
        getDirection(currentMap, src, dest, printMap);
    }
    if (filtered_cities().length > 1) {
    	if (document.getElementById('looped_map').checked && filtered_cities().length > 2){
		const src = filtered_cities()[0];
        	const dest = filtered_cities()[filtered_cities().length - 1];
        	getDirection(currentMap, src, dest, printMap);
        }
        
        var bounds = new mapboxgl.LngLatBounds();

        featureLabelNames.forEach(function (feature) {
            bounds.extend(feature.geometry.coordinates);
        });

        currentMap.fitBounds(bounds, {
            padding: 100
        });
    }
}

function getDirection(currentMap, src, dest, printMap) {
    if(dest.city_flight_path){
        drawRoute(currentMap,src, dest);
        return;
    }
    var coordinateStr = parseFloat(src.city_long).toFixed(4) + ',' +
        parseFloat(src.city_lat).toFixed(4) + ';' +
        parseFloat(dest.city_long).toFixed(4) + ',' +
        parseFloat(dest.city_lat).toFixed(4);

    var direction_url = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + coordinateStr +
        '?geometries=geojson&access_token=' + mapboxgl.accessToken;
    $.ajax({
        url: direction_url,
        error: function (err) {
            console.log("An error occurred");
            drawRoute(currentMap,src, dest);
            dest.city_flight_path = true;
            return;
        },
        success: function (res) {
            console.log("It was a success");

            if (res.code === 'NoRoute') {
                drawRoute(currentMap,src, dest);
                dest.city_flight_path = true;
                return;
            }
            totalDistance += res.routes[0].distance;
            document.getElementById('distancelbl').innerHTML = (totalDistance / 1000).toFixed(2) + 'KM';
            routeGeometry.push(res.routes[0].geometry);
            addLayers(currentMap);

        }
    });

}

function drawRoute(currentMap,src, dest) {
    console.log("Preparing to fly: " + src.city_long);


    var direction_feature = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [src.city_long, src.city_lat],
                    [dest.city_long, dest.city_lat]
                ]
            }
        }]
    };
    // Calculate the distance in kilometers between route start/end point.
    var lineDistance = turf.lineDistance(direction_feature.features[0], 'kilometers');

    var arc = [];

    // Number of steps to use in the arc and animation, more steps means
    // a smoother arc and animation, but too many steps will result in a
    // low frame rate
    var steps = 500;

    // Draw an arc between the `origin` & `destination` of the two points
    for (var i = 0; i < lineDistance; i += lineDistance / steps) {
        var segment = turf.along(direction_feature.features[0], i, 'kilometers');
        arc.push(segment.geometry.coordinates);
    }


    arcGeometry.push({
        "type": "LineString",
        "coordinates": arc
    });


    addLayers(currentMap);

}

function placeNameFeature(currentMap, city, printMap) {
    var city_name = city.city_alias.length > 0 ? city.city_alias : city.city_name;
    var feature = {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [city.city_long, city.city_lat]
        },
        "properties": {
            "title": city_name, 
            "marker-symbol": "circle"
        }
    };
    if(!city.city_source[style_name] || !currentMap.getSource('source_point' + city.city_name)){
        var _city_source = {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": [feature]
        }
    };
        city.city_source[style_name] = true;
        currentMap.addSource('source_point' + city.city_name, _city_source);
    }
    
    currentMap.addLayer({
        "id": "points_" + city.city_name + (printMap? "_p" : ""),
        "type": "symbol",
        "source": "source_point" + city.city_name,
        "layout": {
            "text-field": city_name,
            "text-font": ["HK Grotesk Regular"],
            "text-anchor": city.city_anchor,
            "text-offset": city.city_offset,
            "text-size": city.city_textsize * scaleFactor,
            'text-allow-overlap': true
        },
        "paint": {
            "text-color": penColor
        }
    });

    currentMap.addLayer({
        "id": "markers_" + city.city_name + (printMap? "_p" : ""),
        "type": "circle",
        "source": "source_point" + city.city_name,
        "paint": {
            "circle-radius": scaleFactor * penWidth * 1.5,
            "circle-color": markerColor
        }
    });
    if(!printMap){
        featureLabelNames.push(feature);
    }
}
function createPrintMap(width, height, zoom, center,
    bearing, style, pitch, download) {
    'use strict';
    /*if (!filtered_cities().length) {
        return;
    }*/
    $.LoadingOverlay("show",{
    image: "",
    textResizeFactor: 0.3,
    fontawesome : "fa fa-cog fa-spin",
    text        : "We're creating your poster. This can take a minute ⌚️."
});
    var cwidth = width;
    var cheight = height;
    if (_DEBUG_ || download) {
        var cwidth = width;
        var cheight = height;        
    }else{
        //width = $('#map-container').width();
        //height = $('#map-container').height();        
    }
        
    
    
    // Create map container
    var hidden = document.createElement('div');
    hidden.className = 'hidden-map';
    document.body.appendChild(hidden);
    var container = document.createElement('div');
    
    container.style.width = width;
    container.style.height =height;

    hidden.appendChild(container);
    console.log("Width: " + container.style.width + "; Height: " + container.style.height);


    // Render map
    var renderMap = new mapboxgl.Map({
        container: container,
        center: center,
        zoom: zoom,
        style: style,
        bearing: bearing,
        pitch: pitch,
        interactive: false,
        attributionControl: false,
        preserveDrawingBuffer: true
    });

    renderMap.once('load', function () {
        scaleFactor = 5.5;
        var layers = map.getStyle().layers;
        for (let layer of layers) {
            if (layer.id.match(/markers.*/) || (layer.id.match(/points.*/)) || layer.id.match(/route.*/) || layer.id.match(/arc.*/)) {
                var prop;
                    if(layer.id.match(/markers.*/)){
                        renderMap.setPaintProperty(layer.id, "circle-radius", scaleFactor * penWidth * 2);
                        prop = renderMap.getPaintProperty(layer.id, "circle-radius");
                        console.log(layer.id, ' =>circle-radius ', prop );

                    } else if(layer.id.match(/points.*/)){
                        var prev_size = map.getLayoutProperty(layer.id, "text-size");
                        renderMap.setLayoutProperty(layer.id, 'text-size', prev_size * scaleFactor);
                        prop = renderMap.getLayoutProperty(layer.id, "text-size");
                        console.log(layer.id, ' =>text-size ', prop );

                    } else if(layer.id.match(/route.*/)){
                        renderMap.setPaintProperty(layer.id,  "line-width", 2 + (penWidth * scaleFactor));
                        prop = renderMap.getPaintProperty(layer.id, "line-width");
                        console.log(layer.id, ' =>route ', prop );


                    } else if(layer.id.match(/arc.*/)){
                        renderMap.setPaintProperty(layer.id,  "line-width", 2 + (penWidth * scaleFactor));
                        prop = renderMap.getPaintProperty(layer.id, "line-width");
                        console.log(layer.id, ' =>line-width ', prop );

                    }
            }
        }
            
        renderMap.fitBounds(map.getBounds(), {
            padding: 100
        });
        setTimeout(function () {

            renderMap.getCanvas().toBlob(function(blob) {
            	scaleFactor = 1;
                if (_DEBUG_ || download) {
                    //var dataURL = renderMap.getCanvas().toDataURL();
                    setTimeout(downloadImage(blob), 1000);
                    console.log("Reseting the Layers ....... ");
                    for (let layer of layers) {
                        if (layer.id.match(/markers.*/) || (layer.id.match(/points.*/)) || layer.id.match(/route.*/) || layer.id.match(/arc.*/)) {
                            var prop;
                                if(layer.id.match(/markers.*/)){
                                    map.setPaintProperty(layer.id, "circle-radius", scaleFactor * penWidth * 1.5);
                                    prop = map.getPaintProperty(layer.id, "circle-radius");
                                    console.log(layer.id, ' =>circle-radius ', prop );
            
                                } else if(layer.id.match(/points.*/)){
                                    var prev_size = map.getLayoutProperty(layer.id, "text-size");
                                    map.setLayoutProperty(layer.id, 'text-size', getCity(layer.id).text_size);
                                    prop = map.getLayoutProperty(layer.id, "text-size");
                                    console.log(layer.id, ' =>text-size ', prop );
            
                                } else if(layer.id.match(/route.*/)){
                                    map.setPaintProperty(layer.id,  "line-width", curPenWidth);
                                    prop = map.getPaintProperty(layer.id, "line-width");
                                    console.log(layer.id, ' =>route ', prop );
            
            
                                } else if(layer.id.match(/arc.*/)){
                                    map.setPaintProperty(layer.id,  "line-width", curPenWidth);
                                    prop = map.getPaintProperty(layer.id, "line-width");
                                    console.log(layer.id, ' =>line-width ', prop );
            
                                }
                        }
                    }
                    renderMap.remove();
                            
                    return;
                }
                //container.style.visibility='hidden';
                var tableImage;
                var productId = (selectedSize == "PDF")  ? 715 : (selectedSize == "S") ? 90 : (selectedSize == "M") ? 91 : (selectedSize == "L") ? 92 : (selectedSize == "XL") ? 93 : 92;
                // renderGradients(document.getElementById('state-legend'));

                html2canvas(document.getElementById('state-legend'), {
                    backgroundColor: null
                }).then(function (canvas) {
                    tableImage = canvas.toDataURL("image/png");
                    var form_data = new FormData();
                    form_data.append('map_hq', blob); // Map image
                    form_data.append('overlay', tableImage); // Overlay image
                    form_data.append('thumb', map.getCanvas().toDataURL()); // Thumbnail image
                    var s = $('ul.styler li.active').attr('class');
                        s = s.replace('active','');
                    form_data.append('width', cwidth);
                    form_data.append('height', cheight);
                    form_data.append('zoom', zoom);
                    form_data.append('center', center);
                    form_data.append('bearing', bearing);
                    form_data.append('style', s);
                    form_data.append('pitch', pitch);
                    form_data.append('tcrTripName', $('#tcrTripName').text());
                    form_data.append('tcrTripDetails', $('#tcrTripDetails').text());
                    
                    var res = Array.from(form_data.entries(), ([key, prop]) => (
                        {
                            [key]: {
                                "ContentLength":
                                    typeof prop === "string"
                                        ? prop.length
                                        : prop.size
                            }
                        })
                ) ;

                    console.log(res);
                    $.ajax({
                        url: 'map.php',
                        data: form_data,
                        processData: false,
                        contentType: false,
                        type: 'POST',
                        success: function (response) {
                            console.log(response);
                            renderMap.remove();
                            //hidden.parentNode.removeChild(container);
                            var urlToRoute = "http://myholidaymap.com/checkout/?add-to-cart=" + productId + "&style=" + s + "&header=" + encodeURIComponent($('#tcrTripName').text()) +  "&subheader=" + encodeURIComponent($('#tcrTripDetails').text()) + "&pid=" + response;
                            window.open(urlToRoute,"_self");
                            $.LoadingOverlay("hide");


                        },
                        error: function (error) {
                            renderMap.remove();

                            console.log("this is an error" + error);
                            $.LoadingOverlay("hide");

                        }
                    });

                });
            });
        }, 20000);


    });
}

function printClick_resize() {
    var b = map.getBounds();


    var container = document.getElementById("map-container");

    container.style.width = '7017px';
    container.style.height = '9933px';
    map.resize();
    map.fitBounds(b);
    //setTimeout(download, 5000);
    setTimeout( () => {
    console.log(map.getCanvas().toDataURL())}, 5000);
}

function downloadImage(blob){
    var link = document.createElement('a');
    link.download = 'filename.png';
    link.href = URL.createObjectURL(blob);
    $.LoadingOverlay("hide");
    link.click();
  }

function printClick(download) {
    
    var center = map.getCenter();
    var bearing = map.getBearing();
    var pitch = map.getPitch();

   
    //var original_w = document.getElementById('map-container').style.width.replace('px', '')/72;

    var zoom = map.getZoom();// * (width/original_w);
    /*createPrintMap(download ? '4961px' : '3508px', download ? '7016px' : '4961px', zoom, center,
        bearing, map.getStyle(), pitch,download);*/
        console.log(center+' '+bearing+' '+pitch+' '+zoom+' '+map.getStyle());
    
    createPrintMap('3508px','4961px', zoom, center,
        bearing, map.getStyle(), pitch,download);
        
       
}

function addLayers(currentMap) {
    ++layerCounter;
    var curPenWidth = penWidth * scaleFactor;

    addRouteLayers(currentMap, routeGeometry, curPenWidth, "route");
    addRouteLayers(currentMap, arcGeometry, curPenWidth, "arc");
}

function addRouteLayers(currentMap, geometryArray, curPenWidth, prefix) {
    if (geometryArray.length == 0) return;
    for (i in geometryArray) {
        console.log(geometryArray[i]);

        currentMap.addLayer({
            "id": prefix + layerCounter + '' + i,
            "type": "line",
            "source": {
                "type": "geojson",
                "data": {
                    "type": "Feature",
                    "properties": {},
                    "geometry": geometryArray[i]
                }
            },
            "layout": {
                "line-join": "round",
                "line-cap": "round"
            },
            "paint": {
                "line-color": penColor,
                "line-width": curPenWidth,
                "line-dasharray": [1, 2]
            }
        });
    }
}


$(document).ready(function () {
    $("#travel_car").addClass('active');
    setDimensions();
    /** MapBox Map initialization and EventListener */
    try {
        // Geolocation
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                lng = position.coords.longitude;
                lat = position.coords.latitude;
            });
        }
        map = new mapboxgl.Map({
            container: 'map-container',
            style: 'mapbox://styles/thijssondag/cjdsigxek0yxx2ss2d29xfatn',
            zoom: zoomLvl,
            pitch: 0,
            center: [lng, lat],
            preserveDrawingBuffer: true
        });
        var geocoder = new MapboxGeocoder({
            language: 'en',
            flyTo: false,
            accessToken: mapboxgl.accessToken
        });
            
        document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
        map.doubleClickZoom.disable()
        map.addControl(new mapboxgl.NavigationControl({
            position: 'top-left'
        }));
        // Add geolocate control to the map.
        map.addControl(new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true
        }));
        map.on('load', function() {
            // Listen for the `result` event from the MapboxGeocoder that is triggered when a user
            // makes a selection and add a symbol that matches the result.
            geocoder.on('result', function(ev) {
                autocompleter(ev);
            });
        });
    
        map.on('style.load', function () {
            //map.getCanvas().width = '7017px';
            //map.getCanvas().height = '9933px';
        
            if (filtered_cities().length) {
                completeRedraw(map);
            }
        });
        map.on('click', function (e) {
            var features = map.queryRenderedFeatures(e.point);

            if (!features.length) {
                return;
            }
            // Populate the popup and set its coordinates
            // based on the feature found.
            var layer_id = features[0].layer.id;
        var pos = [
            { position:'right', offset: [-1.3, 0]},
            { position:'bottom', offset: [0, 1.3]},
            { position:'left', offset: [1.3, 0]},
            { position:'top', offset: [0, -1.3]}
        ];
            var x = 0;
            var y = 1;
            var offset = 0.5;
            for (var j = cities.length - 1; j >= 0; --j) {
                if (layer_id.indexOf(cities[j].city_name) !== -1) {
                    for (var i = 0; i < pos.length; i++) {
                        if (pos[i].position === cities[j].city_anchor) {
                            switch(pos[i].position) {
                                case 'right': 
                                    cities[j].city_offset[x] = cities[j].city_offset[x] - offset;
                                break;
                                case 'bottom': 
                                    cities[j].city_offset[y] = cities[j].city_offset[y] + offset;
                                break;
                                case 'left': 
                                    cities[j].city_offset[x] = cities[j].city_offset[x] + offset;
                                break;
                                case 'top': 
                                    cities[j].city_offset[y] = cities[j].city_offset[y] - offset;
                                break;
                            }
                            map.setLayoutProperty(layer_id, 'text-offset', cities[j].city_offset);
                            break;
                        }
                    }
                    break;
                }
            }

        });
    } catch (e) {
        var mapContainer = document.getElementById('map-container');
        mapContainer.parentNode.removeChild(mapContainer);
        alert('This application uses the WebGL feature. Normally, refreshing the browser should fix this problem. If the problem persists, throw us a message at https://www.myholidaymap.com. ');
        console.log('This site requires WebGL, but your browser doesn\'t seem' +
            ' to support it: ' + e.message);
        return;
    }
    
    /** Document Resize */
    $(window).resize(function () {
        setDimensions(map);
        if (map)
            map.resize();
    });
    /** UI EventListener */
    /*
        document.querySelector("#colorWell").addEventListener("change", (event) => {
            penColor = event.target.value;
        console.log(penColor);
    }, false);
        document.querySelector("#penWidth").addEventListener("change", (event) => {
            penWidth = parseInt(event.target.value, 10);
    }, false);
    */
   
   $("#tripName_txt").on('input', () => {
        document.getElementById('tcrTripName').innerHTML = $("#tripName_txt").val();
   });
   $("#tripDetail_txt").on('input', () => {
        document.getElementById('tcrTripDetails').innerHTML = $("#tripDetail_txt").val();
    });
    
    $("ul.styler li").on("click", function () {
        mapboxgl.accessToken = 'pk.eyJ1IjoidGhpanNzb25kYWciLCJhIjoiY2phOHI2MXNuMDh3dzMzanVhZXlzanU4byJ9.L3vNl1ehNadAt1JWPJqgiA';

        $("ul.styler li").each((i, e) => {
            $(e).removeClass("active");
        });
        var className = $(this).attr("class");
        $(this).addClass("active");
        if (className === 'blue') {
            map.setStyle('mapbox://styles/thijssondag/cjdsigxek0yxx2ss2d29xfatn');
            penColor = '#376B67';
            markerColor = '#609B96';
            style_name = 'cjdsigxek0yxx2ss2d29xfatn';
        } else if (className === 'green') {
            map.setStyle('mapbox://styles/thijssondag/cjdst1crt07gr2spe5w4d3jkv');
            penColor = '#376B67';
            markerColor = '#609B96';
            style_name = 'cjdst1crt07gr2spe5w4d3jkv';
        } else if (className === 'red') {
            map.setStyle('mapbox://styles/thijssondag/cjdsijmo902ib2smo8yyt05a9');
            penColor = '#8D241B';
            markerColor = '#BC5148';
            style_name = 'cjdsijmo902ib2smo8yyt05a9';
            //mapboxgl.accessToken = 'pk.eyJ1Ijoic3ZpYXQiLCJhIjoiY2pjb3doNHFmMmJmNDMwcGZ0N3QwcDZmZiJ9.P1smU6PlZWfJGUf5kpOCQQ';
        }
        $(".gradient").attr('class', 'gradient ' + className + '-gradient');

    });
    $("ul.sizes li").on("click", function () {

        $("ul.sizes li").each((i, e) => {
            $(e).removeClass("active");
        });
        var className = $(this).attr("class");
        $(this).addClass("active");
        selectedSize = $(this).find("span.big.size").text().trim();
        console.log("Selected size: " + selectedSize);
    });
    $("#btnPrint").click(function(){
        printClick(false);
    });
    $("#travel_flight").click(function(){
        isFlightPath = true;
        $("#travel_flight").addClass('active');
        $("#travel_car").removeClass('active');

    });
     $("#travel_car").click(function(){
        isFlightPath = false;
        $("#travel_car").addClass('active');
        $("#travel_flight").removeClass('active');
    });
    $("#btnDownload").click(function(){
        printClick(true);
    });
    $('#looped_map').change(function() {
        completeRedraw(map);
               
    });   

    function checkStartDate() {
        var date = document.getElementById('trvlStrtDate').value;
        var input = document.getElementById("trvlEndDate");
        input.setAttribute("min", date);
        if (document.getElementById("trvlStrtDate").value) {
            document.getElementById("trvlEndDate").disabled = false;
        } else {
            document.getElementById("trvlEndDate").value = '';
            document.getElementById("trvlEndDate").disabled = true;
        }
    }

    function newFun() {
        document.getElementById('lbl4').hidden = false;
        document.getElementById('trvlStrtDate').hidden = true;
        document.getElementById('trvlEndDate').hidden = true;
        var strDt = document.getElementById('trvlStrtDate').value;
        var strArr = strDt.split('-');
        var endDt = document.getElementById('trvlEndDate').value;
        var endArr = endDt.split('-');
        document.getElementById('tcrStrtDate').innerHTML = strArr[2] + '/' + strArr[1] + '/' + strArr[0];
        document.getElementById('tcrEndDate').innerHTML = endArr[2] + '/' + endArr[1] + '/' + endArr[0];
    }

    function emptyIfEnd() {
        if (document.getElementById("trvlStrtDate")) {
            document.getElementById("trvlEndDate").disabled = false;
        } else {
            document.getElementById("trvlEndDate").disabled = true;
        }
    }
    function setTicker(id) {
        if (id && id.checked) {
            document.getElementById('state-legend').hidden = false;
        } else {
            document.getElementById('state-legend').hidden = true;
        }
    }

    /** autocomplete for places and city names */
    function autocompleter(result_resp){
   
        
        if (filtered_cities().length > 0 && result_resp['result'].place_name_en === filtered_cities()[filtered_cities().length - 1].city_info) {
            return;
        }
        
        
        console.log(result_resp['result']);
        var city_name = result_resp['result'].text;//autocomplete.getPlace().geometry.location.lat();
        var city_long = result_resp['result'].geometry.coordinates[0];//autocomplete.getPlace().geometry.location.lng();
        var city_lat = result_resp['result'].geometry.coordinates[1];//autocomplete.getPlace().name;
        var city_info = result_resp['result'].place_name_en;
        var city_offset = [1.3,0];
        var city_anchor = "left";
        var city_source = {};
        var city_textsize = 16 * scaleFactor;
        var city_flight_path = isFlightPath;
        var city_alias='';
        var archived = false;
        var found = false;
        for (var i = cities.length - 1; i >= 0; --i) {
            if (cities[i].city_name == city_name) {
                cities[i].archived = false;
                cities[i].city_flight_path = city_flight_path;
		found = true;
                break;
            }
        }
        if (!found){
        cities.push({
            city_info,
            city_long,
            city_lat,
            city_name,
            city_offset,
            city_anchor,
            city_source,
            city_textsize,
            city_flight_path,
            city_alias,
            archived
        });
    ``}
        //document.getElementById('geocoder').value = '';
        if (filtered_cities().length === 1) {
            map.flyTo({
                center: new mapboxgl.LngLat(city_long, city_lat),
                zoom: zoomLvl
            });
        }
        completeRedraw(map);
        $('.geocoder-icon.geocoder-icon-close').click();

    
    }
    function setDimensions(map) {
        var mapHeight;
        var mapContainer = $(document.getElementById('map-container'));
        if ($(window).width() >= 576)
            mapHeight = Math.ceil($(window).height() - $('nav').height() - mapContainer.offset().top + 10);
        else {
            mapHeight = Math.ceil($(window).height());
        }
        var mapWidth = Math.ceil(mapHeight * 0.706);
        if (mapWidth > mapContainer.parent().width()) {
            mapWidth = Math.ceil(mapContainer.parent().width());
            mapHeight = Math.ceil(mapWidth / 0.706);
        }
        mapContainer.css({
            'width': mapWidth + 'px',
            'height': mapHeight + 'px'
        });
        if ($(window).width() < 576) {
            var viewportHeight = parseInt($('map').css('marginTop')) + parseInt(mapContainer.css('marginBottom')) + mapHeight + 50;
            $('.right-area').css('height', viewportHeight + 'px');
        } else
            $('.right-area').css('height', '');



        $('#tcrTripName').css({
            'fontSize': Math.ceil(mapWidth / 14) + 'px',
            'lineHeight': Math.ceil(1.2 * mapWidth / 14) + 'px',
            'letterSpacing': Math.ceil(mapWidth / 52) + 'px'
        });
        $('#tcrTripDetails').css({
            'fontSize': Math.ceil(mapWidth / 28) + 'px',
            'lineHeight': Math.ceil(1.2 * mapWidth / 28) + 'px',
            'letterSpacing': Math.ceil(mapWidth / 85) + 'px'
        });

        var leftAreaHeight = mapHeight + 50;
        $('.left-area').css('minHeight', leftAreaHeight + 'px');
    }
});
