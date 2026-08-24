const LAYER_CONFIG = [
    {
        inputId: "orion-score-layer",
        layerIds: [
            "orion-district-fill",
            "orion-district-line",
        ],
        legendId: "orion-legend"
    },
    {
        inputId: "nsb-layer",
        layerIds: [
            "nsb-raster",
        ],
        legendId: "nsb-legend",
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

        input.addEventListener(
            "change", () => {
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

            updateLegend(
                config.inputId,
                input.checked
            );
        }
    );
});
}

function updateLegend(
    inputId,
    isChecked
) {
    const orionLegend =
        document.getElementById(
            "orion-legend"
        );

    const nsbLegend =
        document.getElementById(
            "nsb-legend"
        );

    if (!orionLegend || !nsbLegend) {
        return;
    }

    if (
        inputId === "nsb-layer" &&
        isChecked
    ) {
        orionLegend.hidden = true;
        nsbLegend.hidden = false;

        return;
    }

    if (
        inputId === "nsb-layer" &&
        !isChecked
    ) {
        orionLegend.hidden = false;
        nsbLegend.hidden = true;
    }
}