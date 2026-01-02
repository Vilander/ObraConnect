import { useState } from 'react';
import { User, Lock, Mail, Phone, Eye, EyeOff } from 'lucide-react';

export function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Login form
  const [loginData, setLoginData] = useState({
    login: '',
    senha: ''
  });

  // Register form
  const [registerData, setRegisterData] = useState({
    login: '',
    senha: '',
    confirmarSenha: '',
    nome_usuario: '',
    email: '',
    telefone: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    // TODO: Conectar com seu backend Node/Express
    // Exemplo de chamada:
    // const response = await fetch('http://localhost:3000/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(loginData)
    // });
    // const data = await response.json();

    // Mock de autenticação para demonstração
    if (loginData.login && loginData.senha) {
      onLogin({
        nome: 'Usuário Demo',
        email: 'usuario@demo.com'
      });
    } else {
      alert('Por favor, preencha todos os campos');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (registerData.senha !== registerData.confirmarSenha) {
      alert('As senhas não coincidem');
      return;
    }

    // TODO: Conectar com seu backend Node/Express
    // Exemplo de chamada:
    // const response = await fetch('http://localhost:3000/criar-conta', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(registerData)
    // });
    // const data = await response.json();

    // Mock de registro para demonstração
    if (registerData.login && registerData.senha && registerData.nome_usuario && registerData.email) {
      onLogin({
        nome: registerData.nome_usuario,
        email: registerData.email
      });
    } else {
      alert('Por favor, preencha todos os campos obrigatórios');
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center px-3 py-5 bg-azul-claro">
      <div className="w-100" style={{ maxWidth: '500px' }}>
        <div className="bg-white rounded shadow-lg p-4 p-md-5">
          {/* Logo/Title */}
          <div className="text-center mb-4">
            <h1 className="text-azul-marinho">
              {isRegister ? 'Criar Conta' : 'Entrar'}
            </h1>
            <p className="text-cinza mt-2">
              {isRegister
                ? 'Cadastre-se para acessar o marketplace'
                : 'Bem-vindo de volta ao ObraConnect'}
            </p>
          </div>

          {/* Login Form */}
          {!isRegister ? (
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label text-azul-marinho">
                  Usuário ou Email
                </label>
                <div className="position-relative">
                  <User className="position-absolute top-50 translate-middle-y ms-3" size={20} color="var(--cinza)" />
                  <input
                    type="text"
                    value={loginData.login}
                    onChange={(e) => setLoginData({ ...loginData, login: e.target.value })}
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
                    type={showPassword ? 'text' : 'password'}
                    value={loginData.senha}
                    onChange={(e) => setLoginData({ ...loginData, senha: e.target.value })}
                    className="form-control ps-5 pe-5 py-3 border-2 border-azul-claro"
                    placeholder="Digite sua senha"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="btn position-absolute top-50 end-0 translate-middle-y border-0"
                  >
                    {showPassword ? <EyeOff size={20} color="var(--cinza)" /> : <Eye size={20} color="var(--cinza)" />}
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
                  onClick={() => setIsRegister(true)}
                  className="btn btn-link text-azul-marinho text-decoration-none"
                >
                  Não tem conta? Cadastre-se aqui
                </button>
              </div>
            </form>
          ) : (
            // Register Form
            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <label className="form-label text-azul-marinho">
                  Nome Completo *
                </label>
                <div className="position-relative">
                  <User className="position-absolute top-50 translate-middle-y ms-3" size={20} color="var(--cinza)" />
                  <input
                    type="text"
                    value={registerData.nome_usuario}
                    onChange={(e) => setRegisterData({ ...registerData, nome_usuario: e.target.value })}
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
                    value={registerData.login}
                    onChange={(e) => setRegisterData({ ...registerData, login: e.target.value })}
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
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
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
                    value={registerData.telefone}
                    onChange={(e) => setRegisterData({ ...registerData, telefone: e.target.value })}
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
                    type={showPassword ? 'text' : 'password'}
                    value={registerData.senha}
                    onChange={(e) => setRegisterData({ ...registerData, senha: e.target.value })}
                    className="form-control ps-5 pe-5 py-3 border-2 border-azul-claro"
                    placeholder="Crie uma senha"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="btn position-absolute top-50 end-0 translate-middle-y border-0"
                  >
                    {showPassword ? <EyeOff size={20} color="var(--cinza)" /> : <Eye size={20} color="var(--cinza)" />}
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
                    type={showPassword ? 'text' : 'password'}
                    value={registerData.confirmarSenha}
                    onChange={(e) => setRegisterData({ ...registerData, confirmarSenha: e.target.value })}
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
                  onClick={() => setIsRegister(false)}
                  className="btn btn-link text-azul-marinho text-decoration-none"
                >
                  Já tem conta? Faça login aqui
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}