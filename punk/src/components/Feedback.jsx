import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost/projetoFinal/punk/back-end/feedback.php";

function StarRating({ value, onChange, readonly = false }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={`text-2xl transition-colors ${
            star <= (hovered || value) ? "text-[#1DB954]" : "text-[#333]"
          } ${readonly ? "cursor-default" : "cursor-pointer"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function Feedback({ user, onLogout }) {
  const [feedbacks, setFeedbacks]     = useState([]);
  const [jaEnviou, setJaEnviou]       = useState(false);
  const [loading, setLoading]         = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState(null);
  const [success, setSuccess]         = useState(null);

  // form de criação
  const [mensagem, setMensagem] = useState("");
  const [nota, setNota]         = useState(0);

  // edição
  const [editando, setEditando]         = useState(null); // { id, mensagem, nota }
  const [editMensagem, setEditMensagem] = useState("");
  const [editNota, setEditNota]         = useState(0);

  // visualização
  const [visualizando, setVisualizando] = useState(null);

  const loadFeedbacks = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(API, { action: "list" });
      if (data.success) setFeedbacks(data.feedbacks);
    } finally {
      setLoading(false);
    }
  };

  const checkJaEnviou = async () => {
    const { data } = await axios.post(API, { action: "check", idusuario: user.idusuarios });
    if (data.success) setJaEnviou(data.jaEnviou);
  };

  useEffect(() => {
    loadFeedbacks();
    checkJaEnviou();
  }, []);

  // CRIAR
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!nota)           { setError("Selecione uma nota."); return; }
    if (!mensagem.trim()){ setError("Escreva uma mensagem."); return; }
    setSubmitting(true);
    try {
      const { data } = await axios.post(API, { action: "create", idusuario: user.idusuarios, mensagem, nota });
      if (data.success) {
        setSuccess("Feedback enviado!");
        setMensagem(""); setNota(0);
        setJaEnviou(true);
        loadFeedbacks();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.message);
      }
    } catch { setError("Erro ao enviar."); }
    finally  { setSubmitting(false); }
  };

  // EDITAR — abrir
  const abrirEdicao = (fb) => {
    setEditando(fb);
    setEditMensagem(fb.mensagem);
    setEditNota(Number(fb.nota));
    setVisualizando(null);
    setError(null);
  };

  // EDITAR — salvar
  const handleEditar = async (e) => {
    e.preventDefault();
    setError(null);
    if (!editNota)            { setError("Selecione uma nota."); return; }
    if (!editMensagem.trim()) { setError("Escreva uma mensagem."); return; }
    setSubmitting(true);
    try {
      const { data } = await axios.post(API, { action: "update", id: editando.id, mensagem: editMensagem, nota: editNota });
      if (data.success) {
        setEditando(null);
        loadFeedbacks();
      } else {
        setError(data.message);
      }
    } catch { setError("Erro ao editar."); }
    finally  { setSubmitting(false); }
  };

  // DELETAR
  const handleDeletar = async (id) => {
    if (!confirm("Tem certeza que deseja remover este feedback?")) return;
    try {
      const { data } = await axios.post(API, { action: "delete", id });
      if (data.success) {
        if (feedbacks.find(f => f.id === id)?.idusuario === user.idusuarios) setJaEnviou(false);
        setVisualizando(null);
        loadFeedbacks();
      }
    } catch { alert("Erro ao deletar."); }
  };

  const formatDate = (str) => new Date(str).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

  const meuFeedback = feedbacks.find(f => String(f.idusuario) === String(user.idusuarios));

  return (
    <section className="min-h-screen bg-black text-white pb-16">

      {/* Header */}
      <div className="flex items-center justify-between max-w-3xl mx-auto px-6 pt-12 pb-8 border-b border-[#1a1a1a]">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Feedbacks</h1>
          <p className="text-xs text-[#555] mt-1">Olá, {user.nome}</p>
        </div>
        <button onClick={onLogout} className="text-xs text-[#555] hover:text-white transition-colors">Sair</button>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-8 flex flex-col gap-10">

        {/* MODAL visualizar */}
        {visualizando && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4" onClick={() => setVisualizando(null)}>
            <div className="bg-[#1a1a1a] rounded-lg p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-semibold text-white">{visualizando.nome}</p>
                  <StarRating value={Number(visualizando.nota)} readonly />
                </div>
                <span className="text-xs text-[#555]">{formatDate(visualizando.criado_em)}</span>
              </div>
              <p className="text-sm text-[#aaa] leading-relaxed">{visualizando.mensagem}</p>
              <button onClick={() => setVisualizando(null)} className="mt-5 text-xs text-[#555] hover:text-white transition-colors">Fechar</button>
            </div>
          </div>
        )}

        {/* MODAL editar */}
        {editando && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4" onClick={() => setEditando(null)}>
            <div className="bg-[#1a1a1a] rounded-lg p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
              <h2 className="text-sm font-semibold text-[#aaa] mb-4 uppercase tracking-widest">Editar feedback</h2>
              <form onSubmit={handleEditar} className="flex flex-col gap-4">
                <StarRating value={editNota} onChange={setEditNota} />
                <textarea
                  value={editMensagem}
                  onChange={e => setEditMensagem(e.target.value)}
                  rows={4}
                  className="w-full bg-[#111] text-white text-sm px-4 py-3 rounded-lg placeholder-[#555] focus:outline-none focus:ring-1 focus:ring-[#1DB954] resize-none"
                />
                {error && <p className="text-red-400 text-xs">{error}</p>}
                <div className="flex gap-3">
                  <button type="submit" disabled={submitting} className="bg-[#1DB954] hover:bg-[#1ed760] disabled:opacity-50 text-black font-semibold text-sm px-5 py-2 rounded-lg transition-colors">
                    {submitting ? "Salvando..." : "Salvar"}
                  </button>
                  <button type="button" onClick={() => setEditando(null)} className="text-sm text-[#555] hover:text-white transition-colors">Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Formulário novo feedback */}
        {!jaEnviou ? (
          <div>
            <h2 className="text-sm font-semibold text-[#aaa] mb-4 uppercase tracking-widest">Deixe seu feedback</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <StarRating value={nota} onChange={setNota} />
              <textarea
                placeholder="Escreva sua mensagem..."
                value={mensagem}
                onChange={e => setMensagem(e.target.value)}
                rows={4}
                className="w-full bg-[#1a1a1a] text-white text-sm px-4 py-3 rounded-lg placeholder-[#555] focus:outline-none focus:ring-1 focus:ring-[#1DB954] resize-none"
              />
              {error   && <p className="text-red-400 text-xs">{error}</p>}
              {success && <p className="text-[#1DB954] text-xs">{success}</p>}
              <button type="submit" disabled={submitting} className="self-start bg-[#1DB954] hover:bg-[#1ed760] disabled:opacity-50 text-black font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors">
                {submitting ? "Enviando..." : "Enviar"}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-[#1a1a1a] rounded-lg px-5 py-4 text-sm text-[#aaa]">
            ✓ Você já enviou seu feedback.
            {meuFeedback && (
              <div className="flex gap-3 mt-2">
                <button onClick={() => abrirEdicao(meuFeedback)} className="text-xs text-[#1DB954] hover:underline">Editar</button>
                <button onClick={() => handleDeletar(meuFeedback.id)} className="text-xs text-red-400 hover:underline">Excluir</button>
              </div>
            )}
          </div>
        )}

        {/* Lista de feedbacks */}
        <div>
          <h2 className="text-sm font-semibold text-[#aaa] mb-4 uppercase tracking-widest">
            {feedbacks.length} {feedbacks.length === 1 ? "feedback" : "feedbacks"}
          </h2>

          {loading && (
            <div className="flex justify-center py-10">
              <div className="w-5 h-5 border-2 border-[#333] border-t-[#1DB954] rounded-full animate-spin" />
            </div>
          )}

          <div className="flex flex-col gap-3">
            {feedbacks.map(fb => (
              <div key={fb.id} className="bg-[#1a1a1a] rounded-lg px-5 py-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-white">{fb.nome}</p>
                    <StarRating value={Number(fb.nota)} readonly />
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-[#555]">{formatDate(fb.criado_em)}</span>
                    <button onClick={() => setVisualizando(fb)} className="text-xs text-[#555] hover:text-white transition-colors">Ver</button>
                    {String(fb.idusuario) === String(user.idusuarios) && (
                      <>
                        <button onClick={() => abrirEdicao(fb)} className="text-xs text-[#1DB954] hover:underline transition-colors">Editar</button>
                        <button onClick={() => handleDeletar(fb.id)} className="text-xs text-red-400 hover:underline transition-colors">Excluir</button>
                      </>
                    )}
                  </div>
                </div>
                <p className="text-sm text-[#aaa] leading-relaxed line-clamp-2">{fb.mensagem}</p>
              </div>
            ))}
            {!loading && feedbacks.length === 0 && (
              <p className="text-[#555] text-sm">Nenhum feedback ainda. Seja o primeiro!</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
