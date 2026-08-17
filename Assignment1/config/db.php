<?php
$host = '127.0.0.1';
$user = 'root';
$pass = '';
$dbname = 'powerpay_db';
// Common local MySQL port. Change if your MySQL uses a different port.
$port = '3306';

$conn = new mysqli($host, $user, $pass, $dbname, $port);

if ($conn->connect_error) {
    die("Database Connection Failed: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");
?>
