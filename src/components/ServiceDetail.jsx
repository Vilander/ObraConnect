import { Star, Phone, Mail, MapPin, Calendar, Heart, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

export function ServiceDetail({ serviceId, onNavigate, isLoggedIn }) {
  const [service, setService] = useState(null);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [showAvaliacaoForm, setShowAvaliacaoForm] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const [novaAvaliacao, setNovaAvaliacao] = useState({
    nota_preco: 5,
    nota_tempo_execucao: 5,
    nota_higiene: 5,
    nota_educacao: 5,
    comentario: ''
  });

  useEffect(() => {
    // TODO: Conectar com seu backend Node/Express
    // const fetchService = async () => {
    //   const response = await fetch(`http://localhost:3000/servico/${serviceId}`);
    //   const data = await response.json();
    //   setService(data);
    // };
    // fetchService();

    // Mock de dados para demonstração
    const mockService = {
      id: serviceId,
      nome_prestador: 'João Silva',
      desc_servico: 'Serviços de alvenaria, construção e reforma. Experiência de 15 anos no mercado. Realizo obras completas, construção de muros, calçadas, pequenos reparos e muito mais. Trabalho com qualidade e pontualidade garantidas.',
      categorias: ['Pedreiro', 'Reformas'],
      imagem: 'https://images.unsplash.com/photo-1672748341520-6a839e6c05bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjB3b3JrZXJ8ZW58MXx8fHwxNzY0Mjg1OTAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      nota_media: 4.8,
      total_avaliacoes: 24,
      telefone_contato: '(11) 98765-4321',
      email: 'joao.silva@email.com',
      data_cadastro: '2024-01-15'
    };

    const mockAvaliacoes = [
      {
        id: 1,
        id_usuario: 2,
        nome_usuario: 'Maria Santos',
        nota_preco: 5,
        nota_tempo_execucao: 5,
        nota_higiene: 4,
        nota_educacao: 5,
        comentario: 'Excelente profissional! Fez a reforma da minha casa com muita qualidade e no prazo combinado.',
        data_avaliacao: '2024-11-20'
      },
      {
        id: 2,
        id_usuario: 3,
        nome_usuario: 'Pedro Costa',
        nota_preco: 4,
        nota_tempo_execucao: 5,
        nota_higiene: 5,
        nota_educacao: 5,
        comentario: 'Muito bom! Recomendo.',
        data_avaliacao: '2024-11-15'
      }
    ];

    setService(mockService);
    setAvaliacoes(mockAvaliacoes);
  }, [serviceId]);

  const handleContratar = async () => {
    if (!isLoggedIn) {
      alert('Você precisa estar logado para contratar um serviço');
      onNavigate('login');
      return;
    }

    // TODO: Conectar com seu backend Node/Express
    // const response = await fetch(`http://localhost:3000/servico/${serviceId}/contratar`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' }
    // });

    alert('Solicitação de contratação enviada! O profissional entrará em contato em breve.');
  };

  const handleSubmitAvaliacao = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert('Você precisa estar logado para avaliar um serviço');
      return;
    }

    // TODO: Conectar com seu backend Node/Express
    // const response = await fetch(`http://localhost:3000/avaliacoes`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     id_servico: serviceId,
    //     ...novaAvaliacao
    //   })
    // });

    alert('Avaliação enviada com sucesso!');
    setShowAvaliacaoForm(false);
    setNovaAvaliacao({
      nota_preco: 5,
      nota_tempo_execucao: 5,
      nota_higiene: 5,
      nota_educacao: 5,
      comentario: ''
    });
  };

  const toggleFavorite = () => {
    if (!isLoggedIn) {
      alert('Você precisa estar logado para favoritar serviços');
      return;
    }
    setIsFavorite(!isFavorite);
  };

  const calcularNotaMedia = (av) => {
    return ((av.nota_preco + av.nota_tempo_execucao + av.nota_higiene + av.nota_educacao) / 4).toFixed(1);
  };

  if (!service) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <p className="text-cinza">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-vh-100">
      {/* Back Button */}
      <div className="container py-3">
        <button
          onClick={() => onNavigate('home')}
          className="btn btn-light d-flex align-items-center gap-2"
        >
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </button>
      </div>

      {/* Service Header */}
      <section className="container pb-4">
        <div className="row g-4">
          {/* Image */}
          <div className="col-12 col-md-6">
            <div className="position-relative">
              <img
                src={service.imagem}
                alt={service.nome_prestador}
                className="w-100 rounded shadow object-cover"
                style={{ height: '400px' }}
              />
              <button
                onClick={toggleFavorite}
                className="btn btn-light rounded-circle position-absolute shadow"
                style={{ top: '1rem', right: '1rem', width: '50px', height: '50px', padding: '0' }}
              >
                <Heart
                  size={24}
                  fill={isFavorite ? 'var(--vermelho-escuro)' : 'none'}
                  color={isFavorite ? 'var(--vermelho-escuro)' : 'var(--cinza)'}
                />
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="col-12 col-md-6">
            <h1 className="text-azul-marinho">{service.nome_prestador}</h1>

            <div className="d-flex flex-wrap gap-2 mt-3">
              {service.categorias.map((cat) => (
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
                {service.nota_media.toFixed(1)}
              </span>
              <span className="text-cinza">
                ({service.total_avaliacoes} avaliações)
              </span>
            </div>

            <div className="mt-4">
              {service.telefone_contato && (
                <div className="d-flex align-items-center gap-3 mb-2">
                  <Phone size={20} color="var(--laranja-principal)" />
                  <span className="text-cinza">{service.telefone_contato}</span>
                </div>
              )}
              {service.email && (
                <div className="d-flex align-items-center gap-3 mb-2">
                  <Mail size={20} color="var(--laranja-principal)" />
                  <span className="text-cinza">{service.email}</span>
                </div>
              )}
              <div className="d-flex align-items-center gap-3">
                <Calendar size={20} color="var(--laranja-principal)" />
                <span className="text-cinza">
                  Membro desde {new Date(service.data_cadastro).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>

            <button
              onClick={handleContratar}
              className="btn btn-laranja w-100 py-3 mt-4 fs-5"
            >
              Contratar Serviço
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="mt-4">
          <h2 className="text-azul-marinho">Sobre o Serviço</h2>
          <p className="mt-3 text-cinza">
            {service.desc_servico}
          </p>
        </div>
      </section>

      {/* Avaliações */}
      <section className="container py-4 border-top">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h2 className="text-azul-marinho mb-0">Avaliações</h2>
          <button
            onClick={() => setShowAvaliacaoForm(!showAvaliacaoForm)}
            className="btn btn-verde-escuro"
          >
            {showAvaliacaoForm ? 'Cancelar' : 'Avaliar Serviço'}
          </button>
        </div>

        {/* Formulário de Avaliação */}
        {showAvaliacaoForm && (
          <form onSubmit={handleSubmitAvaliacao} className="bg-light p-4 rounded mb-4">
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
                  value={novaAvaliacao.nota_preco}
                  onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, nota_preco: Number(e.target.value) })}
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
                  value={novaAvaliacao.nota_tempo_execucao}
                  onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, nota_tempo_execucao: Number(e.target.value) })}
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
                  value={novaAvaliacao.nota_higiene}
                  onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, nota_higiene: Number(e.target.value) })}
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
                  value={novaAvaliacao.nota_educacao}
                  onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, nota_educacao: Number(e.target.value) })}
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
                          {avaliacao.nome_usuario.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="mb-0 text-azul-marinho">{avaliacao.nome_usuario}</p>
                        <p className="mb-0 small text-cinza">
                          {new Date(avaliacao.data_avaliacao).toLocaleDateString('pt-BR')}
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
                        <p className="mb-0 text-azul-marinho">{avaliacao.nota_preco}/5</p>
                      </div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="text-center p-2 bg-light rounded">
                        <p className="small text-cinza mb-1">Tempo</p>
                        <p className="mb-0 text-azul-marinho">{avaliacao.nota_tempo_execucao}/5</p>
                      </div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="text-center p-2 bg-light rounded">
                        <p className="small text-cinza mb-1">Higiene</p>
                        <p className="mb-0 text-azul-marinho">{avaliacao.nota_higiene}/5</p>
                      </div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="text-center p-2 bg-light rounded">
                        <p className="small text-cinza mb-1">Educação</p>
                        <p className="mb-0 text-azul-marinho">{avaliacao.nota_educacao}/5</p>
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