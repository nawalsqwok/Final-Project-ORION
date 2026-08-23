console.log("MAP.JS BERHASIL DIJALANKAN");

import {
    Map,
    NavigationControl,
    Popup,
} from "maplibre-gl";

import "maplibre-gl/dist/maplibre-gl.css";

import { getOrionDistricts } from "../api/orion-data.js";

console.log("MapLibre:", Map);


const MAP_CONTAINER_ID = "map";

const GEOJSON_SOURCE_ID = "orion-districts";

const ORION_FILL_LAYER_ID = "orion-district-fill";
const ORION_LINE_LAYER_ID = "orion-district-line";


const map = new Map({
    container: "map",

    center: [107.6, -6.9],
    zoom: 9,

    style: {
        version: 8,

        sources: {
            "osm-raster": {
                type: "raster",
                tiles: [
                    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
                ],
                tileSize: 256,
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            },
        },

        layers: [
            {
                id: "osm-basemap",
                type: "raster",
                source: "osm-raster",
            },
        ],
    },
});


map.addControl(
    new NavigationControl(),
    "top-right"
);


map.on("load", async () => {
    try {
        const geojson = await getOrionDistricts();


        map.addSource(
            GEOJSON_SOURCE_ID,
            {
                type: "geojson",
                data: geojson,
            }
        );


        map.addLayer({
            id: ORION_FILL_LAYER_ID,
            type: "fill",
            source: GEOJSON_SOURCE_ID,

            paint: {
                "fill-color": [
                    "interpolate",
                    ["linear"],
                    ["get", "ORION_SCORE"],

                    30,
                    "#0b1f3a",

                    40,
                    "#174a63",

                    50,
                    "#2f7f72",

                    60,
                    "#b49b42",

                    68,
                    "#f0cf7a",
                ],

                "fill-opacity": 0.65,
            },
        });


        map.addLayer({
            id: ORION_LINE_LAYER_ID,
            type: "line",
            source: GEOJSON_SOURCE_ID,

            paint: {
                "line-color": "#ffffff",
                "line-width": 0.6,
                "line-opacity": 0.5,
            },
        });


        map.on("click", ORION_FILL_LAYER_ID, (event) => {
            const feature = event.features?.[0];

            if (!feature) {
                return;
            }


            const properties = feature.properties;


            const districtName =
                properties.WADMKC ?? "Tidak diketahui";


            const regencyName =
                properties.WADMKK ?? "Tidak diketahui";


            const orionScore =
                properties.ORION_SCORE ?? "-";


            const nsbScore =
                properties.NSB_SCORE ?? "-";


            const cloudScore =
                properties.CLOUD_SCORE ?? "-";


            const accessScore =
                properties.ACCESS_SCORE ?? "-";


            new Popup()
                .setLngLat(event.lngLat)
                .setHTML(`
                    <div class="map-popup">

                        <p class="popup-label">
                            Kecamatan
                        </p>

                        <h3 class="popup-title">
                            ${districtName}
                        </h3>

                        <p class="popup-location">
                            ${regencyName}
                        </p>

                        <div class="popup-score">
                            <span>ORION Score</span>

                            <strong>
                                ${Number(orionScore).toFixed(2)}
                            </strong>
                        </div>

                        <div class="popup-metrics">

                            <div>
                                <span>NSB</span>
                                <strong>${nsbScore}</strong>
                            </div>

                            <div>
                                <span>Cloud</span>
                                <strong>${cloudScore}</strong>
                            </div>

                            <div>
                                <span>Access</span>
                                <strong>${accessScore}</strong>
                            </div>

                        </div>

                    </div>
                `)
                .addTo(map);
        });


        map.on("mouseenter", ORION_FILL_LAYER_ID, () => {
            map.getCanvas().style.cursor = "pointer";
        });


        map.on("mouseleave", ORION_FILL_LAYER_ID, () => {
            map.getCanvas().style.cursor = "";
        });

    } catch (error) {
        console.error(
            "Gagal menginisialisasi data ORION:",
            error
        );
    }
});