//client side js for browser to execute - eg. app.js
//intialize mapboxglObject with our cerdentials - associate mapbox account to this mapboxglObject instance
mapboxgl.accessToken = MAPBOX_APIS_PUBLIC_ACCESS_TOKEN; //using previously exectued client side js scripts variable
//intializedMapboxglObject.property = MapClassObject()
//mapInstanceObject =  new MapClassObject(objectArgument-passed to constructor method) //NOTE - container property is div id, can choose diffrent stlye
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/light-v10", // style URL
  center: campgroundJsonObject.geometry.coordinates, //campgroundJsonObject.property.property = arrayInstObj// starting position [lng, lat]
  zoom: 10, // starting zoom
});

// Add zoom and rotation controls to the map.
//adding navigationControlInstanceObject to mapInstanceObject
//mapInstanceObject.method(navigationControlInstanceObject,Optionalposition) //default top-right
//intializedMapboxglObject.property = NavigationControlClassObject
//navigationControlInstanceObject = new NavigationControlClassObject(executes empty constructor method)
map.addControl(new mapboxgl.NavigationControl());

//Create a default Marker with Popup and add it to the map.
//intializedMapboxglObject.property = MarkerClassObject
//markerInstanceObject =  new MarkerClassObject(executes empty constructor method)
//markerInstanceObject.method(lngLatArrayInstObj).method(popupInstanceObject.method(htmlStringInstObj)).method(mapInstanceObject)  //method chaining - each method returns markerInstanceObject
//lngLatArrayInstObj = campgroundJsonObject.property.property
//intializedMapboxglObject.property = PopupClassObject()
//popupInstanceObject = new PopupClassObject(objectArgument-passed to constructor method)
const marker1 = new mapboxgl.Marker()
  .setLngLat(campgroundJsonObject.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h3>${campgroundJsonObject.title}</h3>${campgroundJsonObject.location}<p></p>`
    )
  )
  .addTo(map);
