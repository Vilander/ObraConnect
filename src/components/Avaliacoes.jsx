import { Star, ArrowLeft, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Avaliacoes({ onNavigate }) {
  const [avaliacoes, setAvaliacoes] = useState([]);

  useEffect(() => {
    // TODO: Conectar com seu backend Node/Express
    // Exemplo de chamada:
    // const fetchAvaliacoes = async () => {
    //   const response = await fetch('http://localhost:3000/avaliacoes', {
    //     headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
    //   });
    //   const data = await response.json();
    //   setAvaliacoes(data);
    // };
    // fetchAvaliacoes();

    // Mock de avaliações para demonstração
    const mockAvaliacoes = [
      {
        id: 1,
        id_servico: 1,
        nome_prestador: 'João Silva',
        nota_preco: 5,
        nota_tempo_execucao: 5,
        nota_higiene: 4,
        nota_educacao: 5,
        comentario: 'Excelente profissional! Fez a reforma da minha casa com muita qualidade e no prazo combinado.',
        data_avaliacao: '2024-11-20'
      },
      {
        id: 2,
        id_servico: 2,
        nome_prestador: 'Carlos Elétrica',
        nota_preco: 4,
        nota_tempo_execucao: 5,
        nota_higiene: 5,
        nota_educacao: 5,
        comentario: 'Muito profissional. Resolveu meu problema elétrico rapidamente.',
        data_avaliacao: '2024-11-15'
      },
      {
        id: 3,
        id_servico: 3,
        nome_prestador: 'Marcenaria Santos',
        nota_preco: 5,
        nota_tempo_execucao: 4,
        nota_higiene: 5,
        nota_educacao: 5,
        comentario: 'Os móveis ficaram lindos! Super recomendo.',
        data_avaliacao: '2024-11-10'
      }
    ];

    setAvaliacoes(mockAvaliacoes);
  }, []);

  const calcularNotaMedia = (av) => {
    return ((av.nota_preco + av.nota_tempo_execucao + av.nota_higiene + av.nota_educacao) / 4).toFixed(1);
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta avaliação?')) {
      return;
    }

    // TODO: Conectar com seu backend Node/Express
    // const response = await fetch(`http://localhost:3000/avaliacoes/${id}`, {
    //   method: 'DELETE',
    //   headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
    // });

    setAvaliacoes(avaliacoes.filter(av => av.id !== id));
    alert('Avaliação excluída com sucesso!');
  };

  return (
    <div className="min-vh-100 py-4 px-3">
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Back Button */}
        <button
          onClick={() => onNavigate('home')}
          className="btn btn-light d-flex align-items-center gap-2 mb-4"
        >
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </button>

        {/* Header */}
        <div className="mb-4">
          <h1 className="text-azul-marinho">Minhas Avaliações</h1>
          <p className="text-cinza mt-2">
            Veja todas as avaliações que você deixou para os profissionais
          </p>
        </div>

        {/* Avaliações List */}
        {avaliacoes.length === 0 ? (
          <div className="card shadow text-center p-5">
            <Star size={48} color="var(--cinza)" className="mx-auto mb-3" />
            <h3 className="text-azul-marinho">Nenhuma avaliação ainda</h3>
            <p className="text-cinza mt-2">
              Você ainda não avaliou nenhum serviço
            </p>
            <button
              onClick={() => onNavigate('home')}
              className="btn btn-laranja mt-4 mx-auto"
              style={{ maxWidth: '200px' }}
            >
              Explorar Serviços
            </button>
          </div>
        ) : (
          <div className="row g-3">
            {avaliacoes.map((avaliacao) => (
              <div key={avaliacao.id} className="col-12">
                <div className="card shadow-lg card-hover">
                  <div className="card-body p-4">
                    {/* Header da Avaliação */}
                    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-3 gap-3">
                      <div className="flex-grow-1">
                        <button
                          onClick={() => onNavigate('service-detail', avaliacao.id_servico)}
                          className="btn btn-link p-0 text-start text-decoration-none"
                        >
                          <h3 className="text-azul-marinho mb-1">
                            {avaliacao.nome_prestador}
                          </h3>
                        </button>
                        <p className="small text-cinza mb-0">
                          Avaliado em {new Date(avaliacao.data_avaliacao).toLocaleDateString('pt-BR')}
                        </p>
                      </div>

                      <div className="d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center gap-2">
                          <Star size={24} fill="var(--amarelo)" color="var(--amarelo)" />
                          <span className="fs-4 text-azul-marinho">
                            {calcularNotaMedia(avaliacao)}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDelete(avaliacao.id)}
                          className="btn btn-outline-danger btn-sm"
                          title="Excluir avaliação"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Notas Detalhadas */}
                    <div className="row g-2 mb-3">
                      <div className="col-6 col-md-3">
                        <div className="text-center p-3 rounded bg-azul-claro">
                          <p className="small text-azul-marinho mb-1">
                            Preço
                          </p>
                          <div className="d-flex align-items-center justify-content-center gap-1">
                            <Star size={16} fill="var(--amarelo)" color="var(--amarelo)" />
                            <span className="text-azul-marinho">
                              {avaliacao.nota_preco}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="col-6 col-md-3">
                        <div className="text-center p-3 rounded bg-azul-claro">
                          <p className="small text-azul-marinho mb-1">
                            Tempo
                          </p>
                          <div className="d-flex align-items-center justify-content-center gap-1">
                            <Star size={16} fill="var(--amarelo)" color="var(--amarelo)" />
                            <span className="text-azul-marinho">
                              {avaliacao.nota_tempo_execucao}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="col-6 col-md-3">
                        <div className="text-center p-3 rounded bg-azul-claro">
                          <p className="small text-azul-marinho mb-1">
                            Higiene
                          </p>
                          <div className="d-flex align-items-center justify-content-center gap-1">
                            <Star size={16} fill="var(--amarelo)" color="var(--amarelo)" />
                            <span className="text-azul-marinho">
                              {avaliacao.nota_higiene}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="col-6 col-md-3">
                        <div className="text-center p-3 rounded bg-azul-claro">
                          <p className="small text-azul-marinho mb-1">
                            Educação
                          </p>
                          <div className="d-flex align-items-center justify-content-center gap-1">
                            <Star size={16} fill="var(--amarelo)" color="var(--amarelo)" />
                            <span className="text-azul-marinho">
                              {avaliacao.nota_educacao}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Comentário */}
                    {avaliacao.comentario && (
                      <div className="p-3 rounded bg-light">
                        <p className="text-cinza mb-0">"{avaliacao.comentario}"</p>
                      </div>
                    )}

                    {/* Botão Ver Serviço */}
                    <div className="mt-3 pt-3 border-top">
                      <button
                        onClick={() => onNavigate('service-detail', avaliacao.id_servico)}
                        className="btn btn-link p-0 text-laranja-principal text-decoration-none small"
                      >
                        Ver página do serviço →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {avaliacoes.length > 0 && (
          <div className="card bg-azul-claro mt-4">
            <div className="card-body p-4">
              <h3 className="text-azul-marinho mb-4">
                Estatísticas
              </h3>
              <div className="row g-4 text-center">
                <div className="col-6 col-md-3">
                  <p className="display-4 text-azul-marinho mb-1">
                    {avaliacoes.length}
                  </p>
                  <p className="small text-cinza mb-0">
                    Total de avaliações
                  </p>
                </div>
                <div className="col-6 col-md-3">
                  <p className="display-4 text-azul-marinho mb-1">
                    {(avaliacoes.reduce((acc, av) => acc + parseFloat(calcularNotaMedia(av)), 0) / avaliacoes.length).toFixed(1)}
                  </p>
                  <p className="small text-cinza mb-0">
                    Nota média
                  </p>
                </div>
                <div className="col-6 col-md-3">
                  <p className="display-4 text-azul-marinho mb-1">
                    {(avaliacoes.reduce((acc, av) => acc + av.nota_preco, 0) / avaliacoes.length).toFixed(1)}
                  </p>
                  <p className="small text-cinza mb-0">
                    Média preço
                  </p>
                </div>
                <div className="col-6 col-md-3">
                  <p className="display-4 text-azul-marinho mb-1">
                    {avaliacoes.filter(av => parseFloat(calcularNotaMedia(av)) >= 4.5).length}
                  </p>
                  <p className="small text-cinza mb-0">
                    Avaliações 4.5+
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}