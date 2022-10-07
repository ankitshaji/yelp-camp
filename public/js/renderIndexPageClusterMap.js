//clientside js for browser to execute - eg. app.js
//intialize mapboxglObject with our cerdentials - associate mapbox account to this mapboxglObject instance
mapboxgl.accessToken = MAPBOX_APIS_PUBLIC_ACCESS_TOKEN; //using previously exectued client side js scripts variable
//intializedMapboxglObject.property = MapClassObject()
//mapInstanceObject =  new MapClassObject(objectArgument-passed to constructor method) //NOTE - container property is div id, can choose diffrent stlye
const map = new mapboxgl.Map({
  container: "map",
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: "mapbox://styles/mapbox/light-v10",
  center: [-103.5917, 40.6699],
  zoom: 3,
});

//mapInstanceObject.method(eventString,anonymousCallbackFunctionExpression-accepts passed in argument eventObject)
//when eventString happens on mapInstanceObject (ie target) - pass in argument eventObject and execute anonymousCallbackFunctionExpression
map.on("load", () => {
  // Add a new source from our GeoJSON data and
  // set the 'cluster' option to true. GL-JS will
  // add the point_count property to your source data.
  //mapInstanceObject.method("setSourceNameString",loadOptionsObject) //load data into mapInstanceObject with sourceNameString as reference
  map.addSource("campgrounds", {
    type: "geojson",
    // Point to GeoJSON data.
    //previous jsonStringObject data passed into data property -
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
    //NOTE - we can see the data property looks for a features key - so we edited our jsonStringObjectArrayObject to be jsonStringObject
    //our jsonStringObject data passed into data property - {"feature":jsonStringObjectArrayObject}
    //    {
    //     "features":[{"geometry":{"type":"point","coordinates":[-12,32,0.0]},
    //                 "_id":"value",
    //                 "title":"value",
    //                 },
    //                ]
    //    }
    data: campgroundsJsonStringObject,
    cluster: true,
    clusterMaxZoom: 14, // Max zoom to cluster points on
    clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
  });

  //edit cluster circles - color/size
  //mapInstanceObject.method(optionsObject - pass in our sourceNameString )
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
  //modelInstanceObject.method(optionsObject-pass in sourceNameString)
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
  //mapInstanceObject.method(optionsObject-pass in sourceNameString)
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

  //mapInstanceObject.method(eventString,eventSpecificsString,anonymousCallbackFunctionExpression-accepts passed in argument eventObject)
  //when eventString happens on mapInstanceObject (ie target) that also fullfill eventSpecificsString- pass in argument eventObject and execute anonymousCallbackFunctionExpression
  //inspect a cluster on click - zoom in
  //pass in sourceNameString
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

  //mapInstanceObject.method(eventString,eventSpecificsString,anonymousCallbackFunctionExpression-accepts passed in argument eventObject)
  //when eventString happens on mapInstanceObject (ie target) that also fullfill eventSpecificsString- pass in argument eventObject and execute anonymousCallbackFunctionExpression
  // When a click event occurs on a feature in
  // the unclustered-point layer, open a popup at
  // the location of the feature, with
  // description HTML from its properties.
  map.on("click", "unclustered-point", (e) => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const mag = e.features[0].properties.mag;
    const tsunami = e.features[0].properties.tsunami === 1 ? "yes" : "no";

    // Ensure that if the map is zoomed out such that
    // multiple copies of the feature are visible, the
    // popup appears over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(`magnitude: ${mag}<br>Was there a tsunami?: ${tsunami}`)
      .addTo(map);
  });

  //mapInstanceObject.method(eventString,eventSpecificsString,anonymousCallbackFunctionExpression-accepts passed in argument eventObject)
  //when eventString happens on mapInstanceObject (ie target) that also fullfill eventSpecificsString- pass in argument eventObject and execute anonymousCallbackFunctionExpression
  map.on("mouseenter", "clusters", () => {
    map.getCanvas().style.cursor = "pointer";
  });

  //mapInstanceObject.method(eventString,eventSpecificsString,anonymousCallbackFunctionExpression-accepts passed in argument eventObject)
  //when eventString happens on mapInstanceObject (ie target) that also fullfill eventSpecificsString- pass in argument eventObject and execute anonymousCallbackFunctionExpression
  map.on("mouseleave", "clusters", () => {
    map.getCanvas().style.cursor = "";
  });
});
