// ===============================
// INISIALISASI MAP
// ===============================
const map = L.map("map").setView([5.05, 97.32], 9);

// OpenStreetMap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

// Geoserver WMS Batas Kecamatan
L.tileLayer.wms("http://localhost:8080/geoserver/respgweb/wms", {
  layers: "respgweb:BatasKecAceh",
  format: "image/png",
  transparent: true,
  version: "1.1.0",
  attribution: "GeoServer"
}).addTo(map);

// Marker Cluster
const markers = L.markerClusterGroup();

// ===============================
// ICON DEFAULT (Leaflet)
function getIcon(jumlah){
  return L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    shadowSize: [41, 41]
  });
}

// ===============================
// LOAD DATA POSKO
// ===============================
function loadPosko(){
  fetch("get_posko.php")
    .then(res => res.json())
    .then(data => {
      const tableBody = document.getElementById("poskoTable");
      tableBody.innerHTML = "";
      markers.clearLayers();

      data.forEach((posko, idx) => {
        // Tabel
        tableBody.innerHTML += `
          <tr>
            <td>${idx + 1}</td>
            <td>${posko.kecamatan}</td>
            <td>${posko.jumlah_posko}</td>
            <td>${posko.latitude}</td>
            <td>${posko.longitude}</td>
          </tr>
        `;

        // Marker
        const marker = L.marker([parseFloat(posko.latitude), parseFloat(posko.longitude)], {
          icon: getIcon(posko.jumlah_posko)
        });

        marker.bindPopup(`
          <strong>${posko.kecamatan}</strong><br>
          Jumlah Posko: ${posko.jumlah_posko}<br>
          Koordinat: ${posko.latitude}, ${posko.longitude}
        `);

        marker.on("click", () => {
          document.getElementById("infoPanel").innerHTML = `
            <strong>${posko.kecamatan}</strong><br>
            Jumlah Posko: ${posko.jumlah_posko}<br>
            Koordinat: ${posko.latitude}, ${posko.longitude}
          `;
        });

        markers.addLayer(marker);
      });

      map.addLayer(markers);
    })
    .catch(err => console.error("Gagal load posko:", err));
}

loadPosko();

// ===============================
// FORM TAMBAH POSKO
// ===============================
document.getElementById("formPosko").addEventListener("submit", function(e){
  e.preventDefault();
  const formData = new FormData(this);

  fetch("form_posko.php", { method: "POST", body: formData })
    .then(res => res.text())
    .then(msg => {
      document.getElementById("formMessage").innerHTML = msg;
      this.reset();
      loadPosko();
    })
    .catch(err => console.error(err));
});