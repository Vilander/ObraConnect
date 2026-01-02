import { Star, ArrowLeft, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import AlertDialog from './AlertDialog';

export function MinhasAvaliacoes({ navegarPara }) {
  const [avaliacoes, setAvaliacoes] = useState([]);

  // Estado para controlar o Dialog
  const [dialog, setDialog] = useState({
    aberto: false,
    mensagem: '',
    tipo: 'alerta', // 'alerta' ou 'confirmacao'
    idParaExcluir: null
  });

  useEffect(() => {
    // Mock de avaliações para demonstração
    const avaliacoesMock = [
      {
        id: 1,
        idServico: 1,
        nomePrestador: 'João Silva',
        notaPreco: 5,
        notaTempoExecucao: 5,
        notaHigiene: 4,
        notaEducacao: 5,
        comentario: 'Excelente profissional! Fez a reforma da minha casa com muita qualidade e no prazo combinado.',
        dataAvaliacao: '2024-11-20'
      },
      {
        id: 2,
        idServico: 2,
        nomePrestador: 'Carlos Elétrica',
        notaPreco: 4,
        notaTempoExecucao: 5,
        notaHigiene: 5,
        notaEducacao: 5,
        comentario: 'Muito profissional. Resolveu meu problema elétrico rapidamente.',
        dataAvaliacao: '2024-11-15'
      },
      {
        id: 3,
        idServico: 3,
        nomePrestador: 'Marcenaria Santos',
        notaPreco: 5,
        notaTempoExecucao: 4,
        notaHigiene: 5,
        notaEducacao: 5,
        comentario: 'Os móveis ficaram lindos! Super recomendo.',
        dataAvaliacao: '2024-11-10'
      }
    ];

    setAvaliacoes(avaliacoesMock);
  }, []);

  const calcularNotaMedia = (av) => {
    return ((av.notaPreco + av.notaTempoExecucao + av.notaHigiene + av.notaEducacao) / 4).toFixed(1);
  };

  // Abre o modal perguntando se quer excluir
  const solicitarExclusao = (id) => {
    setDialog({
      aberto: true,
      mensagem: 'Tem certeza que deseja excluir esta avaliação?',
      tipo: 'confirmacao',
      idParaExcluir: id
    });
  };

  // Executa a exclusão de fato
  const confirmarExclusao = async () => {
    const id = dialog.idParaExcluir;

    // Remove do estado local
    setAvaliacoes(avaliacoes.filter(av => av.id !== id));

    // Abre modal de sucesso (reaproveitando o estado, mas limpando o ID)
    setTimeout(() => {
      setDialog({
        aberto: true,
        mensagem: 'Avaliação excluída com sucesso!',
        tipo: 'alerta',
        idParaExcluir: null
      });
    }, 100);
  };

  const fecharDialog = () => {
    setDialog({ ...dialog, aberto: false });
  };

  return (
    <div className="min-vh-100 py-4 px-3">
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Botão Voltar */}
        <button
          onClick={() => navegarPara('inicio')}
          className="btn btn-light d-flex align-items-center gap-2 mb-4"
        >
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </button>

        {/* Cabeçalho */}
        <div className="mb-4">
          <h1 className="text-azul-marinho">Minhas Avaliações</h1>
          <p className="text-cinza mt-2">
            Veja todas as avaliações que você deixou para os profissionais
          </p>
        </div>

        {/* Lista de Avaliações */}
        {avaliacoes.length === 0 ? (
          <div className="card shadow text-center p-5">
            <Star size={48} color="var(--cinza)" className="mx-auto mb-3" />
            <h3 className="text-azul-marinho">Nenhuma avaliação ainda</h3>
            <p className="text-cinza mt-2">
              Você ainda não avaliou nenhum serviço
            </p>
            <button
              onClick={() => navegarPara('inicio')}
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
                    {/* Cabeçalho da Avaliação */}
                    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-3 gap-3">
                      <div className="flex-grow-1">
                        <button
                          onClick={() => navegarPara('detalhe-servico', avaliacao.idServico)}
                          className="btn btn-link p-0 text-start text-decoration-none"
                        >
                          <h3 className="text-azul-marinho mb-1">
                            {avaliacao.nomePrestador}
                          </h3>
                        </button>
                        <p className="small text-cinza mb-0">
                          Avaliado em {new Date(avaliacao.dataAvaliacao).toLocaleDateString('pt-BR')}
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
                          onClick={() => solicitarExclusao(avaliacao.id)}
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
                          <p className="small text-azul-marinho mb-1">Preço</p>
                          <div className="d-flex align-items-center justify-content-center gap-1">
                            <Star size={16} fill="var(--amarelo)" color="var(--amarelo)" />
                            <span className="text-azul-marinho">{avaliacao.notaPreco}</span>
                          </div>
                        </div>
                      </div>

                      <div className="col-6 col-md-3">
                        <div className="text-center p-3 rounded bg-azul-claro">
                          <p className="small text-azul-marinho mb-1">Tempo</p>
                          <div className="d-flex align-items-center justify-content-center gap-1">
                            <Star size={16} fill="var(--amarelo)" color="var(--amarelo)" />
                            <span className="text-azul-marinho">{avaliacao.notaTempoExecucao}</span>
                          </div>
                        </div>
                      </div>

                      <div className="col-6 col-md-3">
                        <div className="text-center p-3 rounded bg-azul-claro">
                          <p className="small text-azul-marinho mb-1">Higiene</p>
                          <div className="d-flex align-items-center justify-content-center gap-1">
                            <Star size={16} fill="var(--amarelo)" color="var(--amarelo)" />
                            <span className="text-azul-marinho">{avaliacao.notaHigiene}</span>
                          </div>
                        </div>
                      </div>

                      <div className="col-6 col-md-3">
                        <div className="text-center p-3 rounded bg-azul-claro">
                          <p className="small text-azul-marinho mb-1">Educação</p>
                          <div className="d-flex align-items-center justify-content-center gap-1">
                            <Star size={16} fill="var(--amarelo)" color="var(--amarelo)" />
                            <span className="text-azul-marinho">{avaliacao.notaEducacao}</span>
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
                        onClick={() => navegarPara('detalhe-servico', avaliacao.idServico)}
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

        {/* Estatísticas */}
        {avaliacoes.length > 0 && (
          <div className="card bg-azul-claro mt-4">
            <div className="card-body p-4">
              <h3 className="text-azul-marinho mb-4">Estatísticas</h3>
              <div className="row g-4 text-center">
                <div className="col-6 col-md-3">
                  <p className="display-4 text-azul-marinho mb-1">{avaliacoes.length}</p>
                  <p className="small text-cinza mb-0">Total de avaliações</p>
                </div>
                <div className="col-6 col-md-3">
                  <p className="display-4 text-azul-marinho mb-1">
                    {(avaliacoes.reduce((acc, av) => acc + parseFloat(calcularNotaMedia(av)), 0) / avaliacoes.length).toFixed(1)}
                  </p>
                  <p className="small text-cinza mb-0">Nota média</p>
                </div>
                <div className="col-6 col-md-3">
                  <p className="display-4 text-azul-marinho mb-1">
                    {(avaliacoes.reduce((acc, av) => acc + av.notaPreco, 0) / avaliacoes.length).toFixed(1)}
                  </p>
                  <p className="small text-cinza mb-0">Média preço</p>
                </div>
                <div className="col-6 col-md-3">
                  <p className="display-4 text-azul-marinho mb-1">
                    {avaliacoes.filter(av => parseFloat(calcularNotaMedia(av)) >= 4.5).length}
                  </p>
                  <p className="small text-cinza mb-0">Avaliações 4.5+</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* COMPONENTE ALERT DIALOG ADICIONADO */}
      <AlertDialog
        aberto={dialog.aberto}
        mensagem={dialog.mensagem}
        onClose={fecharDialog}
        onConfirm={dialog.tipo === 'confirmacao' ? confirmarExclusao : null}
      />
    </div>
  );
}