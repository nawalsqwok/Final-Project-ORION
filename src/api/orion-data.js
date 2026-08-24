const GEOJSON_PATH = "public/data/geojson/orion_bandung_raya.geojson";

export async function getOrionDistricts() {
    const response = await fetch(GEOJSON_PATH);

    if (!response.ok) {
        throw new Error(
            `Gagal memuat data ORION: ${response.status}`
        );
    }

    return response.json();
}