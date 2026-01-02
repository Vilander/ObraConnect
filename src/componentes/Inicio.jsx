import { Search, Star, Heart, Filter, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Inicio({ navegarPara, estaLogado }) {
  const [servicos, setServicos] = useState([]);
  const [servicosFiltrados, setServicosFiltrados] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [favoritos, setFavoritos] = useState([]);
  const [mostrarFiltrosMobile, setMostrarFiltrosMobile] = useState(false);

  const categorias = [
    'Arquiteto(a)',
    'Armador(a) de Ferragens',
    'Azulejista / Pisagista',
    'Bombeiro(a) Hidráulico / Encanador(a)',
    'Calheiro(a)',
    'Carpinteiro(a)',
    'Desentupidor(a)',
    'Designer de Interiores',
    'Eletricista',
    'Engenheiro(a) Civil',
    'Gesseiro(a)',
    'Impermeabilizador(a)',
    'Instalador(a) de Ar Condicionado',
    'Instalador(a) de Drywall',
    'Instalador(a) de Gás',
    'Instalador(a) de Sistemas de Segurança',
    'Jardineiro(a) / Paisagista',
    'Limpador(a) Pós-Obra',
    'Marceneiro(a)',
    'Marido de Aluguel',
    'Mestre de Obras',
    'Montador(a) de Andaimes',
    'Montador(a) de Móveis',
    'Terraplanagem',
    'Pedreiro(a)',
    'Pintor(a)',
    'Serralheiro(a)',
    'Técnico(a) em Edificações',
    'Topógrafo(a)',
    'Vidraceiro(a)'
  ];

  useEffect(() => {
    // TODO: Conectar com seu backend Node/Express
    // Exemplo de chamada:
    // const buscarServicos = async () => {
    //   const resposta = await fetch('http://localhost:3000/servicos');
    //   const dados = await resposta.json();
    //   setServicos(dados);
    // };
    // buscarServicos();

    // Mock de serviços para demonstração
    const servicosMock = [
      {
        id: 1,
        nomePrestador: 'João Silva',
        descServico: 'Serviços de alvenaria, construção e reforma. Experiência de 15 anos no mercado.',
        categorias: ['Pedreiro(a)'],
        imagem: 'https://images.unsplash.com/photo-1672748341520-6a839e6c05bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjB3b3JrZXJ8ZW58MXx8fHwxNzY0Mjg1OTAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        notaMedia: 4.8,
        totalAvaliacoes: 24,
        telefoneContato: '(11) 98765-4321'
      },
      {
        id: 2,
        nomePrestador: 'Carlos Elétrica',
        descServico: 'Instalações elétricas residenciais e comerciais. Certificado e com garantia.',
        categorias: ['Eletricista'],
        imagem: 'https://images.unsplash.com/photo-1745590591981-bb6d5274de9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpY2lhbiUyMHdvcmt8ZW58MXx8fHwxNzY0MjMwMjMxfDA&ixlib=rb-4.1.0&q=80&w=1080',
        notaMedia: 4.9,
        totalAvaliacoes: 32,
        telefoneContato: '(11) 98888-1234'
      },
      {
        id: 3,
        nomePrestador: 'Marcenaria Santos',
        descServico: 'Móveis planejados e sob medida. Projetos personalizados para sua casa.',
        categorias: ['Marceneiro(a)'],
        imagem: 'https://images.unsplash.com/photo-1626081063434-79a2169791b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJwZW50ZXIlMjB3b29kd29ya3xlbnwxfHx8fDE3NjQxOTk1NjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
        notaMedia: 4.7,
        totalAvaliacoes: 18,
        telefoneContato: '(11) 97777-5555'
      },
      {
        id: 4,
        nomePrestador: 'Hidráulica Rápida',
        descServico: 'Serviços hidráulicos em geral. Atendimento emergencial 24h.',
        categorias: ['Bombeiro(a) Hidráulico / Encanador(a)'],
        imagem: 'https://images.unsplash.com/photo-1650246363606-a2402ec42b08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbHVtYmVyJTIwd29ya3xlbnwxfHx8fDE3NjQyNTk0Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
        notaMedia: 4.6,
        totalAvaliacoes: 15,
        telefoneContato: '(11) 96666-7777'
      },
      {
        id: 5,
        nomePrestador: 'Pinturas Premium',
        descServico: 'Pintura residencial e comercial. Qualidade e acabamento perfeito.',
        categorias: ['Pintor(a)'],
        imagem: 'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWludGluZyUyMGhvdXNlfGVufDF8fHx8MTc2NDE4MzUwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
        notaMedia: 4.8,
        totalAvaliacoes: 21,
        telefoneContato: '(11) 95555-8888'
      },
      {
        id: 6,
        nomePrestador: 'Reformas Total',
        descServico: 'Reformas completas e pequenos reparos. Equipe qualificada.',
        categorias: ['Pedreiro(a)', 'Pintor(a)'],
        imagem: 'https://images.unsplash.com/photo-1645651964715-d200ce0939cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjB0b29sc3xlbnwxfHx8fDE3NjQyNTM2OTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
        notaMedia: 4.5,
        totalAvaliacoes: 12,
        telefoneContato: '(11) 94444-9999'
      }
    ];

    setServicos(servicosMock);
    setServicosFiltrados(servicosMock);
  }, []);

  useEffect(() => {
    let filtrados = servicos;

    // Filtrar por categoria
    if (categoriaSelecionada) {
      filtrados = filtrados.filter(servico => 
        servico.categorias.includes(categoriaSelecionada)
      );
    }

    // Filtrar por busca
    if (termoBusca) {
      filtrados = filtrados.filter(servico =>
        servico.nomePrestador.toLowerCase().includes(termoBusca.toLowerCase()) ||
        servico.descServico.toLowerCase().includes(termoBusca.toLowerCase()) ||
        servico.categorias.some(cat => cat.toLowerCase().includes(termoBusca.toLowerCase()))
      );
    }

    setServicosFiltrados(filtrados);
  }, [termoBusca, categoriaSelecionada, servicos]);

  const alternarFavorito = async (idServico) => {
    if (!estaLogado) {
      alert('Você precisa estar logado para favoritar serviços');
      return;
    }

    // TODO: Conectar com seu backend Node/Express
    // const resposta = await fetch('http://localhost:3000/favoritos', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ idServico: idServico })
    // });

    setFavoritos(anterior =>
      anterior.includes(idServico)
        ? anterior.filter(id => id !== idServico)
        : [...anterior, idServico]
    );
  };

  const limparFiltros = () => {
    setCategoriaSelecionada('');
    setTermoBusca('');
  };

  return (
    <div className="min-vh-100">
      {/* Seção Hero */}
      <section className="py-5 px-3 bg-azul-claro">
        <div className="container">
          <h1 className="text-azul-marinho text-center">
            Encontre os Melhores Profissionais
          </h1>
          <p className="mt-3 text-cinza text-center">
            Conecte-se com profissionais qualificados de construção e reforma
          </p>

          {/* Barra de Busca */}
          <div className="mt-4 mx-auto" style={{ maxWidth: '700px' }}>
            <div className="position-relative">
              <Search className="position-absolute top-50 translate-middle-y ms-3" size={24} color="var(--cinza)" />
              <input
                type="text"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                className="form-control ps-5 py-3 shadow border-2 border-azul-marinho"
                placeholder="Buscar por serviço ou profissional..."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal com Barra Lateral */}
      <section className="py-4 px-3">
        <div className="container">
          <div className="row g-4">
            {/* Filtros Laterais - Desktop */}
            <div className="col-lg-3 d-none d-lg-block">
              <div className="card shadow-sm sticky-top" style={{ top: '100px' }}>
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h4 className="text-azul-marinho mb-0">Filtros</h4>
                    {(categoriaSelecionada || termoBusca) && (
                      <button
                        onClick={limparFiltros}
                        className="btn btn-sm btn-link text-laranja-principal p-0"
                      >
                        Limpar
                      </button>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-azul-marinho">
                      Categoria
                    </label>
                    <select
                      className="form-select"
                      value={categoriaSelecionada}
                      onChange={(e) => setCategoriaSelecionada(e.target.value)}
                    >
                      <option value="">Todas as categorias</option>
                      {categorias.map((categoria) => (
                        <option key={categoria} value={categoria}>
                          {categoria}
                        </option>
                      ))}
                    </select>
                  </div>

                  {categoriaSelecionada && (
                    <div className="alert alert-info small mb-0">
                      <strong>{servicosFiltrados.length}</strong> serviço(s) encontrado(s)
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Botão Filtro Mobile */}
            <div className="col-12 d-lg-none">
              <button
                onClick={() => setMostrarFiltrosMobile(true)}
                className="btn btn-laranja w-100 d-flex align-items-center justify-content-center gap-2"
              >
                <Filter size={20} />
                Filtros {categoriaSelecionada && `(1)`}
              </button>
            </div>

            {/* Grade de Serviços */}
            <div className="col-12 col-lg-9">
              {servicosFiltrados.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-cinza">
                    Nenhum serviço encontrado
                  </p>
                  {(categoriaSelecionada || termoBusca) && (
                    <button
                      onClick={limparFiltros}
                      className="btn btn-laranja mt-3"
                    >
                      Limpar Filtros
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="mb-3 text-cinza">
                    Exibindo <strong>{servicosFiltrados.length}</strong> de <strong>{servicos.length}</strong> serviços
                  </div>
                  <div className="row g-4">
                    {servicosFiltrados.map((servico) => (
                      <div key={servico.id} className="col-12 col-md-6 col-xl-4">
                        <div className="card h-100 shadow card-hover">
                          <div
                            onClick={() => navegarPara('detalhe-servico', servico.id)}
                            className="position-relative"
                            style={{ cursor: 'pointer' }}
                          >
                            <img
                              src={servico.imagem}
                              alt={servico.nomePrestador}
                              className="card-img-top object-cover"
                              style={{ height: '200px' }}
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                alternarFavorito(servico.id);
                              }}
                              className="btn btn-light rounded-circle position-absolute top-0 end-0 m-3 shadow-sm"
                              style={{ width: '40px', height: '40px', padding: '0' }}
                            >
                              <Heart
                                size={20}
                                fill={favoritos.includes(servico.id) ? 'var(--vermelho-escuro)' : 'none'}
                                color={favoritos.includes(servico.id) ? 'var(--vermelho-escuro)' : 'var(--cinza)'}
                              />
                            </button>
                          </div>

                          <div className="card-body">
                            <h3 className="card-title text-azul-marinho">
                              {servico.nomePrestador}
                            </h3>

                            <div className="d-flex flex-wrap gap-2 mt-2">
                              {servico.categorias.map((cat) => (
                                <span
                                  key={cat}
                                  className="badge bg-amarelo-ouro text-marrom-escuro"
                                >
                                  {cat}
                                </span>
                              ))}
                            </div>

                            <p className="card-text mt-3 text-cinza line-clamp-2">
                              {servico.descServico}
                            </p>

                            <div className="d-flex align-items-center justify-content-between mt-3">
                              <div className="d-flex align-items-center gap-1">
                                <Star size={20} fill="var(--amarelo)" color="var(--amarelo)" />
                                <span className="text-azul-marinho">
                                  {servico.notaMedia.toFixed(1)}
                                </span>
                                <span className="text-cinza small">
                                  ({servico.totalAvaliacoes})
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => navegarPara('detalhe-servico', servico.id)}
                              className="btn btn-laranja w-100 mt-3"
                            >
                              Ver Detalhes
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Modal de Filtros Mobile */}
      {mostrarFiltrosMobile && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-lg-none" 
          style={{ zIndex: 1050, backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setMostrarFiltrosMobile(false)}
        >
          <div 
            className="position-absolute top-0 end-0 h-100 bg-white shadow-lg"
            style={{ width: '300px', maxWidth: '85vw' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex flex-column h-100">
              <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
                <h4 className="text-azul-marinho mb-0">Filtros</h4>
                <button
                  onClick={() => setMostrarFiltrosMobile(false)}
                  className="btn btn-sm btn-light rounded-circle"
                  style={{ width: '35px', height: '35px', padding: '0' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-grow-1 overflow-auto p-3">
                <div className="mb-3">
                  <label className="form-label text-azul-marinho">
                    Categoria
                  </label>
                  <select
                    className="form-select"
                    value={categoriaSelecionada}
                    onChange={(e) => setCategoriaSelecionada(e.target.value)}
                  >
                    <option value="">Todas as categorias</option>
                    {categorias.map((categoria) => (
                      <option key={categoria} value={categoria}>
                        {categoria}
                      </option>
                    ))}
                  </select>
                </div>

                {categoriaSelecionada && (
                  <div className="alert alert-info small">
                    <strong>{servicosFiltrados.length}</strong> serviço(s) encontrado(s)
                  </div>
                )}
              </div>

              <div className="p-3 border-top">
                <button
                  onClick={() => {
                    limparFiltros();
                    setMostrarFiltrosMobile(false);
                  }}
                  className="btn btn-outline-secondary w-100 mb-2"
                >
                  Limpar Filtros
                </button>
                <button
                  onClick={() => setMostrarFiltrosMobile(false)}
                  className="btn btn-laranja w-100"
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
