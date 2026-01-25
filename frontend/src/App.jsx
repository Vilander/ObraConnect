import { useState, useEffect } from 'react';
import { Cabecalho } from './componentes/Cabecalho';
import { Login } from './componentes/Login';
import { Inicio } from './componentes/Inicio';
import { DetalheServico } from './componentes/DetalheServico';
import { CadastrarServico } from './componentes/CadastrarServico';
import { MinhasAvaliacoes } from './componentes/MinhasAvaliacoes';
import { MeusServicos } from './componentes/MeusServicos';
import { EditarServico } from './componentes/EditarServico';

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
  }, []);

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
  };

  const realizarLogout = () => {
    setUsuario(null);
    setEstaLogado(false);
    setPaginaAtual('inicio');

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
          nomeUsuario={usuario?.nome_usuario || usuario?.nome}
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
            <TelaLoginObrigatorio navegarPara={navegarPara} msg="cadastrar um serviço" />
          )}
        </>
      )}

      {paginaAtual === 'minhas-avaliacoes' && (
        <>
          {estaLogado ? (
            <MinhasAvaliacoes navegarPara={navegarPara} />
          ) : (
            <TelaLoginObrigatorio navegarPara={navegarPara} msg="ver suas avaliações" />
          )}
        </>
      )}

      {/* MEUS SERVIÇOS */}
      {paginaAtual === 'meus-servicos' && (
        <>
          {estaLogado ? (
            <MeusServicos navegarPara={navegarPara} />
          ) : (
            <TelaLoginObrigatorio navegarPara={navegarPara} msg="gerenciar seus serviços" />
          )}
        </>
      )}
      {paginaAtual === 'editar-servico' && idServicoSelecionado && (
        <>
          {estaLogado ? (
            <EditarServico
              idServico={idServicoSelecionado}
              navegarPara={navegarPara}
            />
          ) : (
            <TelaLoginObrigatorio navegarPara={navegarPara} msg="editar seu serviço" />
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

// Pequeno componente auxiliar para evitar repetição do HTML de "Você precisa estar logado"
function TelaLoginObrigatorio({ navegarPara, msg }) {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center px-3">
      <div className="text-center">
        <h2 className="text-azul-marinho">
          Você precisa estar logado
        </h2>
        <p className="text-cinza mt-2">
          Faça login para {msg}
        </p>
        <button
          onClick={() => navegarPara('login')}
          className="btn btn-laranja mt-4 px-5 py-3"
        >
          Fazer Login
        </button>
      </div>
    </div>
  );
}