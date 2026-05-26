import { useState } from "react";
import axios from "axios";

const API = "http://localhost/projetoFinal/punk/back-end/auth.php";

export default function Auth({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [loginForm, setLoginForm] = useState({ login: "", senha: "" });
  const [registerForm, setRegisterForm] = useState({
    nome: "", cpf: "", celular: "", email: "", login: "", senha: "", confirmar: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const { data } = await axios.post(API, { action: "login", ...loginForm });
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
        nome:    registerForm.nome,
        cpf:     registerForm.cpf,
        celular: registerForm.celular,
        email:   registerForm.email,
        login:   registerForm.email, // login = email
        senha:   registerForm.senha,
      });
      if (data.success) {
        setSuccess(data.message);
        setRegisterForm({ nome: "", cpf: "", celular: "", email: "", login: "", senha: "", confirmar: "" });
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

  const inputClass = "w-full bg-[#1a1a1a] text-white text-sm px-4 py-3 rounded-lg placeholder-[#555] focus:outline-none focus:ring-1 focus:ring-[#1DB954]";

  return (
    <section className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="#1DB954">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          <h1 className="text-white text-xl font-bold mt-3 tracking-tight">Punk Gallery</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#1a1a1a] rounded-lg p-1 mb-6">
          {["login", "register"].map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(null); setSuccess(null); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                tab === t ? "bg-white text-black" : "text-[#aaa] hover:text-white"
              }`}
            >
              {t === "login" ? "Entrar" : "Cadastrar"}
            </button>
          ))}
        </div>

        {/* Feedback */}
        {error   && <p className="text-red-400 text-xs mb-4 text-center">{error}</p>}
        {success && <p className="text-[#1DB954] text-xs mb-4 text-center">{success}</p>}

        {/* Login */}
        {tab === "login" && (
          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="E-mail"
              required
              value={loginForm.login}
              onChange={e => setLoginForm({ ...loginForm, login: e.target.value })}
              className={inputClass}
            />
            <input
              type="password"
              placeholder="Senha"
              required
              value={loginForm.senha}
              onChange={e => setLoginForm({ ...loginForm, senha: e.target.value })}
              className={inputClass}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1DB954] hover:bg-[#1ed760] disabled:opacity-50 text-black font-semibold text-sm py-3 rounded-lg transition-colors mt-1"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        )}

        {/* Cadastro */}
        {tab === "register" && (
          <form onSubmit={handleRegister} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Nome completo"
              required
              value={registerForm.nome}
              onChange={e => setRegisterForm({ ...registerForm, nome: e.target.value })}
              className={inputClass}
            />
            <input
              type="text"
              placeholder="CPF (somente números)"
              maxLength={11}
              value={registerForm.cpf}
              onChange={e => setRegisterForm({ ...registerForm, cpf: e.target.value })}
              className={inputClass}
            />
            <input
              type="text"
              placeholder="Celular"
              value={registerForm.celular}
              onChange={e => setRegisterForm({ ...registerForm, celular: e.target.value })}
              className={inputClass}
            />
            <input
              type="email"
              placeholder="E-mail"
              required
              value={registerForm.email}
              onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })}
              className={inputClass}
            />
            <input
              type="password"
              placeholder="Senha"
              required
              value={registerForm.senha}
              onChange={e => setRegisterForm({ ...registerForm, senha: e.target.value })}
              className={inputClass}
            />
            <input
              type="password"
              placeholder="Confirmar senha"
              required
              value={registerForm.confirmar}
              onChange={e => setRegisterForm({ ...registerForm, confirmar: e.target.value })}
              className={inputClass}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1DB954] hover:bg-[#1ed760] disabled:opacity-50 text-black font-semibold text-sm py-3 rounded-lg transition-colors mt-1"
            >
              {loading ? "Cadastrando..." : "Criar conta"}
            </button>
          </form>
        )}

        <p className="text-[#333] text-xs text-center mt-8">
          Punk Gallery © {new Date().getFullYear()}
        </p>
      </div>
    </section>
  );
}
