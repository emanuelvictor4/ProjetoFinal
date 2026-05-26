import { useState, useEffect } from "react";
import axios from "axios";

import "./Feedback.css";
import StarRating from "./StarRating";

const API = "http://localhost/projetoFinal/punk/back-end/feedback.php";

export default function Feedback({ user, onLogout }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [jaEnviou, setJaEnviou] = useState(false);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [mensagem, setMensagem] = useState("");
  const [nota, setNota] = useState(0);

  const [editando, setEditando] = useState(null);
  const [editMensagem, setEditMensagem] = useState("");
  const [editNota, setEditNota] = useState(0);

  const [visualizando, setVisualizando] = useState(null);

  const loadFeedbacks = async () => {
    setLoading(true);

    try {
      const { data } = await axios.post(API, {
        action: "list",
      });

      if (data.success) {
        setFeedbacks(data.feedbacks);
      }
    } finally {
      setLoading(false);
    }
  };

  const checkJaEnviou = async () => {
    const { data } = await axios.post(API, {
      action: "check",
      idusuario: user.idusuarios,
    });

    if (data.success) {
      setJaEnviou(data.jaEnviou);
    }
  };

  useEffect(() => {
    loadFeedbacks();
    checkJaEnviou();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);

    if (!nota) {
      setError("Selecione uma nota.");
      return;
    }

    if (!mensagem.trim()) {
      setError("Escreva uma mensagem.");
      return;
    }

    setSubmitting(true);

    try {
      const { data } = await axios.post(API, {
        action: "create",
        idusuario: user.idusuarios,
        mensagem,
        nota,
      });

      if (data.success) {
        setSuccess("Feedback enviado!");
        setMensagem("");
        setNota(0);
        setJaEnviou(true);

        loadFeedbacks();

        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        setError(data.message);
      }
    } catch {
      setError("Erro ao enviar feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  const abrirEdicao = (fb) => {
    setEditando(fb);
    setEditMensagem(fb.mensagem);
    setEditNota(Number(fb.nota));
  };

  const handleEditar = async (e) => {
    e.preventDefault();

    setSubmitting(true);

    try {
      const { data } = await axios.post(API, {
        action: "update",
        id: editando.id,
        mensagem: editMensagem,
        nota: editNota,
      });

      if (data.success) {
        setEditando(null);
        loadFeedbacks();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletar = async (id) => {
    if (!window.confirm("Deseja remover este feedback?")) {
      return;
    }

    try {
      const { data } = await axios.post(API, {
        action: "delete",
        id,
      });

      if (data.success) {
        setVisualizando(null);
        setJaEnviou(false);
        loadFeedbacks();
      }
    } catch {
      alert("Erro ao excluir.");
    }
  };

  const formatDate = (data) =>
    new Date(data).toLocaleDateString("pt-BR");

  const meuFeedback = feedbacks.find(
    (fb) =>
      String(fb.idusuario) === String(user.idusuarios)
  );

  return (
    <section className="feedback-page">

      <header className="feedback-header">
        <div>
          <h1>Feedbacks</h1>
          <p>Olá, {user.nome}</p>
        </div>

        <button
          className="logout-btn"
          onClick={onLogout}
        >
          Sair
        </button>
      </header>

      <div className="feedback-container">

        {visualizando && (
          <div
            className="modal-overlay"
            onClick={() => setVisualizando(null)}
          >
            <div
              className="modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>{visualizando.nome}</h3>

              <StarRating
                value={Number(visualizando.nota)}
                readonly
              />

              <p className="feedback-card-message">
                {visualizando.mensagem}
              </p>

              <div className="modal-buttons">
                <button
                  className="cancel-btn"
                  onClick={() => setVisualizando(null)}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

        {editando && (
          <div
            className="modal-overlay"
            onClick={() => setEditando(null)}
          >
            <div
              className="modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Editar feedback</h3>

              <form onSubmit={handleEditar}>

                <StarRating
                  value={editNota}
                  onChange={setEditNota}
                />

                <textarea
                  value={editMensagem}
                  onChange={(e) =>
                    setEditMensagem(e.target.value)
                  }
                />

                <div className="modal-buttons">
                  <button
                    type="submit"
                    className="save-btn"
                  >
                    {submitting
                      ? "Salvando..."
                      : "Salvar"}
                  </button>

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setEditando(null)}
                  >
                    Cancelar
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {!jaEnviou ? (
          <div className="feedback-form">

            <h2>Deixe seu feedback</h2>

            <form onSubmit={handleSubmit}>

              <StarRating
                value={nota}
                onChange={setNota}
              />

              <textarea
                placeholder="Escreva sua mensagem..."
                value={mensagem}
                onChange={(e) =>
                  setMensagem(e.target.value)
                }
              />

              {error && (
                <p className="error-msg">
                  {error}
                </p>
              )}

              {success && (
                <p className="success-msg">
                  {success}
                </p>
              )}

              <button
                className="submit-btn"
                type="submit"
              >
                {submitting
                  ? "Enviando..."
                  : "Enviar"}
              </button>

            </form>

          </div>
        ) : (
          <div className="feedback-info">

            ✓ Você já enviou um feedback.

            {meuFeedback && (
              <div className="feedback-actions">

                <button
                  className="edit-btn"
                  onClick={() =>
                    abrirEdicao(meuFeedback)
                  }
                >
                  Editar
                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    handleDeletar(meuFeedback.id)
                  }
                >
                  Excluir
                </button>

              </div>
            )}

          </div>
        )}

        <div className="feedback-list">

          <h2>
            {feedbacks.length} Feedbacks
          </h2>

          {loading && (
            <p className="loading">
              Carregando...
            </p>
          )}

          {feedbacks.map((fb) => (
            <div
              key={fb.id}
              className="feedback-card"
            >

              <div className="feedback-card-header">

                <div>
                  <div className="feedback-card-name">
                    {fb.nome}
                  </div>

                  <StarRating
                    value={Number(fb.nota)}
                    readonly
                  />
                </div>

                <span className="feedback-card-date">
                  {formatDate(fb.criado_em)}
                </span>

              </div>

              <p className="feedback-card-message">
                {fb.mensagem}
              </p>

              <div className="feedback-card-actions">

                <button
                  className="edit-btn"
                  onClick={() =>
                    setVisualizando(fb)
                  }
                >
                  Ver
                </button>

                {String(fb.idusuario) ===
                  String(user.idusuarios) && (
                    <>
                      <button
                        className="edit-btn"
                        onClick={() =>
                          abrirEdicao(fb)
                        }
                      >
                        Editar
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDeletar(fb.id)
                        }
                      >
                        Excluir
                      </button>
                    </>
                  )}

              </div>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}