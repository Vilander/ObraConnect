import { Home, LogIn, LogOut, Menu, Star, Briefcase, X } from 'lucide-react';
import { useState } from 'react';

export function Cabecalho({ paginaAtual, navegarPara, estaLogado, realizarLogout, nomeUsuario }) {
  const [menuMobilAberto, setMenuMobilAberto] = useState(false);

  return (
    <header className="sticky-top shadow bg-azul-marinho">
      <div className="container py-3">
        <div className="d-flex align-items-center justify-content-between">
          {/* Logo */}
          <button 
            onClick={() => navegarPara('inicio')}
            className="btn d-flex align-items-center gap-2 p-0 border-0 hover-opacity"
          >
            <Briefcase size={32} color="var(--amarelo)" />
            <span className="fs-3 text-branco">
              ObraConnect
            </span>
          </button>

          {/* Menu Desktop */}
          <nav className="d-none d-md-flex align-items-center gap-3">
            <button
              onClick={() => navegarPara('inicio')}
              className={`btn d-flex align-items-center gap-2 text-branco ${
                paginaAtual === 'inicio' ? 'bg-white bg-opacity-10' : ''
              }`}
            >
              <Home size={20} />
              <span>Início</span>
            </button>

            {estaLogado ? (
              <>
                <button
                  onClick={() => navegarPara('minhas-avaliacoes')}
                  className={`btn d-flex align-items-center gap-2 text-branco ${
                    paginaAtual === 'minhas-avaliacoes' ? 'bg-white bg-opacity-10' : ''
                  }`}
                >
                  <Star size={20} />
                  <span>Minhas Avaliações</span>
                </button>

                <button
                  onClick={() => navegarPara('cadastrar-servico')}
                  className="btn btn-laranja"
                >
                  Cadastrar Serviço
                </button>

                <div className="d-flex align-items-center gap-3">
                  <span className="text-amarelo">Olá, {nomeUsuario}</span>
                  <button
                    onClick={realizarLogout}
                    className="btn d-flex align-items-center gap-2 text-branco"
                  >
                    <LogOut size={20} />
                    <span>Sair</span>
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => navegarPara('login')}
                className="btn btn-laranja d-flex align-items-center gap-2"
              >
                <LogIn size={20} />
                <span>Entrar</span>
              </button>
            )}
          </nav>

          {/* Botão Menu Mobile */}
          <button
            onClick={() => setMenuMobilAberto(!menuMobilAberto)}
            className="btn d-md-none p-2 text-branco"
          >
            {menuMobilAberto ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menu Mobile */}
        {menuMobilAberto && (
          <nav className="d-md-none mt-3 pb-3 d-flex flex-column gap-2">
            <button
              onClick={() => {
                navegarPara('inicio');
                setMenuMobilAberto(false);
              }}
              className={`btn d-flex align-items-center gap-2 text-branco text-start ${
                paginaAtual === 'inicio' ? 'bg-white bg-opacity-10' : ''
              }`}
            >
              <Home size={20} />
              <span>Início</span>
            </button>

            {estaLogado ? (
              <>
                <button
                  onClick={() => {
                    navegarPara('minhas-avaliacoes');
                    setMenuMobilAberto(false);
                  }}
                  className={`btn d-flex align-items-center gap-2 text-branco text-start ${
                    paginaAtual === 'minhas-avaliacoes' ? 'bg-white bg-opacity-10' : ''
                  }`}
                >
                  <Star size={20} />
                  <span>Minhas Avaliações</span>
                </button>

                <button
                  onClick={() => {
                    navegarPara('cadastrar-servico');
                    setMenuMobilAberto(false);
                  }}
                  className="btn btn-laranja d-flex align-items-center gap-2"
                >
                  Cadastrar Serviço
                </button>

                <div className="px-3 py-2 text-amarelo">
                  Olá, {nomeUsuario}
                </div>

                <button
                  onClick={() => {
                    realizarLogout();
                    setMenuMobilAberto(false);
                  }}
                  className="btn d-flex align-items-center gap-2 text-branco text-start"
                >
                  <LogOut size={20} />
                  <span>Sair</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  navegarPara('login');
                  setMenuMobilAberto(false);
                }}
                className="btn btn-laranja d-flex align-items-center gap-2"
              >
                <LogIn size={20} />
                <span>Entrar</span>
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
