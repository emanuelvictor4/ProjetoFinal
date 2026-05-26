<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$type  = $_GET['type'];
$ids   = $_GET['ids'];
$token = $_GET['token'];

$url = "https://api.spotify.com/v1/{$type}?ids={$ids}";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer {$token}"
]);

$response = curl_exec($ch);
curl_close($ch);

echo $response;