import { Pencil, Trash2, Plus, Loader2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import AlertDialog from './AlertDialog';

export function MeusServicos({ navegarPara }) {
    const [servicos, setServicos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados para o Dialog
    const [dialog, setDialog] = useState({ aberto: false, titulo: '', mensagem: '' });
    const [servicoParaExcluir, setServicoParaExcluir] = useState(null);

    // 1. Busca os serviços ao carregar a página
    const buscarMeusServicos = async () => {
        const token = localStorage.getItem('token');
        try {
            const resposta = await fetch('http://localhost:3001/api/servicos/meus-servicos', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const dados = await resposta.json();

            if (resposta.ok) {
                // Mapeia para garantir campos camelCase
                const formatados = dados.map(item => ({
                    id: item.id,
                    titulo: item.titulo || 'Sem título',
                    descricao: item.desc_servico,
                    imagem: item.imagem_url
                }));
                setServicos(formatados);
            }
        } catch (erro) {
            console.error("Erro ao buscar serviços:", erro);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        buscarMeusServicos();
    }, []);

    // 2. Lógica de Exclusão
    const confirmarExclusao = (id) => {
        setServicoParaExcluir(id); // Guarda o ID e abre a confirmação
    };

    const executarExclusao = async () => {
        if (!servicoParaExcluir) return;

        const token = localStorage.getItem('token');
        try {
            const resposta = await fetch(`http://localhost:3001/api/servicos/${servicoParaExcluir}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (resposta.ok) {
                // Remove o item da lista visualmente sem precisar recarregar tudo
                setServicos(atual => atual.filter(s => s.id !== servicoParaExcluir));
                setDialog({ aberto: true, titulo: 'Sucesso', mensagem: 'Serviço excluído com sucesso.' });
            } else {
                setDialog({ aberto: true, titulo: 'Erro', mensagem: 'Não foi possível excluir o serviço.' });
            }
        } catch (erro) {
            setDialog({ aberto: true, titulo: 'Erro', mensagem: 'Erro de conexão.' });
        } finally {
            setServicoParaExcluir(null); // Reseta o estado
        }
    };

    if (loading) return <div className="text-center py-5"><Loader2 className="animate-spin text-laranja-principal" size={48} /></div>;

    return (
        <div className="bg-light min-vh-100 p-4">
            <div className="container">

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <button onClick={() => navegarPara('inicio')} className="btn btn-link text-decoration-none text-azul-marinho ps-0 d-flex align-items-center gap-2">
                            <ArrowLeft size={20} /> Voltar
                        </button>
                        <h2 className="fw-bold text-azul-marinho">Gerenciar Meus Anúncios</h2>
                    </div>
                    <button onClick={() => navegarPara('cadastrar-servico')} className="btn btn-laranja d-flex align-items-center gap-2">
                        <Plus size={20} /> Novo Serviço
                    </button>
                </div>

                {servicos.length === 0 ? (
                    <div className="text-center py-5 bg-white rounded shadow-sm">
                        <h4 className="text-muted">Você ainda não tem serviços anunciados.</h4>
                        <p className="mb-4">Comece a ganhar clientes agora mesmo!</p>
                        <button onClick={() => navegarPara('cadastrar-servico')} className="btn btn-outline-primary">
                            Criar meu primeiro anúncio
                        </button>
                    </div>
                ) : (
                    <div className="row g-4">
                        {servicos.map((servico) => (
                            <div key={servico.id} className="col-md-6 col-lg-4">
                                <div className="card h-100 shadow-sm border-0">
                                    <div className="position-relative">
                                        <img
                                            src={servico.imagem || 'https://via.placeholder.com/400x200?text=Servi%C3%A7o'}
                                            className="card-img-top object-cover"
                                            alt={servico.titulo}
                                            style={{ height: '200px', filter: 'brightness(0.9)' }}
                                        />
                                        <div className="position-absolute top-0 end-0 p-2">
                                            <span className="badge bg-success shadow-sm">Ativo</span>
                                        </div>
                                    </div>

                                    <div className="card-body">
                                        <h5 className="card-title fw-bold text-azul-marinho">{servico.titulo}</h5>
                                        <p className="card-text text-muted small line-clamp-2">
                                            {servico.descricao}
                                        </p>
                                    </div>

                                    <div className="card-footer bg-white border-top-0 d-flex gap-2 pb-3">
                                        <button
                                            className="btn btn-outline-secondary flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                                            onClick={() => navegarPara('editar-servico', servico.id)}
                                        >
                                            <Pencil size={16} /> Editar
                                        </button>
                                        <button
                                            onClick={() => confirmarExclusao(servico.id)}
                                            className="btn btn-outline-danger flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                                        >
                                            <Trash2 size={16} /> Excluir
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 1. Dialog de Confirmação de Exclusão */}
            <AlertDialog
                aberto={!!servicoParaExcluir}
                titulo="Excluir Serviço?"
                mensagem="Tem certeza que deseja remover este anúncio? Essa ação não pode ser desfeita."
                onClose={() => setServicoParaExcluir(null)}
                onConfirm={executarExclusao}
            />

            {/* 2. Dialog de Feedback */}
            <AlertDialog
                aberto={dialog.aberto}
                titulo={dialog.titulo}
                mensagem={dialog.mensagem}
                onClose={() => setDialog({ ...dialog, aberto: false })}
            />
        </div>
    );
}