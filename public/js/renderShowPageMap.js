//client side js for browser to execute - eg. app.js
//intialize mapboxglObject with our cerdentials - associate mapbox account to this mapboxglObject instance
mapboxgl.accessToken = MAPBOX_APIS_PUBLIC_ACCESS_TOKEN; //using previously exectued client side js scripts variable
//intializedMapboxglObject.property = MapClassObject()
//mapInstanceObject =  new MapClassObject(objectArgument-passed to constructor method) //NOTE - container property is div id
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v11", // style URL
  center: campgroundJsonStringObject.geometry.coordinates, //campgroundJsonStringObject.property.property = arrayObject// starting position [lng, lat]
  zoom: 10, // starting zoom
});

//Create a default Marker and add it to the map.
//intializedMapboxglObject.property = MarkerClassObject()
//markerInstanceObject =  new MarkerClassObject(executes empty constructor method)
//markerInstanceObject.method(lngLatArrayObject).method(mapInstanceObject)  //method chaining
//lngLatArrayObject = campgroundJsonStringObject.property.property
const marker1 = new mapboxgl.Marker()
  .setLngLat(campgroundJsonStringObject.geometry.coordinates)
  .addTo(map);
