import { Map, NavigationControl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const MAP_CONTAINER_ID = "map";
const GEOJSON_SOURCE_ID = "orion-districts";
const GEOJSON_PATH = "/data/geojson/orion_bandung_raya.geojson";

const map = new Map({
    container: MAP_CONTAINER_ID,

    style: {
        version: 8,

        sources: {},

        layers: [
            {
                id: "background",
                type: "background",
                paint: { "background-color": "#020817",},
            },
        ],
    },

    center: [107.6, -6.9],
    zoom: 9,
});

map.addControl(
    new NavigationControl(),
    "top-right"
);

map.on("load", async() => {
    try{
        const response = await fetch(GEOJSON_PATH);

        if (!response.ok) {
            throw new Error(
                `Gagal memuat GeoJSON: ${response.status}`
            );
        }

        const geojson = await response.json();

        map.addSource(GEOJSON_SOURCE_ID, {
            type: "geojson",
            data: geojson,
        });

        map.addLayer({
            id: "orion-district-fill",
            type: "fill",

            source: GEOJSON_SOURCE_ID,

            paint: {
                "fill-color": "#29406f",
                "fill-opacity": 0.65,
            },
        });

        map.addLayer({
            id: "orion-district-line",
            type: "line",

            source: GEOJSON_SOURCE_ID,

            paint: {
                "line-color": "#9aa9c2",
                "line-width": 0.8,
            },
        });

    } catch (error) {
        console.error("Gagal memuat data ORION:", error);
    }
});