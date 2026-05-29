<?php

require_once 'Database.php';

class Usuario {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function login(string $login, string $senha): array {
        $stmt = $this->db->prepare(
            'SELECT idusuarios, nome, email, login FROM usuarios WHERE login = ? AND senha = MD5(?)'
        );
        $stmt->execute([$login, $senha]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            return ['success' => true, 'user' => $user];
        }
        return ['success' => false, 'message' => 'Login ou senha inválidos.'];
    }

    public function criar(array $dados): array {
        $check = $this->db->prepare('SELECT idusuarios FROM usuarios WHERE login = ?');
        $check->execute([$dados['email']]);
        if ($check->fetch()) {
            return ['success' => false, 'message' => 'E-mail já cadastrado.'];
        }

        $stmt = $this->db->prepare(
            'INSERT INTO usuarios (cpf, nome, celular, email, login, senha)
             VALUES (?, ?, ?, ?, ?, MD5(?))'
        );
        $ok = $stmt->execute([
            $dados['cpf']     ?? null,
            $dados['nome']    ?? '',
            $dados['celular'] ?? null,
            $dados['email']   ?? '',
            $dados['email']   ?? '',
            $dados['senha']   ?? '',
        ]);

        if ($ok) {
            return ['success' => true, 'message' => 'Cadastro realizado com sucesso!'];
        }
        return ['success' => false, 'message' => 'Erro ao cadastrar usuário.'];
    }

    public function listar(): array {
        $stmt = $this->db->query(
            'SELECT idusuarios, nome, email, login, celular, cpf FROM usuarios ORDER BY nome'
        );
        return ['success' => true, 'users' => $stmt->fetchAll(PDO::FETCH_ASSOC)];
    }

    public function buscarPorId(int $id): array {
        $stmt = $this->db->prepare(
            'SELECT idusuarios, nome, email, login, celular, cpf FROM usuarios WHERE idusuarios = ?'
        );
        $stmt->execute([$id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            return ['success' => true, 'user' => $user];
        }
        return ['success' => false, 'message' => 'Usuário não encontrado.'];
    }

    public function atualizar(int $id, array $dados): array {
        $stmt = $this->db->prepare(
            'UPDATE usuarios SET nome = ?, celular = ? WHERE idusuarios = ?'
        );
        $ok = $stmt->execute([$dados['nome'] ?? '', $dados['celular'] ?? '', $id]);

        if ($ok) {
            return ['success' => true, 'message' => 'Usuário atualizado.'];
        }
        return ['success' => false, 'message' => 'Erro ao atualizar.'];
    }

    public function deletar(int $id): array {
        $stmt = $this->db->prepare('DELETE FROM usuarios WHERE idusuarios = ?');
        $ok = $stmt->execute([$id]);

        if ($ok) {
            return ['success' => true, 'message' => 'Usuário removido.'];
        }
        return ['success' => false, 'message' => 'Erro ao remover.'];
    }
}
