# 📝 GUIA PRÁTICO: COMEÇANDO O BACKEND

## Passo 1: Setup Inicial

### 1.1 Criar a pasta do backend

```bash
cd c:\xampp\htdocs\ObraConnect
mkdir backend
cd backend
```

### 1.2 Inicializar Node.js

```bash
npm init -y
```

### 1.3 Instalar dependências

```bash
npm install express mysql2 bcryptjs jsonwebtoken cors dotenv joi
npm install --save-dev nodemon
```

### 1.4 Atualizar package.json

```json
{
  "name": "obraconnect-backend",
  "version": "1.0.0",
  "description": "Backend do ObraConnect - Marketplace de Serviços",
  "main": "src/servidor.js",
  "scripts": {
    "start": "node src/servidor.js",
    "dev": "nodemon src/servidor.js"
  },
  "keywords": ["marketplace", "construção", "obraconnect"],
  "author": "Seu Nome",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "joi": "^17.11.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

---

## Passo 2: Arquivos de Configuração

### 2.1 `.env`

```env
# ========== SERVIDOR ==========
PORTA=3000
NODE_ENV=development

# ========== BANCO DE DADOS ==========
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=obraconnect_db

# ========== SEGURANÇA ==========
JWT_SECRET=sua_chave_super_segura_min_32_caracteres_aqui_12345
JWT_EXPIRATION=24h

# ========== CORS ==========
FRONTEND_URL=http://localhost:5173
FRONTEND_PROD=https://obraconnect.com.br
```

### 2.2 `.gitignore`

```
node_modules/
.env
.env.local
.DS_Store
*.log
dist/
build/
```

---

## Passo 3: Configuração do Banco de Dados

### 3.1 `src/config/database.js`

```javascript
const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "obraconnect_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4",
});

// Testar conexão na inicialização
pool
  .getConnection()
  .then((connection) => {
    console.log("✅ Conectado ao banco de dados MySQL");
    connection.release();
  })
  .catch((err) => {
    console.error("❌ Erro ao conectar ao banco de dados:", err.message);
    process.exit(1);
  });

module.exports = pool;
```

### 3.2 `src/config/constants.js`

```javascript
const TIPO_USUARIO = {
  USUARIO: "usuario",
  PRESTADOR: "prestador",
  ADMIN: "admin",
};

const MENSAGENS = {
  SUCESSO: {
    LOGIN: "Login realizado com sucesso",
    REGISTRO: "Usuário registrado com sucesso",
    CRIADO: "Recurso criado com sucesso",
    ATUALIZADO: "Recurso atualizado com sucesso",
    DELETADO: "Recurso deletado com sucesso",
  },
  ERRO: {
    LOGIN_INVALIDO: "Login ou senha inválidos",
    USUARIO_EXISTE: "Usuário já existe",
    USUARIO_NAO_EXISTE: "Usuário não encontrado",
    SENHA_FRACA: "Senha deve ter no mínimo 8 caracteres",
    EMAIL_INVALIDO: "Email inválido",
    NAO_AUTORIZADO: "Não autorizado",
    ERRO_SERVIDOR: "Erro interno do servidor",
  },
};

const STATUS_HTTP = {
  OK: 200,
  CRIADO: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  ERRO_SERVIDOR: 500,
};

module.exports = {
  TIPO_USUARIO,
  MENSAGENS,
  STATUS_HTTP,
};
```

---

## Passo 4: Utilitários

### 4.1 `src/utils/criptografia.js`

```javascript
const bcrypt = require("bcryptjs");

// Hash de senha
const hashSenha = async (senha) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(senha, salt);
};

// Comparar senha
const compararSenha = async (senha, hashArmazenado) => {
  return bcrypt.compare(senha, hashArmazenado);
};

module.exports = {
  hashSenha,
  compararSenha,
};
```

### 4.2 `src/utils/validadores.js`

```javascript
const Joi = require("joi");

// Esquema de validação para registro
const schemaRegistro = Joi.object({
  login: Joi.string().alphanum().min(3).max(50).required().messages({
    "string.alphanum": "Login deve conter apenas letras e números",
    "string.min": "Login deve ter no mínimo 3 caracteres",
    "any.required": "Login é obrigatório",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Email inválido",
    "any.required": "Email é obrigatório",
  }),

  senha: Joi.string().min(8).required().messages({
    "string.min": "Senha deve ter no mínimo 8 caracteres",
    "any.required": "Senha é obrigatória",
  }),

  nome_usuario: Joi.string().max(100).required().messages({
    "any.required": "Nome é obrigatório",
  }),

  tipo_usuario: Joi.string().valid("usuario", "prestador").default("usuario"),
});

// Esquema de validação para login
const schemaLogin = Joi.object({
  login: Joi.string().min(3).required().messages({
    "any.required": "Login é obrigatório",
  }),

  senha: Joi.string().required().messages({
    "any.required": "Senha é obrigatória",
  }),
});

// Esquema para criar serviço
const schemaServico = Joi.object({
  nome_prestador: Joi.string().max(100).required(),

  desc_servico: Joi.string().required(),

  imagem_url: Joi.string().uri().allow(null, ""),

  telefone_contato: Joi.string().max(20).allow(null, ""),

  categorias: Joi.array().items(Joi.number()).required(),
});

module.exports = {
  schemaRegistro,
  schemaLogin,
  schemaServico,
};
```

---

## Passo 5: Middlewares

### 5.1 `src/middlewares/autenticacao.js`

```javascript
const jwt = require("jsonwebtoken");
const { STATUS_HTTP, MENSAGENS } = require("../config/constants");

const verificarToken = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(STATUS_HTTP.UNAUTHORIZED).json({
        sucesso: false,
        mensagem: "Token não fornecido",
      });
    }

    const [tipo, token] = header.split(" ");

    if (tipo !== "Bearer") {
      return res.status(STATUS_HTTP.UNAUTHORIZED).json({
        sucesso: false,
        mensagem: "Formato de token inválido",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (erro) {
    return res.status(STATUS_HTTP.UNAUTHORIZED).json({
      sucesso: false,
      mensagem: "Token inválido ou expirado",
      erro: erro.message,
    });
  }
};

const verificarAdmin = (req, res, next) => {
  if (req.usuario.tipo_usuario !== "admin") {
    return res.status(STATUS_HTTP.FORBIDDEN).json({
      sucesso: false,
      mensagem: "Acesso negado. Apenas administradores",
    });
  }
  next();
};

const verificarPrestador = (req, res, next) => {
  if (
    req.usuario.tipo_usuario !== "prestador" &&
    req.usuario.tipo_usuario !== "admin"
  ) {
    return res.status(STATUS_HTTP.FORBIDDEN).json({
      sucesso: false,
      mensagem: "Acesso negado. Apenas prestadores",
    });
  }
  next();
};

module.exports = {
  verificarToken,
  verificarAdmin,
  verificarPrestador,
};
```

### 5.2 `src/middlewares/validacao.js`

```javascript
const { STATUS_HTTP } = require("../config/constants");

const validarDados = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const mensagens = error.details.map((e) => e.message);
      return res.status(STATUS_HTTP.BAD_REQUEST).json({
        sucesso: false,
        mensagem: "Dados inválidos",
        erros: mensagens,
      });
    }

    req.validado = value;
    next();
  };
};

module.exports = { validarDados };
```

### 5.3 `src/middlewares/erros.js`

```javascript
const { STATUS_HTTP } = require("../config/constants");

const tratarErroGlobal = (erro, req, res, next) => {
  console.error("❌ Erro:", erro.message);
  console.error("Stack:", erro.stack);

  const statusCode = erro.statusCode || STATUS_HTTP.ERRO_SERVIDOR;
  const mensagem = erro.message || "Erro interno do servidor";

  res.status(statusCode).json({
    sucesso: false,
    mensagem,
    ...(process.env.NODE_ENV === "development" && { stack: erro.stack }),
  });
};

module.exports = { tratarErroGlobal };
```

---

## Passo 6: Services (Lógica de Negócio)

### 6.1 `src/services/tokenService.js`

```javascript
const jwt = require("jsonwebtoken");

const gerarToken = (usuario) => {
  const payload = {
    id: usuario.id,
    login: usuario.login,
    email: usuario.email,
    tipo_usuario: usuario.tipo_usuario,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION || "24h",
  });
};

const verificarToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (erro) {
    return null;
  }
};

module.exports = {
  gerarToken,
  verificarToken,
};
```

---

## Passo 7: Controller de Autenticação

### 7.1 `src/controllers/authController.js`

```javascript
const pool = require("../config/database");
const { hashSenha, compararSenha } = require("../utils/criptografia");
const { gerarToken } = require("../services/tokenService");
const { STATUS_HTTP, MENSAGENS } = require("../config/constants");

// Registro de novo usuário
exports.registro = async (req, res) => {
  try {
    const { login, email, senha, nome_usuario, tipo_usuario } = req.validado;
    const conexao = await pool.getConnection();

    // Verificar se login já existe
    const [usuariosComLogin] = await conexao.execute(
      "SELECT id FROM tb_usuario WHERE login = ?",
      [login]
    );

    if (usuariosComLogin.length > 0) {
      conexao.release();
      return res.status(STATUS_HTTP.CONFLICT).json({
        sucesso: false,
        mensagem: MENSAGENS.ERRO.USUARIO_EXISTE,
      });
    }

    // Verificar se email já existe
    const [usuariosComEmail] = await conexao.execute(
      "SELECT id FROM tb_usuario WHERE email = ?",
      [email]
    );

    if (usuariosComEmail.length > 0) {
      conexao.release();
      return res.status(STATUS_HTTP.CONFLICT).json({
        sucesso: false,
        mensagem: "Email já registrado",
      });
    }

    // Hash da senha
    const senhaCriptografada = await hashSenha(senha);

    // Inserir novo usuário
    const [resultado] = await conexao.execute(
      `INSERT INTO tb_usuario 
       (login, email, senha, nome_usuario, tipo_usuario, data_cadastro) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [
        login,
        email,
        senhaCriptografada,
        nome_usuario,
        tipo_usuario || "usuario",
      ]
    );

    conexao.release();

    const usuarioNovo = {
      id: resultado.insertId,
      login,
      email,
      nome_usuario,
      tipo_usuario: tipo_usuario || "usuario",
    };

    const token = gerarToken(usuarioNovo);

    res.status(STATUS_HTTP.CRIADO).json({
      sucesso: true,
      mensagem: MENSAGENS.SUCESSO.REGISTRO,
      dados: {
        usuario: usuarioNovo,
        token,
      },
    });
  } catch (erro) {
    console.error("Erro no registro:", erro);
    res.status(STATUS_HTTP.ERRO_SERVIDOR).json({
      sucesso: false,
      mensagem: MENSAGENS.ERRO.ERRO_SERVIDOR,
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { login, senha } = req.validado;
    const conexao = await pool.getConnection();

    // Buscar usuário
    const [usuarios] = await conexao.execute(
      "SELECT * FROM tb_usuario WHERE login = ? OR email = ?",
      [login, login]
    );

    conexao.release();

    if (usuarios.length === 0) {
      return res.status(STATUS_HTTP.UNAUTHORIZED).json({
        sucesso: false,
        mensagem: MENSAGENS.ERRO.LOGIN_INVALIDO,
      });
    }

    const usuario = usuarios[0];

    // Verificar senha
    const senhaValida = await compararSenha(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(STATUS_HTTP.UNAUTHORIZED).json({
        sucesso: false,
        mensagem: MENSAGENS.ERRO.LOGIN_INVALIDO,
      });
    }

    // Gerar token
    const token = gerarToken(usuario);

    const usuarioResposta = {
      id: usuario.id,
      login: usuario.login,
      email: usuario.email,
      nome_usuario: usuario.nome_usuario,
      tipo_usuario: usuario.tipo_usuario,
    };

    res.status(STATUS_HTTP.OK).json({
      sucesso: true,
      mensagem: MENSAGENS.SUCESSO.LOGIN,
      dados: {
        usuario: usuarioResposta,
        token,
      },
    });
  } catch (erro) {
    console.error("Erro no login:", erro);
    res.status(STATUS_HTTP.ERRO_SERVIDOR).json({
      sucesso: false,
      mensagem: MENSAGENS.ERRO.ERRO_SERVIDOR,
    });
  }
};

// Obter perfil do usuário logado
exports.obterPerfil = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const conexao = await pool.getConnection();

    const [usuarios] = await conexao.execute(
      "SELECT id, login, email, nome_usuario, tipo_usuario, data_cadastro FROM tb_usuario WHERE id = ?",
      [usuarioId]
    );

    conexao.release();

    if (usuarios.length === 0) {
      return res.status(STATUS_HTTP.NOT_FOUND).json({
        sucesso: false,
        mensagem: MENSAGENS.ERRO.USUARIO_NAO_EXISTE,
      });
    }

    res.status(STATUS_HTTP.OK).json({
      sucesso: true,
      mensagem: "Perfil obtido com sucesso",
      dados: usuarios[0],
    });
  } catch (erro) {
    console.error("Erro ao obter perfil:", erro);
    res.status(STATUS_HTTP.ERRO_SERVIDOR).json({
      sucesso: false,
      mensagem: MENSAGENS.ERRO.ERRO_SERVIDOR,
    });
  }
};
```

---

## Passo 8: Rotas

### 8.1 `src/routes/authRoutes.js`

```javascript
const express = require("express");
const router = express.Router();
const { validarDados } = require("../middlewares/validacao");
const { schemaRegistro, schemaLogin } = require("../utils/validadores");
const authController = require("../controllers/authController");
const { verificarToken } = require("../middlewares/autenticacao");

router.post("/registro", validarDados(schemaRegistro), authController.registro);
router.post("/login", validarDados(schemaLogin), authController.login);
router.get("/perfil", verificarToken, authController.obterPerfil);

module.exports = router;
```

---

## Passo 9: Servidor Principal

### 9.1 `src/servidor.js`

```javascript
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ========== MIDDLEWARES GLOBAIS ==========
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== ROTAS ==========
const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    ambiente: process.env.NODE_ENV,
  });
});

// Rota não encontrada
app.use((req, res) => {
  res.status(404).json({
    sucesso: false,
    mensagem: "Rota não encontrada",
    caminho: req.path,
  });
});

// ========== INICIAR SERVIDOR ==========
const PORT = process.env.PORTA || 3000;
const HOST = "localhost";

app.listen(PORT, HOST, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║    🚀 OBRACONNECT BACKEND INICIADO    ║
  ╚════════════════════════════════════════╝
  
  🌐 http://${HOST}:${PORT}
  📡 API: http://${HOST}:${PORT}/api
  🏥 Health: http://${HOST}:${PORT}/api/health
  📍 Ambiente: ${process.env.NODE_ENV}
  
  ✋ Pressione Ctrl+C para parar o servidor
  `);
});

module.exports = app;
```

---

## Passo 10: Executar o Backend

### Criar estrutura de pastas

```bash
cd backend
mkdir -p src/config src/controllers src/routes src/middlewares src/services src/utils
```

### Criar arquivos conforme mostrado acima

### Executar em desenvolvimento

```bash
npm run dev
```

### Resultado esperado

```
╔════════════════════════════════════════╗
║    🚀 OBRACONNECT BACKEND INICIADO    ║
╚════════════════════════════════════════╝

🌐 http://localhost:3000
📡 API: http://localhost:3000/api
🏥 Health: http://localhost:3000/api/health
📍 Ambiente: development

✋ Pressione Ctrl+C para parar o servidor

✅ Conectado ao banco de dados MySQL
```

---

## Próximas Etapas

1. **Testar autenticação no Postman/Insomnia**
2. **Implementar CRUD de Serviços**
3. **Implementar CRUD de Avaliações**
4. **Conectar frontend ao backend**
5. **Adicionar upload de imagens**

---

**Dúvidas?** Consulte a documentação completa em `ANALISE_COMPLETA_BACKEND.md`
