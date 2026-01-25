import { Upload, CheckCircle, AlertTriangle, Loader2, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import AlertDialog from './AlertDialog';

export function CadastrarServico({ navegarPara }) {
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState({ aberto: false, mensagem: '' });
  
  // Estado do formulário
  const [formulario, setFormulario] = useState({
    titulo: '',
    descricao: '',
    categoria: '',
    telefone: '', 
  });
  
  const [imagemSelecionada, setImagemSelecionada] = useState(null);
  const [previewImagem, setPreviewImagem] = useState(null);

  // Lista de categorias sincronizada com o Banco de Dados
  const categorias = [
    'Arquiteto(a)', 'Armador(a) de Ferragens', 'Azulejista / Pisagista', 'Bombeiro(a) Hidráulico / Encanador(a)',
    'Calheiro(a)', 'Carpinteiro(a)', 'Desentupidor(a)', 'Designer de Interiores', 'Eletricista',
    'Engenheiro(a) Civil', 'Gesseiro(a)', 'Impermeabilizador(a)', 'Instalador(a) de Ar Condicionado',
    'Instalador(a) de Drywall', 'Instalador(a) de Gás', 'Instalador(a) de Sistemas de Segurança',
    'Jardineiro(a) / Paisagista', 'Limpador(a) Pós-Obra', 'Marceneiro(a)', 'Marido de Aluguel',
    'Mestre de Obras', 'Montador(a) de Andaimes', 'Montador(a) de Móveis', 'Terraplanagem',
    'Pedreiro(a)', 'Pintor(a)', 'Serralheiro(a)', 'Técnico(a) em Edificações', 'Topógrafo(a)', 'Vidraceiro(a)'
  ];

  // Manipula a seleção do arquivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagemSelecionada(file);
      // Cria uma URL temporária para mostrar a foto na tela antes de enviar
      setPreviewImagem(URL.createObjectURL(file));
    }
  };

  // Envia os dados para o Backend
  const submeterServico = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Validação simples
    if (!formulario.titulo || !formulario.descricao || !formulario.categoria) {
      setDialog({ aberto: true, mensagem: "Preencha todos os campos obrigatórios." });
      setLoading(false);
      return;
    }

    // 2. Prepara o FormData (Pacote para envio de arquivos)
    const formData = new FormData();
    formData.append('titulo', formulario.titulo);
    formData.append('descricao', formulario.descricao);
    
    // Nota: O backend atual ainda não salva a categoria na tabela de relacionamento,
    // mas vamos enviar para deixar pronto ou você pode adicionar ao texto da descrição se quiser.
    // Por enquanto, o backend ignora este campo se não tiver lógica para ele.
    formData.append('categoria', formulario.categoria); 

    if (imagemSelecionada) {
      formData.append('imagem', imagemSelecionada);
    }

    const token = localStorage.getItem('token');

    try {
      const resposta = await fetch('http://localhost:3001/api/servicos', {
        method: 'POST',
        headers: {
          // IMPORTANTE: Quando usamos FormData, NÃO definimos 'Content-Type'. 
          // O navegador faz isso sozinho. Apenas o Token é necessário.
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        setDialog({ aberto: true, mensagem: "Serviço cadastrado com sucesso!" });
        // Limpa o formulário
        setFormulario({ titulo: '', descricao: '', categoria: '', telefone: '' });
        setImagemSelecionada(null);
        setPreviewImagem(null);
        
        // Opcional: Redirecionar para a Home após uns segundos
        setTimeout(() => navegarPara('inicio'), 2000);
      } else {
        setDialog({ aberto: true, mensagem: dados.erro || "Erro ao cadastrar serviço." });
      }
    } catch (erro) {
      console.error(erro);
      setDialog({ aberto: true, mensagem: "Erro de conexão com o servidor." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 p-4">
      <div className="container" style={{ maxWidth: '800px' }}>
        
        {/* Botão Voltar */}
        <button 
          onClick={() => navegarPara('inicio')} 
          className="btn btn-link text-decoration-none text-azul-marinho ps-0 mb-3 d-flex align-items-center gap-2"
        >
          <ArrowLeft size={20} />
          Voltar
        </button>

        <div className="card shadow border-0">
          <div className="card-body p-5">
            <h2 className="text-azul-marinho fw-bold mb-4">Anuncie seu Serviço</h2>
            
            <form onSubmit={submeterServico}>
              {/* Título */}
              <div className="mb-4">
                <label className="form-label fw-bold text-azul-marinho">Título do Anúncio *</label>
                <input
                  type="text"
                  className="form-control py-3"
                  placeholder="Ex: Reforma de Telhados, Eletricista 24h..."
                  value={formulario.titulo}
                  onChange={(e) => setFormulario({...formulario, titulo: e.target.value})}
                  required
                />
              </div>

              {/* Categoria */}
              <div className="mb-4">
                <label className="form-label fw-bold text-azul-marinho">Categoria *</label>
                <select 
                  className="form-select py-3"
                  value={formulario.categoria}
                  onChange={(e) => setFormulario({...formulario, categoria: e.target.value})}
                  required
                >
                  <option value="">Selecione uma categoria...</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Descrição */}
              <div className="mb-4">
                <label className="form-label fw-bold text-azul-marinho">Descrição Detalhada *</label>
                <textarea
                  className="form-control"
                  rows="5"
                  placeholder="Descreva sua experiência, tipos de serviço que realiza, regiões que atende..."
                  value={formulario.descricao}
                  onChange={(e) => setFormulario({...formulario, descricao: e.target.value})}
                  required
                ></textarea>
              </div>

              {/* Upload de Imagem */}
              <div className="mb-4">
                <label className="form-label fw-bold text-azul-marinho">Foto do Serviço</label>
                <div className="border-2 border-dashed border-secondary rounded p-4 text-center bg-light position-relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
                    style={{ cursor: 'pointer' }}
                  />
                  
                  {previewImagem ? (
                    <div className="position-relative d-inline-block">
                        <img 
                            src={previewImagem} 
                            alt="Preview" 
                            className="img-fluid rounded shadow-sm" 
                            style={{ maxHeight: '200px' }} 
                        />
                        <div className="mt-2 text-success small fw-bold">
                            <CheckCircle size={16} className="d-inline me-1" />
                            Imagem selecionada
                        </div>
                    </div>
                  ) : (
                    <div className="py-3">
                        <Upload className="mx-auto text-cinza mb-2" size={32} />
                        <p className="text-cinza mb-0">Clique ou arraste uma foto aqui</p>
                        <p className="small text-muted">(Opcional, mas recomendado)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Botão de Envio */}
              <div className="d-grid">
                <button 
                  type="submit" 
                  className="btn btn-laranja py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                        <Loader2 className="animate-spin" size={20} />
                        Publicando...
                    </>
                  ) : 'Publicar Serviço'}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>

      <AlertDialog
        aberto={dialog.aberto}
        mensagem={dialog.mensagem}
        onClose={() => setDialog({ ...dialog, aberto: false })}
      />
    </div>
  );
}