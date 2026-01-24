import { Search, Star, Heart, Filter, X, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import AlertDialog from './AlertDialog';

export function Inicio({ navegarPara, estaLogado }) {
  const [servicos, setServicos] = useState([]);
  const [servicosFiltrados, setServicosFiltrados] = useState([]);
  const [carregando, setCarregando] = useState(true); // Estado de carregamento

  const [termoBusca, setTermoBusca] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [favoritos, setFavoritos] = useState([]);
  const [mostrarFiltrosMobile, setMostrarFiltrosMobile] = useState(false);

  // Estado Dialog
  const [dialog, setDialog] = useState({ aberto: false, mensagem: '' });

  // Lista de Categorias (Sincronizada com seu Banco de Dados)
  const categorias = [
    'Arquiteto(a)', 'Armador(a) de Ferragens', 'Azulejista / Pisagista', 'Bombeiro(a) Hidráulico / Encanador(a)',
    'Calheiro(a)', 'Carpinteiro(a)', 'Desentupidor(a)', 'Designer de Interiores', 'Eletricista',
    'Engenheiro(a) Civil', 'Gesseiro(a)', 'Impermeabilizador(a)', 'Instalador(a) de Ar Condicionado',
    'Instalador(a) de Drywall', 'Instalador(a) de Gás', 'Instalador(a) de Sistemas de Segurança',
    'Jardineiro(a) / Paisagista', 'Limpador(a) Pós-Obra', 'Marceneiro(a)', 'Marido de Aluguel',
    'Mestre de Obras', 'Montador(a) de Andaimes', 'Montador(a) de Móveis', 'Terraplanagem',
    'Pedreiro(a)', 'Pintor(a)', 'Serralheiro(a)', 'Técnico(a) em Edificações', 'Topógrafo(a)', 'Vidraceiro(a)'
  ];

  // --- INTEGRAÇÃO: BUSCAR SERVIÇOS DO BACKEND ---
  useEffect(() => {
    const buscarServicos = async () => {
      try {
        const resposta = await fetch('http://localhost:3001/api/servicos');
        const dados = await resposta.json();

        // Mapeia os dados do Banco (snake_case) para o Frontend (camelCase)
        const servicosFormatados = dados.map(item => ({
          id: item.id,
          nomePrestador: item.nome_prestador, // Banco: nome_prestador -> Front: nomePrestador
          descServico: item.desc_servico,
          imagem: item.imagem_url || 'https://via.placeholder.com/400x300?text=Sem+Imagem', // Fallback se não tiver foto
          notaMedia: Number(item.nota_media) || 0,
          totalAvaliacoes: item.total_avaliacoes || 0,
          telefoneContato: item.telefone || 'Não informado', // Ajuste conforme seu SELECT

          // OBS: Como ainda não implementamos o vínculo de categorias no backend,
          // vamos deixar um array vazio ou pegar do item se você já implementou.
          categorias: []
        }));

        setServicos(servicosFormatados);
        setServicosFiltrados(servicosFormatados);
      } catch (erro) {
        console.error("Erro ao buscar serviços:", erro);
        setDialog({ aberto: true, mensagem: 'Não foi possível carregar os serviços do servidor.' });
      } finally {
        setCarregando(false);
      }
    };

    buscarServicos();
  }, []);

  // Filtros (Mantido igual)
  useEffect(() => {
    let filtrados = servicos;

    if (categoriaSelecionada) {
      // Nota: Como o backend ainda não manda categorias, esse filtro só funcionará
      // quando implementarmos o vínculo no backend.
      filtrados = filtrados.filter(servico =>
        servico.categorias.includes(categoriaSelecionada)
      );
    }

    if (termoBusca) {
      filtrados = filtrados.filter(servico =>
        servico.nomePrestador.toLowerCase().includes(termoBusca.toLowerCase()) ||
        servico.descServico.toLowerCase().includes(termoBusca.toLowerCase())
      );
    }

    setServicosFiltrados(filtrados);
  }, [termoBusca, categoriaSelecionada, servicos]);

  const alternarFavorito = async (idServico) => {
    if (!estaLogado) {
      setDialog({ aberto: true, mensagem: 'Você precisa estar logado para favoritar serviços' });
      return;
    }
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

      {/* Conteúdo Principal */}
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
                      <button onClick={limparFiltros} className="btn btn-sm btn-link text-laranja-principal p-0">
                        Limpar
                      </button>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-azul-marinho">Categoria</label>
                    <select
                      className="form-select"
                      value={categoriaSelecionada}
                      onChange={(e) => setCategoriaSelecionada(e.target.value)}
                    >
                      <option value="">Todas as categorias</option>
                      {categorias.map((categoria) => (
                        <option key={categoria} value={categoria}>{categoria}</option>
                      ))}
                    </select>
                  </div>

                  <div className="alert alert-light small text-cinza">
                    <small>Filtro por categoria em breve</small>
                  </div>
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
              {carregando ? (
                <div className="text-center py-5">
                  <Loader2 className="animate-spin mx-auto text-laranja-principal" size={48} />
                  <p className="mt-3 text-cinza">Carregando serviços...</p>
                </div>
              ) : servicosFiltrados.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-cinza">Nenhum serviço encontrado.</p>
                  <p className="small text-cinza">Tente cadastrar um novo serviço ou limpar a busca.</p>
                  {(categoriaSelecionada || termoBusca) && (
                    <button onClick={limparFiltros} className="btn btn-laranja mt-3">
                      Limpar Filtros
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="mb-3 text-cinza">
                    Exibindo <strong>{servicosFiltrados.length}</strong> serviço(s)
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
                              style={{ height: '200px', width: '100%' }}
                              onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Imagem+Indispon%C3%ADvel'; }}
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                alternarFavorito(servico.id);
                              }}
                              className="btn btn-light rounded-circle position-absolute top-0 end-0 m-3 shadow-sm d-flex align-items-center justify-content-center"
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
                            <h3 className="card-title text-azul-marinho h5">
                              {servico.nomePrestador}
                            </h3>

                            {/* Categorias (Placeholder até implementar no backend) */}
                            <div className="d-flex flex-wrap gap-2 mt-2">
                              {/* Como ainda não vem do back, não mostramos nada ou um badge fixo */}
                            </div>

                            <p className="card-text mt-3 text-cinza line-clamp-2 small">
                              {servico.descServico}
                            </p>

                            <div className="d-flex align-items-center justify-content-between mt-3">
                              <div className="d-flex align-items-center gap-1">
                                <Star size={20} fill="var(--amarelo)" color="var(--amarelo)" />
                                <span className="text-azul-marinho fw-bold">
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

      <AlertDialog
        aberto={dialog.aberto}
        mensagem={dialog.mensagem}
        onClose={() => setDialog({ ...dialog, aberto: false })}
      />
    </div>
  );
}