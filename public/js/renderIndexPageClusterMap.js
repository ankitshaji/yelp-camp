//clientside js for browser to execute - eg. app.js
//intialize mapboxglObject with our cerdentials - associate mapbox account to this mapboxglObject instance
mapboxgl.accessToken = MAPBOX_APIS_PUBLIC_ACCESS_TOKEN; //using previously exectued client side js scripts variable
//intializedMapboxglObject.property = MapClassObject()
//mapInstanceObject =  new MapClassObject(objectArgument-passed to constructor method) //NOTE - container property is div id, can choose diffrent stlye
const map = new mapboxgl.Map({
  container: "cluster-map", // container ID
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: "mapbox://styles/mapbox/light-v10", // style URL
  center: [-103.5917, 40.6699],
  zoom: 3,
});

// Add zoom and rotation controls to the map.
//adding navigationControlInstanceObject to mapInstanceObject
//mapInstanceObject.method(navigationControlInstanceObject,Optionalposition) //default top-right
//intializedMapboxglObject.property = NavigationControlClassObject
//navigationControlInstanceObject = new NavigationControlClassObject(executes empty constructor method)
map.addControl(new mapboxgl.NavigationControl());

//mapInstanceObject.method(eventStringInstObj,anonymousCallbackFunctionExpression-has parameter to accepts created/passed in argument eventObject)
//when eventStringInstObj happens on mapInstanceObject (ie target) - create/pass in argument eventObject to anonymousCallbackFunctionExpression and execute callback
map.on("load", () => {
  // Add a new source from our GeoJSON data and
  // set the 'cluster' option to true. GL-JS will
  // add the point_count property to your source data.
  //mapInstanceObject.method("setSourceNameStringInstObj",loadOptionsObject) //load data into mapInstanceObject with sourceNameStringInstObj as reference
  map.addSource("campgrounds", {
    type: "geojson",
    // Point to GeoJSON data.
    //previous jsonObject data passed into data property -
    //https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson - GET request
    //   {
    //    "type":"FeatureCollection",
    //    "otherPropertyName":"value",
    //    "features":[{"type":"Feature",
    //                 "properties":{"id":"value","mag":2.3,},
    //                 "geometry":{"type":"point","coordinates":[-12,32,0.0]}
    //                },
    //               ]
    //    }
    //NOTE - we can see the data property looks for a features key - so we edited our jsonObjectArrayInstObj to be jsonObject
    //our jsonObject data passed into data property - {"feature":jsonObjectArrayInstObj}
    //    {
    //     "features":[{"geometry":{"type":"point","coordinates":[-12,32,0.0]},
    //                 "_id":"value",
    //                 "title":"value",
    //                 },
    //                ]
    //    }
    data: campgroundsJsonObject,
    cluster: true,
    clusterMaxZoom: 14, // Max zoom to cluster points on
    clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
  });

  //edit cluster circles - color/size
  //mapInstanceObject.method(optionsObject - pass in our sourceNameStringInstObj )
  map.addLayer({
    id: "clusters",
    type: "circle",
    source: "campgrounds",
    filter: ["has", "point_count"],
    paint: {
      // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
      // with three steps to implement three types of circles:
      //   * Blue, 20px circles when point count is less than 100
      //   * Yellow, 30px circles when point count is between 100 and 750
      //   * Pink, 40px circles when point count is greater than or equal to 750
      "circle-color": [
        "step",
        ["get", "point_count"],
        "#90CAF9",
        10,
        "#2196F3",
        30,
        "#1976D2",
      ],
      "circle-radius": ["step", ["get", "point_count"], 15, 10, 20, 30, 25],
    },
  });

  //edit number on cluster circle
  //modelInstanceObject.method(optionsObject-pass in sourceNameStringInstObj)
  map.addLayer({
    id: "cluster-count",
    type: "symbol",
    source: "campgrounds",
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12,
    },
  });

  //edit unclusterd point
  //mapInstanceObject.method(optionsObject-pass in sourceNameStringInstObj)
  map.addLayer({
    id: "unclustered-point",
    type: "circle",
    source: "campgrounds",
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": "#11b4da",
      "circle-radius": 4,
      "circle-stroke-width": 1,
      "circle-stroke-color": "#fff",
    },
  });

  //mapInstanceObject.method(eventStringInstObj,eventSpecificsStringInstObj,anonymousCallbackFunctionExpression-has parameter to accepts created/passed in argument eventObject)
  //when eventStringInstObj happens on mapInstanceObject (ie target) that also fullfill eventSpecificsStringInstObj - create/pass in argument eventObject to anonymousCallbackFunctionExpression and execute callback
  //inspect a cluster on click - zoom in
  //pass in sourceNameStringInstObj
  map.on("click", "clusters", (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ["clusters"],
    });
    const clusterId = features[0].properties.cluster_id;
    map
      .getSource("campgrounds")
      .getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;

        map.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom,
        });
      });
  });

  //mapInstanceObject.method(eventStringInstObj,eventSpecificsStringInstObj,anonymousCallbackFunctionExpression-has parameter to accepts created/passed in argument eventObject)
  //when eventStringInstObj happens on mapInstanceObject (ie target) that also fullfill eventSpecificsStringInstObj - create/pass in argument eventObject to anonymousCallbackFunctionExpression and execute callback
  // When a click event occurs on a feature in
  // the unclustered-point layer, open a popup at
  // the location of the feature, with
  // description HTML from its properties.
  map.on("click", "unclustered-point", (e) => {
    //Created eventObject has a features property which auto populates/contains the specific campgroundJsonObject
    //eventObject follows a set pattern to auto populates/use the data passed into mapboxInstanceObject
    //eventObject.features[0] requires us to have properties property and geometry property to help it auto populate
    //all campgroundJsonObject properties other than geometry should have been nested inside properties property //which was not how our campgroundSchemaInstanceObject was set up
    //quick fix work around for this is creating a virtual nested property "properties.popupMarkup" in campgroundSchemaInstanceObject //therfore avaiable in all modelInstanceObjects //then available in campgroundJsonStringObject with the help of a set optionObject
    //SIDENOTE - this keywork refers to either mapInstanceObject ie(left of dot-execution scope) or windowObject based on functionExpression type

    //object keys to variable - Object destructuring - //propertiesObject
    //popupMarkupStringInstObj
    const { popupMarkup } = e.features[0].properties; //campgroundJsonObject.property //propertiesObject
    const coordinates = e.features[0].geometry.coordinates.slice(); //campgroundJsonObject.property.property.stringMethod() //arrayInstObj

    // Ensure that if the map is zoomed out such that
    // multiple copies of the feature are visible, the
    // popup appears over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    //adding popupInstanceObject to mapInstanceObject
    //intializedMapboxglObject.property = PopupClassObject
    //popupInstanceObject = new PopupClassObject(executes empty constructor method)
    //popupInstanceObject.method(arrayInstObj).method(popupMarkupStringInstObj).method(mapInstanceObject)
    new mapboxgl.Popup().setLngLat(coordinates).setHTML(popupMarkup).addTo(map);
  });

  //mapInstanceObject.method(eventStringInstObj,eventSpecificsStringInstObj,anonymousCallbackFunctionExpression-has parameter to accepts created/passed in argument eventObject)
  //when eventStringInstObj happens on mapInstanceObject (ie target) that also fullfill eventSpecificsStringInstObj - create/pass in argument eventObject to anonymousCallbackFunctionExpression and execute callback
  map.on("mouseenter", "clusters", () => {
    map.getCanvas().style.cursor = "pointer";
  });

  //mapInstanceObject.method(eventStringInstObj,eventSpecificsStringInstObj,anonymousCallbackFunctionExpression-has parameter to accepts created/passed in argument eventObject)
  //when eventStringInstObj happens on mapInstanceObject (ie target) that also fullfill eventSpecificsStringInstObj - create/pass in argument eventObject to anonymousCallbackFunctionExpression and execute callback
  map.on("mouseleave", "clusters", () => {
    map.getCanvas().style.cursor = "";
  });
});
