import { useState } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';

export function RegisterService({ onNavigate }) {
  const [formData, setFormData] = useState({
    nome_prestador: '',
    desc_servico: '',
    email: '',
    telefone_contato: '',
    categorias_selecionadas: []
  });

  const categoriasDisponiveis = [
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

  const toggleCategoria = (categoria) => {
    setFormData(prev => ({
      ...prev,
      categorias_selecionadas: prev.categorias_selecionadas.includes(categoria)
        ? prev.categorias_selecionadas.filter(c => c !== categoria)
        : [...prev.categorias_selecionadas, categoria]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.categorias_selecionadas.length === 0) {
      alert('Por favor, selecione pelo menos uma categoria');
      return;
    }

    // TODO: Conectar com seu backend Node/Express
    // Exemplo de chamada:
    // const response = await fetch('http://localhost:3000/servicos/cadastrar', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData)
    // });
    // const data = await response.json();

    alert('Serviço cadastrado com sucesso!');
    onNavigate('home');
  };

  return (
    <div className="min-vh-100 py-4 px-3">
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Back Button */}
        <button
          onClick={() => onNavigate('home')}
          className="btn btn-light d-flex align-items-center gap-2 mb-4"
        >
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </button>

        {/* Form Container */}
        <div className="card shadow-lg">
          <div className="card-body p-4 p-md-5">
            <h1 className="text-azul-marinho mb-2">
              Cadastrar Novo Serviço
            </h1>
            <p className="text-cinza mb-4">
              Preencha as informações abaixo para cadastrar seu serviço no marketplace
            </p>

            <form onSubmit={handleSubmit}>
              {/* Nome do Prestador */}
              <div className="mb-4">
                <label className="form-label text-azul-marinho">
                  Nome do Prestador *
                </label>
                <input
                  type="text"
                  value={formData.nome_prestador}
                  onChange={(e) => setFormData({ ...formData, nome_prestador: e.target.value })}
                  className="form-control py-3 border-2 border-azul-claro"
                  placeholder="Ex: João Silva Construções"
                  required
                />
              </div>

              {/* Categorias */}
              <div className="mb-4">
                <label className="form-label text-azul-marinho mb-2">
                  Categorias de Serviço *
                </label>
                <p className="small text-cinza mb-3">
                  Selecione uma ou mais categorias que você atende
                </p>
                <div className="row g-2">
                  {categoriasDisponiveis.map((categoria) => (
                    <div key={categoria} className="col-12 col-sm-6 col-md-4">
                      <button
                        type="button"
                        onClick={() => toggleCategoria(categoria)}
                        className={`btn w-100 py-2 text-start ${formData.categorias_selecionadas.includes(categoria)
                            ? 'btn-laranja shadow'
                            : 'btn-outline-secondary'
                          }`}
                      >
                        {formData.categorias_selecionadas.includes(categoria) && (
                          <span className="me-1">✓</span>
                        )}
                        {categoria}
                      </button>
                    </div>
                  ))}
                </div>
                {formData.categorias_selecionadas.length > 0 && (
                  <div className="mt-3">
                    <small className="text-cinza">
                      {formData.categorias_selecionadas.length} categoria(s) selecionada(s)
                    </small>
                  </div>
                )}
              </div>

              {/* Descrição */}
              <div className="mb-4">
                <label className="form-label text-azul-marinho">
                  Descrição do Serviço *
                </label>
                <textarea
                  value={formData.desc_servico}
                  onChange={(e) => setFormData({ ...formData, desc_servico: e.target.value })}
                  className="form-control py-3 border-2 border-azul-claro"
                  rows={5}
                  placeholder="Descreva seus serviços, experiência, diferenciais, etc."
                  required
                />
                <small className="form-text text-cinza">
                  Mínimo 50 caracteres. Seja claro e detalhado.
                </small>
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="form-label text-azul-marinho">
                  Email para Contato
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-control py-3 border-2 border-azul-claro"
                  placeholder="seu@email.com"
                />
              </div>

              {/* Telefone */}
              <div className="mb-4">
                <label className="form-label text-azul-marinho">
                  Telefone para Contato *
                </label>
                <input
                  type="tel"
                  value={formData.telefone_contato}
                  onChange={(e) => setFormData({ ...formData, telefone_contato: e.target.value })}
                  className="form-control py-3 border-2 border-azul-claro"
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="row g-3 pt-3">
                <div className="col-12 col-md-6">
                  <button
                    type="submit"
                    className="btn btn-laranja w-100 py-3"
                  >
                    Cadastrar Serviço
                  </button>
                </div>
                <div className="col-12 col-md-6">
                  <button
                    type="button"
                    onClick={() => onNavigate('home')}
                    className="btn btn-outline-secondary w-100 py-3"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Info Box */}
        <div className="card bg-azul-claro mt-4">
          <div className="card-body p-4">
            <h3 className="text-azul-marinho mb-3">Dicas para um bom cadastro:</h3>
            <ul className="text-cinza mb-0">
              <li className="mb-2">• Seja específico na descrição dos seus serviços</li>
              <li className="mb-2">• Mencione sua experiência e qualificações</li>
              <li className="mb-2">• Informe sobre garantias e diferenciais</li>
              <li className="mb-2">• Mantenha seus dados de contato atualizados</li>
              <li>• Responda rapidamente às solicitações de contratação</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}