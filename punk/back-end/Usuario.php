<?php
require_once "Database.php";

class Usuario {
    private $conn;

    public function __construct() {
        $this->conn = Database::getInstance()->getConn();
    }

    // CREATE
    public function criar(array $dados): array {
        $nome    = $this->conn->real_escape_string($dados['nome']    ?? '');
        $cpf     = $this->conn->real_escape_string($dados['cpf']     ?? '');
        $celular = $this->conn->real_escape_string($dados['celular'] ?? '');
        $email   = $this->conn->real_escape_string($dados['email']   ?? '');
        $login   = $this->conn->real_escape_string($dados['login']   ?? '');
        $senha   = md5($dados['senha'] ?? '');

        if (!$nome || !$login || !$dados['senha']) {
            return ["success" => false, "message" => "Campos obrigatórios não preenchidos."];
        }

        $check = $this->conn->query("SELECT idusuarios FROM usuarios WHERE login = '$login'");
        if ($check->num_rows > 0) {
            return ["success" => false, "message" => "Este e-mail já está cadastrado."];
        }

        $this->conn->query("
            INSERT INTO usuarios (nome, cpf, celular, email, login, senha)
            VALUES ('$nome', '$cpf', '$celular', '$email', '$login', '$senha')
        ");

        if ($this->conn->affected_rows > 0) {
            return ["success" => true, "message" => "Cadastro realizado com sucesso!"];
        }
        return ["success" => false, "message" => "Erro ao cadastrar."];
    }

    // READ — buscar todos
    public function listar(): array {
        $result = $this->conn->query("
            SELECT idusuarios, nome, cpf, celular, email, login FROM usuarios
            ORDER BY nome ASC
        ");
        $usuarios = [];
        while ($row = $result->fetch_assoc()) $usuarios[] = $row;
        return ["success" => true, "usuarios" => $usuarios];
    }

    // READ — buscar por ID
    public function buscarPorId(int $id): array {
        $result = $this->conn->query("
            SELECT idusuarios, nome, cpf, celular, email, login FROM usuarios
            WHERE idusuarios = $id
        ");
        if ($result->num_rows === 0) {
            return ["success" => false, "message" => "Usuário não encontrado."];
        }
        return ["success" => true, "usuario" => $result->fetch_assoc()];
    }

    // UPDATE
    public function atualizar(int $id, array $dados): array {
        $nome    = $this->conn->real_escape_string($dados['nome']    ?? '');
        $cpf     = $this->conn->real_escape_string($dados['cpf']     ?? '');
        $celular = $this->conn->real_escape_string($dados['celular'] ?? '');
        $email   = $this->conn->real_escape_string($dados['email']   ?? '');

        if (!$nome) {
            return ["success" => false, "message" => "Nome é obrigatório."];
        }

        // Atualiza senha só se vier no payload
        $senhaSQL = "";
        if (!empty($dados['senha'])) {
            $senha    = md5($dados['senha']);
            $senhaSQL = ", senha = '$senha'";
        }

        $this->conn->query("
            UPDATE usuarios
            SET nome = '$nome', cpf = '$cpf', celular = '$celular', email = '$email'$senhaSQL
            WHERE idusuarios = $id
        ");

        if ($this->conn->affected_rows >= 0) {
            return ["success" => true, "message" => "Usuário atualizado."];
        }
        return ["success" => false, "message" => "Erro ao atualizar."];
    }

    // DELETE
    public function deletar(int $id): array {
        $this->conn->query("DELETE FROM usuarios WHERE idusuarios = $id");
        if ($this->conn->affected_rows > 0) {
            return ["success" => true, "message" => "Usuário removido."];
        }
        return ["success" => false, "message" => "Usuário não encontrado."];
    }

    // LOGIN
    public function login(string $login, string $senha): array {
        $login = $this->conn->real_escape_string($login);
        $senha = md5($senha);

        $result = $this->conn->query("
            SELECT idusuarios, nome, email FROM usuarios
            WHERE login = '$login' AND senha = '$senha'
        ");

        if ($result->num_rows > 0) {
            return ["success" => true, "user" => $result->fetch_assoc()];
        }
        return ["success" => false, "message" => "Login ou senha incorretos."];
    }
}
