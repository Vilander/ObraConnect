import { ArrowLeft, MapPin, Star, Calendar, MessageSquare, Shield, CheckCircle, User, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import AlertDialog from './AlertDialog';

export function DetalheServico({ idServico, navegarPara, estaLogado }) {
  const [servico, setServico] = useState(null);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Estado para nova avaliação
  const [novaAvaliacao, setNovaAvaliacao] = useState({
    nota_preco: 5,
    nota_tempo: 5,
    nota_higiene: 5,
    nota_educacao: 5,
    comentario: ''
  });
  const [enviandoAvaliacao, setEnviandoAvaliacao] = useState(false);

  // Estado Dialog
  const [dialog, setDialog] = useState({ aberto: false, mensagem: '' });

  // --- 1. BUSCAR DADOS DO SERVIÇO E AVALIAÇÕES ---
  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Busca Serviço
        const respServico = await fetch(`http://localhost:3001/api/servicos/${idServico}`);
        const dadosServico = await respServico.json();

        if (!respServico.ok) throw new Error(dadosServico.erro);

        // Busca Avaliações
        const respAvaliacoes = await fetch(`http://localhost:3001/api/avaliacoes/servico/${idServico}`);
        const dadosAvaliacoes = await respAvaliacoes.json();

        setServico({
          ...dadosServico,
          // Mapeia snake_case do banco para camelCase se necessário, ou usa direto
          nomePrestador: dadosServico.nome_usuario || dadosServico.nome_prestador,
          imagem: dadosServico.imagem_url,
          notaMedia: Number(dadosServico.nota_media),
          totalAvaliacoes: dadosServico.total_avaliacoes,
          descricao: dadosServico.desc_servico
        });

        setAvaliacoes(dadosAvaliacoes);

      } catch (erro) {
        console.error("Erro:", erro);
        setDialog({ aberto: true, mensagem: "Erro ao carregar detalhes do serviço." });
      } finally {
        setCarregando(false);
      }
    };

    if (idServico) {
      carregarDados();
    }
  }, [idServico]);


  // --- 2. ENVIAR NOVA AVALIAÇÃO ---
  const submeterAvaliacao = async (e) => {
    e.preventDefault();
    if (!estaLogado) {
      setDialog({ aberto: true, mensagem: "Você precisa estar logado para avaliar." });
      navegarPara('login');
      return;
    }

    setEnviandoAvaliacao(true);
    const token = localStorage.getItem('token');

    try {
      const resposta = await fetch('http://localhost:3001/api/avaliacoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id_servico: idServico,
          ...novaAvaliacao
        })
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        setDialog({ aberto: true, mensagem: "Avaliação enviada com sucesso!" });
        setNovaAvaliacao({ nota_preco: 5, nota_tempo: 5, nota_higiene: 5, nota_educacao: 5, comentario: '' });
        // Recarrega as avaliações para aparecer a nova
        const respNovas = await fetch(`http://localhost:3001/api/avaliacoes/servico/${idServico}`);
        setAvaliacoes(await respNovas.json());
      } else {
        setDialog({ aberto: true, mensagem: dados.erro || "Erro ao enviar avaliação." });
      }
    } catch (erro) {
      setDialog({ aberto: true, mensagem: "Erro de conexão." });
    } finally {
      setEnviandoAvaliacao(false);
    }
  };

  if (carregando) return (
    <div className="text-center py-5">
      <Loader2 className="animate-spin mx-auto text-laranja-principal" size={48} />
    </div>
  );

  if (!servico) return <div className="text-center py-5">Serviço não encontrado.</div>;

  return (
    <div className="bg-light min-vh-100 pb-5">
      {/* Cabeçalho da Página */}
      <div className="bg-azul-marinho text-white py-4 shadow-sm">
        <div className="container">
          <button
            onClick={() => navegarPara('inicio')}
            className="btn btn-link text-white text-decoration-none p-0 mb-3 d-flex align-items-center gap-2 hover-opacity"
          >
            <ArrowLeft size={20} />
            Voltar para busca
          </button>
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="fw-bold mb-2">{servico.nomePrestador}</h1>
              <div className="d-flex flex-wrap gap-3 text-white-50">
                <div className="d-flex align-items-center gap-1">
                  <MapPin size={18} />
                  <span>Americana - SP</span>
                </div>
                <div className="d-flex align-items-center gap-1">
                  <Star size={18} className="text-amarelo" fill="currentColor" />
                  <span className="text-white fw-bold">{servico.notaMedia?.toFixed(1) || "0.0"}</span>
                  <span>({servico.totalAvaliacoes} avaliações)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-4">
        <div className="row g-4">
          {/* Coluna Esquerda - Informações Principais */}
          <div className="col-lg-8">
            {/* Cartão de Descrição */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body p-4">
                <h3 className="h5 text-azul-marinho fw-bold mb-3">Sobre o Serviço</h3>
                <img
                  src={servico.imagem || 'https://via.placeholder.com/800x400?text=Servi%C3%A7o'}
                  alt="Foto do serviço"
                  className="img-fluid rounded mb-3 w-100 object-cover"
                  style={{ maxHeight: '400px' }}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/800x400?text=Sem+Imagem'; }}
                />
                <p className="text-cinza" style={{ whiteSpace: 'pre-line' }}>
                  {servico.descricao}
                </p>
              </div>
            </div>

            {/* Seção de Avaliações */}
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <h3 className="h5 text-azul-marinho fw-bold mb-4 d-flex align-items-center gap-2">
                  <MessageSquare size={20} />
                  Avaliações de Clientes
                </h3>

                {avaliacoes.length === 0 ? (
                  <p className="text-cinza">Este serviço ainda não possui avaliações.</p>
                ) : (
                  <div className="d-flex flex-column gap-4">
                    {avaliacoes.map((av) => (
                      <div key={av.id} className="border-bottom pb-3">
                        <div className="d-flex justify-content-between mb-2">
                          <div className="d-flex align-items-center gap-2">
                            <div className="bg-azul-claro rounded-circle p-2">
                              <User size={16} className="text-azul-marinho" />
                            </div>
                            <span className="fw-bold text-azul-marinho">
                              {av.nome_usuario || "Usuário"}
                            </span>
                          </div>
                          <span className="text-cinza small">
                            {new Date(av.data_avaliacao).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="d-flex gap-2 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < Math.round((av.nota_preco + av.nota_tempo_execucao + av.nota_higiene + av.nota_educacao) / 4) ? "text-amarelo" : "text-gray-300"}
                              fill="currentColor"
                            />
                          ))}
                        </div>
                        <p className="text-cinza mb-0 small">"{av.comentario}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Coluna Direita - Ação e Formulário */}
          <div className="col-lg-4">
            {/* Card de Contato */}
            <div className="card shadow-sm border-0 mb-4 bg-white sticky-top" style={{ top: '20px', zIndex: 1 }}>
              <div className="card-body p-4">
                <h3 className="h5 text-azul-marinho fw-bold mb-3">Interessado?</h3>

                {servico.telefone ? (
                  <a
                    href={`https://wa.me/55${servico.telefone.replace(/\D/g, '')}?text=Olá, vi seu anúncio "${servico.titulo}" no ObraConnect e gostaria de um orçamento.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp w-100 py-3 mb-3 d-flex align-items-center justify-content-center gap-2 shadow-sm text-white fw-bold"
                    style={{ backgroundColor: '#25D366', border: 'none' }}
                  >
                    <MessageSquare size={20} />
                    Conversar no WhatsApp
                  </a>
                ) : (
                  <div className="alert alert-warning small text-center">
                    Telefone não informado pelo prestador.
                  </div>
                )}

                <div className="d-flex align-items-center gap-2 text-cinza small justify-content-center">
                  <Shield size={16} />
                  <span>Profissional verificado</span>
                </div>
              </div>
            </div>

            {/* Formulário de Avaliação */}
            {estaLogado ? (
              <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                  <h4 className="h6 text-azul-marinho fw-bold mb-3">Avalie este profissional</h4>
                  <form onSubmit={submeterAvaliacao}>
                    <div className="mb-3">
                      <label className="form-label small">Seu comentário</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={novaAvaliacao.comentario}
                        onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, comentario: e.target.value })}
                        required
                      ></textarea>
                    </div>

                    {/* Selects simples para as notas*/}
                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <label className="small">Preço</label>
                        <select className="form-select form-select-sm"
                          value={novaAvaliacao.nota_preco}
                          onChange={e => setNovaAvaliacao({ ...novaAvaliacao, nota_preco: Number(e.target.value) })}>
                          <option value="5">5 - Excelente</option>
                          <option value="4">4 - Bom</option>
                          <option value="3">3 - Regular</option>
                          <option value="2">2 - Ruim</option>
                          <option value="1">1 - Péssimo</option>
                        </select>
                      </div>
                      <div className="col-6">
                        <label className="small">Tempo</label>
                        <select className="form-select form-select-sm"
                          value={novaAvaliacao.nota_tempo}
                          onChange={e => setNovaAvaliacao({ ...novaAvaliacao, nota_tempo: Number(e.target.value) })}>
                          <option value="5">5 - Rápido</option>
                          <option value="4">4 - No prazo</option>
                          <option value="3">3 - Atrasou pouco</option>
                          <option value="2">2 - Atrasou</option>
                          <option value="1">1 - Muito lento</option>
                        </select>
                      </div>
                      <div className="col-6">
                        <label className="small">Higiene</label>
                        <select className="form-select form-select-sm"
                          value={novaAvaliacao.nota_higiene}
                          onChange={e => setNovaAvaliacao({ ...novaAvaliacao, nota_higiene: Number(e.target.value) })}>
                          <option value="5">5 - Impecável (muito limpo e organizado)</option>
                          <option value="4">4 - Muito bom (limpo e bem cuidado)</option>
                          <option value="3">3 - Regular (limpeza aceitável)</option>
                          <option value="2">2 - Ruim (pouco cuidado com a higiene)</option>
                          <option value="1">1 - Péssimo (sem higiene adequada)</option>
                        </select>
                      </div>
                      <div className="col-6">
                        <label className="small">Educação</label>
                        <select className="form-select form-select-sm"
                          value={novaAvaliacao.nota_educacao}
                          onChange={e => setNovaAvaliacao({ ...novaAvaliacao, nota_educacao: Number(e.target.value) })}>
                          <option value="5">5 - Extremamente educado e cordial</option>
                          <option value="4">4 - Educado e respeitoso</option>
                          <option value="3">3 - Educação razoável</option>
                          <option value="2">2 - Pouco educado</option>
                          <option value="1">1 - Muito mal-educado</option>
                        </select>
                      </div>
                    </div>

                    <button type="submit" className="btn btn-azul-marinho w-100 btn-sm" disabled={enviandoAvaliacao}>
                      {enviandoAvaliacao ? 'Enviando...' : 'Enviar Avaliação'}
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="alert alert-info small">
                Faça login para avaliar este serviço.
              </div>
            )}

          </div>
        </div>
      </div>

      <AlertDialog
        aberto={dialog.aberto}
        mensagem={dialog.mensagem}
        onClose={() => setDialog({ ...dialog, aberto: false })}
      />
    </div>
  );
}