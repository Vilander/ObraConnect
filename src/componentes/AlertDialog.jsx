import { useEffect, useRef } from 'react';

export default function AlertDialog({ aberto, mensagem, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (aberto) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [aberto]);

  return (
    <dialog ref={dialogRef} className="alert-dialog">
      <p>{mensagem}</p>

      <button onClick={onClose}>
        Ok
      </button>
    </dialog>
  );
}
