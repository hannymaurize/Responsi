<?php
include 'koneksi.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $kecamatan = $_POST['kecamatan'];
    $jumlah_posko = $_POST['jumlah_posko'];
    $lat = $_POST['lat'];
    $lng = $_POST['lng'];

    $stmt = $conn->prepare("INSERT INTO posko (kecamatan, jumlah_posko, latitude, longitude) VALUES (?,?,?,?)");
    $stmt->bind_param("ssdd", $nama, $lokasi, $lat, $lng);

    if ($stmt->execute()) echo "success";
    else echo "error: " . $stmt->error;

    $stmt->close();
    $conn->close();
}
?>
