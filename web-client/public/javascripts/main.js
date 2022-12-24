window.onload = init;

function init() {
  const OSM = new ol.source.OSM();
  let tempat = new ol.layer.Vector({
    source: new ol.source.Vector({

    }),
    style: new ol.style.Style({
      image: new ol.style.Icon({
        src: '/assets/home.png',
        size: [512,512],
        scale: 0.09
      }) 
    })
  });

  fetch("http://localhost:3100/tempat")
    .then((response) => {
      return response.json()
    }).then((jRes) => {
      console.log(jRes)
      tempat.setSource(
        new ol.source.Vector({
          features: new ol.format.GeoJSON().readFeatures(jRes)
        }),
      )
    })

  const map = new ol.Map({
    target: 'map',
    view: new ol.View({
      projection: `EPSG:4326`,
      center: [107.6032585063428, -6.917864632060578],
      zoom: 13,
    }),

    layers: [
      new ol.layer.Tile({
        source: new ol.source.XYZ({
          url: `https://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}`,
        }),
      }),
      new ol.layer.Tile({
        source: OSM,
      }),
      tempat

    ],


  })
}

