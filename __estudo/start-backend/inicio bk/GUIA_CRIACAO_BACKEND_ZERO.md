# 🔧 GUIA PASSO A PASSO: Criar o Backend do Zero

## 📋 Índice
1. [O que é este projeto?](#o-que-é-este-projeto)
2. [Tecnologias utilizadas](#tecnologias-utilizadas)
3. [Passo 1: Preparação do Ambiente](#passo-1-preparação-do-ambiente)
4. [Passo 2: Estrutura de Pastas](#passo-2-estrutura-de-pastas)
5. [Passo 3: Inicializar o Projeto Node.js](#passo-3-inicializar-o-projeto-nodejs)
6. [Passo 4: Instalar Dependências](#passo-4-instalar-dependências)
7. [Passo 5: Configurar Banco de Dados](#passo-5-configurar-banco-de-dados)
8. [Passo 6: Variáveis de Ambiente (.env)](#passo-6-variáveis-de-ambiente-env)
9. [Passo 7: Configuração do Banco de Dados](#passo-7-configuração-do-banco-de-dados)
10. [Passo 8: Sistema de Autenticação](#passo-8-sistema-de-autenticação)
11. [Passo 9: Gerenciamento de Serviços](#passo-9-gerenciamento-de-serviços)
12. [Passo 10: Sistema de Avaliações](#passo-10-sistema-de-avaliações)
13. [Passo 11: Testar no Postman](#passo-11-testar-no-postman)

---

## O que é este projeto?

### 🎯 Objetivo Geral
ObraConnect é um **marketplace online** onde:
- **Usuários** podem se cadastrar e contratar serviços
- **Prestadores** podem se registrar, oferecer serviços e receber avaliações
- **Sistema de Avaliações** permite que clientes avaliem o serviço recebido

**Exemplo Real:**
- Maria se cadastra como cliente
- João se torna um prestador (instalador elétrico)
- João cria um serviço chamado "Instalação de tomadas"
- Maria contrata João e depois avalia o serviço
- A nota fica registrada no perfil de João

### 🏗️ Arquitetura de Como Funciona

```
Frontend (React) ←→ Backend (Node.js/Express) ←→ Banco de Dados (MySQL)
   (Tela)              (API/Lógica)             (Armazena dados)
```

---

## Tecnologias utilizadas

| Nome | Função | Para que serve |
|------|--------|-----------------|
| **Node.js** | Runtime JavaScript | Executar código JavaScript fora do navegador |
| **Express** | Framework Web | Criar endpoints (rotas) da API |
| **MySQL** | Banco de Dados | Armazenar usuários, serviços, avaliações |
| **JWT (jsonwebtoken)** | Autenticação | "Crachá digital" para manter usuário logado |
| **Bcrypt** | Segurança | Criptografar senhas (não guardar em texto puro) |
| **Multer** | Upload de Arquivos | Permitir que usuários enviem imagens |
| **Dotenv** | Variáveis de Ambiente | Guardar senhas e configurações de forma segura |
| **Nodemon** | Desenvolvimento | Reiniciar servidor automaticamente quando arquivo muda |
| **CORS** | Compartilhamento | Permitir que o Frontend acesse o Backend |

---

# 🚀 PASSOS DO ZERO ATÉ O TOPO

## PASSO 1: Preparação do Ambiente

### O que você precisa ter instalado:

**1. Node.js** (inclui npm)
- Download: https://nodejs.org (escolha a versão LTS)
- Verificar instalação:
```bash
node --version
npm --version
```

**2. MySQL** (banco de dados)
- Download: https://dev.mysql.com/downloads/mysql/ OU
- Use XAMPP (inclui MySQL, Apache, PHP)
- Verificar: Abra o XAMPP Control Panel e clique "Start" no MySQL

**3. Visual Studio Code** (editor)
- Download: https://code.visualstudio.com

**4. Postman** (testar API)
- Download: https://www.postman.com/downloads/
- Serve para enviar requisições HTTP e testar seu backend

---

## PASSO 2: Estrutura de Pastas

Execute estes comandos para criar a estrutura:

```bash
mkdir BackendObraConnect
cd BackendObraConnect

mkdir src
mkdir src/config
mkdir src/controllers
mkdir src/middlewares
mkdir src/routes
mkdir src/services
mkdir src/utils
mkdir uploads
```

**Resultado esperado:**
```
BackendObraConnect/
├── src/
│   ├── config/       (Configurações do projeto)
│   ├── controllers/  (Lógica de negócio)
│   ├── middlewares/  (Verificadores de segurança)
│   ├── routes/       (Endereços da API)
│   ├── services/     (Funções reutilizáveis)
│   └── utils/        (Utilitários)
├── uploads/          (Imagens enviadas)
└── src/index.js      (Arquivo principal)
```

---

## PASSO 3: Inicializar o Projeto Node.js

No terminal, dentro da pasta `BackendObraConnect`:

```bash
npm init -y
```

Isso cria um `package.json` com as configurações básicas.

**Edite o `package.json` e coloque isso:**

```json
{
  "name": "backend-obraconnect",
  "version": "1.0.0",
  "description": "Marketplace ObraConnect",
  "main": "src/index.js",
  "type": "commonjs",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Seu Nome",
  "license": "MIT",
  "dependencies": {},
  "devDependencies": {}
}
```

**O que significa:**
- `"start"`: Comando para rodar em produção (`npm start`)
- `"dev"`: Comando para rodar em desenvolvimento (`npm run dev`) - reinicia sozinho
- `main`: Arquivo que começa tudo

---

## PASSO 4: Instalar Dependências

Agora vamos instalar todas as bibliotecas que precisa:

```bash
npm install express cors dotenv mysql2 bcryptjs jsonwebtoken multer
npm install --save-dev nodemon
```

**O que cada uma faz:**

| Biblioteca | Função |
|-----------|--------|
| `express` | Criar rotas/endpoints |
| `cors` | Permitir que frontend acesse backend |
| `dotenv` | Ler arquivo .env (variáveis secretas) |
| `mysql2` | Conectar no MySQL |
| `bcryptjs` | Criptografar senhas |
| `jsonwebtoken` | Gerar tokens de autenticação |
| `multer` | Fazer upload de imagens |
| `nodemon` | Reiniciar servidor automaticamente |

Final do `package.json` ficará assim:

```json
{
  ...
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "multer": "^2.0.2",
    "mysql2": "^3.16.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.11"
  }
}
```

---

## PASSO 5: Configurar Banco de Dados

### 5.1 - Criar o Banco de Dados

Abra o **MySQL Workbench** ou acesse via Terminal/PowerShell:

```bash
mysql -u root -p
```

Cole este SQL para criar o banco e as tabelas:

```sql
-- Criar o banco "obraconnect"
CREATE DATABASE IF NOT EXISTS obraconnect;
USE obraconnect;

-- Tabela de Usuários
CREATE TABLE oc__tb_usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome_usuario VARCHAR(100) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  login VARCHAR(50) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  tipo_usuario ENUM('usuario', 'prestador', 'admin') DEFAULT 'usuario',
  telefone VARCHAR(20),
  data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Serviços
CREATE TABLE oc__tb_servico (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  nome_prestador VARCHAR(100),
  titulo VARCHAR(200) NOT NULL,
  desc_servico LONGTEXT,
  imagem_url VARCHAR(500),
  nota_media DECIMAL(3,2) DEFAULT 0,
  total_avaliacoes INT DEFAULT 0,
  data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES oc__tb_usuario(id) ON DELETE CASCADE
);

-- Tabela de Avaliações
CREATE TABLE oc__tb_avaliacao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_servico INT NOT NULL,
  id_usuario INT NOT NULL,
  nota_preco INT,
  nota_tempo_execucao INT,
  nota_higiene INT,
  nota_educacao INT,
  comentario TEXT,
  data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_servico) REFERENCES oc__tb_servico(id) ON DELETE CASCADE,
  FOREIGN KEY (id_usuario) REFERENCES oc__tb_usuario(id) ON DELETE CASCADE
);

-- Tabela de Categorias (opcional, para futuras expansões)
CREATE TABLE tb_categoria (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Verificar se criou:**
```sql
SHOW DATABASES;
USE obraconnect;
SHOW TABLES;
```

---

## PASSO 6: Variáveis de Ambiente (.env)

Crie um arquivo `.env` na raiz do projeto com as credenciais:

```
# BANCO DE DADOS
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_NAME=obraconnect

# SERVIDOR
PORT=3001

# JWT (SEGURANÇA)
SEGREDO_JWT=sua_chave_super_secreta_aqui_123456789
```

⚠️ **IMPORTANTE:**
- `SEGREDO_JWT`: Use algo aleatório e longo (não use "123456")
- `DB_PASSWORD`: Substitua pela senha do seu MySQL
- Nunca compartilhe este arquivo! Coloque na `.gitignore`

Crie também `.gitignore`:
```
node_modules/
.env
uploads/*
```

---

## PASSO 7: Configuração do Banco de Dados

### 7.1 - Criar `src/config/database.js`

```javascript
const mysql = require("mysql2");
require("dotenv").config();

// EXPLICAÇÃO:
// Criamos um "Pool" (conjunto) de conexões com o MySQL
// Em vez de abrir uma conexão por vez, reutilizamos conexões
// Isso é mais rápido e usa menos recursos

const poolConexoes = mysql.createPool({
  host: process.env.DB_HOST,           // localhost
  user: process.env.DB_USER,           // root
  password: process.env.DB_PASSWORD,   // sua senha
  database: process.env.DB_NAME,       // obraconnect
  waitForConnections: true,
  connectionLimit: 10,  // Máximo de 10 conexões simultâneas
  queueLimit: 0,        // Sem limite na fila
});

// Exporta como Promise para usar "async/await"
const banco = poolConexoes.promise();

module.exports = banco;
```

**O que isso faz:**
- Se conecta automaticamente ao MySQL
- Reutiliza conexões (mais rápido)
- Permite usar `async/await` nas consultas

---

## PASSO 8: Sistema de Autenticação

Este é um dos passos MAIS IMPORTANTES. Explica como usuários fazem login.

### 📌 CONCEITO: O que é JWT (Token)?

Imagine um parque de diversões:
1. Você compra um ingresso (faz LOGIN)
2. Colocam um **pulseira com seu código** no seu braço (JWT Token)
3. A pulseira prova que você pagou
4. Em qualquer atração, basta mostrar a pulseira para entrar

**No nosso sistema:**
1. Usuário faz LOGIN
2. Recebe um **token** (string com dados criptografados)
3. Token é salvo no Frontend
4. Toda requisição enviada, o token vai junto
5. Backend valida o token e sabe quem está fazendo a requisição

### 7.1 - Criar `src/services/tokenService.js`

```javascript
const jwt = require("jsonwebtoken");
require("dotenv").config();

// GERADOR DE TOKEN
// Recebe os dados do usuário e cria um "crachá digital"
exports.gerarToken = (usuario) => {
  // O que vai escrito dentro do crachá (Token)
  const dadosToken = {
    id: usuario.id,
    login: usuario.login,
    email: usuario.email,
    tipo_usuario: usuario.tipo_usuario,  // usuario / prestador / admin
  };

  // jwt.sign(dados, chave secreta, opções)
  // expiresIn: '24h' = o login válida por 1 dia
  return jwt.sign(dadosToken, process.env.SEGREDO_JWT, {
    expiresIn: "24h",
  });
};
```

**Como funciona:**
- Pega os dados do usuário
- Criptografa com a chave secreta do `.env`
- Retorna uma string (o token)
- Ese token viaja no Frontend

### 7.2 - Criar `src/middlewares/autenticacao.js`

**O que é Middleware?**
É como um "segurança" na porta que:
1. Verifica se você tem o "crachá"
2. Se tiver, libera para entrar
3. Se não tiver, bloqueia

```javascript
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Este middleware valida o Token
// Se válido, coloca os dados do usuário na requisição
// Se inválido, retorna erro 401 (não autorizado)
exports.verificarToken = (req, res, next) => {
  // 1. Busca o token no cabeçalho da requisição
  // Formato esperado: "Bearer eyJhbGc..."
  const cabecalhoAuth = req.headers["authorization"];

  // Se não haver cabeçalho, retorna erro
  if (!cabecalhoAuth) {
    return res
      .status(401)
      .json({ erro: "Acesso negado. Token não fornecido." });
  }

  // 2. Separa a palavra "Bearer" do token em si
  // "Bearer eyJhbGc..." → ["Bearer", "eyJhbGc..."]
  // Pega apenas o segundo elemento [1]
  const token = cabecalhoAuth.split(" ")[1];

  // Se não haver token depois do "Bearer"
  if (!token) {
    return res
      .status(401)
      .json({ erro: "Acesso negado. Formato de token inválido." });
  }

  try {
    // 3. Verifica se o token é válido
    // jwt.verify(token, chave_secreta)
    // Se alguém alterou o token, ele saberá
    const verificado = jwt.verify(token, process.env.SEGREDO_JWT);

    // 4. Se válido, coloca os dados do usuário na requisição
    // Assim a próxima função saberá quem é o usuário
    req.usuario = verificado;

    // 5. Chama a próxima função (next)
    // É como dizer "passou na porta, pode entrar"
    next();
  } catch (erro) {
    // Se token expirou ou é inválido
    res.status(403).json({ erro: "Token inválido ou expirado." });
  }
};
```

**Fluxo de uma requisição protegida:**

```
Frontend envia requisição com Token
        ↓
[Middleware: verificarToken]
  ¿Token válido?
    ✓ Sim → req.usuario = dados do usuário → next()
    ✗ Não → Retorna erro 403
        ↓
[Controlador] executa a função
        ↓
Backend retorna a resposta
```

### 7.3 - Criar `src/controllers/authController.js`

```javascript
const banco = require("../config/database");
const bcrypt = require("bcryptjs");
const tokenService = require("../services/tokenService");

// ===================================================================
// 1. REGISTRO - Usuário novo se cadastra
// ===================================================================
exports.registrarUsuario = async (req, res) => {
  // req.body = dados que vieram do Frontend
  const { nome_usuario, email, senha, login, tipo_usuario } = req.body;

  // 1. VALIDAÇÃO: Todos os campos foram preenchidos?
  if (!nome_usuario || !email || !senha || !login) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios!" });
  }

  try {
    // 2. VERIFICAÇÃO: Este email/login já existe?
    // SELECT * = "busca tudo"
    // WHERE = "com a condição"
    const [usuariosExistentes] = await banco.query(
      "SELECT * FROM oc__tb_usuario WHERE email = ? OR login = ?",
      [email, login],
    );

    if (usuariosExistentes.length > 0) {
      // length > 0 = encontrou algo
      return res.status(409).json({ erro: "Usuário ou Email já cadastrados." });
    }

    // 3. CRIPTOGRAFIA: Nunca guardar senha em texto puro!
    // bcrypt transforma: "123456" → "$2x$10$asdkfj..."
    // É como transformar um documento em cinzas
    // Impossível voltar ao original (um sentido)
    const salt = await bcrypt.genSalt(10);        // Gera um sal aleatório
    const senhaCriptografada = await bcrypt.hash(senha, salt); // Criptografa

    // 4. TIPO DE USUÁRIO (padrão é "usuario")
    const tipoFinal = tipo_usuario || "usuario";

    // 5. INSERE no banco de dados
    // INSERT = "adiciona um novo registro"
    // VALUES (?, ?, ...) = "os ? são substituídos pelos valores"
    const [resultado] = await banco.query(
      "INSERT INTO oc__tb_usuario (nome_usuario, email, senha, login, tipo_usuario, data_cadastro) VALUES (?, ?, ?, ?, ?, NOW())",
      [nome_usuario, email, senhaCriptografada, login, tipoFinal],
    );

    // 6. RESPOSTA: Retorna sucesso
    res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso!",
      id_usuario: resultado.insertId,  // o ID gerado automaticamente
      usuario: nome_usuario,
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao cadastrar usuário." });
  }
};

// ===================================================================
// 2. LOGIN - Usuário existente faz login
// ===================================================================
exports.login = async (req, res) => {
  const { login, senha } = req.body;

  try {
    // 1. Busca o usuário no banco de dados
    const [usuarios] = await banco.query(
      "SELECT * FROM oc__tb_usuario WHERE login = ? OR email = ?",
      [login, login],
    );

    // Se não encontrou
    if (usuarios.length === 0) {
      return res.status(401).json({ erro: "Usuário ou senha incorretos." });
    }

    const usuario = usuarios[0];

    // 2. Verifica a senha
    // bcrypt.compare(senha_enviada, senha_criptografada_no_banco)
    // Retorna true/false
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: "Usuário ou senha incorretos." });
    }

    // 3. Gera o Token (usando o serviceToken)
    const token = tokenService.gerarToken(usuario);

    // 4. Retorna o Token e dados do usuário
    res.status(200).json({
      mensagem: "Login realizado com sucesso!",
      token: token,  // Frontend vai guardar isso
      usuario: {
        id: usuario.id,
        nome: usuario.nome_usuario,
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario,
      },
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao realizar login." });
  }
};

// ===================================================================
// 3. OBTER PERFIL - Retorna dados do usuário logado
// ===================================================================
exports.obterPerfil = async (req, res) => {
  // req.usuario foi preenchido pelo Middleware verificarToken
  res.status(200).json({
    mensagem: "Acesso autorizado!",
    dados_usuario: req.usuario,
  });
};

// ===================================================================
// 4. TORNAR PRESTADOR - Usuário vira um prestador
// ===================================================================
exports.tornarPrestador = async (req, res) => {
  const usuarioLogado = req.usuario;

  try {
    // 1. ATUALIZA no banco
    // UPDATE = "modifica um registro existente"
    await banco.query(
      'UPDATE oc__tb_usuario SET tipo_usuario = "prestador" WHERE id = ?',
      [usuarioLogado.id],
    );

    // 2. Busca os dados atualizados
    const [usuarios] = await banco.query(
      "SELECT * FROM oc__tb_usuario WHERE id = ?",
      [usuarioLogado.id],
    );
    const usuarioAtualizado = usuarios[0];

    // 3. Gera um NOVO TOKEN (agora com tipo_usuario = "prestador")
    const novoToken = tokenService.gerarToken(usuarioAtualizado);

    res.status(200).json({
      mensagem: "Parabéns! Agora você é um prestador.",
      token: novoToken,  // Frontend precisa atualizar o token
      usuario: {
        id: usuarioAtualizado.id,
        nome: usuarioAtualizado.nome_usuario,
        tipo_usuario: "prestador",
      },
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao atualizar perfil." });
  }
};
```

### 7.4 - Criar `src/routes/authRoutes.js`

**O que são rotas?**
São os "endereços" da sua API. Como URLs:
- `http://seu-site.com/api/auth/registro` → Registrar
- `http://seu-site.com/api/auth/login` → Login
- `http://seu-site.com/api/auth/perfil` → Ver perfil

```javascript
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verificarToken } = require("../middlewares/autenticacao");

// POST = adiciona dados (como enviar um formulário)
// Quando a requisição chegar, chama a função do controlador
router.post("/registro", authController.registrarUsuario);

// LOGIN: Envia login e senha
router.post("/login", authController.login);

// PERFIL: Precisa do Token (middleware verificarToken)
// A função só executa se o Token for válido
router.get("/perfil", verificarToken, authController.obterPerfil);

// TORNAR PRESTADOR: Também precisa de Token
router.put("/tornar-prestador", verificarToken, authController.tornarPrestador);

module.exports = router;
```

---

## PASSO 9: Gerenciamento de Serviços

### 📌 CONCEITO: O que é CRUD?

CRUD = Create, Read, Update, Delete

- **Create**: Criar novo serviço (POST)
- **Read**: Listar ou buscar serviços (GET)
- **Update**: Editar serviço (PUT)
- **Delete**: Deletar serviço (DELETE)

### 9.1 - Criar `src/config/upload.js`

Este arquivo configura como fazer upload de imagens.

```javascript
const multer = require("multer");
const path = require("path");

// EXPLICAÇÃO:
// Multer é um middleware que processa upload de arquivos
// Precisamos dizer ONDE salvar e COMO nomear

const storage = multer.diskStorage({
  // Onde salvar? Na pasta "uploads" na raiz do projeto
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  
  // Como nomear?
  // Se duas pessoas enviarem "foto.jpg", um sobrescreve o outro
  // Solução: adicionar timestamp (data/hora) no começo
  // Exemplo: 1706762400000-foto.jpg
  filename: (req, file, cb) => {
    const nomeUnico = Date.now() + "-" + file.originalname;
    cb(null, nomeUnico);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
```

### 9.2 - Criar `src/controllers/servicoController.js`

```javascript
const banco = require("../config/database");

// =======================================================
// 1. OPERAÇÕES DE LEITURA (GET)
// =======================================================

// LISTAR TODOS OS SERVIÇOS (Pública)
// Qualquer um pode ver
exports.listarServicos = async (req, res) => {
  try {
    // SELECT s.* = "pega todos os campos da tabela servico"
    // JOIN = "junta dados de duas tabelas"
    // ORDER BY = "ordena por alguma coluna"
    const [servicos] = await banco.query(`
      SELECT s.*, u.nome_usuario 
      FROM oc__tb_servico s
      JOIN oc__tb_usuario u ON s.id_usuario = u.id
      ORDER BY s.id DESC
    `);

    // DESC = ordem decrescente (mais recentes primeiro)
    res.status(200).json(servicos);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao buscar serviços." });
  }
};

// BUSCAR UM SERVIÇO ESPECÍFICO (Pública)
exports.buscarPorId = async (req, res) => {
  // req.params = dados que vêm na URL
  // /servicos/5 → req.params.id = 5
  const { id } = req.params;

  try {
    const [servicos] = await banco.query(
      `
      SELECT s.*, u.nome_usuario, u.email, u.telefone 
      FROM oc__tb_servico s
      JOIN oc__tb_usuario u ON s.id_usuario = u.id
      WHERE s.id = ?
      `,
      [id],
    );

    // Se não encontrou
    if (servicos.length === 0) {
      return res.status(404).json({ erro: "Serviço não encontrado." });
    }

    // [0] = primeiro resultado
    res.status(200).json(servicos[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao buscar detalhes do serviço." });
  }
};

// LISTAR APENAS MEUS SERVIÇOS (Protegida)
// Só o prestador logado vê seus próprios serviços
exports.listarMeusServicos = async (req, res) => {
  const usuarioLogado = req.usuario;  // Vem do middleware verificarToken

  try {
    const [servicos] = await banco.query(
      `
      SELECT * FROM oc__tb_servico 
      WHERE id_usuario = ?
      ORDER BY id DESC
      `,
      [usuarioLogado.id],
    );

    res.status(200).json(servicos);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao buscar seus serviços." });
  }
};

// =======================================================
// 2. OPERAÇÕES DE ESCRITA (CREATE, UPDATE, DELETE)
// =======================================================

// CRIAR NOVO SERVIÇO (Protegida + Upload)
exports.criarServico = async (req, res) => {
  const usuarioLogado = req.usuario;

  // VALIDAÇÃO: Só prestadores podem criar serviços
  if (
    usuarioLogado.tipo_usuario !== "prestador" &&
    usuarioLogado.tipo_usuario !== "admin"
  ) {
    return res
      .status(403)
      .json({ erro: "Apenas prestadores podem cadastrar serviços!" });
  }

  // req.file = arquivo enviado (se houver)
  // req.body = dados enviados
  const arquivo = req.file;
  const { titulo, descricao } = req.body;

  // Validação: Campos obrigatórios
  if (!titulo || !descricao) {
    return res
      .status(400)
      .json({ erro: "Título e Descrição são obrigatórios." });
  }

  // Se arquivo foi enviado, cria URL
  let caminhoImagem = null;
  if (arquivo) {
    caminhoImagem = `http://localhost:3001/uploads/${arquivo.filename}`;
  }

  try {
    // INSERT = adiciona novo registro
    const [resultado] = await banco.query(
      `INSERT INTO oc__tb_servico (id_usuario, nome_prestador, titulo, desc_servico, imagem_url, data_cadastro) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [usuarioLogado.id, usuarioLogado.nome, titulo, descricao, caminhoImagem],
    );

    res.status(201).json({
      mensagem: "Serviço criado com sucesso!",
      id_servico: resultado.insertId,  // ID do novo serviço
      imagem: caminhoImagem,
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao criar serviço." });
  }
};

// EDITAR SERVIÇO (Protegida)
exports.editarServico = async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao } = req.body;
  const usuarioLogado = req.usuario;

  try {
    // 1. Verifica se o serviço existe
    const [servicos] = await banco.query(
      "SELECT * FROM oc__tb_servico WHERE id = ?",
      [id],
    );

    if (servicos.length === 0) {
      return res.status(404).json({ erro: "Serviço não encontrado." });
    }

    // 2. Verifica PERMISSÃO: Só o criador pode editar
    if (servicos[0].id_usuario !== usuarioLogado.id) {
      return res
        .status(403)
        .json({ erro: "Você não tem permissão para editar este serviço." });
    }

    // 3. Monta a query dinamicamente
    // Se houver nova imagem, coloca na query
    let sql = "UPDATE oc__tb_servico SET titulo = ?, desc_servico = ?";
    let params = [titulo, descricao];

    if (req.file) {
      const imagemUrl = `http://localhost:3001/uploads/${req.file.filename}`;
      sql += ", imagem_url = ?";
      params.push(imagemUrl);
    }

    sql += " WHERE id = ?";
    params.push(id);

    // 4. Executa a atualização
    await banco.query(sql, params);

    res.status(200).json({ mensagem: "Serviço atualizado com sucesso!" });
  } catch (erro) {
    console.error("Erro SQL:", erro);
    res
      .status(500)
      .json({ erro: "Erro ao atualizar serviço no banco de dados." });
  }
};

// DELETAR SERVIÇO (Protegida)
exports.deletarServico = async (req, res) => {
  const { id } = req.params;
  const usuarioLogado = req.usuario;

  try {
    // 1. Verifica existência
    const [servicos] = await banco.query(
      "SELECT * FROM oc__tb_servico WHERE id = ?",
      [id],
    );

    if (servicos.length === 0) {
      return res.status(404).json({ erro: "Serviço não encontrado." });
    }

    // 2. Verifica PERMISSÃO: Dono ou Admin
    if (
      servicos[0].id_usuario !== usuarioLogado.id &&
      usuarioLogado.tipo_usuario !== "admin"
    ) {
      return res
        .status(403)
        .json({ erro: "Você não tem permissão para deletar este serviço." });
    }

    // 3. Deleta do banco
    await banco.query("DELETE FROM oc__tb_servico WHERE id = ?", [id]);

    res.status(200).json({ mensagem: "Serviço removido com sucesso!" });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao deletar serviço." });
  }
};
```

### 9.3 - Criar `src/routes/servicoRoutes.js`

```javascript
const express = require("express");
const router = express.Router();
const servicoController = require("../controllers/servicoController");
const { verificarToken } = require("../middlewares/autenticacao");
const upload = require("../config/upload");

// IMPORTANTE: As rotas ESPECÍFICAS devem vir ANTES das dinâmicas
// Senão /meus-servicos será interpretado como /:id

// ROTA ESPECÍFICA: Meus serviços (Protegida)
router.get("/meus-servicos", verificarToken, servicoController.listarMeusServicos);

// ROTAS GERAIS (Públicas)
router.get("/", servicoController.listarServicos);
router.get("/:id", servicoController.buscarPorId);

// ROTAS DE GERENCIAMENTO (Protegidas)
// upload.single("imagem") = espera um arquivo chamado "imagem"
router.post(
  "/",
  verificarToken,
  upload.single("imagem"),
  servicoController.criarServico,
);

router.put(
  "/:id",
  verificarToken,
  upload.single("imagem"),
  servicoController.editarServico,
);

router.delete("/:id", verificarToken, servicoController.deletarServico);

module.exports = router;
```

---

## PASSO 10: Sistema de Avaliações

### 📌 CONCEITO: Avaliações

Um cliente avalia o serviço com 4 notas (1 a 5):
- Nota Preço: O serviço foi caro demais?
- Nota Tempo: Demorou muito?
- Nota Higiene: Ficou limpo?
- Nota Educação: O prestador foi educado?

A média dessas 4 notas fica no perfil do prestador.

### 10.1 - Criar `src/controllers/avaliacaoController.js`

```javascript
const banco = require("../config/database");

// CRIAR AVALIAÇÃO
exports.criarAvaliacao = async (req, res) => {
  const usuarioLogado = req.usuario;
  const {
    id_servico,
    nota_preco,
    nota_tempo,
    nota_higiene,
    nota_educacao,
    comentario,
  } = req.body;

  // VALIDAÇÃO: As notas devem estar entre 1 e 5
  if (nota_preco < 1 || nota_preco > 5 || nota_tempo < 1 || nota_tempo > 5) {
    return res.status(400).json({ erro: "As notas devem ser entre 1 e 5." });
  }

  try {
    // VERIFICAÇÃO: O usuário já avaliou este serviço?
    // Se avaliou, não pode avaliar de novo (evita spam)
    const [existente] = await banco.query(
      "SELECT * FROM oc__tb_avaliacao WHERE id_servico = ? AND id_usuario = ?",
      [id_servico, usuarioLogado.id],
    );

    if (existente.length > 0) {
      return res.status(409).json({ erro: "Você já avaliou este serviço!" });
    }

    // INSERE a avaliação
    await banco.query(
      `INSERT INTO oc__tb_avaliacao 
            (id_servico, id_usuario, nota_preco, nota_tempo_execucao, nota_higiene, nota_educacao, comentario, data_avaliacao)
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        id_servico,
        usuarioLogado.id,
        nota_preco,
        nota_tempo,
        nota_higiene,
        nota_educacao,
        comentario,
      ],
    );

    // ATUALIZA a nota média do serviço
    await banco.query(
      `
            UPDATE oc__tb_servico SET 
                nota_media = (
                    SELECT AVG((nota_preco + nota_tempo_execucao + nota_higiene + nota_educacao) / 4)
                    FROM oc__tb_avaliacao WHERE id_servico = ?
                ),
                total_avaliacoes = (
                    SELECT COUNT(*) FROM oc__tb_avaliacao WHERE id_servico = ?
                )
            WHERE id = ?
        `,
      [id_servico, id_servico, id_servico],
    );

    res.status(201).json({ mensagem: "Avaliação enviada com sucesso!" });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao salvar avaliação." });
  }
};

// LISTAR AVALIAÇÕES DE UM SERVIÇO (Pública)
exports.listarAvaliacoes = async (req, res) => {
  const { id_servico } = req.params;

  try {
    const [avaliacoes] = await banco.query(
      `
            SELECT a.*, u.nome_usuario 
            FROM oc__tb_avaliacao a
            JOIN oc__tb_usuario u ON a.id_usuario = u.id
            WHERE a.id_servico = ?
            ORDER BY a.data_avaliacao DESC
        `,
      [id_servico],
    );

    res.status(200).json(avaliacoes);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao buscar avaliações." });
  }
};

// LISTAR AVALIAÇÕES RECEBIDAS (Dashboard do Prestador)
exports.listarRecebidas = async (req, res) => {
  const usuarioLogado = req.usuario;

  try {
    // Busca avaliações onde os serviços pertencem ao prestador logado
    const [avaliacoes] = await banco.query(
      `
        SELECT a.*, s.titulo, u.nome_usuario 
        FROM oc__tb_avaliacao a
        JOIN oc__tb_servico s ON a.id_servico = s.id
        JOIN oc__tb_usuario u ON a.id_usuario = u.id
        WHERE s.id_usuario = ?
        ORDER BY a.data_avaliacao DESC
      `,
      [usuarioLogado.id],
    );

    res.status(200).json(avaliacoes);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao buscar avaliações recebidas." });
  }
};
```

### 10.2 - Criar `src/routes/avaliacaoRoutes.js`

```javascript
const express = require("express");
const router = express.Router();
const avaliacaoController = require("../controllers/avaliacaoController");
const { verificarToken } = require("../middlewares/autenticacao");

// Criar avaliação (Protegida)
router.post("/", verificarToken, avaliacaoController.criarAvaliacao);

// Listar avaliações recebidas do prestador (Protegida)
router.get("/recebidas", verificarToken, avaliacaoController.listarRecebidas);

// Listar avaliações de um serviço (Pública)
router.get("/servico/:id_servico", avaliacaoController.listarAvaliacoes);

module.exports = router;
```

---

## PASSO 11: O Arquivo Principal (index.js)

Este é o arquivo que **inicia tudo**.

### 11.1 - Criar `src/index.js`

```javascript
// 1. Carrega variáveis do .env
require("dotenv").config();

// 2. Importa as bibliotecas
const express = require("express");
const cors = require("cors");
const path = require("path");

// 3. Importa as rotas
const banco = require("./config/database");
const rotasAutenticacao = require("./routes/authRoutes");
const rotasServico = require("./routes/servicoRoutes");
const rotasAvaliacao = require("./routes/avaliacaoRoutes");

// 4. Cria a aplicação Express
const app = express();

// ===================================================
// MIDDLEWARES GLOBAIS (aplicados a todas as rotas)
// ===================================================

// CORS: Permite que o Frontend acesse o Backend
// Sem isso, o React não consegue fazer requisições
app.use(cors());

// JSON: Faz o Express entender dados em JSON
app.use(express.json());

// ARQUIVOS ESTÁTICOS: Permite acessar /uploads/imagem.jpg
app.use("/uploads", express.static("uploads"));

// ===================================================
// ROTAS
// ===================================================

// Quando uma requisição chega em /api/auth, use rotasAutenticacao
app.use("/api/auth", rotasAutenticacao);
app.use("/api/servicos", rotasServico);
app.use("/api/avaliacoes", rotasAvaliacao);

// ===================================================
// ROTAS DE TESTE
// ===================================================

// Simples teste: GET na raiz
app.get("/", (req, res) => {
  res.send("Hello World! Backend funcionando!");
});

// Teste de conexão com banco de dados
app.get("/teste-banco", async (req, res) => {
  try {
    const [categorias] = await banco.query(
      "SELECT * FROM tb_categoria LIMIT 5",
    );

    res.status(200).json({
      mensagem: "Conexão com Banco de Dados realizada com sucesso!",
      total_encontrado: categorias.length,
      dados: categorias,
    });
  } catch (erro) {
    console.error("Erro ao conectar:", erro);
    res.status(500).json({
      mensagem: "Erro ao conectar no banco de dados",
      erro_detalhado: erro.message,
    });
  }
});

// ===================================================
// INICIA O SERVIDOR
// ===================================================

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 Base URL: http://localhost:${PORT}`);
});
```

---

## PASSO 12: Testando no Postman

### O que é Postman?

É um software para testar APIs. Você envia requisições e vê as respostas.

### Passos para testar:

**1. Abra o Postman**

**2. Teste cada endpoint:**

#### 📝 REGISTRAR NOVO USUÁRIO

```
POST http://localhost:3001/api/auth/registro

Body (JSON):
{
  "nome_usuario": "João Silva",
  "email": "joao@email.com",
  "login": "joao123",
  "senha": "123456"
}

Esperado: 
{
  "mensagem": "Usuário cadastrado com sucesso!",
  "id_usuario": 1,
  "usuario": "João Silva"
}
```

---

#### 🔐 FAZER LOGIN

```
POST http://localhost:3001/api/auth/login

Body (JSON):
{
  "login": "joao123",
  "senha": "123456"
}

Esperado:
{
  "mensagem": "Login realizado com sucesso!",
  "token": "eyJhbGc...muito_grande...",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "tipo_usuario": "usuario"
  }
}
```

**⚠️ IMPORTANTE:** Copie o token! Você vai precisar dele para as próximas requisições.

---

#### ⭐ TORNAR PRESTADOR

```
PUT http://localhost:3001/api/auth/tornar-prestador

Headers:
Authorization: Bearer [COLE_O_TOKEN_AQUI]

Body: {}

Esperado:
{
  "mensagem": "Parabéns! Agora você é um prestador.",
  "token": "eyJhbGc...novo_token...",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "tipo_usuario": "prestador"
  }
}
```

---

#### ➕ CRIAR SERVIÇO

```
POST http://localhost:3001/api/servicos/

Headers:
Authorization: Bearer [NOVO_TOKEN_DO_PRESTADOR]

Body (form-data):
- titulo: "Instalação de Tomadas"
- descricao: "Instalo tomadas em qualquer lugar"
- imagem: [selecionar arquivo]

Esperado:
{
  "mensagem": "Serviço criado com sucesso!",
  "id_servico": 1,
  "imagem": "http://localhost:3001/uploads/1706762400000-foto.jpg"
}
```

---

#### 📋 LISTAR TODOS OS SERVIÇOS

```
GET http://localhost:3001/api/servicos/

Headers: (nenhum necessário)

Esperado:
[
  {
    "id": 1,
    "id_usuario": 1,
    "titulo": "Instalação de Tomadas",
    "desc_servico": "Instalo tomadas em qualquer lugar",
    "nome_usuario": "João Silva",
    ...
  }
]
```

---

#### 🔍 BUSCAR UM SERVIÇO

```
GET http://localhost:3001/api/servicos/1

Esperado:
{
  "id": 1,
  "titulo": "Instalação de Tomadas",
  ...com todos os detalhes...
}
```

---

#### ⭐ CRIAR AVALIAÇÃO

```
POST http://localhost:3001/api/avaliacoes/

Headers:
Authorization: Bearer [TOKEN_DE_OUTRO_USUARIO]

Body (JSON):
{
  "id_servico": 1,
  "nota_preco": 5,
  "nota_tempo": 4,
  "nota_higiene": 5,
  "nota_educacao": 5,
  "comentario": "Excelente trabalho!"
}

Esperado:
{
  "mensagem": "Avaliação enviada com sucesso!"
}
```

---

### 🐛 Se algo deu errado:

1. **Erro de conexão com banco:**
   - Verifique se o MySQL está rodando
   - Verifique as credenciais no `.env`

2. **Token inválido:**
   - Copie o token correto
   - Coloque no formato: `Bearer token_aqui`

3. **Arquivo não encontrado:**
   - Verifique o caminho no terminal
   - Crie manualmente a pasta `uploads/`

---

## 📊 FLUXOGRAMA COMPLETO

```
┌─────────────────────────────────────────────────────────────┐
│                    USUÁRIO NOVO                              │
└─────────────────────────────────────────────────────────────┘
                           ↓
        ┌──────────────────────────────────────┐
        │  /api/auth/registro                  │
        │  POST {nome, email, login, senha}    │
        └──────────────────────────────────────┘
                           ↓
        ┌──────────────────────────────────────┐
        │  Bcrypt criptografa a senha          │
        │  Salva no banco                      │
        └──────────────────────────────────────┘
                           ↓
        ┌──────────────────────────────────────┐
        │  200: Usuário cadastrado             │
        └──────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    FAZER LOGIN                               │
└─────────────────────────────────────────────────────────────┘
                           ↓
        ┌──────────────────────────────────────┐
        │  /api/auth/login                     │
        │  POST {login, senha}                 │
        └──────────────────────────────────────┘
                           ↓
        ┌──────────────────────────────────────┐
        │  Valida login + senha                │
        │  JWT.sign() gera TOKEN               │
        └──────────────────────────────────────┘
                           ↓
        ┌──────────────────────────────────────┐
        │  200: Retorna TOKEN                  │
        │  Frontend salva no localStorage      │
        └──────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    CRIAR SERVIÇO                             │
└─────────────────────────────────────────────────────────────┘
                           ↓
        ┌──────────────────────────────────────┐
        │  /api/servicos/                      │
        │  POST {titulo, descricao, imagem}    │
        │  Header: Authorization: Bearer TOKEN │
        └──────────────────────────────────────┘
                           ↓
        ┌──────────────────────────────────────┐
        │  verificarToken valida TOKEN         │
        │  Multer salva imagem em /uploads     │
        │  Insere no banco                     │
        └──────────────────────────────────────┘
                           ↓
        ┌──────────────────────────────────────┐
        │  201: Serviço criado!                │
        └──────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    VER AVALIAÇÕES                            │
└─────────────────────────────────────────────────────────────┘
                           ↓
        ┌──────────────────────────────────────┐
        │  /api/avaliacoes/servico/1           │
        │  GET (público)                       │
        └──────────────────────────────────────┘
                           ↓
        ┌──────────────────────────────────────┐
        │  Busca todas as avaliações do        │
        │  serviço ID 1                        │
        └──────────────────────────────────────┘
                           ↓
        ┌──────────────────────────────────────┐
        │  200: Lista de avaliações            │
        └──────────────────────────────────────┘
```

---

## 📚 RESUMO DOS ARQUIVOS CRIADOS

```
backend/
├── src/
│   ├── index.js                    ← Arquivo principal que inicia tudo
│   ├── config/
│   │   ├── database.js             ← Conecta ao MySQL
│   │   └── upload.js               ← Configura upload de imagens
│   ├── controllers/
│   │   ├── authController.js       ← Lógica de autenticação
│   │   ├── servicoController.js    ← Lógica de serviços
│   │   └── avaliacaoController.js  ← Lógica de avaliações
│   ├── middlewares/
│   │   └── autenticacao.js         ← Valida tokens
│   ├── routes/
│   │   ├── authRoutes.js           ← Rotas de login/registro
│   │   ├── servicoRoutes.js        ← Rotas de serviços
│   │   └── avaliacaoRoutes.js      ← Rotas de avaliações
│   ├── services/
│   │   └── tokenService.js         ← Gera tokens JWT
│   └── utils/                      ← Utilitários (vazio por enquanto)
├── uploads/                        ← Imagens enviadas aqui
├── .env                            ← Variáveis secretas
├── .gitignore                      ← Arquivos a ignorar no Git
└── package.json                    ← Dependências do projeto
```

---

## 🚀 RODAR O PROJETO

### 1. Instale as dependências (primeira vez):
```bash
npm install
```

### 2. Configure o `.env` com suas credenciais

### 3. Crie o banco de dados (execute os SQLs)

### 4. Inicie o servidor:
```bash
npm run dev
```

Você verá:
```
🚀 Servidor rodando na porta 3001
📡 Base URL: http://localhost:3001
```

### 5. Acesse:
- Teste: http://localhost:3001/
- Teste banco: http://localhost:3001/teste-banco

---

## ⚡ PONTOS CRUCIAIS RESUMIDOS

### 1. **Autenticação (JWT)**
- Usuário faz login
- Servidor gera um "crachá digital" (token)
- Frontend guarda esse token
- Toda requisição enviada, o token vai junto
- Servidor valida o token e sabe quem é

### 2. **Criptografia de Senhas**
- **NUNCA** guarde senhas em texto puro
- Use Bcrypt: transforma "123456" em "$2a$10$asdkfj..."
- É um sentido: senha → hash, mas hash → senha é impossível

### 3. **Middlewares**
- São "porteiros" da aplicação
- Executam ANTES da função principal
- Exemplo: `verificarToken` bloqueia requisições sem token válido

### 4. **Rotas**
- GET: Buscar dados (lista, detalhe)
- POST: Criar dados novo
- PUT: Editar dados existente
- DELETE: Remover dados

### 5. **Upload de Imagens**
- Multer processa o arquivo
- Salva na pasta `uploads/`
- Gera um nome único (timestamp + nome original)
- Retorna uma URL para acessar depois

### 6. **CRUD**
- **C** reate: POST (criar)
- **R** ead: GET (ler)
- **U** pdate: PUT (atualizar)
- **D** elete: DELETE (deletar)

---

## 🎯 PRÓXIMOS PASSOS

1. **Conectar o Frontend** para fazer requisições
2. **Adicionar validações** mais robustas
3. **Implementar paginação** nas listas
4. **Adicionar logs** para debug
5. **Colocar em produção** (Heroku, AWS, etc)

---

Qualquer dúvida, você pode rever esta documentação! 🚀
