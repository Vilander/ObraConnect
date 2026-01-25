import { useState, useEffect } from 'react';
import { Cabecalho } from './componentes/Cabecalho';
import { Login } from './componentes/Login';
import { Inicio } from './componentes/Inicio';
import { DetalheServico } from './componentes/DetalheServico';
import { CadastrarServico } from './componentes/CadastrarServico';
import { MinhasAvaliacoes } from './componentes/MinhasAvaliacoes';

export default function App() {
  const [paginaAtual, setPaginaAtual] = useState('inicio');
  const [estaLogado, setEstaLogado] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [idServicoSelecionado, setIdServicoSelecionado] = useState(null);

  // Verifica se já existe um login salvo ao abrir o site ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuarioSalvo = localStorage.getItem('usuario');

    if (token && usuarioSalvo) {
      try {
        setUsuario(JSON.parse(usuarioSalvo));
        setEstaLogado(true);
      } catch (erro) {
        // Se der erro ao ler os dados, limpa tudo por segurança
        console.error("Erro ao restaurar sessão:", erro);
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
      }
    }
  }, []); // O array vazio [] garante que isso rode apenas 1 vez na inicialização

  const navegarPara = (pagina, idServico) => {
    setPaginaAtual(pagina);
    if (idServico) {
      setIdServicoSelecionado(idServico);
    }
    window.scrollTo(0, 0);
  };

  const realizarLogin = (dadosUsuario) => {
    setUsuario(dadosUsuario);
    setEstaLogado(true);
    setPaginaAtual('inicio');
    // Nota: O salvamento no localStorage já é feito dentro do Login.jsx
  };

  // --- ATUALIZADO: Logout completo ---
  const realizarLogout = () => {
    setUsuario(null);
    setEstaLogado(false);
    setPaginaAtual('inicio');

    // Remove os dados do navegador
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  };

  return (
    <div className="min-vh-100">
      {paginaAtual !== 'login' && (
        <Cabecalho
          paginaAtual={paginaAtual}
          navegarPara={navegarPara}
          estaLogado={estaLogado}
          realizarLogout={realizarLogout}
          nomeUsuario={usuario?.nome_usuario || usuario?.nome} // Ajuste para aceitar ambos os formatos
        />
      )}

      {paginaAtual === 'login' && (
        <Login realizarLogin={realizarLogin} />
      )}

      {paginaAtual === 'inicio' && (
        <Inicio navegarPara={navegarPara} estaLogado={estaLogado} />
      )}

      {paginaAtual === 'detalhe-servico' && idServicoSelecionado && (
        <DetalheServico
          idServico={idServicoSelecionado}
          navegarPara={navegarPara}
          estaLogado={estaLogado}
        />
      )}

      {paginaAtual === 'cadastrar-servico' && (
        <>
          {estaLogado ? (
            <CadastrarServico navegarPara={navegarPara} />
          ) : (
            <div className="min-vh-100 d-flex align-items-center justify-content-center px-3">
              <div className="text-center">
                <h2 className="text-azul-marinho">
                  Você precisa estar logado
                </h2>
                <p className="text-cinza mt-2">
                  Faça login para cadastrar um serviço
                </p>
                <button
                  onClick={() => navegarPara('login')}
                  className="btn btn-laranja mt-4 px-5 py-3"
                >
                  Fazer Login
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {paginaAtual === 'minhas-avaliacoes' && (
        <>
          {estaLogado ? (
            <MinhasAvaliacoes navegarPara={navegarPara} />
          ) : (
            <div className="min-vh-100 d-flex align-items-center justify-content-center px-3">
              <div className="text-center">
                <h2 className="text-azul-marinho">
                  Você precisa estar logado
                </h2>
                <p className="text-cinza mt-2">
                  Faça login para ver suas avaliações
                </p>
                <button
                  onClick={() => navegarPara('login')}
                  className="btn btn-laranja mt-4 px-5 py-3"
                >
                  Fazer Login
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Rodapé */}
      <footer className="py-4 px-3 mt-5 border-top bg-azul-marinho">
        <div className="container text-center">
          <p className="text-branco mb-2">
            © 2026 ObraConnect - Marketplace de Serviços de Construção Civil
          </p>
          <p className="text-white-50 fs-6 mb-0">
            Conectando profissionais qualificados com quem precisa
          </p>
          <br />
          <p className="text-light small mb-0">
            Desenvolvido por: Vilander Costa
          </p>
        </div>
      </footer>
    </div>
  );
}