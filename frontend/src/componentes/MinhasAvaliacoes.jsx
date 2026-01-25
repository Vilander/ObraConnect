import { Star, MessageSquare, User, Calendar, TrendingUp, ArrowLeft, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export function MinhasAvaliacoes({ navegarPara }) {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resumo, setResumo] = useState({ media: 0, total: 0 });

  useEffect(() => {
    const buscarAvaliacoes = async () => {
      const token = localStorage.getItem('token');
      try {
        const resposta = await fetch('http://localhost:3001/api/avaliacoes/recebidas', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const dados = await resposta.json();

        if (resposta.ok) {
          setAvaliacoes(dados);

          // Calcular média geral do prestador
          if (dados.length > 0) {
            const somaDasMedias = dados.reduce((acc, av) => {
              const mediaIndividual = (av.nota_preco + av.nota_tempo_execucao + av.nota_higiene + av.nota_educacao) / 4;
              return acc + mediaIndividual;
            }, 0);
            setResumo({
              media: somaDasMedias / dados.length,
              total: dados.length
            });
          }
        }
      } catch (erro) {
        console.error("Erro ao buscar avaliações", erro);
      } finally {
        setLoading(false);
      }
    };

    buscarAvaliacoes();
  }, []);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <Loader2 className="animate-spin text-laranja-principal" size={48} />
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light pb-5">
      {/* Cabeçalho Dashboard */}
      <div className="bg-azul-marinho text-white py-5">
        <div className="container">
          <button
            onClick={() => navegarPara('inicio')}
            className="btn btn-link text-white-50 text-decoration-none p-0 mb-3 d-flex align-items-center gap-2"
          >
            <ArrowLeft size={20} />
            Voltar
          </button>

          <div className="d-flex justify-content-between align-items-end flex-wrap gap-3">
            <div>
              <h1 className="fw-bold mb-2">Minha Reputação</h1>
              <p className="text-white-50 mb-0">
                Acompanhe o feedback dos seus clientes
              </p>
            </div>

            {/* Card de Resumo no Topo */}
            <div className="bg-white text-azul-marinho rounded p-3 d-flex align-items-center gap-4 shadow-sm">
              <div className="text-center border-end pe-4">
                <div className="h2 fw-bold mb-0">{resumo.total}</div>
                <div className="small text-muted">Avaliações</div>
              </div>
              <div className="text-center">
                <div className="h2 fw-bold mb-0 text-amarelo d-flex align-items-center gap-2">
                  {resumo.media.toFixed(1)} <Star fill="currentColor" size={24} />
                </div>
                <div className="small text-muted">Média Geral</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-n4" style={{ marginTop: '-30px' }}>
        {avaliacoes.length === 0 ? (
          <div className="card shadow border-0 p-5 text-center">
            <div className="mb-3">
              <MessageSquare size={48} className="text-cinza opacity-50" />
            </div>
            <h3 className="text-azul-marinho">Ainda sem avaliações</h3>
            <p className="text-muted">
              Assim que você realizar serviços e for avaliado, os comentários aparecerão aqui.
            </p>
            <button onClick={() => navegarPara('inicio')} className="btn btn-laranja mt-3">
              Voltar para o Início
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {avaliacoes.map((av) => {
              const mediaAv = (av.nota_preco + av.nota_tempo_execucao + av.nota_higiene + av.nota_educacao) / 4;

              return (
                <div key={av.id} className="col-12">
                  <div className="card shadow-sm border-0 border-start border-4 border-azul-marinho">
                    <div className="card-body p-4">
                      <div className="row align-items-center">
                        {/* Coluna 1: Quem e Quando */}
                        <div className="col-md-3 mb-3 mb-md-0 border-end-md">
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <div className="bg-light rounded-circle p-2">
                              <User size={20} className="text-azul-marinho" />
                            </div>
                            <span className="fw-bold text-azul-marinho">
                              {av.nome_avaliador}
                            </span>
                          </div>
                          <div className="d-flex align-items-center gap-2 text-muted small">
                            <Calendar size={14} />
                            {new Date(av.data_avaliacao).toLocaleDateString()}
                          </div>
                          <div className="mt-2 badge bg-azul-claro text-azul-marinho">
                            Serviço: {av.nome_servico}
                          </div>
                        </div>

                        {/* Coluna 2: Notas Detalhadas */}
                        <div className="col-md-5 mb-3 mb-md-0 px-md-4">
                          <div className="row g-2 small">
                            <div className="col-6 d-flex justify-content-between">
                              <span className="text-muted">Preço:</span>
                              <span className="fw-bold">{av.nota_preco}</span>
                            </div>
                            <div className="col-6 d-flex justify-content-between">
                              <span className="text-muted">Tempo:</span>
                              <span className="fw-bold">{av.nota_tempo_execucao}</span>
                            </div>
                            <div className="col-6 d-flex justify-content-between">
                              <span className="text-muted">Higiene:</span>
                              <span className="fw-bold">{av.nota_higiene}</span>
                            </div>
                            <div className="col-6 d-flex justify-content-between">
                              <span className="text-muted">Educação:</span>
                              <span className="fw-bold">{av.nota_educacao}</span>
                            </div>
                          </div>
                        </div>

                        {/* Coluna 3: Comentário e Média Final */}
                        <div className="col-md-4 text-md-end border-start-md ps-md-4">
                          <div className="mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={18}
                                className={i < Math.round(mediaAv) ? "text-amarelo" : "text-gray-300"}
                                fill="currentColor"
                              />
                            ))}
                          </div>
                          <p className="fst-italic text-muted mb-0">
                            "{av.comentario}"
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}