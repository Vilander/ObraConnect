import { Save, ArrowLeft, Loader2, Image as ImageIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import AlertDialog from './AlertDialog';

export function EditarServico({ idServico, navegarPara }) {
    const [loading, setLoading] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [dialog, setDialog] = useState({ aberto: false, mensagem: '' });

    const [formulario, setFormulario] = useState({
        titulo: '',
        descricao: '',
        categoria: '', // Opcional, mantido para consistência
    });

    const [imagemAtual, setImagemAtual] = useState(null);
    const [novaImagem, setNovaImagem] = useState(null);
    const [previewNovaImagem, setPreviewNovaImagem] = useState(null);

    // 1. Carregar dados do serviço ao abrir
    useEffect(() => {
        const carregarDados = async () => {
            try {
                const resposta = await fetch(`http://localhost:3001/api/servicos/${idServico}`);
                const dados = await resposta.json();

                if (resposta.ok) {
                    setFormulario({
                        titulo: dados.titulo || '',
                        descricao: dados.desc_servico || '',
                        categoria: '' // Backend ainda não retorna categoria vinculada, deixamos em branco ou tratamos depois
                    });
                    setImagemAtual(dados.imagem_url);
                } else {
                    setDialog({ aberto: true, mensagem: "Erro ao carregar dados do serviço." });
                }
            } catch (erro) {
                console.error(erro);
            } finally {
                setLoading(false);
            }
        };

        if (idServico) carregarDados();
    }, [idServico]);

    // 2. Manipular nova imagem
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNovaImagem(file);
            setPreviewNovaImagem(URL.createObjectURL(file));
        }
    };

    // 3. Salvar alterações
    const salvarAlteracoes = async (e) => {
        e.preventDefault();
        setSalvando(true);

        const formData = new FormData();
        formData.append('titulo', formulario.titulo);
        formData.append('descricao', formulario.descricao);

        if (novaImagem) {
            formData.append('imagem', novaImagem);
        }

        const token = localStorage.getItem('token');

        try {
            const resposta = await fetch(`http://localhost:3001/api/servicos/${idServico}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (resposta.ok) {
                setDialog({ aberto: true, mensagem: "Serviço atualizado com sucesso!" });
                // Volta para a lista após 1.5s
                setTimeout(() => navegarPara('meus-servicos'), 1500);
            } else {
                const erro = await resposta.json();
                setDialog({ aberto: true, mensagem: erro.erro || "Erro ao salvar." });
            }
        } catch (erro) {
            setDialog({ aberto: true, mensagem: "Erro de conexão." });
        } finally {
            setSalvando(false);
        }
    };

    if (loading) return <div className="text-center py-5"><Loader2 className="animate-spin text-laranja-principal" size={48} /></div>;

    return (
        <div className="bg-light min-vh-100 p-4">
            <div className="container" style={{ maxWidth: '800px' }}>
                <button onClick={() => navegarPara('meus-servicos')} className="btn btn-link text-decoration-none text-azul-marinho ps-0 mb-3 d-flex align-items-center gap-2">
                    <ArrowLeft size={20} /> Cancelar e Voltar
                </button>

                <div className="card shadow border-0">
                    <div className="card-body p-5">
                        <h2 className="text-azul-marinho fw-bold mb-4">Editar Serviço</h2>

                        <form onSubmit={salvarAlteracoes}>
                            <div className="mb-3">
                                <label className="form-label fw-bold text-azul-marinho">Título</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formulario.titulo}
                                    onChange={(e) => setFormulario({ ...formulario, titulo: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold text-azul-marinho">Descrição</label>
                                <textarea
                                    className="form-control"
                                    rows="5"
                                    value={formulario.descricao}
                                    onChange={(e) => setFormulario({ ...formulario, descricao: e.target.value })}
                                    required
                                ></textarea>
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold text-azul-marinho">Imagem</label>
                                <div className="d-flex gap-4 align-items-start">
                                    {/* Imagem Atual/Preview */}
                                    <div className="border rounded p-1" style={{ width: '150px' }}>
                                        <img
                                            src={previewNovaImagem || imagemAtual || 'https://via.placeholder.com/150'}
                                            alt="Preview"
                                            className="img-fluid rounded"
                                        />
                                        <div className="text-center small text-muted mt-1">
                                            {previewNovaImagem ? "Nova Imagem" : "Imagem Atual"}
                                        </div>
                                    </div>

                                    {/* Input de Arquivo */}
                                    <div className="flex-grow-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="form-control"
                                        />
                                        <div className="form-text mt-2">
                                            <ImageIcon size={14} className="me-1" />
                                            Deixe vazio para manter a imagem atual.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="d-grid">
                                <button
                                    type="submit"
                                    className="btn btn-laranja py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                                    disabled={salvando}
                                >
                                    {salvando ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                    Salvar Alterações
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <AlertDialog aberto={dialog.aberto} mensagem={dialog.mensagem} onClose={() => setDialog({ ...dialog, aberto: false })} />
        </div>
    );
}