<?php
class Database {
    private static $instance = null;
    private $conn;

    private $host   = "localhost";
    private $db     = "unisale";
    private $user   = "root";
    private $pass   = "";

    private function __construct() {
        $this->conn = new mysqli($this->host, $this->user, $this->pass, $this->db);
        $this->conn->set_charset("utf8");

        if ($this->conn->connect_error) {
            die(json_encode(["success" => false, "message" => "Erro de conexão: " . $this->conn->connect_error]));
        }
    }

    // Singleton — uma única conexão reutilizada
    public static function getInstance(): Database {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }

    public function getConn(): mysqli {
        return $this->conn;
    }
}
