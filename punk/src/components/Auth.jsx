import { useState } from "react";
import axios from "axios";
import "./Auth.css";

const API = "http://localhost/projetoFinal/punk/back-end/auth.php";

export default function Auth({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [loginForm, setLoginForm] = useState({
    login: "",
    senha: "",
  });

  const [registerForm, setRegisterForm] = useState({
    nome: "",
    cpf: "",
    celular: "",
    email: "",
    login: "",
    senha: "",
    confirmar: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const { data } = await axios.post(API, {
        action: "login",
        ...loginForm,
      });

      if (data.success) {
        onLogin?.(data.user);
      } else {
        setError(data.message);
      }
    } catch {
      setError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);

    if (registerForm.senha !== registerForm.confirmar) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(API, {
        action: "register",
        nome: registerForm.nome,
        cpf: registerForm.cpf,
        celular: registerForm.celular,
        email: registerForm.email,
        login: registerForm.email,
        senha: registerForm.senha,
      });

      if (data.success) {
        setSuccess(data.message);

        setRegisterForm({
          nome: "",
          cpf: "",
          celular: "",
          email: "",
          login: "",
          senha: "",
          confirmar: "",
        });

        setTimeout(() => setTab("login"), 1500);
      } else {
        setError(data.message);
      }
    } catch {
      setError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-container">
      <div className="auth-card">

        <div className="auth-logo">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="#1DB954">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02z"/>
          </svg>

          <h1>Punk Gallery</h1>
        </div>

        <div className="auth-tabs">
          <button
            className={tab === "login" ? "active" : ""}
            onClick={() => setTab("login")}
          >
            Entrar
          </button>

          <button
            className={tab === "register" ? "active" : ""}
            onClick={() => setTab("register")}
          >
            Cadastrar
          </button>
        </div>

        {error && <p className="auth-error">{error}</p>}
        {success && <p className="auth-success">{success}</p>}

        {tab === "login" ? (
          <form className="auth-form" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="E-mail"
              required
              value={loginForm.login}
              onChange={(e) =>
                setLoginForm({
                  ...loginForm,
                  login: e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="Senha"
              required
              value={loginForm.senha}
              onChange={(e) =>
                setLoginForm({
                  ...loginForm,
                  senha: e.target.value,
                })
              }
            />

            <button type="submit" className="auth-submit">
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Nome completo"
              value={registerForm.nome}
              onChange={(e) =>
                setRegisterForm({
                  ...registerForm,
                  nome: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="CPF"
              value={registerForm.cpf}
              onChange={(e) =>
                setRegisterForm({
                  ...registerForm,
                  cpf: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Celular"
              value={registerForm.celular}
              onChange={(e) =>
                setRegisterForm({
                  ...registerForm,
                  celular: e.target.value,
                })
              }
            />

            <input
              type="email"
              placeholder="E-mail"
              value={registerForm.email}
              onChange={(e) =>
                setRegisterForm({
                  ...registerForm,
                  email: e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="Senha"
              value={registerForm.senha}
              onChange={(e) =>
                setRegisterForm({
                  ...registerForm,
                  senha: e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="Confirmar senha"
              value={registerForm.confirmar}
              onChange={(e) =>
                setRegisterForm({
                  ...registerForm,
                  confirmar: e.target.value,
                })
              }
            />

            <button type="submit" className="auth-submit">
              {loading ? "Cadastrando..." : "Criar conta"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}