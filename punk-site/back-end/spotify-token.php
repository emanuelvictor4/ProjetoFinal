<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$client_id     = "0f0b87a76b294e0f8093cd7063f81320";
$client_secret = "aabef1e587934224811949b5ab9d707a";

// Credenciais em Base64 — formato exigido pelo Spotify
$credentials = base64_encode($client_id . ":" . $client_secret);

$post_data = http_build_query(["grant_type" => "client_credentials"]);

$ch = curl_init("https://accounts.spotify.com/api/token");
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $post_data,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_HTTPHEADER     => [
        "Authorization: Basic " . $credentials,
        "Content-Type: application/x-www-form-urlencoded",
        "Content-Length: " . strlen($post_data),
    ],
]);

$response  = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_err  = curl_error($ch);
curl_close($ch);

// Erro de rede/cURL
if ($response === false || !empty($curl_err)) {
    http_response_code(500);
    echo json_encode(["error" => "Erro cURL: " . $curl_err]);
    exit();
}

$data = json_decode($response, true);

// Resposta inesperada do Spotify — repassa o detalhe inteiro pro frontend
if ($http_code !== 200 || empty($data['access_token'])) {
    http_response_code($http_code ?: 500);
    echo json_encode([
        "error"     => "Spotify retornou status " . $http_code,
        "spotify"   => $data,        // ex: {"error":"invalid_client","error_description":"..."}
        "http_code" => $http_code,
    ]);
    exit();
}

echo json_encode([
    "access_token" => $data["access_token"],
    "token_type"   => $data["token_type"],
    "expires_in"   => $data["expires_in"],
]);
