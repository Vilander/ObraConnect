import { useEffect, useRef } from 'react';

export default function AlertDialog({ aberto, mensagem, onClose, onConfirm }) {
    const dialogRef = useRef(null);

    useEffect(() => {
        if (aberto) {
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [aberto]);

    return (
        <dialog ref={dialogRef} className="alert-dialog">
            <div className="dialog-content">
                <p>{mensagem}</p>

                <div className="dialog-actions">
                    {onConfirm ? (
                        <>
                            <button
                                onClick={onClose}
                                className="btn btn-outline-secondary"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className="btn btn-danger"
                            >
                                Confirmar
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={onClose}
                            className="btn btn-primary"
                        >
                            Ok
                        </button>
                    )}
                </div>
            </div>
        </dialog>
    );
}