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

        map.addSource(NSB_IMAGE_SOURCE_ID, {

            type: "image",
            url: "/data/rasters/orion-nsb-bandung-raya-2024.png",
            
            coordinates: [
            
            [107.1788867, -6.6874825],
            
            [107.9413847, -6.6874825],
            
            [107.9413847, -7.3124809],
            
            [107.1788867, -7.3124809]
            
            ]
            
            });


            map.addLayer({

                id: NSB_RASTER_LAYER_ID,
                
                type: "raster",
                
                source: NSB_IMAGE_SOURCE_ID,
                
                paint: {
                
                "raster-opacity": 0.6
                
                }
                
                });


        map.on(
            "click", ORION_FILL_LAYER_ID,
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
        }
    );


        map.on(
            "mouseenter",
            ORION_FILL_LAYER_ID, () => {
            map.getCanvas().style.cursor = "pointer";
        }
    );


        map.on(
            "mouseleave",
            ORION_FILL_LAYER_ID, () => {
            map.getCanvas().style.cursor = "";
        }
    );

        initializeLayerControl(map);

        initializeLocationSearch(
            map,
            geojson
        );

    } catch (error) {
        console.error(
            "Gagal menginisialisasi data ORION:",
            error
        );
    }
});

function initializeLocationSearch(
    map,
    geojson
) {
    const searchInput =
        document.getElementById(
            "location-search"
        );

    if (!searchInput) {
        return;
    }

    searchInput.addEventListener(
        "change",
        () => {
            const query =
                searchInput.value
                    .trim()
                    .toLowerCase();

            if (!query) {
                return;
            }

            const feature =
                geojson.features.find(
                    (item) => {
                        const districtName =
                            String(
                                item.properties
                                    ?.WADMKC ?? ""
                            ).toLowerCase();

                        const regencyName =
                            String(
                                item.properties
                                    ?.WADMKK ?? ""
                            ).toLowerCase();

                        return (
                            districtName.includes(query) ||
                            regencyName.includes(query)
                        );
                    }
                );


            if (!feature) {
                return;
            }


            const coordinates =
                getFeatureCenter(feature);

            map.flyTo({
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


    let minLongitude = Infinity;
    let maxLongitude = -Infinity;

    let minLatitude = Infinity;
    let maxLatitude = -Infinity;


    coordinates.forEach(
        ([longitude, latitude]) => {
            minLongitude =
                Math.min(
                    minLongitude,
                    longitude
                );

            maxLongitude =
                Math.max(
                    maxLongitude,
                    longitude
                );

            minLatitude =
                Math.min(
                    minLatitude,
                    latitude
                );

            maxLatitude =
                Math.max(
                    maxLatitude,
                    latitude
                );
        }
    );


    return [
        (minLongitude + maxLongitude) / 2,
        (minLatitude + maxLatitude) / 2,
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
