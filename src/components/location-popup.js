import { Popup } from "maplibre-gl";

export function createLocationPopup(event, properties) {
    const districtName =
        properties.WADMKC ?? "Tidak diketahui";

    const regencyName =
        properties.WADMKK ?? "Tidak diketahui";

    const orionScore =
        Number(properties.orion_score ?? 0).toFixed(2);

    const nsbScore =
        properties.nsb_nsb_score ?? "-";

    const cloudScore =
        properties.cloud_cloud_score ?? "-";

    const accessScore =
        properties.access_score ?? "-";

    const popup = new Popup({
        closeButton: true,
        closeOnClick: true,
        maxWidth: "320px",
    });

    popup
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
                    <strong>${orionScore}</strong>
                </div>

                <div class="popup-metrics">

                    <div class="popup-metric">
                        <span>NSB</span>
                        <strong>${nsbScore}</strong>
                    </div>

                    <div class="popup-metric">
                        <span>Cloud</span>
                        <strong>${cloudScore}</strong>
                    </div>

                    <div class="popup-metric">
                        <span>Access</span>
                        <strong>${accessScore}</strong>
                    </div>

                </div>

                <button
                    type="button"
                    class="popup-detail-button"
                    data-action="view-detail"
                >
                    Lihat Detail
                </button>

            </div>
        `);

    return popup;
}