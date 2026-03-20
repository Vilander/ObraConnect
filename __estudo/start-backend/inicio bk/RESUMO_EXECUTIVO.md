# ⚡ RESUMO EXECUTIVO: Backend ObraConnect em 30 Minutos

## O que é isso?

```
ObraConnect = Marketplace de serviços
Usuários= contratam prestadores
Prestadores = oferecem serviços
Avaliações = classificam serviços (nota 1-5)
```

---

## Stack Tecnológico

| Tecnologia | Função | Port |
|-----------|--------|------|
| Node.js | Runtime | - |
| Express | Framework web | 3001 |
| MySQL | Banco dados | 3306 |
| JWT | Autenticação | - |
| Bcrypt | Criptografia | - |
| Multer | Upload | - |

---

## Instalação Rápida

```bash
# 1. Instalar dependências
npm install express cors dotenv mysql2 bcryptjs jsonwebtoken multer
npm install --save-dev nodemon

# 2. Criar .env (mudar credenciais)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=obraconnect
PORT=3001
SEGREDO_JWT=sua_chave_secreta_aqui

# 3. Criar banco MySQL
mysql -u root -p < obraconnect_db.sql

# 4. Rodar
npm run dev
```

---

## Estrutura de Pastas

```
src/
├─ config/database.js      ← Conexão MySQL
├─ config/upload.js        ← Upload de imagens
├─ controllers/            ← Lógica
├─ middlewares/           ← Validação (JWT)
├─ routes/                ← Endpoints
├─ services/              ← Funções reutilizáveis
├─ utils/                 ← Utilitários
└─ index.js               ← Main
```

---

## Conceitos-Chave

### 🔐 JWT (Token)
- Usuário faz login → Recebe um "crachá digital" (token)
- Token prova que ele está logado
- Válido por 24h

### 🛡️ Bcrypt
- Criptografa senhas
- "123456" vira "$2a$10$..."
- Impossível reverter

### 🚪 Middleware
- "Porteiros" que verificam requisições
- Exemplo: `verificarToken` bloqueia sem token válido

### 📦 CRUD
- **C**reate: POST (criar)
- **R**ead: GET (ler)
- **U**pdate: PUT (editar)
- **D**elete: DELETE (deletar)

---

## Endpoints Principais

### Autenticação
```
POST   /api/auth/registro           ← Novo usuário
POST   /api/auth/login              ← Login (retorna token)
GET    /api/auth/perfil             ← Dados do usuário (protegido)
PUT    /api/auth/tornar-prestador   ← Vira prestador (protegido)
```

### Serviços
```
GET    /api/servicos                ← Lista todos
POST   /api/servicos                ← Criar (+token +imagem)
GET    /api/servicos/:id            ← Ver detalhes
PUT    /api/servicos/:id            ← Editar
DELETE /api/servicos/:id            ← Deletar
GET    /api/servicos/meus-servicos  ← Meus serviços (token)
```

### Avaliações
```
POST   /api/avaliacoes              ← Criar avaliação
GET    /api/avaliacoes/servico/:id  ← Ver avaliações do serviço
GET    /api/avaliacoes/recebidas    ← Avaliações que recebi
```

---

## Como Testar

### No Postman:
1. **Registrar**: `POST /api/auth/registro`
   ```json
   {
     "nome_usuario": "João",
     "email": "joao@email.com",
     "login": "joao123",
     "senha": "123456"
   }
   ```

2. **Login**: `POST /api/auth/login`
   ```json
   {
     "login": "joao123",
     "senha": "123456"
   }
   ```
   → Salva o token!

3. **Ver Perfil**: `GET /api/auth/perfil`
   ```
   Header: Authorization: Bearer [TOKEN]
   ```

4. **Criar Serviço**: `POST /api/servicos`
   ```
   Header: Authorization: Bearer [TOKEN]
   Body (form-data):
   - titulo: "Instalação"
   - descricao: "Descrição..."
   - imagem: [arquivo]
   ```

---

## No React

### 1. Instalar Axios
```bash
npm install axios
```

### 2. Criar `api/axiosConfig.js`
```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### 3. Usar API
```javascript
import api from "./api/axiosConfig";

// Login
const resposta = await api.post("/api/auth/login", {
  login: "usuario",
  senha: "senha"
});
localStorage.setItem("token", resposta.data.token);

// Listar serviços
const servicos = await api.get("/api/servicos");

// Criar serviço
const formData = new FormData();
formData.append("titulo", "...");
formData.append("descricao", "...");
formData.append("imagem", arquivo);
await api.post("/api/servicos", formData);
```

---

## Fluxo de Dados

```
1. Frontend envia requisição
       ↓
2. Backend recebe (Express)
       ↓
3. Middleware valida token (se protegido)
       ↓
4. Controlador executa lógica
       ↓
5. Consulta/altera banco (MySQL)
       ↓
6. Retorna resposta JSON
       ↓
7. Frontend mostra na tela
```

---

## Headers Importantes

### Protegido (com token):
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### Upload:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data
```

---

## Códigos de Resposta

| Código | Significado |
|--------|------------|
| 200 | OK (sucesso) |
| 201 | Criado (POST sucesso) |
| 400 | Erro de validação |
| 401 | Sem autenticação |
| 403 | Sem autorização |
| 404 | Não encontrado |
| 409 | Conflito (ex: email já existe) |
| 500 | Erro do servidor |

---

## Erros Comuns

| Erro | Solução |
|------|----------|
| "CORS error" | Backend tem `app.use(cors())` |
| "Token not found" | Fazer login primeiro |
| "Token invalid" | Token expirou (24h), fazer login novamente |
| "Permission denied" | Não é prestador ou não é dono |
| "File not uploaded" | Checar se multer está configurado |
| "DB connection failed" | MySQL não está rodando |

---

## Banco de Dados (SQL)

### Tabelas
```sql
oc__tb_usuario      → Usuários
oc__tb_servico      → Serviços
oc__tb_avaliacao    → Avaliações
tb_categoria        → (opcional)
```

### Relacionamentos
```
1 usuário → muitos serviços
1 serviço → muitas avaliações
1 usuário → muitas avaliações recebidas
```

---

## Checklist Rápido

- [ ] Node.js instalado
- [ ] MySQL rodando
- [ ] Banco criado
- [ ] `.env` configurado
- [ ] Dependências instaladas
- [ ] Pasta `/uploads` criada
- [ ] Backend rodando (`npm run dev`)
- [ ] Testado em Postman
- [ ] Frontend conectado ao backend
- [ ] Login funcionando
- [ ] Serviços funcionando
- [ ] Avaliações funcionando

---

## Começar do Zero

1. **Leia**: FLUXOGRAMAS_VISUAIS.md
2. **Siga**: GUIA_CRIACAO_BACKEND_ZERO.md
3. **Consulte**: REFERENCIA_ENDPOINTS_API.md
4. **Integre**: GUIA_FRONTEND_INTEGRACAO.md

---

## Links Úteis

- [Node.js](https://nodejs.org)
- [MySQL](https://dev.mysql.com)
- [Express](https://expressjs.com)
- [JWT.io](https://jwt.io)
- [Bcryptjs](https://www.npmjs.com/package/bcryptjs)
- [Multer](https://www.npmjs.com/package/multer)

---

**Tempo total:** ~4 horas (do zero)  
**Dificuldade:** Intermediária  
**Resultado:** Backend completo e funcional! 🚀

---

Salve esta página! É seu mapa rápido de referência. 📌
