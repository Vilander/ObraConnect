# 🔥 REFERÊNCIA RÁPIDA: Todos os Endpoints da API

## 📌 Base URL
```
http://localhost:3001
```

---

## 🔐 AUTENTICAÇÃO (`/api/auth`)

### 1️⃣ Registro de Novo Usuário
```
POST /api/auth/registro

Body (JSON):
{
  "nome_usuario": "João Silva",
  "email": "joao@email.com",
  "login": "joao123",
  "senha": "password123"
}

Response (201):
{
  "mensagem": "Usuário cadastrado com sucesso!",
  "id_usuario": 1,
  "usuario": "João Silva"
}
```

### 2️⃣ Login
```
POST /api/auth/login

Body (JSON):
{
  "login": "joao123",
  "senha": "password123"
}

Response (200):
{
  "mensagem": "Login realizado com sucesso!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "tipo_usuario": "usuario"
  }
}

⚠️ IMPORTANTE: Salve este token! Você vai precisar em quase tudo.
```

### 3️⃣ Obter Perfil do Usuário Logado
```
GET /api/auth/perfil

Headers:
Authorization: Bearer [TOKEN_AQUI]

Response (200):
{
  "mensagem": "Acesso autorizado!",
  "dados_usuario": {
    "id": 1,
    "login": "joao123",
    "email": "joao@email.com",
    "tipo_usuario": "usuario"
  }
}
```

### 4️⃣ Se Tornar Prestador
```
PUT /api/auth/tornar-prestador

Headers:
Authorization: Bearer [TOKEN_AQUI]

Body: {} (vazio)

Response (200):
{
  "mensagem": "Parabéns! Agora você é um prestador.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "tipo_usuario": "prestador"
  }
}

⚠️ Use o novo token nas próximas requisições!
```

---

## 🛠️ SERVIÇOS (`/api/servicos`)

### 1️⃣ Listar Todos os Serviços (Público)
```
GET /api/servicos

Response (200):
[
  {
    "id": 1,
    "id_usuario": 1,
    "nome_prestador": "João Silva",
    "titulo": "Instalação de Tomadas",
    "desc_servico": "Instalo tomadas em qualquer lugar",
    "imagem_url": "http://localhost:3001/uploads/1706762400000-foto.jpg",
    "nota_media": 4.75,
    "total_avaliacoes": 4,
    "data_cadastro": "2024-02-01T10:30:00.000Z"
  },
  ...
]
```

### 2️⃣ Buscar Detalhes de Um Serviço (Público)
```
GET /api/servicos/1

Response (200):
{
  "id": 1,
  "id_usuario": 1,
  "nome_prestador": "João Silva",
  "titulo": "Instalação de Tomadas",
  "desc_servico": "Instalo tomadas em qualquer lugar",
  "imagem_url": "http://localhost:3001/uploads/1706762400000-foto.jpg",
  "nota_media": 4.75,
  "total_avaliacoes": 4,
  "email": "joao@email.com",
  "telefone": "11999999999",
  "data_cadastro": "2024-02-01T10:30:00.000Z"
}
```

### 3️⃣ Listar Meus Serviços (Protegido)
```
GET /api/servicos/meus-servicos

Headers:
Authorization: Bearer [TOKEN_AQUI]

Response (200):
[
  {
    "id": 1,
    "titulo": "Instalação de Tomadas",
    ...
  }
]

⚠️ Só retorna serviços do usuário logado
```

### 4️⃣ Criar Novo Serviço (Protegido + Upload)
```
POST /api/servicos

Headers:
Authorization: Bearer [TOKEN_AQUI]
Content-Type: multipart/form-data

Body (form-data):
- titulo: "Instalação de Tomadas"
- descricao: "Instalo tomadas de qualquer tipo"
- imagem: [arquivo .jpg, .png, etc]

Response (201):
{
  "mensagem": "Serviço criado com sucesso!",
  "id_servico": 1,
  "imagem": "http://localhost:3001/uploads/1706762400000-foto.jpg"
}

⚠️ Só prestadores podem criar serviços!
⚠️ O arquivo "imagem" é opcional, mas recomendado
```

### 5️⃣ Editar Serviço (Protegido)
```
PUT /api/servicos/1

Headers:
Authorization: Bearer [TOKEN_AQUI]
Content-Type: multipart/form-data

Body (form-data):
- titulo: "Novo Título"
- descricao: "Nova descrição"
- imagem: [novo arquivo - opcional]

Response (200):
{
  "mensagem": "Serviço atualizado com sucesso!"
}

⚠️ Só o criador pode editar seu próprio serviço
```

### 6️⃣ Deletar Serviço (Protegido)
```
DELETE /api/servicos/1

Headers:
Authorization: Bearer [TOKEN_AQUI]

Response (200):
{
  "mensagem": "Serviço removido com sucesso!"
}

⚠️ Só o criador ou admin pode deletar
```

---

## ⭐ AVALIAÇÕES (`/api/avaliacoes`)

### 1️⃣ Criar Avaliação (Protegido)
```
POST /api/avaliacoes

Headers:
Authorization: Bearer [TOKEN_AQUI]

Body (JSON):
{
  "id_servico": 1,
  "nota_preco": 5,
  "nota_tempo": 4,
  "nota_higiene": 5,
  "nota_educacao": 5,
  "comentario": "Excelente trabalho, muito satisfeito!"
}

Response (201):
{
  "mensagem": "Avaliação enviada com sucesso!"
}

⚠️ Notas devem ser de 1 a 5
⚠️ Cada usuário só pode avaliar um serviço UMA VEZ
⚠️ O comentário é opcional
```

### 2️⃣ Listar Avaliações de Um Serviço (Público)
```
GET /api/avaliacoes/servico/1

Response (200):
[
  {
    "id": 1,
    "id_servico": 1,
    "id_usuario": 2,
    "nome_usuario": "Maria Silva",
    "nota_preco": 5,
    "nota_tempo_execucao": 4,
    "nota_higiene": 5,
    "nota_educacao": 5,
    "comentario": "Excelente trabalho!",
    "data_avaliacao": "2024-02-05T14:20:00.000Z"
  },
  ...
]
```

### 3️⃣ Listar Avaliações Recebidas (Protegido)
```
GET /api/avaliacoes/recebidas

Headers:
Authorization: Bearer [TOKEN_AQUI]

Response (200):
[
  {
    "id": 1,
    "id_servico": 1,
    "id_usuario": 2,
    "nome_usuario": "Maria Silva",
    "titulo": "Instalação de Tomadas",
    "nota_preco": 5,
    "nota_tempo_execucao": 4,
    "nota_higiene": 5,
    "nota_educacao": 5,
    "comentario": "Excelente trabalho!",
    "data_avaliacao": "2024-02-05T14:20:00.000Z"
  },
  ...
]

⚠️ Só retorna avaliações de serviços do prestador logado
```

---

## 🧪 TESTES (`/`)

### 1️⃣ Teste Simples
```
GET /

Response (200):
Hello World! Backend funcionando!
```

### 2️⃣ Teste de Conexão com Banco de Dados
```
GET /teste-banco

Response (200):
{
  "mensagem": "Conexão com Banco de Dados realizada com sucesso!",
  "total_encontrado": 3,
  "dados": [
    { "id": 1, "nome": "Instalação Elétrica", ... },
    ...
  ]
}
```

---

## ⚠️ CÓDIGOS DE RESPOSTA HTTP

| Código | Significado | Exemplo |
|--------|-----------|---------|
| **200** | OK (sucesso) | Login realizado |
| **201** | Criado (sucesso em POST) | Serviço criado |
| **400** | Erro de validação | Campos obrigatórios faltando |
| **401** | Não autenticado | Token não fornecido ou inválido |
| **403** | Não autorizado | Tentou editar serviço de outro usuário |
| **404** | Não encontrado | Serviço com ID 999 não existe |
| **409** | Conflito | Email já cadastrado |
| **500** | Erro do servidor | Problema no banco de dados |

---

## 🚨 ERROS COMUNS

### ❌ "Acesso negado. Token não fornecido."
**Problema:** Sua requisição é protegida, mas você não mandou o token
**Solução:** Adicione o header `Authorization: Bearer [TOKEN]`

### ❌ "Token inválido ou expirado."
**Problema:** Token expirou (validade é 24h) ou foi alterado
**Solução:** Faça login novamente para obter novo token

### ❌ "Você não tem permissão para editar este serviço."
**Problema:** Você está tentando editar um serviço de outra pessoa
**Solução:** Só você pode editar seus próprios serviços

### ❌ "Apenas prestadores podem cadastrar serviços!"
**Problema:** Seu tipo_usuario é "usuario", não "prestador"
**Solução:** Execute `PUT /api/auth/tornar-prestador` primeiro

### ❌ "Você já avaliou este serviço!"
**Problema:** Você tentou avaliar 2 vezes
**Solução:** Cada usuário só avalia uma vez por serviço

### ❌ "CORS error" no navegador
**Problema:** Frontend em porta diferente do backend
**Solução:** Backend tem `app.use(cors())` habilitado

---

## 📋 TIPOS DE USUÁRIO

| Tipo | Pode Fazer |
|------|-----------|
| **usuario** | Fazer login, ver serviços, avaliar serviços |
| **prestador** | Tudo de usuario + criar/editar/deletar seus serviços |
| **admin** | Tudo, editar qualquer coisa |

---

## 🔐 HEADERS NECESSÁRIOS

### Para requisições PROTEGIDAS (precisa de token):
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### Para requisições com UPLOAD:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data
```

### Para requisições PÚBLICAS:
```
Content-Type: application/json
```

---

## 💾 FLUXO TÍPICO DE USO

```
1. POST /api/auth/registro
   └─ Cria novo usuário

2. POST /api/auth/login
   └─ Obtém token (salva no localStorage)

3. PUT /api/auth/tornar-prestador
   └─ Muda tipo para "prestador"

4. POST /api/servicos
   └─ Cria novo serviço (com imagem)

5. GET /api/servicos
   └─ Lista todos os serviços

6. GET /api/servicos/1
   └─ Vê detalhes de um serviço

7. POST /api/avaliacoes
   └─ Avalia um serviço

8. GET /api/avaliacoes/servico/1
   └─ Vê as avaliações recebidas
```

---

## 🛠️ USANDO COM CURL (Linha de Comando)

### Registro:
```bash
curl -X POST http://localhost:3001/api/auth/registro \
  -H "Content-Type: application/json" \
  -d '{
    "nome_usuario": "João",
    "email": "joao@email.com",
    "login": "joao123",
    "senha": "123456"
  }'
```

### Login:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login": "joao123", "senha": "123456"}'
```

### Listar Serviços (com token):
```bash
curl -X GET http://localhost:3001/api/servicos/meus-servicos \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Criar Serviço (com imagem):
```bash
curl -X POST http://localhost:3001/api/servicos \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -F "titulo=Meu Serviço" \
  -F "descricao=Descrição do serviço" \
  -F "imagem=@/caminho/para/imagem.jpg"
```

---

## 📊 STATUS DO BACKEND

Para verificar se está online:
```
GET http://localhost:3001/
```

Se retornar "Hello World! Backend funcionando!" então está ok! ✅

---

Salve este arquivo como referência! 📝
