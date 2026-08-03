 // Konten Langit Malam
const tombolLangitMalam = document.querySelector("#langit-malam");

tombolLangitMalam.addEventListener("click", menampilkan_konten_langit_malam);

function menampilkan_konten_langit_malam() {
    const konten_pertama = document.querySelector(".konten-langit-malam");

    const paragrafBaru_langit_malam = document.createElement("p");
        paragrafBaru_langit_malam.innerHTML = "→ Langit malam yang berkualitas memiliki tingkat polusi cahaya rendah sehingga objek astronomi terlihat lebih jelas.";
        paragrafBaru_langit_malam.style.color = "white";
        paragrafBaru_langit_malam.style.padding = "20px";
        paragrafBaru_langit_malam.style.margin = "0px";
        paragrafBaru_langit_malam.style.backgroundColor = "background-color:  rgb(40, 31, 123);";

    konten_pertama.appendChild(paragrafBaru_langit_malam);
    console.log("Konten langit malam berhasil dipanggil");
}

// Konten Aksesibilitas
const tombolAksesibilitas = document.querySelector("#aksesibilitas");

tombolAksesibilitas.addEventListener("click", menampilkan_konten_aksesibilitas);

function menampilkan_konten_aksesibilitas() {
    const konten_kedua = document.querySelector(".konten-aksesibilitas");

    const paragrafBaru_aksesibilitas = document.createElement("p");
        paragrafBaru_aksesibilitas.innerHTML = "→ Aksesibilitas sebagai dasar keterjangkauannya area atau lokasi wisata langit malam";
        paragrafBaru_aksesibilitas.style.color = "white";
        paragrafBaru_aksesibilitas.style.padding = "20px";
        paragrafBaru_aksesibilitas.style.margin = "0px";
        paragrafBaru_aksesibilitas.style.backgroundColor = "background-color:  rgb(40, 31, 123);";

    konten_kedua.appendChild(paragrafBaru_aksesibilitas);
    console.log("Konten aksesibilitas berhasil dipanggil");
}

// Konten Skor-Orion
const tombolSkor = document.querySelector("#skor-orion");

tombolSkor.addEventListener("click", menampilkan_konten_skor_orion);

function menampilkan_konten_skor_orion() {
    const konten_ketiga = document.querySelector(".konten-skor-orion");

    const paragrafBaru_skor_orion = document.createElement("p");
        paragrafBaru_skor_orion.innerHTML = "→ Skor ORION merupakan hasil kombinasi kualitas langit malam, aksesibilitas, dan faktor pendukung lainnya.";
        paragrafBaru_skor_orion.style.color = "white";
        paragrafBaru_skor_orion.style.padding = "20px";
        paragrafBaru_skor_orion.style.margin = "0px";
        paragrafBaru_skor_orion.style.backgroundColor = "background-color:  rgb(40, 31, 123);";

    konten_ketiga.appendChild(paragrafBaru_skor_orion);
    console.log("Konten skor orion berhasil dipanggil");
}

    // -------- FETCH API -----------

const url = "https://geoserver.mapid.io/layers_new/get_layer?api_key=974a5e4528be40a0ab5580ecdc4c0ffb&layer_id=6a4a63953b4813529f28b80e&project_id=6a4a633e3b4813529f28a868"
// CARA LAMA
// fetch(url)
// .then(function(Response) { 
//     return Response.json();}) //menangkap dan menampilkan data dalam bentuk JSON
// .then(function(data) { 
//     console.log(data); }); // Data akan muncul

// Cara yang lebih enak dibaca (async/await)

async function mengambil_data() {
    const Response = await fetch(url);
    const data = await Response.json();
    console.log(data);
}

mengambil_data();

const tombol_lokasi_wisata = document.querySelector(".lokasi-wisata");
tombol_lokasi_wisata.addEventListener("click", menampilkan_data);

async function menampilkan_data() {
    const Response = await fetch(url);
    const data = await Response.json();

    const hasil_api = document.querySelector(".hasil-api");

    data.features.forEach((item, index) => {
        const p = item.properties;
        hasil_api.innerHTML += `
            <div class="card">
                <h3>${index + 1}. ${p.NAMA}</h3>
                <p>${p.ALAMAT}</p>
            </div>
        `;
    });

    console.log("Infromasi lokasi wisata berhasil ditampilkan");
}