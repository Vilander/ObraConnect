# ⚡ REFERÊNCIA RÁPIDA - CHEAT SHEET

## 🚀 INICIAR EM 5 MINUTOS

```bash
# 1. Criar pasta
mkdir backend && cd backend

# 2. Setup Node
npm init -y
npm install express mysql2 bcryptjs jsonwebtoken cors dotenv joi
npm install --save-dev nodemon

# 3. .env
echo "PORTA=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=obraconnect_db
JWT_SECRET=sua_chave_segura_min_32_chars
FRONTEND_URL=http://localhost:5173" > .env

# 4. Estrutura
mkdir -p src/{config,controllers,routes,middlewares,services,utils}

# 5. Rodar
npm run dev
```

---

## 📚 DOCUMENTOS ESSENCIAIS

| Documento                   | Tempo  | Para              |
| --------------------------- | ------ | ----------------- |
| INDEX.md                    | 5 min  | Entender qual ler |
| SUMARIO_EXECUTIVO.md        | 15 min | Visão geral       |
| ANALISE_COMPLETA_BACKEND.md | 45 min | Arquitetura       |
| GUIA_PRATICO_BACKEND.md     | 1h     | Código pronto     |
| FLUXOGRAMAS_SISTEMA.md      | 30 min | Ver fluxos        |
| ROADMAP_DETALHADO.md        | 30 min | Planejar semana   |
| TESTES_POSTMAN.md           | 2-3h   | Testar API        |

---

## 🏗️ ESTRUTURA DE PASTAS

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── constants.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── servicoController.js
│   │   └── avaliacaoController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── servicoRoutes.js
│   │   └── avaliacaoRoutes.js
│   ├── middlewares/
│   │   ├── autenticacao.js
│   │   ├── validacao.js
│   │   └── erros.js
│   ├── services/
│   │   └── tokenService.js
│   ├── utils/
│   │   ├── criptografia.js
│   │   └── validadores.js
│   └── servidor.js
├── .env
├── package.json
└── .gitignore
```

---

## 🔑 ENDPOINTS PRINCIPAIS

### Auth

```
POST   /api/auth/registro
POST   /api/auth/login
GET    /api/auth/perfil (🔒 requer token)
```

### Serviços

```
GET    /api/servicos
GET    /api/servicos/:id
POST   /api/servicos (🔒 prestador)
PUT    /api/servicos/:id (🔒 proprietário)
DELETE /api/servicos/:id (🔒 proprietário)
GET    /api/servicos/meus (🔒 prestador)
```

### Avaliações

```
POST   /api/avaliacoes (🔒 qualquer usuário)
GET    /api/servicos/:id/avaliacoes
GET    /api/avaliacoes/minhas (🔒 usuário)
GET    /api/avaliacoes/recebidas (🔒 prestador)
PUT    /api/avaliacoes/:id (🔒 autor)
DELETE /api/avaliacoes/:id (🔒 autor)
```

---

## 💾 BD EM DIAGRAMA

```
tb_usuario (id, login*, email*, senha, nome_usuario, tipo_usuario)
    ↓ 1:N
tb_servico (id, id_usuario*, nome_prestador, desc_servico, nota_media)
    ↓ N:M ↓ 1:N
tb_categoria_atendida      tb_avaliacao (id, id_servico*, id_usuario*, notas...)
    ↓
tb_categoria (id, nome*)

* = Índice ou FK
```

---

## 🔐 AUTENTICAÇÃO FLOW

```
1. POST /auth/registro
   → Hash senha com bcryptjs
   → Retorna JWT + usuário

2. POST /auth/login
   → Busca usuário
   → Compara senha (bcryptjs)
   → Retorna JWT + usuário

3. Header: Authorization: Bearer <token>
   → Middleware verifica JWT
   → Decodifica e seta req.usuario
   → Continua rota se OK, 401 se erro
```

---

## 📊 TIPOS DE USUÁRIO

| Tipo      | Ver Serviços | Criar Serviço | Avaliar | Gerenciar Admin |
| --------- | ------------ | ------------- | ------- | --------------- |
| usuario   | ✅           | ❌            | ✅      | ❌              |
| prestador | ✅           | ✅\*          | ✅      | ❌              |
| admin     | ✅           | ✅            | ✅      | ✅              |

\* Apenas seus próprios

---

## 🧪 TESTAR RÁPIDO

### Registrar

```bash
curl -X POST http://localhost:3000/api/auth/registro \
  -H "Content-Type: application/json" \
  -d '{
    "login": "teste",
    "email": "teste@test.com",
    "senha": "Senha123456",
    "nome_usuario": "Teste User"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login": "teste", "senha": "Senha123456"}'
```

### Listar Serviços

```bash
curl http://localhost:3000/api/servicos
```

---

## ⚙️ CONFIGURAÇÃO VARIÁVEIS .env

```env
# SERVIDOR
PORTA=3000                          # Port
NODE_ENV=development                # Environment

# BANCO
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=                        # Vazia por padrão XAMPP
DB_NAME=obraconnect_db

# JWT
JWT_SECRET=sua_chave_super_segura_aqui_minimo_32_caracteres
JWT_EXPIRATION=24h

# FRONTEND
FRONTEND_URL=http://localhost:5173  # Vite dev server
```

---

## 📋 VALIDAÇÕES (JOI)

```javascript
// Registro
login: min 3, alphanum
email: valid email
senha: min 8 chars
nome_usuario: max 100
tipo_usuario: 'usuario' | 'prestador'

// Login
login: required
senha: required

// Serviço
nome_prestador: max 100
desc_servico: required
imagem_url: valid URI
categorias: array of numbers

// Avaliação
id_servico: number
nota_preco: 1-5
nota_tempo_execucao: 1-5
nota_higiene: 1-5
nota_educacao: 1-5
comentario: optional text
```

---

## 🔄 FLUXO DE AVALIAÇÃO

```
1. POST /api/avaliacoes
   ↓
2. Backend valida
   ↓
3. Insere em tb_avaliacao
   ↓
4. Calcula: (n1+n2+n3+n4)/4 para cada avaliação
   ↓
5. Média final = SUM(todas as médias) / total_avaliacoes
   ↓
6. UPDATE tb_servico.nota_media
   ↓
7. UPDATE tb_servico.total_avaliacoes
   ↓
8. Frontend atualiza UI
```

---

## 🚨 ERROS COMUNS

| Erro              | Causa                  | Solução                     |
| ----------------- | ---------------------- | --------------------------- |
| ECONNREFUSED 3306 | MySQL não rodando      | Inicie XAMPP, MySQL         |
| Token inválido    | JWT expirado           | Fazer login novamente       |
| 403 Forbidden     | Tipo usuário errado    | Use token de prestador      |
| 409 Conflict      | Avaliação duplicada    | Check UNIQUE constraint     |
| CORS error        | Frontend origin errado | Verificar .env FRONTEND_URL |
| Login inválido    | Senha SHA-256          | Use bcryptjs (não SHA)      |

---

## 📦 DEPENDÊNCIAS ESSENCIAIS

```json
{
  "express": "Web framework",
  "mysql2": "Driver MySQL",
  "bcryptjs": "Hash senhas (OBRIGATÓRIO)",
  "jsonwebtoken": "JWT tokens",
  "cors": "CORS setup",
  "dotenv": "Env vars",
  "joi": "Validação dados"
}
```

---

## 🎯 CHECKLIST DE SEMANA

### Seg-Ter (Autenticação)

- [ ] Projeto criado
- [ ] BD conectando
- [ ] Registro funcionando
- [ ] Login funcionando

### Qua-Qui (Serviços)

- [ ] GET listar
- [ ] GET detalhes
- [ ] POST criar
- [ ] PUT editar
- [ ] DELETE soft delete

### Sex-Seg (Avaliações)

- [ ] POST criar
- [ ] Média recalcula
- [ ] GET listar
- [ ] DELETE atualiza média

### Ter (Integração)

- [ ] Frontend + Backend
- [ ] Sem CORS errors
- [ ] Testes passando
- [ ] Deploy?

---

## 🔍 QUERY SQL IMPORTANTES

```sql
-- Buscar serviço com categorias
SELECT s.*, GROUP_CONCAT(c.nome_categoria) as categorias
FROM tb_servico s
LEFT JOIN tb_categoria_atendida ca ON s.id = ca.id_servico
LEFT JOIN tb_categoria c ON ca.id_categoria = c.id
WHERE s.id = ? AND s.ativo = 1
GROUP BY s.id;

-- Recalcular média
UPDATE tb_servico SET
  nota_media = (
    SELECT AVG((nota_preco + nota_tempo_execucao + nota_higiene + nota_educacao) / 4)
    FROM tb_avaliacao
    WHERE id_servico = ?
  ),
  total_avaliacoes = (SELECT COUNT(*) FROM tb_avaliacao WHERE id_servico = ?)
WHERE id = ?;

-- Soft delete
UPDATE tb_servico SET ativo = 0 WHERE id = ?;

-- Serviços de um prestador
SELECT * FROM tb_servico WHERE id_usuario = ? ORDER BY data_cadastro DESC;
```

---

## 🧠 CONCEITOS-CHAVE

**JWT (Token)**: Credencial que prova que está logado. Válido por 24h.

**bcryptjs**: Criptografia forte de senhas. SHA-256 é fraco.

**Soft Delete**: Marcar ativo=0 em vez de deletar. Permite recover.

**Pool MySQL**: Reutiliza conexões (melhor performance).

**Joi**: Valida formato de dados antes de processar.

**CORS**: Permite frontend em localhost:5173 acessar backend.

---

## ✨ QUICK COMMANDS

```bash
# Iniciar dev
npm run dev

# Instalar package
npm install <package>

# Ver logs MySQL
mysql -u root -p

# Testar endpoint
curl http://localhost:3000/api/health

# Check Node version
node --version
```

---

## 📞 HELP

1. **Erro de conexão?** → Verifique MySQL está rodando + .env correto
2. **Token inválido?** → Faça login novamente
3. **Não funciona nada?** → Leia ANALISE_COMPLETA_BACKEND.md
4. **Como implementar X?** → Procure em GUIA_PRATICO_BACKEND.md
5. **Quanto tempo?** → Veja ROADMAP_DETALHADO.md

---

## 🎓 DEPOIS

Você saberá:

- ✅ Arquitetura backend Node.js
- ✅ Autenticação JWT
- ✅ MySQL com pool
- ✅ Validação robusta
- ✅ Integração frontend-backend
- ✅ Deploy production-ready

---

**Versão**: 1.0  
**Última atualização**: 20 de janeiro de 2026  
**Status**: Pronto para usar!
