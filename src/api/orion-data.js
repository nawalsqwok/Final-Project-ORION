const GEOJSON_PATH = "/data/geojson/orion_bandung_raya.geojson";

export async function getOrionDistricts() {
    const response = await fetch(GEOJSON_PATH);

    if (!response.ok) {
        throw new Error(
            `Gagal memuat data ORION: ${response.status}`
        );
    }

    return response.json();
}