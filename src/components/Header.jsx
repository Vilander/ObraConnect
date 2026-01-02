import { Home, LogIn, LogOut, Menu, Star, Briefcase, X } from 'lucide-react';
import { useState } from 'react';

export function Header({ currentPage, onNavigate, isLoggedIn, onLogout, userName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky-top shadow bg-azul-marinho">
      <div className="container py-3">
        <div className="d-flex align-items-center justify-content-between">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="btn d-flex align-items-center gap-2 p-0 border-0 hover-opacity"
          >
            <Briefcase size={32} color="var(--amarelo)" />
            <span className="fs-3 text-branco">
              ObraConnect
            </span>
          </button>

          {/* Desktop Menu */}
          <nav className="d-none d-md-flex align-items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className={`btn d-flex align-items-center gap-2 text-branco ${currentPage === 'home' ? 'bg-white bg-opacity-10' : ''
                }`}
            >
              <Home size={20} />
              <span>Início</span>
            </button>

            {isLoggedIn ? (
              <>
                <button
                  onClick={() => onNavigate('avaliacoes')}
                  className={`btn d-flex align-items-center gap-2 text-branco ${currentPage === 'avaliacoes' ? 'bg-white bg-opacity-10' : ''
                    }`}
                >
                  <Star size={20} />
                  <span>Minhas Avaliações</span>
                </button>

                <button
                  onClick={() => onNavigate('cadastrar-servico')}
                  className="btn btn-laranja"
                >
                  Cadastrar Serviço
                </button>

                <div className="d-flex align-items-center gap-3">
                  <span className="text-amarelo">Olá, {userName}</span>
                  <button
                    onClick={onLogout}
                    className="btn d-flex align-items-center gap-2 text-branco"
                  >
                    <LogOut size={20} />
                    <span>Sair</span>
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="btn btn-laranja d-flex align-items-center gap-2"
              >
                <LogIn size={20} />
                <span>Entrar</span>
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn d-md-none p-2 text-branco"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="d-md-none mt-3 pb-3 d-flex flex-column gap-2">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className={`btn d-flex align-items-center gap-2 text-branco text-start ${currentPage === 'home' ? 'bg-white bg-opacity-10' : ''
                }`}
            >
              <Home size={20} />
              <span>Início</span>
            </button>

            {isLoggedIn ? (
              <>
                <button
                  onClick={() => {
                    onNavigate('avaliacoes');
                    setMobileMenuOpen(false);
                  }}
                  className={`btn d-flex align-items-center gap-2 text-branco text-start ${currentPage === 'avaliacoes' ? 'bg-white bg-opacity-10' : ''
                    }`}
                >
                  <Star size={20} />
                  <span>Minhas Avaliações</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('cadastrar-servico');
                    setMobileMenuOpen(false);
                  }}
                  className="btn btn-laranja d-flex align-items-center gap-2"
                >
                  Cadastrar Serviço
                </button>

                <div className="px-3 py-2 text-amarelo">
                  Olá, {userName}
                </div>

                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
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
                  onNavigate('login');
                  setMobileMenuOpen(false);
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