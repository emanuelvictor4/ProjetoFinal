<?php

$origin = $_SERVER['HTTP_ORIGIN'] ?? 'http://localhost:5173';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

session_start();
require_once "Feedback.php";

$body   = json_decode(file_get_contents("php://input"), true);
$action = $body['action'] ?? '';

$feedback = new Feedback();

// listar é público
if ($action === 'list') {
    echo json_encode($feedback->listar());
    exit;
}

// demais ações exigem login
if (!isset($_SESSION['user'])) {
    echo json_encode(['success' => false, 'message' => 'Você precisa estar logado.']);
    exit;
}

$user = $_SESSION['user'];

switch ($action) {

    case "create":
        echo json_encode($feedback->criar(
            (int) $user['idusuarios'],
            $user['nome'],
            $body['mensagem'] ?? '',
            (int) ($body['nota'] ?? 5)
        ));
        break;

    case "update":
        echo json_encode($feedback->atualizar(
            (int) ($body['id']      ?? 0),
            (int) $user['idusuarios'],
            $body['mensagem'] ?? '',
            (int) ($body['nota']    ?? 5)
        ));
        break;

    case "delete":
        echo json_encode($feedback->deletar(
            (int) ($body['id'] ?? 0),
            (int) $user['idusuarios']
        ));
        break;

    default:
        echo json_encode(["success" => false, "message" => "Ação inválida."]);
}
