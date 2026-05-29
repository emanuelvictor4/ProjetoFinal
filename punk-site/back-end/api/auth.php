<?php

$origin = $_SERVER['HTTP_ORIGIN'] ?? 'http://localhost:5173';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

session_start();
require_once "Usuario.php";

$body   = json_decode(file_get_contents("php://input"), true);
$action = $body['action'] ?? '';

$usuario = new Usuario();

switch ($action) {

    case "login":
        $result = $usuario->login($body['login'] ?? '', $body['senha'] ?? '');
        if ($result['success']) {
            $_SESSION['user'] = $result['user'];
        }
        echo json_encode($result);
        break;

    case "register":
        echo json_encode($usuario->criar($body));
        break;

    case "logout":
        session_destroy();
        echo json_encode(['success' => true]);
        break;

    case "session":
        if (isset($_SESSION['user'])) {
            echo json_encode(['success' => true, 'user' => $_SESSION['user']]);
        } else {
            echo json_encode(['success' => false]);
        }
        break;

    default:
        echo json_encode(["success" => false, "message" => "Ação inválida."]);
}
