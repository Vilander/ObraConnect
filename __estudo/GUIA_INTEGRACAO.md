# 🔧 Guia de Integração - Backend Node.js/Express

## 📦 Dependências Necessárias no Backend

Instale as seguintes dependências no seu projeto Node.js:

```bash
npm install express mysql2 bcryptjs jsonwebtoken cors dotenv
npm install --save-dev nodemon
```

## 🗂️ Estrutura Sugerida do Backend

```
backend/
├── src/
│   ├── configuracao/
│   │   ├── bancoDados.js          # Configuração do MySQL
│   │   └── autenticacao.js         # Configuração JWT
│   ├── controladores/
│   │   ├── usuarioControlador.js   # Login, cadastro
│   │   ├── servicoControlador.js   # CRUD de serviços
│   │   ├── avaliacaoControlador.js # CRUD de avaliações
│   │   └── favoritoControlador.js  # Favoritos
│   ├── rotas/
│   │   ├── usuarioRotas.js
│   │   ├── servicoRotas.js
│   │   ├── avaliacaoRotas.js
│   │   └── favoritoRotas.js
│   ├── middlewares/
│   │   ├── autenticacao.js         # Verificar JWT
│   │   └── validacao.js            # Validar dados
│   └── servidor.js                 # Arquivo principal
├── .env                            # Variáveis de ambiente
├── package.json
└── README.md
```

## 🔐 Configuração do Arquivo .env

Crie um arquivo `.env` na raiz do projeto backend:

```env
# Servidor
PORTA=3000
NODE_ENV=development

# Banco de Dados MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_NAME=obraconnect_db

# JWT
JWT_SECRET=sua_chave_secreta_super_segura_aqui
JWT_EXPIRATION=24h

# CORS
FRONTEND_URL=http://localhost:5173
```

## 🗄️ Configuração do Banco de Dados (bancoDados.js)

```javascript
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

// Testar conexão
pool.getConnection()
  .then(connection => {
    console.log('✅ Conectado ao banco de dados MySQL');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Erro ao conectar ao banco de dados:', err);
  });

module.exports = pool;
```

## 🚀 Servidor Principal (servidor.js)

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const usuarioRotas = require('./rotas/usuarioRotas');
const servicoRotas = require('./rotas/servicoRotas');
const avaliacaoRotas = require('./rotas/avaliacaoRotas');
const favoritoRotas = require('./rotas/favoritoRotas');

const app = express();
const PORTA = process.env.PORTA || 3000;

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api', usuarioRotas);
app.use('/api', servicoRotas);
app.use('/api', avaliacaoRotas);
app.use('/api', favoritoRotas);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ mensagem: 'ObraConnect API - Funcionando! 🚀' });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    erro: 'Algo deu errado!',
    mensagem: err.message 
  });
});

// Iniciar servidor
app.listen(PORTA, () => {
  console.log(`🚀 Servidor rodando na porta ${PORTA}`);
  console.log(`📍 http://localhost:${PORTA}`);
});
```

## 🔑 Middleware de Autenticação (autenticacao.js)

```javascript
const jwt = require('jsonwebtoken');
require('dotenv').config();

const verificarToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      erro: 'Token não fornecido' 
    });
  }

  try {
    const decodificado = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decodificado;
    next();
  } catch (erro) {
    return res.status(401).json({ 
      erro: 'Token inválido' 
    });
  }
};

module.exports = { verificarToken };
```

## 👤 Controlador de Usuário (usuarioControlador.js)

```javascript
const bancoDados = require('../configuracao/bancoDados');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Cadastro de usuário
exports.cadastrar = async (req, res) => {
  try {
    const { login, senha, nomeUsuario, email, telefone } = req.body;

    // Verificar se usuário já existe
    const [usuarioExistente] = await bancoDados.query(
      'SELECT id_usuario FROM usuarios WHERE login = ? OR email = ?',
      [login, email]
    );

    if (usuarioExistente.length > 0) {
      return res.status(400).json({ 
        erro: 'Usuário ou email já cadastrado' 
      });
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Inserir usuário
    const [resultado] = await bancoDados.query(
      'INSERT INTO usuarios (login, senha, nome_usuario, email, telefone) VALUES (?, ?, ?, ?, ?)',
      [login, senhaHash, nomeUsuario, email, telefone]
    );

    // Gerar token
    const token = jwt.sign(
      { id: resultado.insertId, login, email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso',
      token,
      usuario: { nome: nomeUsuario, email }
    });
  } catch (erro) {
    console.error('Erro ao cadastrar:', erro);
    res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { login, senha } = req.body;

    // Buscar usuário
    const [usuarios] = await bancoDados.query(
      'SELECT * FROM usuarios WHERE login = ? OR email = ?',
      [login, login]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({ 
        erro: 'Credenciais inválidas' 
      });
    }

    const usuario = usuarios[0];

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ 
        erro: 'Credenciais inválidas' 
      });
    }

    // Gerar token
    const token = jwt.sign(
      { id: usuario.id_usuario, login: usuario.login, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.json({
      mensagem: 'Login realizado com sucesso',
      token,
      usuario: { 
        nome: usuario.nome_usuario, 
        email: usuario.email 
      }
    });
  } catch (erro) {
    console.error('Erro ao fazer login:', erro);
    res.status(500).json({ erro: 'Erro ao fazer login' });
  }
};
```

## 🏗️ Exemplo de Rota de Serviços (servicoRotas.js)

```javascript
const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/autenticacao');

// GET /api/servicos - Listar todos os serviços
router.get('/servicos', async (req, res) => {
  try {
    const bancoDados = require('../configuracao/bancoDados');
    
    const [servicos] = await bancoDados.query(`
      SELECT 
        s.id_servico as id,
        s.nome_prestador as nomePrestador,
        s.desc_servico as descServico,
        s.imagem_url as imagem,
        s.nota_media as notaMedia,
        s.total_avaliacoes as totalAvaliacoes,
        s.telefone_contato as telefoneContato,
        s.email,
        GROUP_CONCAT(c.nome_categoria) as categorias
      FROM servicos s
      LEFT JOIN servicos_categorias sc ON s.id_servico = sc.id_servico
      LEFT JOIN categorias c ON sc.id_categoria = c.id_categoria
      WHERE s.ativo = TRUE
      GROUP BY s.id_servico
      ORDER BY s.nota_media DESC
    `);

    // Transformar categorias de string para array
    const servicosFormatados = servicos.map(servico => ({
      ...servico,
      categorias: servico.categorias ? servico.categorias.split(',') : []
    }));

    res.json(servicosFormatados);
  } catch (erro) {
    console.error('Erro ao buscar serviços:', erro);
    res.status(500).json({ erro: 'Erro ao buscar serviços' });
  }
});

// POST /api/servicos/cadastrar - Cadastrar novo serviço (requer autenticação)
router.post('/servicos/cadastrar', verificarToken, async (req, res) => {
  try {
    const bancoDados = require('../configuracao/bancoDados');
    const { nomePrestador, descServico, email, telefoneContato, categoriasSelecionadas } = req.body;
    const idUsuario = req.usuario.id;

    // Inserir serviço
    const [resultado] = await bancoDados.query(
      `INSERT INTO servicos 
       (id_usuario, nome_prestador, desc_servico, email, telefone_contato) 
       VALUES (?, ?, ?, ?, ?)`,
      [idUsuario, nomePrestador, descServico, email, telefoneContato]
    );

    const idServico = resultado.insertId;

    // Associar categorias
    if (categoriasSelecionadas && categoriasSelecionadas.length > 0) {
      for (const nomeCategoria of categoriasSelecionadas) {
        const [categoria] = await bancoDados.query(
          'SELECT id_categoria FROM categorias WHERE nome_categoria = ?',
          [nomeCategoria]
        );
        
        if (categoria.length > 0) {
          await bancoDados.query(
            'INSERT INTO servicos_categorias (id_servico, id_categoria) VALUES (?, ?)',
            [idServico, categoria[0].id_categoria]
          );
        }
      }
    }

    res.status(201).json({
      mensagem: 'Serviço cadastrado com sucesso',
      idServico
    });
  } catch (erro) {
    console.error('Erro ao cadastrar serviço:', erro);
    res.status(500).json({ erro: 'Erro ao cadastrar serviço' });
  }
});

module.exports = router;
```

## 📋 Checklist de Integração

### No Backend:
- [ ] Instalar dependências (express, mysql2, bcryptjs, jsonwebtoken, cors, dotenv)
- [ ] Criar arquivo .env com configurações
- [ ] Configurar conexão com MySQL
- [ ] Criar estrutura de pastas
- [ ] Implementar rotas de autenticação (login, cadastro)
- [ ] Implementar rotas de serviços (listar, cadastrar, buscar por id)
- [ ] Implementar rotas de avaliações (criar, listar, excluir)
- [ ] Implementar rotas de favoritos (adicionar, remover, listar)
- [ ] Criar middleware de autenticação JWT
- [ ] Testar todas as rotas com Postman ou Insomnia

### No Frontend:
- [ ] Atualizar URL da API nos componentes (substituir http://localhost:3000)
- [ ] Descomentar chamadas fetch() em todos os componentes
- [ ] Implementar armazenamento de token JWT (localStorage)
- [ ] Adicionar token no header das requisições autenticadas
- [ ] Implementar tratamento de erros
- [ ] Adicionar feedback visual (loading, mensagens de sucesso/erro)
- [ ] Testar fluxo completo da aplicação

### No Banco de Dados:
- [ ] Criar banco de dados `obraconnect_db`
- [ ] Executar script de criação das tabelas
- [ ] Inserir categorias iniciais
- [ ] Criar triggers para atualização de nota média
- [ ] Testar consultas SQL

## 🔍 Testando a API

### Usando cURL:

```bash
# Cadastrar usuário
curl -X POST http://localhost:3000/api/criar-conta \
  -H "Content-Type: application/json" \
  -d '{
    "login": "usuario_teste",
    "senha": "senha123",
    "nomeUsuario": "Usuário Teste",
    "email": "teste@email.com",
    "telefone": "(11) 99999-9999"
  }'

# Login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "login": "usuario_teste",
    "senha": "senha123"
  }'

# Listar serviços
curl http://localhost:3000/api/servicos
```

## 📚 Recursos Adicionais

- [Documentação Express](https://expressjs.com/)
- [Documentação MySQL2](https://github.com/sidorares/node-mysql2)
- [Documentação JWT](https://jwt.io/)
- [Documentação Bcrypt](https://www.npmjs.com/package/bcryptjs)

---

**Dica**: Comece implementando as rotas de autenticação primeiro, depois as de serviços, e por último as de avaliações e favoritos.
