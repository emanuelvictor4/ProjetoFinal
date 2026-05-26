<?php
require_once "Database.php";

class Feedback {
    private $conn;

    public function __construct() {
        $this->conn = Database::getInstance()->getConn();
    }

    // CREATE
    public function criar(int $idusuario, string $mensagem, int $nota): array {
        if (!$mensagem) {
            return ["success" => false, "message" => "Mensagem é obrigatória."];
        }
        if ($nota < 1 || $nota > 5) {
            return ["success" => false, "message" => "Nota deve ser entre 1 e 5."];
        }

        $check = $this->conn->query("SELECT id FROM feedbacks WHERE idusuario = $idusuario");
        if ($check->num_rows > 0) {
            return ["success" => false, "message" => "Você já enviou um feedback."];
        }

        $mensagem = $this->conn->real_escape_string($mensagem);
        $this->conn->query("
            INSERT INTO feedbacks (idusuario, mensagem, nota)
            VALUES ($idusuario, '$mensagem', $nota)
        ");

        if ($this->conn->affected_rows > 0) {
            return ["success" => true, "message" => "Feedback enviado!"];
        }
        return ["success" => false, "message" => "Erro ao salvar feedback."];
    }

    // READ — listar todos
    public function listar(): array {
        $result = $this->conn->query("
            SELECT f.id, f.idusuario, f.mensagem, f.nota, f.criado_em, u.nome
            FROM feedbacks f
            JOIN usuarios u ON f.idusuario = u.idusuarios
            ORDER BY f.criado_em DESC
        ");
        $feedbacks = [];
        while ($row = $result->fetch_assoc()) $feedbacks[] = $row;
        return ["success" => true, "feedbacks" => $feedbacks];
    }

    // READ — buscar por ID
    public function buscarPorId(int $id): array {
        $result = $this->conn->query("
            SELECT f.id, f.mensagem, f.nota, f.criado_em, u.nome
            FROM feedbacks f
            JOIN usuarios u ON f.idusuario = u.idusuarios
            WHERE f.id = $id
        ");
        if ($result->num_rows === 0) {
            return ["success" => false, "message" => "Feedback não encontrado."];
        }
        return ["success" => true, "feedback" => $result->fetch_assoc()];
    }

    // UPDATE
    public function atualizar(int $id, string $mensagem, int $nota): array {
        if (!$mensagem) {
            return ["success" => false, "message" => "Mensagem é obrigatória."];
        }
        if ($nota < 1 || $nota > 5) {
            return ["success" => false, "message" => "Nota deve ser entre 1 e 5."];
        }

        $mensagem = $this->conn->real_escape_string($mensagem);
        $this->conn->query("
            UPDATE feedbacks SET mensagem = '$mensagem', nota = $nota
            WHERE id = $id
        ");

        if ($this->conn->affected_rows >= 0) {
            return ["success" => true, "message" => "Feedback atualizado."];
        }
        return ["success" => false, "message" => "Erro ao atualizar."];
    }

    // DELETE
    public function deletar(int $id): array {
        $this->conn->query("DELETE FROM feedbacks WHERE id = $id");
        if ($this->conn->affected_rows > 0) {
            return ["success" => true, "message" => "Feedback removido."];
        }
        return ["success" => false, "message" => "Feedback não encontrado."];
    }

    // Verifica se usuário já enviou feedback
    public function jaEnviou(int $idusuario): array {
        $result = $this->conn->query("SELECT id FROM feedbacks WHERE idusuario = $idusuario");
        return ["success" => true, "jaEnviou" => $result->num_rows > 0];
    }
}
