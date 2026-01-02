import { useState } from 'react';
import { User, Lock, Mail, Phone, Eye, EyeOff } from 'lucide-react';
import AlertDialog from './AlertDialog';

export function Login({ realizarLogin }) {
  const [ehCadastro, setEhCadastro] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // Estado para controlar o Dialog
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
    telefone: ''
  });

  const submeterLogin = async (e) => {
    e.preventDefault();

    if (dadosLogin.login && dadosLogin.senha) {
      realizarLogin({
        nome: 'Usuário Demo',
        email: 'usuario@demo.com'
      });
    } else {
      mostrarAlerta('Por favor, preencha todos os campos');
    }
  };

  const submeterCadastro = async (e) => {
    e.preventDefault();

    if (dadosCadastro.senha !== dadosCadastro.confirmarSenha) {
      mostrarAlerta('As senhas não coincidem');
      return;
    }

    if (dadosCadastro.login && dadosCadastro.senha && dadosCadastro.nomeUsuario && dadosCadastro.email) {
      realizarLogin({
        nome: dadosCadastro.nomeUsuario,
        email: dadosCadastro.email
      });
    } else {
      mostrarAlerta('Por favor, preencha todos os campos obrigatórios');
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center px-3 py-5 bg-azul-claro">
      <div className="w-100" style={{ maxWidth: '500px' }}>
        <div className="bg-white rounded shadow-lg p-4 p-md-5">
          {/* Logo/Título */}
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

          {/* Formulário de Login */}
          {!ehCadastro ? (
            <form onSubmit={submeterLogin}>
              <div className="mb-3">
                <label className="form-label text-azul-marinho">
                  Usuário ou Email
                </label>
                <div className="position-relative">
                  <User className="position-absolute top-50 translate-middle-y ms-3" size={20} color="var(--cinza)" />
                  <input
                    type="text"
                    value={dadosLogin.login}
                    onChange={(e) => setDadosLogin({ ...dadosLogin, login: e.target.value })}
                    className="form-control ps-5 py-3 border-2 border-azul-claro"
                    placeholder="Digite seu usuário"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-azul-marinho">
                  Senha
                </label>
                <div className="position-relative">
                  <Lock className="position-absolute top-50 translate-middle-y ms-3" size={20} color="var(--cinza)" />
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    value={dadosLogin.senha}
                    onChange={(e) => setDadosLogin({ ...dadosLogin, senha: e.target.value })}
                    className="form-control ps-5 pe-5 py-3 border-2 border-azul-claro"
                    placeholder="Digite sua senha"
                    required
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

              <button
                type="submit"
                className="btn btn-laranja w-100 py-3 mt-2"
              >
                Entrar
              </button>

              <div className="text-center mt-3">
                <button
                  type="button"
                  onClick={() => setEhCadastro(true)}
                  className="btn btn-link text-azul-marinho text-decoration-none"
                >
                  Não tem conta? Cadastre-se aqui
                </button>
              </div>
            </form>
          ) : (
            // Formulário de Cadastro
            <form onSubmit={submeterCadastro}>
              <div className="mb-3">
                <label className="form-label text-azul-marinho">
                  Nome Completo *
                </label>
                <div className="position-relative">
                  <User className="position-absolute top-50 translate-middle-y ms-3" size={20} color="var(--cinza)" />
                  <input
                    type="text"
                    value={dadosCadastro.nomeUsuario}
                    onChange={(e) => setDadosCadastro({ ...dadosCadastro, nomeUsuario: e.target.value })}
                    className="form-control ps-5 py-3 border-2 border-azul-claro"
                    placeholder="Seu nome completo"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-azul-marinho">
                  Usuário *
                </label>
                <div className="position-relative">
                  <User className="position-absolute top-50 translate-middle-y ms-3" size={20} color="var(--cinza)" />
                  <input
                    type="text"
                    value={dadosCadastro.login}
                    onChange={(e) => setDadosCadastro({ ...dadosCadastro, login: e.target.value })}
                    className="form-control ps-5 py-3 border-2 border-azul-claro"
                    placeholder="Escolha um nome de usuário"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-azul-marinho">
                  Email *
                </label>
                <div className="position-relative">
                  <Mail className="position-absolute top-50 translate-middle-y ms-3" size={20} color="var(--cinza)" />
                  <input
                    type="email"
                    value={dadosCadastro.email}
                    onChange={(e) => setDadosCadastro({ ...dadosCadastro, email: e.target.value })}
                    className="form-control ps-5 py-3 border-2 border-azul-claro"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-azul-marinho">
                  Telefone
                </label>
                <div className="position-relative">
                  <Phone className="position-absolute top-50 translate-middle-y ms-3" size={20} color="var(--cinza)" />
                  <input
                    type="tel"
                    value={dadosCadastro.telefone}
                    onChange={(e) => setDadosCadastro({ ...dadosCadastro, telefone: e.target.value })}
                    className="form-control ps-5 py-3 border-2 border-azul-claro"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-azul-marinho">
                  Senha *
                </label>
                <div className="position-relative">
                  <Lock className="position-absolute top-50 translate-middle-y ms-3" size={20} color="var(--cinza)" />
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    value={dadosCadastro.senha}
                    onChange={(e) => setDadosCadastro({ ...dadosCadastro, senha: e.target.value })}
                    className="form-control ps-5 pe-5 py-3 border-2 border-azul-claro"
                    placeholder="Crie uma senha"
                    required
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

              <div className="mb-3">
                <label className="form-label text-azul-marinho">
                  Confirmar Senha *
                </label>
                <div className="position-relative">
                  <Lock className="position-absolute top-50 translate-middle-y ms-3" size={20} color="var(--cinza)" />
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    value={dadosCadastro.confirmarSenha}
                    onChange={(e) => setDadosCadastro({ ...dadosCadastro, confirmarSenha: e.target.value })}
                    className="form-control ps-5 py-3 border-2 border-azul-claro"
                    placeholder="Confirme sua senha"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-laranja w-100 py-3 mt-2"
              >
                Criar Conta
              </button>

              <div className="text-center mt-3">
                <button
                  type="button"
                  onClick={() => setEhCadastro(false)}
                  className="btn btn-link text-azul-marinho text-decoration-none"
                >
                  Já tem conta? Faça login aqui
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <AlertDialog
        aberto={alerta.aberto}
        mensagem={alerta.mensagem}
        onClose={() => setAlerta({ ...alerta, aberto: false })}
      />
    </div>
  );
}