<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "Usuario.php";

$body   = json_decode(file_get_contents("php://input"), true);
$action = $body['action'] ?? '';

$usuario = new Usuario();

switch ($action) {

    case "login":
        echo json_encode($usuario->login($body['login'] ?? '', $body['senha'] ?? ''));
        break;

    case "register":
        echo json_encode($usuario->criar($body));
        break;

    case "list":
        echo json_encode($usuario->listar());
        break;

    case "get":
        echo json_encode($usuario->buscarPorId(intval($body['id'] ?? 0)));
        break;

    case "update":
        echo json_encode($usuario->atualizar(intval($body['id'] ?? 0), $body));
        break;

    case "delete":
        echo json_encode($usuario->deletar(intval($body['id'] ?? 0)));
        break;

    default:
        echo json_encode(["success" => false, "message" => "Ação inválida."]);
}
