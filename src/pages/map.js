import {
    Map,
    NavigationControl,
} from "maplibre-gl";

import "maplibre-gl/dist/maplibre-gl.css";

import { getOrionDistricts } from "../api/orion-data.js";
import { createLocationPopup } from "../components/location-popup.js";
import { initializeLayerControl } from "../components/layer-control.js";


const MAP_CONTAINER_ID = "map";

const GEOJSON_SOURCE_ID = "orion-districts";

const ORION_FILL_LAYER_ID = "orion-district-fill";
const ORION_LINE_LAYER_ID = "orion-district-line";
const NSB_IMAGE_SOURCE_ID = "nsb-image";
const NSB_RASTER_LAYER_ID = "nsb-raster";


const map = new Map({
    container: MAP_CONTAINER_ID,

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
                    '&copy; OpenStreetMap contributors',
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

        map.addSource(
            NSB_IMAGE_SOURCE_ID,
            {
                type: "image",
                url: "/data/rasters/orion-nsb-bandung-raya-2024.png",
                coordinates: [
                    [107.1788867, -6.6874825],
                    [107.9413847, -6.6874825],
                    [107.9413847, -7.3124809],
                    [107.1788867, -7.3124809],
                ],
            }
        );

        map.addLayer({
            id: NSB_RASTER_LAYER_ID,
            type: "raster",
            source: NSB_IMAGE_SOURCE_ID,

            layout: {
                visibility: "none",
            },

            paint: {
                "raster-opacity": 1,
            },
        });


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

                "fill-opacity": 0.68,
            },
        });


        map.addLayer({
            id: ORION_LINE_LAYER_ID,
            type: "line",
            source: GEOJSON_SOURCE_ID,

            paint: {
                "line-color": "#ffffff",
                "line-width": 0.6,
                "line-opacity": 0.45,
            },
        });

        initializeLayerControl(map);

        map.on(
            "click",
            ORION_FILL_LAYER_ID,
            (event) => {
                const feature = event.features?.[0];

                if (!feature) {
                    return;
                }

                const popup = createLocationPopup(
                    event,
                    feature.properties
                );

                popup.addTo(map);

                setupPopupDetailButton(
                    popup,
                    feature.properties
                );
            }
        );


        map.on(
            "mouseenter",
            ORION_FILL_LAYER_ID,
            () => {
                map.getCanvas().classList.add(
                    "map-canvas--interactive"
                );
            }
        );


        map.on(
            "mouseleave",
            ORION_FILL_LAYER_ID,
            () => {
                map.getCanvas().classList.remove(
                    "map-canvas--interactive"
                );
            }
        );


        initializeLocationSearch(
            map,
            geojson
        );

    } catch (error) {
        console.error(
            "Failed to initialize ORION map:",
            error
        );
    }
});


function setupPopupDetailButton(
    popup,
    properties
) {
    popup.on("open", () => {
        const detail_button =
            document.querySelector(
                '[data-action="view-detail"]'
            );

        if (!detail_button) {
            return;
        }

        detail_button.addEventListener(
            "click",
            () => {
                openLocationPanel(
                    properties
                );

                popup.remove();
            }
        );
    });
}


function openLocationPanel(properties) {
    const location_panel =
        document.getElementById(
            "location-panel"
        );

    const location_name =
        document.getElementById(
            "location-name"
        );

    const location_regency =
        document.getElementById(
            "location-regency"
        );

    const orion_score =
        document.getElementById(
            "orion-score"
        );

    const nsb_score =
        document.getElementById(
            "nsb-score"
        );

    const cloud_score =
        document.getElementById(
            "cloud-score"
        );

    const access_score =
        document.getElementById(
            "access-score"
        );


    if (!location_panel) {
        return;
    }


    location_name.textContent =
        properties.WADMKC ??
        "Tidak diketahui";


    location_regency.textContent =
        properties.WADMKK ??
        "Tidak diketahui";


    orion_score.textContent =
        Number(
            properties.ORION_SCORE ?? 0
        ).toFixed(2);


    nsb_score.textContent =
        properties.NSB_SCORE ??
        "-";


    cloud_score.textContent =
        properties.CLOUD_SCORE ??
        "-";


    access_score.textContent =
        properties.ACCESS_SCORE ??
        "-";


    location_panel.hidden = false;
}


function closeLocationPanel() {
    const location_panel =
        document.getElementById(
            "location-panel"
        );

    if (!location_panel) {
        return;
    }

    location_panel.hidden = true;
}


function initializeLocationSearch(
    map_instance,
    geojson
) {
    const search_input =
        document.getElementById(
            "location-search"
        );

    if (!search_input) {
        return;
    }


    search_input.addEventListener(
        "change",
        () => {
            const query =
                search_input.value
                    .trim()
                    .toLowerCase();


            if (!query) {
                return;
            }


            const feature =
                geojson.features.find(
                    (item) => {
                        const district_name =
                            String(
                                item.properties?.WADMKC ??
                                ""
                            ).toLowerCase();


                        const regency_name =
                            String(
                                item.properties?.WADMKK ??
                                ""
                            ).toLowerCase();


                        return (
                            district_name.includes(
                                query
                            ) ||
                            regency_name.includes(
                                query
                            )
                        );
                    }
                );


            if (!feature) {
                return;
            }


            const coordinates =
                getFeatureCenter(
                    feature
                );


            map_instance.flyTo({
                center: coordinates,
                zoom: 12,
                essential: true,
            });
        }
    );
}


function getFeatureCenter(feature) {
    const coordinates = [];

    collectCoordinates(
        feature.geometry,
        coordinates
    );


    if (!coordinates.length) {
        return [107.6, -6.9];
    }


    let min_longitude = Infinity;
    let max_longitude = -Infinity;

    let min_latitude = Infinity;
    let max_latitude = -Infinity;


    coordinates.forEach(
        ([longitude, latitude]) => {
            min_longitude =
                Math.min(
                    min_longitude,
                    longitude
                );


            max_longitude =
                Math.max(
                    max_longitude,
                    longitude
                );


            min_latitude =
                Math.min(
                    min_latitude,
                    latitude
                );


            max_latitude =
                Math.max(
                    max_latitude,
                    latitude
                );
        }
    );


    return [
        (min_longitude + max_longitude) /
            2,

        (min_latitude + max_latitude) /
            2,
    ];
}


function collectCoordinates(
    geometry,
    output
) {
    if (
        geometry.type ===
        "Polygon"
    ) {
        geometry.coordinates.forEach(
            (ring) => {
                ring.forEach(
                    (coordinate) => {
                        output.push(
                            coordinate
                        );
                    }
                );
            }
        );

        return;
    }


    if (
        geometry.type ===
        "MultiPolygon"
    ) {
        geometry.coordinates.forEach(
            (polygon) => {
                polygon.forEach(
                    (ring) => {
                        ring.forEach(
                            (coordinate) => {
                                output.push(
                                    coordinate
                                );
                            }
                        );
                    }
                );
            }
        );
    }
}


const close_panel_button =
    document.getElementById(
        "close-location-panel"
    );

if (close_panel_button) {
    close_panel_button.addEventListener(
        "click",
        closeLocationPanel
    );
}