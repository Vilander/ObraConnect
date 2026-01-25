import { AlertCircle, HelpCircle } from 'lucide-react';

export default function AlertDialog({ aberto, titulo, mensagem, onClose, onConfirm }) {
    if (!aberto) return null;

    return (
        <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ zIndex: 1060, backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
            <div
                className="bg-white rounded shadow-lg p-4 animate-fade-in"
                style={{ maxWidth: '400px', width: '90%' }}
            >
                <div className="text-center">
                    {/* Ícone muda se for Pergunta ou Aviso */}
                    <div className="mb-3 d-flex justify-content-center">
                        {onConfirm ? (
                            <HelpCircle size={48} className="text-laranja-principal" />
                        ) : (
                            <AlertCircle size={48} className="text-azul-marinho" />
                        )}
                    </div>

                    <h4 className="fw-bold text-azul-marinho mb-2">
                        {titulo || (onConfirm ? 'Confirmação' : 'Atenção')}
                    </h4>

                    <p className="text-cinza mb-4">
                        {mensagem}
                    </p>

                    <div className="d-flex gap-2 justify-content-center">
                        {onConfirm ? (
                            // MODO CONFIRMAÇÃO (Dois botões)
                            <>
                                <button
                                    onClick={onClose}
                                    className="btn btn-outline-secondary flex-grow-1"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => {
                                        onConfirm();
                                        onClose(); // Fecha após confirmar
                                    }}
                                    className="btn btn-laranja flex-grow-1 fw-bold"
                                >
                                    Confirmar
                                </button>
                            </>
                        ) : (
                            // MODO AVISO (Só um botão)
                            <button
                                onClick={onClose}
                                className="btn btn-azul-marinho w-100"
                            >
                                Entendi
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}