mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/harrymarah/cknzxxigo4hn117qvt5fsr79k', // style URL
    center: businesses.geometry.coordinates, // starting position [lng, lat]
    zoom: 13 // starting zoom
});

new mapboxgl.Marker({
    color: '#32a852'
}).setLngLat(businesses.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(`
        <h6>${businesses.title}</h6>
        <p>${businesses.location.address}</p>
        `)
    )
    .addTo(map)