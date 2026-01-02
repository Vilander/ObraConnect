import { Search, Star, Heart, Filter, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Home({ onNavigate, isLoggedIn }) {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const categories = [
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
    // const fetchServices = async () => {
    //   const response = await fetch('http://localhost:3000/servicos');
    //   const data = await response.json();
    //   setServices(data);
    // };
    // fetchServices();

    // Mock de serviços para demonstração
    const mockServices = [
      {
        id: 1,
        nome_prestador: 'João Silva',
        desc_servico: 'Serviços de alvenaria, construção e reforma. Experiência de 15 anos no mercado.',
        categorias: ['Pedreiro(a)'],
        imagem: 'https://images.unsplash.com/photo-1672748341520-6a839e6c05bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjB3b3JrZXJ8ZW58MXx8fHwxNzY0Mjg1OTAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        nota_media: 4.8,
        total_avaliacoes: 24,
        telefone_contato: '(11) 98765-4321'
      },
      {
        id: 2,
        nome_prestador: 'Carlos Elétrica',
        desc_servico: 'Instalações elétricas residenciais e comerciais. Certificado e com garantia.',
        categorias: ['Eletricista'],
        imagem: 'https://images.unsplash.com/photo-1745590591981-bb6d5274de9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpY2lhbiUyMHdvcmt8ZW58MXx8fHwxNzY0MjMwMjMxfDA&ixlib=rb-4.1.0&q=80&w=1080',
        nota_media: 4.9,
        total_avaliacoes: 32,
        telefone_contato: '(11) 98888-1234'
      },
      {
        id: 3,
        nome_prestador: 'Marcenaria Santos',
        desc_servico: 'Móveis planejados e sob medida. Projetos personalizados para sua casa.',
        categorias: ['Marceneiro(a)'],
        imagem: 'https://images.unsplash.com/photo-1626081063434-79a2169791b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJwZW50ZXIlMjB3b29kd29ya3xlbnwxfHx8fDE3NjQxOTk1NjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
        nota_media: 4.7,
        total_avaliacoes: 18,
        telefone_contato: '(11) 97777-5555'
      },
      {
        id: 4,
        nome_prestador: 'Hidráulica Rápida',
        desc_servico: 'Serviços hidráulicos em geral. Atendimento emergencial 24h.',
        categorias: ['Bombeiro(a) Hidráulico / Encanador(a)'],
        imagem: 'https://images.unsplash.com/photo-1650246363606-a2402ec42b08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbHVtYmVyJTIwd29ya3xlbnwxfHx8fDE3NjQyNTk0Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
        nota_media: 4.6,
        total_avaliacoes: 15,
        telefone_contato: '(11) 96666-7777'
      },
      {
        id: 5,
        nome_prestador: 'Pinturas Premium',
        desc_servico: 'Pintura residencial e comercial. Qualidade e acabamento perfeito.',
        categorias: ['Pintor(a)'],
        imagem: 'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWludGluZyUyMGhvdXNlfGVufDF8fHx8MTc2NDE4MzUwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
        nota_media: 4.8,
        total_avaliacoes: 21,
        telefone_contato: '(11) 95555-8888'
      },
      {
        id: 6,
        nome_prestador: 'Reformas Total',
        desc_servico: 'Reformas completas e pequenos reparos. Equipe qualificada.',
        categorias: ['Pedreiro(a)', 'Pintor(a)'],
        imagem: 'https://images.unsplash.com/photo-1645651964715-d200ce0939cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjB0b29sc3xlbnwxfHx8fDE3NjQyNTM2OTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
        nota_media: 4.5,
        total_avaliacoes: 12,
        telefone_contato: '(11) 94444-9999'
      }
    ];

    setServices(mockServices);
    setFilteredServices(mockServices);
  }, []);

  useEffect(() => {
    let filtered = services;

    // Filtrar por categoria
    if (selectedCategory) {
      filtered = filtered.filter(service => 
        service.categorias.includes(selectedCategory)
      );
    }

    // Filtrar por busca
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.nome_prestador.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.desc_servico.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.categorias.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredServices(filtered);
  }, [searchTerm, selectedCategory, services]);

  const toggleFavorite = async (serviceId) => {
    if (!isLoggedIn) {
      alert('Você precisa estar logado para favoritar serviços');
      return;
    }

    // TODO: Conectar com seu backend Node/Express
    // const response = await fetch('http://localhost:3000/favoritos', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ id_servico: serviceId })
    // });

    setFavorites(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchTerm('');
  };

  return (
    <div className="min-vh-100">
      {/* Hero Section */}
      <section className="py-5 px-3 bg-azul-claro">
        <div className="container">
          <h1 className="text-azul-marinho text-center">
            Encontre os Melhores Profissionais
          </h1>
          <p className="mt-3 text-cinza text-center">
            Conecte-se com profissionais qualificados de construção e reforma
          </p>

          {/* Search Bar */}
          <div className="mt-4 mx-auto" style={{ maxWidth: '700px' }}>
            <div className="position-relative">
              <Search className="position-absolute top-50 translate-middle-y ms-3" size={24} color="var(--cinza)" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control ps-5 py-3 shadow border-2 border-azul-marinho"
                placeholder="Buscar por serviço ou profissional..."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section className="py-4 px-3">
        <div className="container">
          <div className="row g-4">
            {/* Sidebar Filters - Desktop */}
            <div className="col-lg-3 d-none d-lg-block">
              <div className="card shadow-sm sticky-top" style={{ top: '100px' }}>
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h4 className="text-azul-marinho mb-0">Filtros</h4>
                    {(selectedCategory || searchTerm) && (
                      <button
                        onClick={clearFilters}
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
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">Todas as categorias</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedCategory && (
                    <div className="alert alert-info small mb-0">
                      <strong>{filteredServices.length}</strong> serviço(s) encontrado(s)
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Filter Button */}
            <div className="col-12 d-lg-none">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="btn btn-laranja w-100 d-flex align-items-center justify-content-center gap-2"
              >
                <Filter size={20} />
                Filtros {selectedCategory && `(1)`}
              </button>
            </div>

            {/* Services Grid */}
            <div className="col-12 col-lg-9">
              {filteredServices.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-cinza">
                    Nenhum serviço encontrado
                  </p>
                  {(selectedCategory || searchTerm) && (
                    <button
                      onClick={clearFilters}
                      className="btn btn-laranja mt-3"
                    >
                      Limpar Filtros
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="mb-3 text-cinza">
                    Exibindo <strong>{filteredServices.length}</strong> de <strong>{services.length}</strong> serviços
                  </div>
                  <div className="row g-4">
                    {filteredServices.map((service) => (
                      <div key={service.id} className="col-12 col-md-6 col-xl-4">
                        <div className="card h-100 shadow card-hover">
                          <div
                            onClick={() => onNavigate('service-detail', service.id)}
                            className="position-relative"
                            style={{ cursor: 'pointer' }}
                          >
                            <img
                              src={service.imagem}
                              alt={service.nome_prestador}
                              className="card-img-top object-cover"
                              style={{ height: '200px' }}
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(service.id);
                              }}
                              className="btn btn-light rounded-circle position-absolute top-0 end-0 m-3 shadow-sm"
                              style={{ width: '40px', height: '40px', padding: '0' }}
                            >
                              <Heart
                                size={20}
                                fill={favorites.includes(service.id) ? 'var(--vermelho-escuro)' : 'none'}
                                color={favorites.includes(service.id) ? 'var(--vermelho-escuro)' : 'var(--cinza)'}
                              />
                            </button>
                          </div>

                          <div className="card-body">
                            <h3 className="card-title text-azul-marinho">
                              {service.nome_prestador}
                            </h3>

                            <div className="d-flex flex-wrap gap-2 mt-2">
                              {service.categorias.map((cat) => (
                                <span
                                  key={cat}
                                  className="badge bg-amarelo-ouro text-marrom-escuro"
                                >
                                  {cat}
                                </span>
                              ))}
                            </div>

                            <p className="card-text mt-3 text-cinza line-clamp-2">
                              {service.desc_servico}
                            </p>

                            <div className="d-flex align-items-center justify-content-between mt-3">
                              <div className="d-flex align-items-center gap-1">
                                <Star size={20} fill="var(--amarelo)" color="var(--amarelo)" />
                                <span className="text-azul-marinho">
                                  {service.nota_media.toFixed(1)}
                                </span>
                                <span className="text-cinza small">
                                  ({service.total_avaliacoes})
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => onNavigate('service-detail', service.id)}
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

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-lg-none" 
          style={{ zIndex: 1050, backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowMobileFilters(false)}
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
                  onClick={() => setShowMobileFilters(false)}
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
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">Todas as categorias</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCategory && (
                  <div className="alert alert-info small">
                    <strong>{filteredServices.length}</strong> serviço(s) encontrado(s)
                  </div>
                )}
              </div>

              <div className="p-3 border-top">
                <button
                  onClick={() => {
                    clearFilters();
                    setShowMobileFilters(false);
                  }}
                  className="btn btn-outline-secondary w-100 mb-2"
                >
                  Limpar Filtros
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
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