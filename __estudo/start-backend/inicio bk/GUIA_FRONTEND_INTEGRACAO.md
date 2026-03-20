# 🔗 GUIA: Como Usar o Backend no Frontend (React)

## 📋 Índice
1. [Conceito: Cliente x Servidor](#conceito-cliente-x-servidor)
2. [Instalação de Dependências](#instalação-de-dependências)
3. [Configurar a Base URL](#configurar-a-base-url)
4. [Funções de API](#funções-de-api)
5. [Componentes React](#componentes-react)
6. [Armazenar Token](#armazenar-token)
7. [Fluxo Completo de Login](#fluxo-completo-de-login)

---

## Conceito: Cliente x Servidor

### Cliente (Frontend = React)
- É a tela que o usuário vê
- Coleta dados do formulário
- Envia para o Backend
- Mostra a resposta

### Servidor (Backend = Node.js)
- Recebe os dados
- Valida
- Guarda no banco de dados
- Envia resposta

```
┌──────────────────┐                      ┌──────────────────┐
│  Frontend (React)│                      │ Backend (Node.js)│
├──────────────────┤                      ├──────────────────┤
│  Tela do usuário │                      │ API/Lógica       │
│  Formulários     │ ←(requisição HTTP)→  │ Banco de dados   │
│  Buttons         │                      │                  │
└──────────────────┘                      └──────────────────┘
```

---

## Instalação de Dependências

No Frontend React, você precisa de uma forma para fazer requisições HTTP. A mais comum é o **Axios**:

```bash
npm install axios
```

Ou use a **Fetch API** (já vem no navegador, não precisa instalar).

---

## Configurar a Base URL

Crie um arquivo `src/api/axiosConfig.js`:

```javascript
import axios from "axios";

// Base URL é o endereço do backend
// Todas as requisições vão começar com isso
const api = axios.create({
  baseURL: "http://localhost:3001", // Onde está seu backend
});

// INTERCEPTADOR: Adiciona o token automaticamente em TODAS as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default api;
```

**O que isso faz:**
- Toda vez que fizer uma requisição, o token é adicionado automaticamente
- Você não precisa adicionar manualmente em cada chamada

---

## Funções de API

Crie um arquivo `src/api/auth.js`:

```javascript
import api from "./axiosConfig";

// REGISTRAR NOVO USUÁRIO
export const registrarUsuario = async (dados) => {
  try {
    const resposta = await api.post("/api/auth/registro", {
      nome_usuario: dados.nome,
      email: dados.email,
      login: dados.login,
      senha: dados.senha,
    });
    
    return resposta.data;
  } catch (erro) {
    console.error("Erro ao registrar:", erro.response?.data);
    throw erro;
  }
};

// FAZER LOGIN
export const fazerLogin = async (login, senha) => {
  try {
    const resposta = await api.post("/api/auth/login", {
      login,
      senha,
    });
    
    // Salva o token no localStorage
    localStorage.setItem("token", resposta.data.token);
    localStorage.setItem("usuario", JSON.stringify(resposta.data.usuario));
    
    return resposta.data;
  } catch (erro) {
    console.error("Erro ao fazer login:", erro.response?.data);
    throw erro;
  }
};

// FAZER LOGOUT
export const fazerLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
};

// OBTER PERFIL DO USUÁRIO LOGADO
export const obterPerfil = async () => {
  try {
    const resposta = await api.get("/api/auth/perfil");
    return resposta.data;
  } catch (erro) {
    console.error("Erro ao obter perfil:", erro.response?.data);
    throw erro;
  }
};

// TORNAR PRESTADOR
export const tornarPrestador = async () => {
  try {
    const resposta = await api.put("/api/auth/tornar-prestador");
    
    // Atualiza o token com a nova informação
    localStorage.setItem("token", resposta.data.token);
    localStorage.setItem("usuario", JSON.stringify(resposta.data.usuario));
    
    return resposta.data;
  } catch (erro) {
    console.error("Erro ao tornar prestador:", erro.response?.data);
    throw erro;
  }
};
```

Crie também `src/api/servicos.js`:

```javascript
import api from "./axiosConfig";

// LISTAR TODOS OS SERVIÇOS
export const listarServicos = async () => {
  try {
    const resposta = await api.get("/api/servicos");
    return resposta.data;
  } catch (erro) {
    console.error("Erro ao listar serviços:", erro.response?.data);
    throw erro;
  }
};

// BUSCAR DETALHES DE UM SERVIÇO
export const buscarServico = async (id) => {
  try {
    const resposta = await api.get(`/api/servicos/${id}`);
    return resposta.data;
  } catch (erro) {
    console.error("Erro ao buscar serviço:", erro.response?.data);
    throw erro;
  }
};

// LISTAR MEUS SERVIÇOS (Protegido - precisa de token)
export const listarMeusServicos = async () => {
  try {
    const resposta = await api.get("/api/servicos/meus-servicos");
    return resposta.data;
  } catch (erro) {
    console.error("Erro ao listar meus serviços:", erro.response?.data);
    throw erro;
  }
};

// CRIAR NOVO SERVIÇO (com upload de imagem)
export const criarServico = async (dados) => {
  try {
    const formData = new FormData();
    formData.append("titulo", dados.titulo);
    formData.append("descricao", dados.descricao);
    formData.append("imagem", dados.imagem); // File do input

    const resposta = await api.post("/api/servicos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return resposta.data;
  } catch (erro) {
    console.error("Erro ao criar serviço:", erro.response?.data);
    throw erro;
  }
};

// EDITAR SERVIÇO
export const editarServico = async (id, dados) => {
  try {
    const formData = new FormData();
    formData.append("titulo", dados.titulo);
    formData.append("descricao", dados.descricao);
    if (dados.imagem) {
      formData.append("imagem", dados.imagem); // Opcionalmente enviar nova imagem
    }

    const resposta = await api.put(`/api/servicos/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return resposta.data;
  } catch (erro) {
    console.error("Erro ao editar serviço:", erro.response?.data);
    throw erro;
  }
};

// DELETAR SERVIÇO
export const deletarServico = async (id) => {
  try {
    const resposta = await api.delete(`/api/servicos/${id}`);
    return resposta.data;
  } catch (erro) {
    console.error("Erro ao deletar serviço:", erro.response?.data);
    throw erro;
  }
};
```

Crie também `src/api/avaliacoes.js`:

```javascript
import api from "./axiosConfig";

// CRIAR AVALIAÇÃO
export const criarAvaliacao = async (dados) => {
  try {
    const resposta = await api.post("/api/avaliacoes", {
      id_servico: dados.id_servico,
      nota_preco: dados.nota_preco,
      nota_tempo: dados.nota_tempo,
      nota_higiene: dados.nota_higiene,
      nota_educacao: dados.nota_educacao,
      comentario: dados.comentario,
    });

    return resposta.data;
  } catch (erro) {
    console.error("Erro ao criar avaliação:", erro.response?.data);
    throw erro;
  }
};

// LISTAR AVALIAÇÕES DE UM SERVIÇO
export const listarAvaliacoes = async (id_servico) => {
  try {
    const resposta = await api.get(`/api/avaliacoes/servico/${id_servico}`);
    return resposta.data;
  } catch (erro) {
    console.error("Erro ao listar avaliações:", erro.response?.data);
    throw erro;
  }
};

// LISTAR AVALIAÇÕES RECEBIDAS DO PRESTADOR
export const listarAvaliacoesRecebidas = async () => {
  try {
    const resposta = await api.get("/api/avaliacoes/recebidas");
    return resposta.data;
  } catch (erro) {
    console.error("Erro ao listar avaliações recebidas:", erro.response?.data);
    throw erro;
  }
};
```

---

## Componentes React

### Componente de Login

```jsx
import React, { useState } from "react";
import { fazerLogin } from "../api/auth";

function Login() {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro("");

    try {
      const dados = await fazerLogin(login, senha);
      
      // Se chegou aqui, login foi bem sucedido!
      console.log("Login feito!", dados);
      
      // Redireciona para a página principal
      // window.location.href = "/";
      
    } catch (erro) {
      setErro("Erro ao fazer login: " + erro.response?.data?.erro);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      
      {erro && <p style={{ color: "red" }}>{erro}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Login ou Email"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <button type="submit" disabled={carregando}>
          {carregando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}

export default Login;
```

### Componente de Listar Serviços

```jsx
import React, { useState, useEffect } from "react";
import { listarServicos } from "../api/servicos";

function ListarServicos() {
  const [servicos, setServicos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const buscarServicos = async () => {
      try {
        const dados = await listarServicos();
        setServicos(dados);
      } catch (erro) {
        setErro("Erro ao carregar serviços");
      } finally {
        setCarregando(false);
      }
    };

    buscarServicos();
  }, []); // Executa apenas uma vez ao carregar o componente

  if (carregando) return <p>Carregando...</p>;
  if (erro) return <p style={{ color: "red" }}>{erro}</p>;

  return (
    <div>
      <h1>Serviços Disponíveis</h1>
      
      {servicos.length === 0 ? (
        <p>Nenhum serviço disponível</p>
      ) : (
        <ul>
          {servicos.map((servico) => (
            <li key={servico.id}>
              <h3>{servico.titulo}</h3>
              <p>{servico.desc_servico}</p>
              <p>Prestador: {servico.nome_usuario}</p>
              <p>Nota: {servico.nota_media || "Sem avaliações"}</p>
              
              {servico.imagem_url && (
                <img 
                  src={servico.imagem_url} 
                  alt={servico.titulo}
                  style={{ maxWidth: "200px" }}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ListarServicos;
```

### Componente de Criar Serviço

```jsx
import React, { useState } from "react";
import { criarServico } from "../api/servicos";

function CriarServico() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const handleChange = (e) => {
    const file = e.target.files[0];
    setImagem(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro("");
    setSucesso("");

    try {
      const dados = {
        titulo,
        descricao,
        imagem, // File object
      };

      const resposta = await criarServico(dados);
      setSucesso("Serviço criado com sucesso!");
      
      // Limpa o formulário
      setTitulo("");
      setDescricao("");
      setImagem(null);
      
    } catch (erro) {
      setErro("Erro ao criar serviço: " + erro.response?.data?.erro);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div>
      <h1>Criar Novo Serviço</h1>

      {erro && <p style={{ color: "red" }}>{erro}</p>}
      {sucesso && <p style={{ color: "green" }}>{sucesso}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título do serviço"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />

        <textarea
          placeholder="Descrição do serviço"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
        />

        <button type="submit" disabled={carregando}>
          {carregando ? "Criando..." : "Criar Serviço"}
        </button>
      </form>
    </div>
  );
}

export default CriarServico;
```

---

## Armazenar Token

### O que é localStorage?

É um armazenamento no navegador que persiste mesmo após fechar o browser.

```jsx
// Salvar token
localStorage.setItem("token", token);

// Recuperar token
const token = localStorage.getItem("token");

// Limpar token
localStorage.removeItem("token");
```

### Custom Hook para Autenticação

```jsx
// src/hooks/useAuth.js
import { useState, useEffect } from "react";
import { fazerLogout } from "../api/auth";

function useAuth() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Ao carregar o app, verifica se tem token salvo
    const usuarioSalvo = localStorage.getItem("usuario");
    if (usuarioSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
    }
    setCarregando(false);
  }, []);

  const logout = () => {
    fazerLogout();
    setUsuario(null);
    window.location.href = "/login";
  };

  return {
    usuario,
    carregando,
    estaLogado: !!usuario,
    logout,
  };
}

export default useAuth;
```

### Usar o Hook

```jsx
import useAuth from "../hooks/useAuth";

function Header() {
  const { usuario, estaLogado, logout } = useAuth();

  return (
    <header>
      <h1>ObraConnect</h1>
      
      {estaLogado ? (
        <div>
          <p>Olá, {usuario.nome}</p>
          <button onClick={logout}>Sair</button>
        </div>
      ) : (
        <a href="/login">Entrar</a>
      )}
    </header>
  );
}

export default Header;
```

---

## Fluxo Completo de Login

```
1. Usuário preenche formulário (login + senha)
   ↓
2. Clica no botão "Entrar"
   ↓
3. handleSubmit é chamado
   ↓
4. fazerLogin() é executada
   ↓
5. Faz requisição POST para http://localhost:3001/api/auth/login
   ↓
6. Backend verifica as credenciais
   ↓
7. Se válido, retorna Token + dados do usuário
   ↓
8. Frontend salva Token no localStorage
   ↓
9. Frontend salva usuário no localStorage
   ↓
10. Redireciona para a página principal
   ↓
11. Header atualiza e mostra "Olá, João"
   ↓
12. Próximas requisições incluem o Token automaticamente (interceptador)
```

---

## Erros Comuns

### ❌ "CORS error"
**Problema:** Frontend e Backend em endereços diferentes
**Solução:** Backend tem `app.use(cors())` ativado

### ❌ "Token não encontrado"
**Problema:** localStorage.getItem("token") retorna null
**Solução:** Fazer login primeiro para gerar token

### ❌ "Arquivo não enviado"
**Problema:** FormData não está sendo enviado corretamente
**Solução:** Usar `"Content-Type": "multipart/form-data"` no header

### ❌ "Serviço não criado"
**Problema:** Tipo de usuário não é "prestador"
**Solução:** Executar "Tornar Prestador" antes de criar serviço

---

## Checklist de Integração

- [ ] Backend rodando em http://localhost:3001
- [ ] Frontend rodando em http://localhost:5173 (Vite) ou 3000 (Create React App)
- [ ] Arquivo de configuração (`axiosConfig.js`) criado
- [ ] Funções de API (`auth.js`, `servicos.js`, `avaliacoes.js`) criadas
- [ ] Componentes React criados
- [ ] Testar Login no Postman primeira
- [ ] Testar Login no Frontend
- [ ] Testar Listar Serviços
- [ ] Testar Criar Serviço
- [ ] Testar Upload de Imagem

---

Pronto! Agora você tem um guia completo para integrar o Backend com o Frontend! 🎉
