import { Star, Phone, Mail, Calendar, Heart, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

export function DetalheServico({ idServico, navegarPara, estaLogado }) {
  const [servico, setServico] = useState(null);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [mostrarFormularioAvaliacao, setMostrarFormularioAvaliacao] = useState(false);
  const [ehFavorito, setEhFavorito] = useState(false);

  const [novaAvaliacao, setNovaAvaliacao] = useState({
    notaPreco: 5,
    notaTempoExecucao: 5,
    notaHigiene: 5,
    notaEducacao: 5,
    comentario: ''
  });

  useEffect(() => {
    // TODO: Conectar com seu backend Node/Express
    // const buscarServico = async () => {
    //   const resposta = await fetch(`http://localhost:3000/servico/${idServico}`);
    //   const dados = await resposta.json();
    //   setServico(dados);
    // };
    // buscarServico();

    // Mock de dados para demonstração
    const servicoMock = {
      id: idServico,
      nomePrestador: 'João Silva',
      descServico: 'Serviços de alvenaria, construção e reforma. Experiência de 15 anos no mercado. Realizo obras completas, construção de muros, calçadas, pequenos reparos e muito mais. Trabalho com qualidade e pontualidade garantidas.',
      categorias: ['Pedreiro', 'Reformas'],
      imagem: 'https://images.unsplash.com/photo-1672748341520-6a839e6c05bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjB3b3JrZXJ8ZW58MXx8fHwxNzY0Mjg1OTAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      notaMedia: 4.8,
      totalAvaliacoes: 24,
      telefoneContato: '(11) 98765-4321',
      email: 'joao.silva@email.com',
      dataCadastro: '2024-01-15'
    };

    const avaliacoesMock = [
      {
        id: 1,
        idUsuario: 2,
        nomeUsuario: 'Maria Santos',
        notaPreco: 5,
        notaTempoExecucao: 5,
        notaHigiene: 4,
        notaEducacao: 5,
        comentario: 'Excelente profissional! Fez a reforma da minha casa com muita qualidade e no prazo combinado.',
        dataAvaliacao: '2024-11-20'
      },
      {
        id: 2,
        idUsuario: 3,
        nomeUsuario: 'Pedro Costa',
        notaPreco: 4,
        notaTempoExecucao: 5,
        notaHigiene: 5,
        notaEducacao: 5,
        comentario: 'Muito bom! Recomendo.',
        dataAvaliacao: '2024-11-15'
      }
    ];

    setServico(servicoMock);
    setAvaliacoes(avaliacoesMock);
  }, [idServico]);

  const realizarContratacao = async () => {
    if (!estaLogado) {
      alert('Você precisa estar logado para contratar um serviço');
      navegarPara('login');
      return;
    }

    // TODO: Conectar com seu backend Node/Express
    // const resposta = await fetch(`http://localhost:3000/servico/${idServico}/contratar`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' }
    // });

    alert('Solicitação de contratação enviada! O profissional entrará em contato em breve.');
  };

  const submeterAvaliacao = async (e) => {
    e.preventDefault();

    if (!estaLogado) {
      alert('Você precisa estar logado para avaliar um serviço');
      return;
    }

    // TODO: Conectar com seu backend Node/Express
    // const resposta = await fetch(`http://localhost:3000/avaliacoes`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     idServico: idServico,
    //     ...novaAvaliacao
    //   })
    // });

    alert('Avaliação enviada com sucesso!');
    setMostrarFormularioAvaliacao(false);
    setNovaAvaliacao({
      notaPreco: 5,
      notaTempoExecucao: 5,
      notaHigiene: 5,
      notaEducacao: 5,
      comentario: ''
    });
  };

  const alternarFavorito = () => {
    if (!estaLogado) {
      alert('Você precisa estar logado para favoritar serviços');
      return;
    }
    setEhFavorito(!ehFavorito);
  };

  const calcularNotaMedia = (av) => {
    return ((av.notaPreco + av.notaTempoExecucao + av.notaHigiene + av.notaEducacao) / 4).toFixed(1);
  };

  if (!servico) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <p className="text-cinza">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-vh-100">
      {/* Botão Voltar */}
      <div className="container py-3">
        <button
          onClick={() => navegarPara('inicio')}
          className="btn btn-light d-flex align-items-center gap-2"
        >
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </button>
      </div>

      {/* Cabeçalho do Serviço */}
      <section className="container pb-4">
        <div className="row g-4">
          {/* Imagem */}
          <div className="col-12 col-md-6">
            <div className="position-relative">
              <img
                src={servico.imagem}
                alt={servico.nomePrestador}
                className="w-100 rounded shadow object-cover"
                style={{ height: '400px' }}
              />
              <button
                onClick={alternarFavorito}
                className="btn btn-light rounded-circle position-absolute shadow"
                style={{ top: '1rem', right: '1rem', width: '50px', height: '50px', padding: '0' }}
              >
                <Heart
                  size={24}
                  fill={ehFavorito ? 'var(--vermelho-escuro)' : 'none'}
                  color={ehFavorito ? 'var(--vermelho-escuro)' : 'var(--cinza)'}
                />
              </button>
            </div>
          </div>

          {/* Informações */}
          <div className="col-12 col-md-6">
            <h1 className="text-azul-marinho">{servico.nomePrestador}</h1>

            <div className="d-flex flex-wrap gap-2 mt-3">
              {servico.categorias.map((cat) => (
                <span
                  key={cat}
                  className="badge bg-amarelo-ouro text-marrom-escuro fs-6 px-3 py-2"
                >
                  {cat}
                </span>
              ))}
            </div>

            <div className="d-flex align-items-center gap-2 mt-3">
              <Star size={28} fill="var(--amarelo)" color="var(--amarelo)" />
              <span className="fs-2 text-azul-marinho">
                {servico.notaMedia.toFixed(1)}
              </span>
              <span className="text-cinza">
                ({servico.totalAvaliacoes} avaliações)
              </span>
            </div>

            <div className="mt-4">
              {servico.telefoneContato && (
                <div className="d-flex align-items-center gap-3 mb-2">
                  <Phone size={20} color="var(--laranja-principal)" />
                  <span className="text-cinza">{servico.telefoneContato}</span>
                </div>
              )}
              {servico.email && (
                <div className="d-flex align-items-center gap-3 mb-2">
                  <Mail size={20} color="var(--laranja-principal)" />
                  <span className="text-cinza">{servico.email}</span>
                </div>
              )}
              <div className="d-flex align-items-center gap-3">
                <Calendar size={20} color="var(--laranja-principal)" />
                <span className="text-cinza">
                  Membro desde {new Date(servico.dataCadastro).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>

            <button
              onClick={realizarContratacao}
              className="btn btn-laranja w-100 py-3 mt-4 fs-5"
            >
              Contratar Serviço
            </button>
          </div>
        </div>

        {/* Descrição */}
        <div className="mt-4">
          <h2 className="text-azul-marinho">Sobre o Serviço</h2>
          <p className="mt-3 text-cinza">
            {servico.descServico}
          </p>
        </div>
      </section>

      {/* Avaliações */}
      <section className="container py-4 border-top">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h2 className="text-azul-marinho mb-0">Avaliações</h2>
          <button
            onClick={() => setMostrarFormularioAvaliacao(!mostrarFormularioAvaliacao)}
            className="btn btn-verde-escuro"
          >
            {mostrarFormularioAvaliacao ? 'Cancelar' : 'Avaliar Serviço'}
          </button>
        </div>

        {/* Formulário de Avaliação */}
        {mostrarFormularioAvaliacao && (
          <form onSubmit={submeterAvaliacao} className="bg-light p-4 rounded mb-4">
            <h3 className="text-azul-marinho mb-3">
              Deixe sua avaliação
            </h3>

            <div className="row g-3 mb-3">
              <div className="col-12 col-md-6">
                <label className="form-label text-azul-marinho">
                  Nota Preço (1-5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={novaAvaliacao.notaPreco}
                  onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, notaPreco: Number(e.target.value) })}
                  className="form-control border-2 border-azul-claro"
                  required
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label text-azul-marinho">
                  Nota Tempo de Execução (1-5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={novaAvaliacao.notaTempoExecucao}
                  onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, notaTempoExecucao: Number(e.target.value) })}
                  className="form-control border-2 border-azul-claro"
                  required
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label text-azul-marinho">
                  Nota Higiene (1-5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={novaAvaliacao.notaHigiene}
                  onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, notaHigiene: Number(e.target.value) })}
                  className="form-control border-2 border-azul-claro"
                  required
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label text-azul-marinho">
                  Nota Educação (1-5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={novaAvaliacao.notaEducacao}
                  onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, notaEducacao: Number(e.target.value) })}
                  className="form-control border-2 border-azul-claro"
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label text-azul-marinho">
                Comentário
              </label>
              <textarea
                value={novaAvaliacao.comentario}
                onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, comentario: e.target.value })}
                className="form-control border-2 border-azul-claro"
                rows={4}
                placeholder="Conte como foi sua experiência..."
              />
            </div>

            <button
              type="submit"
              className="btn btn-verde-escuro"
            >
              Enviar Avaliação
            </button>
          </form>
        )}

        {/* Lista de Avaliações */}
        <div className="row g-3">
          {avaliacoes.length === 0 ? (
            <p className="text-cinza">Ainda não há avaliações para este serviço.</p>
          ) : (
            avaliacoes.map((avaliacao) => (
              <div key={avaliacao.id} className="col-12">
                <div className="card shadow-sm p-3">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-circle d-flex align-items-center justify-content-center bg-azul-claro" style={{ width: '50px', height: '50px' }}>
                        <span className="text-azul-marinho">
                          {avaliacao.nomeUsuario.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="mb-0 text-azul-marinho">{avaliacao.nomeUsuario}</p>
                        <p className="mb-0 small text-cinza">
                          {new Date(avaliacao.dataAvaliacao).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <Star size={20} fill="var(--amarelo)" color="var(--amarelo)" />
                      <span className="text-azul-marinho">
                        {calcularNotaMedia(avaliacao)}
                      </span>
                    </div>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6 col-md-3">
                      <div className="text-center p-2 bg-light rounded">
                        <p className="small text-cinza mb-1">Preço</p>
                        <p className="mb-0 text-azul-marinho">{avaliacao.notaPreco}/5</p>
                      </div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="text-center p-2 bg-light rounded">
                        <p className="small text-cinza mb-1">Tempo</p>
                        <p className="mb-0 text-azul-marinho">{avaliacao.notaTempoExecucao}/5</p>
                      </div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="text-center p-2 bg-light rounded">
                        <p className="small text-cinza mb-1">Higiene</p>
                        <p className="mb-0 text-azul-marinho">{avaliacao.notaHigiene}/5</p>
                      </div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="text-center p-2 bg-light rounded">
                        <p className="small text-cinza mb-1">Educação</p>
                        <p className="mb-0 text-azul-marinho">{avaliacao.notaEducacao}/5</p>
                      </div>
                    </div>
                  </div>

                  {avaliacao.comentario && (
                    <p className="text-cinza mb-0">{avaliacao.comentario}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
