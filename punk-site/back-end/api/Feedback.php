<?php

require_once 'Database.php';

class Feedback {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function listar(): array {
        $stmt = $this->db->query(
            'SELECT id, idusuario, nome, mensagem, nota, criado_em
             FROM feedbacks ORDER BY criado_em DESC'
        );
        return ['success' => true, 'feedbacks' => $stmt->fetchAll(PDO::FETCH_ASSOC)];
    }

    public function criar(int $idusuario, string $nome, string $mensagem, int $nota): array {
        if ($nota < 1 || $nota > 5) {
            return ['success' => false, 'message' => 'Nota deve ser entre 1 e 5.'];
        }
        $stmt = $this->db->prepare(
            'INSERT INTO feedbacks (idusuario, nome, mensagem, nota) VALUES (?, ?, ?, ?)'
        );
        $ok = $stmt->execute([$idusuario, $nome, $mensagem, $nota]);

        if ($ok) {
            return ['success' => true, 'message' => 'Feedback publicado.'];
        }
        return ['success' => false, 'message' => 'Erro ao salvar feedback.'];
    }

    public function atualizar(int $id, int $idusuario, string $mensagem, int $nota): array {
        if ($nota < 1 || $nota > 5) {
            return ['success' => false, 'message' => 'Nota deve ser entre 1 e 5.'];
        }
        $stmt = $this->db->prepare(
            'UPDATE feedbacks SET mensagem = ?, nota = ? WHERE id = ? AND idusuario = ?'
        );
        $stmt->execute([$mensagem, $nota, $id, $idusuario]);

        if ($stmt->rowCount() > 0) {
            return ['success' => true, 'message' => 'Feedback atualizado.'];
        }
        return ['success' => false, 'message' => 'Feedback não encontrado ou sem permissão.'];
    }

    public function deletar(int $id, int $idusuario): array {
        $stmt = $this->db->prepare(
            'DELETE FROM feedbacks WHERE id = ? AND idusuario = ?'
        );
        $stmt->execute([$id, $idusuario]);

        if ($stmt->rowCount() > 0) {
            return ['success' => true, 'message' => 'Feedback removido.'];
        }
        return ['success' => false, 'message' => 'Feedback não encontrado ou sem permissão.'];
    }
}
