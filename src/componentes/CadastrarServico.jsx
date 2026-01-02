import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import AlertDialog from './AlertDialog';

export function CadastrarServico({ navegarPara }) {
  const [dadosFormulario, setDadosFormulario] = useState({
    nomePrestador: '',
    descServico: '',
    email: '',
    telefoneContato: '',
    categoriasSelecionadas: []
  });

  const [dialogAberto, setDialogAberto] = useState(false);
  const [mensagemDialog, setMensagemDialog] = useState('');

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

  const alternarCategoria = (categoria) => {
    setDadosFormulario(anterior => ({
      ...anterior,
      categoriasSelecionadas: anterior.categoriasSelecionadas.includes(categoria)
        ? anterior.categoriasSelecionadas.filter(c => c !== categoria)
        : [...anterior.categoriasSelecionadas, categoria]
    }));
  };

  const submeterFormulario = async (e) => {
    e.preventDefault();

    if (dadosFormulario.categoriasSelecionadas.length === 0) {
      setMensagemDialog('Por favor, selecione pelo menos uma categoria');
      setDialogAberto(true);
      return;
    }

    // TODO: Conectar com seu backend Node/Express
    // Exemplo de chamada:
    // const resposta = await fetch('http://localhost:3000/servicos/cadastrar', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(dadosFormulario)
    // });
    // const dados = await resposta.json();

    setMensagemDialog('Serviço cadastrado com sucesso!');
    setDialogAberto(true);
    navegarPara('inicio');
  };

  return (
    <div className="min-vh-100 py-4 px-3">
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Botão Voltar */}
        <button
          onClick={() => navegarPara('inicio')}
          className="btn btn-light d-flex align-items-center gap-2 mb-4"
        >
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </button>

        {/* Container do Formulário */}
        <div className="card shadow-lg">
          <div className="card-body p-4 p-md-5">
            <h1 className="text-azul-marinho mb-2">
              Cadastrar Novo Serviço
            </h1>
            <p className="text-cinza mb-4">
              Preencha as informações abaixo para cadastrar seu serviço no marketplace
            </p>

            <form onSubmit={submeterFormulario}>
              {/* Nome do Prestador */}
              <div className="mb-4">
                <label className="form-label text-azul-marinho">
                  Nome do Prestador *
                </label>
                <input
                  type="text"
                  value={dadosFormulario.nomePrestador}
                  onChange={(e) => setDadosFormulario({ ...dadosFormulario, nomePrestador: e.target.value })}
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
                        onClick={() => alternarCategoria(categoria)}
                        className={`btn w-100 py-2 text-start ${dadosFormulario.categoriasSelecionadas.includes(categoria)
                          ? 'btn-laranja shadow'
                          : 'btn-outline-secondary'
                          }`}
                      >
                        {dadosFormulario.categoriasSelecionadas.includes(categoria) && (
                          <span className="me-1">✓</span>
                        )}
                        {categoria}
                      </button>
                    </div>
                  ))}
                </div>
                {dadosFormulario.categoriasSelecionadas.length > 0 && (
                  <div className="mt-3">
                    <small className="text-cinza">
                      {dadosFormulario.categoriasSelecionadas.length} categoria(s) selecionada(s)
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
                  value={dadosFormulario.descServico}
                  onChange={(e) => setDadosFormulario({ ...dadosFormulario, descServico: e.target.value })}
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
                  value={dadosFormulario.email}
                  onChange={(e) => setDadosFormulario({ ...dadosFormulario, email: e.target.value })}
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
                  value={dadosFormulario.telefoneContato}
                  onChange={(e) => setDadosFormulario({ ...dadosFormulario, telefoneContato: e.target.value })}
                  className="form-control py-3 border-2 border-azul-claro"
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>

              {/* Botões */}
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
                    onClick={() => navegarPara('inicio')}
                    className="btn btn-outline-secondary w-100 py-3"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Caixa de Informações */}
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
        <AlertDialog
          aberto={dialogAberto}
          mensagem={mensagemDialog}
          onClose={() => {
            setDialogAberto(false);

            if (mensagemDialog === 'Serviço cadastrado com sucesso!') {
              navegarPara('inicio');
            }
          }}
        />
      </div>
    </div>
  );
}
