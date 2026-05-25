<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$client_id     = "0f0b87a76b294e0f8093cd7063f81320";
$client_secret = "aabef1e587934224811949b5ab9d707a";

$response = file_get_contents("https://accounts.spotify.com/api/token", false, stream_context_create([
    "http" => [
        "method"  => "POST",
        "header"  => "Authorization: Basic " . base64_encode("$client_id:$client_secret") . "\r\nContent-Type: application/x-www-form-urlencoded",
        "content" => "grant_type=client_credentials",
    ]
]));

echo $response;

?>