<?php
header('Content-Type: application/json');
include "koneksi.php";

$sql = "SELECT * FROM posko";
$result = $conn->query($sql);

$data = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}
echo json_encode($data);
$conn->close();
?>
