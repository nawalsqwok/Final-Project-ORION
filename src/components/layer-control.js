const LAYER_CONFIG = [
    {
        inputId: "orion-score-layer",
        layerIds: [
            "orion-district-fill",
            "orion-district-line",
        ],
    },
    {
        inputId: "nsb-layer",
        layerIds: [
            "nsb-placeholder",
        ],
    },
    {
        inputId: "cloud-layer",
        layerIds: [
            "cloud-placeholder",
        ],
    },
    {
        inputId: "accessibility-layer",
        layerIds: [
            "accessibility-placeholder",
        ],
    },
    {
        inputId: "tourism-layer",
        layerIds: [
            "tourism-placeholder",
        ],
    },
];

export function initializeLayerControl(map) {
    LAYER_CONFIG.forEach((config) => {
        const input = document.getElementById(config.inputId);

        if (!input) {
            return;
        }

        input.addEventListener("change", () => {
            const visibility = input.checked ? "visible" : "none";

            config.layerIds.forEach((layerId) => {
                if (!map.getLayer(layerId)) {
                    return;
                }

                map.setLayoutProperty(
                    layerId,
                    "visibility",
                    visibility
                );
            });
        });
    });
}