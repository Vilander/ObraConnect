import { useState } from 'react';
import { User, Lock, Mail, Phone, Eye, EyeOff, Loader2, HardHat } from 'lucide-react'; // Adicionei HardHat (Capacete)
import AlertDialog from './AlertDialog';

export function Login({ realizarLogin }) {
  const [ehCadastro, setEhCadastro] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const [alerta, setAlerta] = useState({ aberto: false, mensagem: '' });
  const mostrarAlerta = (msg) => setAlerta({ aberto: true, mensagem: msg });

  // Formulário de login
  const [dadosLogin, setDadosLogin] = useState({
    login: '',
    senha: ''
  });

  // Formulário de cadastro
  const [dadosCadastro, setDadosCadastro] = useState({
    login: '',
    senha: '',
    confirmarSenha: '',
    nomeUsuario: '',
    email: '',
    telefone: '',
    ehPrestador: false // --- NOVO: Checkbox para prestador
  });

  // --- LOGIN ---
  const submeterLogin = async (e) => {
    e.preventDefault();
    setCarregando(true);

    if (!dadosLogin.login || !dadosLogin.senha) {
      mostrarAlerta('Por favor, preencha todos os campos');
      setCarregando(false);
      return;
    }

    try {
      const resposta = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosLogin)
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        localStorage.setItem('token', dados.token);
        localStorage.setItem('usuario', JSON.stringify(dados.usuario));
        realizarLogin(dados.usuario);
      } else {
        mostrarAlerta(dados.erro || 'Erro ao realizar login');
      }
    } catch (erro) {
      mostrarAlerta('Erro de conexão com o servidor.');
    } finally {
      setCarregando(false);
    }
  };

  // --- CADASTRO ---
  const submeterCadastro = async (e) => {
    e.preventDefault();
    setCarregando(true);

    if (dadosCadastro.senha !== dadosCadastro.confirmarSenha) {
      mostrarAlerta('As senhas não coincidem');
      setCarregando(false);
      return;
    }

    // Define o tipo baseado no checkbox
    const tipo = dadosCadastro.ehPrestador ? 'prestador' : 'usuario';

    const payload = {
      nome_usuario: dadosCadastro.nomeUsuario,
      login: dadosCadastro.login,
      email: dadosCadastro.email,
      senha: dadosCadastro.senha,
      telefone: dadosCadastro.telefone,
      tipo_usuario: tipo // --- AQUI ENVIAMOS A ESCOLHA CERTA
    };

    try {
      const resposta = await fetch('http://localhost:3001/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        mostrarAlerta(`Conta criada com sucesso! Você foi cadastrado como ${tipo === 'prestador' ? 'Prestador' : 'Usuário'}.`);
        setEhCadastro(false);
        // Limpa formulário
        setDadosCadastro({
          login: '', senha: '', confirmarSenha: '', nomeUsuario: '', email: '', telefone: '', ehPrestador: false
        });
      } else {
        mostrarAlerta(dados.erro || 'Erro ao criar conta');
      }
    } catch (erro) {
      mostrarAlerta('Erro de conexão com o servidor.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center px-3 py-5 bg-azul-claro">
      <div className="w-100" style={{ maxWidth: '500px' }}>
        <div className="bg-white rounded shadow-lg p-4 p-md-5">
          <div className="text-center mb-4">
            <h1 className="text-azul-marinho">
              {ehCadastro ? 'Criar Conta' : 'Entrar'}
            </h1>
            <p className="text-cinza mt-2">
              {ehCadastro
                ? 'Cadastre-se para acessar o marketplace'
                : 'Bem-vindo de volta ao ObraConnect'}
            </p>
          </div>

          {!ehCadastro ? (
            // FORMULÁRIO LOGIN (Igual ao anterior)
            <form onSubmit={submeterLogin}>
              <div className="mb-3">
                <label className="form-label text-azul-marinho">Usuário ou Email</label>
                <div className="position-relative">
                  <User className="position-absolute top-50 translate-middle-y ms-3" size={20} color="var(--cinza)" />
                  <input
                    type="text"
                    value={dadosLogin.login}
                    onChange={(e) => setDadosLogin({ ...dadosLogin, login: e.target.value })}
                    className="form-control ps-5 py-3 border-2 border-azul-claro"
                    placeholder="Digite seu usuário"
                    required
                    disabled={carregando}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-azul-marinho">Senha</label>
                <div className="position-relative">
                  <Lock className="position-absolute top-50 translate-middle-y ms-3" size={20} color="var(--cinza)" />
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    value={dadosLogin.senha}
                    onChange={(e) => setDadosLogin({ ...dadosLogin, senha: e.target.value })}
                    className="form-control ps-5 pe-5 py-3 border-2 border-azul-claro"
                    placeholder="Digite sua senha"
                    required
                    disabled={carregando}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="btn position-absolute top-50 end-0 translate-middle-y border-0"
                  >
                    {mostrarSenha ? <EyeOff size={20} color="var(--cinza)" /> : <Eye size={20} color="var(--cinza)" />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-laranja w-100 py-3 mt-2 d-flex align-items-center justify-content-center gap-2" disabled={carregando}>
                {carregando ? <><Loader2 className="animate-spin" size={20} /> Entrando...</> : 'Entrar'}
              </button>

              <div className="text-center mt-3">
                <button type="button" onClick={() => setEhCadastro(true)} className="btn btn-link text-azul-marinho text-decoration-none">
                  Não tem conta? <strong>Cadastre-se aqui</strong>
                </button>
              </div>
            </form>
          ) : (
            // FORMULÁRIO CADASTRO (Com o novo Checkbox)
            <form onSubmit={submeterCadastro}>
              <div className="mb-3">
                <label className="form-label text-azul-marinho">Nome Completo *</label>
                <div className="position-relative">
                  <User className="position-absolute top-50 translate-middle-y ms-3" size={20} color="var(--cinza)" />
                  <input type="text" value={dadosCadastro.nomeUsuario} onChange={(e) => setDadosCadastro({ ...dadosCadastro, nomeUsuario: e.target.value })} className="form-control ps-5 py-3 border-2 border-azul-claro" placeholder="Seu nome completo" required disabled={carregando} />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-azul-marinho">Usuário *</label>
                <div className="position-relative">
                  <User className="position-absolute top-50 translate-middle-y ms-3" size={20} color="var(--cinza)" />
                  <input type="text" value={dadosCadastro.login} onChange={(e) => setDadosCadastro({ ...dadosCadastro, login: e.target.value })} className="form-control ps-5 py-3 border-2 border-azul-claro" placeholder="Escolha um nome de usuário" required disabled={carregando} />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-azul-marinho">Email *</label>
                <div className="position-relative">
                  <Mail className="position-absolute top-50 translate-middle-y ms-3" size={20} color="var(--cinza)" />
                  <input type="email" value={dadosCadastro.email} onChange={(e) => setDadosCadastro({ ...dadosCadastro, email: e.target.value })} className="form-control ps-5 py-3 border-2 border-azul-claro" placeholder="seu@email.com" required disabled={carregando} />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-azul-marinho">Senha *</label>
                <div className="position-relative">
                  <Lock className="position-absolute top-50 translate-middle-y ms-3" size={20} color="var(--cinza)" />
                  <input type={mostrarSenha ? 'text' : 'password'} value={dadosCadastro.senha} onChange={(e) => setDadosCadastro({ ...dadosCadastro, senha: e.target.value })} className="form-control ps-5 pe-5 py-3 border-2 border-azul-claro" placeholder="Crie uma senha" required disabled={carregando} />
                  <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)} className="btn position-absolute top-50 end-0 translate-middle-y border-0">
                    {mostrarSenha ? <EyeOff size={20} color="var(--cinza)" /> : <Eye size={20} color="var(--cinza)" />}
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-azul-marinho">Confirmar Senha *</label>
                <div className="position-relative">
                  <Lock className="position-absolute top-50 translate-middle-y ms-3" size={20} color="var(--cinza)" />
                  <input type={mostrarSenha ? 'text' : 'password'} value={dadosCadastro.confirmarSenha} onChange={(e) => setDadosCadastro({ ...dadosCadastro, confirmarSenha: e.target.value })} className="form-control ps-5 py-3 border-2 border-azul-claro" placeholder="Confirme sua senha" required disabled={carregando} />
                </div>
              </div>

              {/* --- NOVO CHECKBOX: QUERO SER PRESTADOR --- */}
              <div className="mb-4 p-3 bg-light rounded border border-azul-claro">
                <div className="form-check d-flex align-items-center gap-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="checkPrestador"
                    checked={dadosCadastro.ehPrestador}
                    onChange={(e) => setDadosCadastro({ ...dadosCadastro, ehPrestador: e.target.checked })}
                    style={{ transform: 'scale(1.2)', cursor: 'pointer' }}
                  />
                  <label className="form-check-label fw-bold text-azul-marinho" htmlFor="checkPrestador" style={{ cursor: 'pointer' }}>
                    <div className="d-flex align-items-center gap-2">
                      <HardHat size={20} className="text-laranja-principal" />
                      Quero oferecer meus serviços
                    </div>
                  </label>
                </div>
                <div className="ms-4 mt-1 text-muted small">
                  Marque esta opção se você deseja anunciar trabalhos na plataforma.
                </div>
              </div>

              <button type="submit" className="btn btn-laranja w-100 py-3 mt-2 d-flex align-items-center justify-content-center gap-2" disabled={carregando}>
                {carregando ? <><Loader2 className="animate-spin" size={20} /> Criando conta...</> : 'Criar Conta'}
              </button>

              <div className="text-center mt-3">
                <button type="button" onClick={() => setEhCadastro(false)} className="btn btn-link text-azul-marinho text-decoration-none">
                  Já tem conta? <strong>Faça login aqui</strong>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <AlertDialog aberto={alerta.aberto} mensagem={alerta.mensagem} onClose={() => setAlerta({ ...alerta, aberto: false })} />
    </div>
  );
}