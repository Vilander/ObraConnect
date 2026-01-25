import { Hammer, LogOut, User, HardHat, Loader2 } from 'lucide-react';
import { useState } from 'react';
import AlertDialog from './AlertDialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';

export function Cabecalho({ paginaAtual, navegarPara, estaLogado, realizarLogout, nomeUsuario }) {
  const [loading, setLoading] = useState(false);

  // Dialog Genérico (Avisos de erro/sucesso)
  const [dialog, setDialog] = useState({ aberto: false, mensagem: '', titulo: '' });

  // Estado específico para a Confirmação
  const [confirmacaoAberto, setConfirmacaoAberto] = useState(false);

  const usuarioSalvo = JSON.parse(localStorage.getItem('usuario') || '{}');
  const ehPrestador = usuarioSalvo.tipo_usuario === 'prestador' || usuarioSalvo.tipo_usuario === 'admin';

  const solicitarVirarPrestador = () => {
    setConfirmacaoAberto(true);
  };

  const executarVirarPrestador = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const resposta = await fetch('http://localhost:3001/api/auth/tornar-prestador', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        localStorage.setItem('token', dados.token);
        localStorage.setItem('usuario', JSON.stringify(dados.usuario));

        setDialog({
          aberto: true,
          titulo: 'Sucesso!',
          mensagem: "Parabéns! Agora você pode anunciar seus serviços."
        });

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setDialog({ aberto: true, mensagem: dados.erro || "Erro ao atualizar conta." });
      }
    } catch (erro) {
      setDialog({ aberto: true, mensagem: "Erro de conexão." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-azul-marinho py-3 sticky-top shadow-sm">
      <div className="container">
        {/* Logo */}
        <a
          className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4"
          href="#"
          onClick={(e) => { e.preventDefault(); navegarPara('inicio'); }}
        >
          <div className="bg-laranja-principal p-2 rounded">
            <Hammer size={24} className="text-white" />
          </div>
          ObraConnect
        </a>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto align-items-center gap-3">
            <li className="nav-item">
              <a
                className={`nav-link ${paginaAtual === 'inicio' ? 'active fw-bold' : ''}`}
                href="#"
                onClick={(e) => { e.preventDefault(); navegarPara('inicio'); }}
              >
                Início
              </a>
            </li>

            {estaLogado ? (
              <>
                <li className="nav-item">
                  {ehPrestador ? (
                    <button
                      onClick={() => navegarPara('cadastrar-servico')}
                      className="btn btn-outline-light d-flex align-items-center gap-2"
                    >
                      <HardHat size={18} />
                      Anunciar Serviço
                    </button>
                  ) : (
                    <button
                      onClick={solicitarVirarPrestador}
                      disabled={loading}
                      className="btn btn-outline-warning d-flex align-items-center gap-2 fw-bold text-amarelo border-amarelo hover-warning"
                    >
                      {loading ? <Loader2 className="animate-spin" size={18} /> : <HardHat size={18} />}
                      Quero ser Prestador
                    </button>
                  )}
                </li>

                <li className="nav-item dropdown">
                  <div className="d-flex align-items-center gap-2 text-white border-start border-white-50 ps-3 ms-2">
                    <div className="d-flex flex-column text-end lh-1">
                      <span className="small text-white-50">Olá,</span>
                      <span className="fw-bold">{nomeUsuario}</span>
                    </div>
                    <div className="bg-white-50 rounded-circle p-2">
                      <User size={20} className="text-azul-marinho" />
                    </div>
                  </div>
                </li>

                {/* --- Lógica Condicional: Apenas prestadores veem Minhas Avaliações --- */}
                {ehPrestador && (
                  <li className="nav-item">
                    <button
                      onClick={() => navegarPara('minhas-avaliacoes')}
                      className="btn btn-link nav-link"
                    >
                      Minhas Avaliações
                    </button>
                  </li>
                )}

                <li className="nav-item">
                  <button onClick={realizarLogout} className="btn btn-link text-white-50 hover-text-white p-0 ms-2">
                    <LogOut size={20} />
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item ms-2">
                <button
                  onClick={() => navegarPara('login')}
                  className="btn btn-laranja px-4 fw-bold d-flex align-items-center gap-2"
                >
                  Login
                  <FontAwesomeIcon icon={faArrowRightToBracket} />
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>

      <AlertDialog
        aberto={confirmacaoAberto}
        titulo="Tornar-se Prestador?"
        mensagem="Deseja ativar sua conta para oferecer serviços? Isso é gratuito e permitirá que você crie anúncios."
        onClose={() => setConfirmacaoAberto(false)}
        onConfirm={executarVirarPrestador}
      />

      <AlertDialog
        aberto={dialog.aberto}
        titulo={dialog.titulo}
        mensagem={dialog.mensagem}
        onClose={() => setDialog({ ...dialog, aberto: false })}
      />
    </nav>
  );
}