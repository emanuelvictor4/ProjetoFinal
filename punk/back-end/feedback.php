<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "FeedbackModel.php";

$body   = json_decode(file_get_contents("php://input"), true);
$action = $body['action'] ?? '';

$feedback = new Feedback();

switch ($action) {

    case "list":
        echo json_encode($feedback->listar());
        break;

    case "get":
        echo json_encode($feedback->buscarPorId(intval($body['id'] ?? 0)));
        break;

    case "check":
        echo json_encode($feedback->jaEnviou(intval($body['idusuario'] ?? 0)));
        break;

    case "create":
        echo json_encode($feedback->criar(
            intval($body['idusuario'] ?? 0),
            $body['mensagem'] ?? '',
            intval($body['nota'] ?? 0)
        ));
        break;

    case "update":
        echo json_encode($feedback->atualizar(
            intval($body['id'] ?? 0),
            $body['mensagem'] ?? '',
            intval($body['nota'] ?? 0)
        ));
        break;

    case "delete":
        echo json_encode($feedback->deletar(intval($body['id'] ?? 0)));
        break;

    default:
        echo json_encode(["success" => false, "message" => "Ação inválida."]);
}
