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
const ORION_HIGHLIGHT_LAYER_ID = "orion-district-highlight";

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
                attribution: "&copy; OpenStreetMap contributors",
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

window.orionMap = map;

map.addControl(
    new NavigationControl(),
    "top-right"
);

map.on("load", async () => {
    try {
        const geojson = await getOrionDistricts();

        const sukasari = geojson.features.find(
            feature => feature.properties?.WADMKC === "Sukasari"
            );

            console.log("SUKASARI DATA:", sukasari?.properties);

        map.addSource(GEOJSON_SOURCE_ID, {
            type: "geojson",
            data: geojson,
            buffer: 128,
            tolerance: 0.375,
        });

        map.addSource(NSB_IMAGE_SOURCE_ID, {
            type: "image",
            url: "/data/rasters/orion-nsb-bandung-raya-2024.png",
            coordinates: [
                [107.1788867, -6.6874825],
                [107.9413847, -6.6874825],
                [107.9413847, -7.3124809],
                [107.1788867, -7.3124809],
            ],
        });

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
                    [
                        "coalesce",
                        ["get", "orion_score"],
                        0,
                    ],

                    30,
                    "#07152b",

                    40,
                    "#174a63",

                    45,
                    "#2f7f72",

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

        map.addLayer({
            id: ORION_HIGHLIGHT_LAYER_ID,
            type: "line",
            source: GEOJSON_SOURCE_ID,

            filter: [
                "==",
                ["get", "WADMKC"],
                "",
            ],

            paint: {
                "line-color": "#f0cf7a",
                "line-width": 4,
                "line-opacity": 1,
            },
        });

        initializeLayerControl(map);

        map.on(
            "click",
            ORION_FILL_LAYER_ID,
            (event) => {
                const feature = event.features?.[0];

                console.log("FEATURE DIKLIK:", feature);

                console.log("PROPERTIES:", feature?.properties);

                console.log("FEATURE DIKLIK:", feature);

                if (!feature) {
                    return;
                }

                const popup = createLocationPopup(
                    event,
                    feature.properties
                );

                console.log("MEMBUAT POPUP:", popup);

                popup.addTo(map);

                console.log("POPUP BERHASIL DITAMBAHKAN");

                setupPopupDetailButton(
                    popup,
                    feature.properties
                );

                highlightDistrict(
                    map,
                    feature.properties?.WADMKC
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

        initializeLocationPanelClose();

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
        const detailButton =
            document.querySelector(
                '[data-action="view-detail"]'
            );

        if (!detailButton) {
            return;
        }

        detailButton.addEventListener(
            "click",
            () => {
                openLocationPanel(properties);

                popup.remove();
            }
        );
    });
}

function openLocationPanel(properties) {
    const locationPanel =
        document.getElementById(
            "location-panel"
        );

    const locationName =
        document.getElementById(
            "location-name"
        );

    const locationRegency =
        document.getElementById(
            "location-regency"
        );

    const orionScore =
        document.getElementById(
            "orion-score"
        );

    const nsbScore =
        document.getElementById(
            "nsb-score"
        );

    const cloudScore =
        document.getElementById(
            "cloud-score"
        );

    const accessScore =
        document.getElementById(
            "access-score"
        );

    if (!locationPanel) {
        return;
    }

    if (locationName) {
        locationName.textContent =
            properties.WADMKC ??
            "Tidak diketahui";
    }

    if (locationRegency) {
        locationRegency.textContent =
            properties.WADMKK ??
            "Tidak diketahui";
    }

    if (orionScore) {
        orionScore.textContent =
            formatScore(
                properties.orion_score
            );
    }

    if (nsbScore) {
        nsbScore.textContent =
            formatMetric(
                properties.nsb_nsb_score
            );
    }

    if (cloudScore) {
        cloudScore.textContent =
            formatMetric(
                properties.cloud_cloud_score
            );
    }

    if (accessScore) {
        accessScore.textContent =
            formatMetric(
                properties.access_score
            );
    }

    locationPanel.hidden = false;
}

function initializeLocationPanelClose() {
    const closePanelButton =
        document.getElementById(
            "close-location-panel"
        );

    if (!closePanelButton) {
        return;
    }

    closePanelButton.addEventListener(
        "click",
        () => {
            closeLocationPanel();
        }
    );
}

function closeLocationPanel() {
    const locationPanel =
        document.getElementById(
            "location-panel"
        );

    if (!locationPanel) {
        return;
    }

    locationPanel.hidden = true;

    clearDistrictHighlight(map);
}

function initializeLocationSearch(
    mapInstance,
    geojson
) {
    const searchInput =
        document.getElementById(
            "location-search"
        );

    const suggestionsContainer =
        document.getElementById(
            "location-suggestions"
        );

    if (
        !searchInput ||
        !suggestionsContainer
    ) {
        return;
    }

    const districts = [
        ...new Set(
            geojson.features
                .map(
                    (feature) =>
                        feature.properties?.WADMKC
                )
                .filter(Boolean)
        ),
    ].sort(
        (firstName, secondName) =>
            firstName.localeCompare(
                secondName,
                "id"
            )
    );

    function renderSuggestions(
        query = ""
    ) {
        const normalizedQuery =
            query
                .trim()
                .toLowerCase();

        const filteredDistricts =
            districts.filter(
                (districtName) =>
                    districtName
                        .toLowerCase()
                        .includes(
                            normalizedQuery
                        )
            );

        suggestionsContainer.innerHTML = "";

        if (
            filteredDistricts.length === 0
        ) {
            suggestionsContainer.hidden = true;
            return;
        }

        filteredDistricts.forEach(
            (districtName) => {
                const suggestion =
                    document.createElement(
                        "button"
                    );

                suggestion.type = "button";

                suggestion.classList.add(
                    "location-suggestion"
                );

                suggestion.textContent =
                    districtName;

                suggestion.addEventListener(
                    "click",
                    () => {
                        selectDistrict(
                            districtName
                        );
                    }
                );

                suggestionsContainer.appendChild(
                    suggestion
                );
            }
        );

        suggestionsContainer.hidden = false;
    }

    function selectDistrict(
        districtName
    ) {
        const feature =
            geojson.features.find(
                (item) =>
                    item.properties
                        ?.WADMKC ===
                    districtName
            );

        if (!feature) {
            return;
        }

        searchInput.value =
            districtName;

        suggestionsContainer.hidden = true;

        highlightDistrict(
            mapInstance,
            districtName
        );

        const coordinates =
            getFeatureCenter(
                feature
            );

        mapInstance.flyTo({
            center: coordinates,
            zoom: 12,
            essential: true,
        });
    }

    searchInput.addEventListener(
        "focus",
        () => {
            renderSuggestions(
                searchInput.value
            );
        }
    );

    searchInput.addEventListener(
        "input",
        () => {
            renderSuggestions(
                searchInput.value
            );
        }
    );

    document.addEventListener(
        "click",
        (event) => {
            const searchContainer =
                document.querySelector(
                    ".map-search"
                );

            if (
                searchContainer &&
                !searchContainer.contains(
                    event.target
                )
            ) {
                suggestionsContainer.hidden =
                    true;
            }
        }
    );
}

function highlightDistrict(
    mapInstance,
    districtName
) {
    if (
        !mapInstance.getLayer(
            ORION_HIGHLIGHT_LAYER_ID
        )
    ) {
        return;
    }

    if (!districtName) {
        clearDistrictHighlight(
            mapInstance
        );

        return;
    }

    mapInstance.setFilter(
        ORION_HIGHLIGHT_LAYER_ID,
        [
            "==",
            ["get", "WADMKC"],
            districtName,
        ]
    );
}

function clearDistrictHighlight(
    mapInstance
) {
    if (
        !mapInstance.getLayer(
            ORION_HIGHLIGHT_LAYER_ID
        )
    ) {
        return;
    }

    mapInstance.setFilter(
        ORION_HIGHLIGHT_LAYER_ID,
        [
            "==",
            ["get", "WADMKC"],
            "",
        ]
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
        !geometry ||
        !geometry.type
    ) {
        return;
    }

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

function formatScore(value) {
    const numericValue =
        Number(value);

    if (
        !Number.isFinite(
            numericValue
        )
    ) {
        return "-";
    }

    return numericValue.toFixed(2);
}

function formatMetric(value) {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "-";
    }

    return String(value);
}