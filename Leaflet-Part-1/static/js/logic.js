// Create a map object and set a default map view
var myMap = L.map("map", {
    center: [37.8, -96.9],
    zoom: 5
  });
  
  // Add a tile layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  }).addTo(myMap);
  
  // Define URL for the earthquake data in GeoJSON format
  var earthquakeDataURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
  
  // Choose color of marker based on the earthquake depth
  function depthColor(depth) {
    if (depth <= 10) return "#ffffcc";
    else if (depth <= 30) return "#ffeda0";
    else if (depth <= 50) return "#fed976";
    else if (depth <= 70) return "#feb24c";
    else if (depth <= 90) return "#fd8d3c";
    else return "#fc4e2a";  // Anything above 90+ depth
  }
  
  // Scale radius of marker based on the earthquake magnitude
  function radiusSize(magnitude) {
    return magnitude * 4;
  }
  
  // Use D3 to load the GeoJSON data
  d3.json(earthquakeDataURL).then(function(data) {
    L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
          radius: radiusSize(feature.properties.mag), 
          fillColor: depthColor(feature.geometry.coordinates[2]),
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });
      },
      onEachFeature: function(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place +
                        "<br>Depth: " + feature.geometry.coordinates[2] + " km");
      }
    }).addTo(myMap); 
  });
  
  // Create legend 
  var legend = L.control({position: 'bottomright'});
  
  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 30, 50, 70, 90],
        labels = [],
        from, to;
  
    for (var i = 0; i < grades.length; i++) {
      from = grades[i];
      to = grades[i + 1];
  
      labels.push(
        '<i style="background:' + depthColor(from + 1) + '"></i> ' +
        from + (to ? '&ndash;' + to : '+') + ' km');
    }
  
    div.innerHTML = labels.join('<br>');
    return div;
  };
  
  // Add the legend to the map
  legend.addTo(myMap);
  
  
  
  