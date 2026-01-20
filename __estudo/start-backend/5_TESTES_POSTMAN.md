# 🧪 TESTES COM POSTMAN/INSOMNIA

Neste arquivo você encontra os comandos e testes para validar seu backend enquanto o desenvolve.

---

## 📌 COMO USAR

### Opção 1: Postman (Recomendado)

1. Abra Postman
2. Clique em "New" → "Collection"
3. Copie as requisições abaixo
4. Execute e valide as respostas

### Opção 2: Insomnia

1. Abra Insomnia
2. Crie uma nova workspace
3. Copie e cole as requisições
4. Clique em "Send"

### Opção 3: cURL (Terminal)

1. Copie os comandos cURL abaixo
2. Cole no terminal
3. Veja a resposta

---

## 🔧 VARIÁVEIS GLOBAIS

Configure estas variáveis em Postman:

```
base_url = http://localhost:3000/api
token = (será preenchido após login)
```

---

## 📋 TESTES POR FASE

### FASE 1: AUTENTICAÇÃO

#### 1.1 POST - Registrar Novo Usuário

**Postman:**

```
POST http://localhost:3000/api/auth/registro
Content-Type: application/json

{
  "login": "joao_silva",
  "email": "joao@email.com",
  "senha": "Senha123456",
  "nome_usuario": "João Silva",
  "tipo_usuario": "usuario"
}
```

**cURL:**

```bash
curl -X POST http://localhost:3000/api/auth/registro \
  -H "Content-Type: application/json" \
  -d '{
    "login": "joao_silva",
    "email": "joao@email.com",
    "senha": "Senha123456",
    "nome_usuario": "João Silva",
    "tipo_usuario": "usuario"
  }'
```

**Resposta Esperada (201):**

```json
{
  "sucesso": true,
  "mensagem": "Usuário registrado com sucesso",
  "dados": {
    "usuario": {
      "id": 3,
      "login": "joao_silva",
      "email": "joao@email.com",
      "nome_usuario": "João Silva",
      "tipo_usuario": "usuario"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Testes:**

- [x] Status 201
- [x] Campo "token" retornado
- [x] Dados do usuário corretos
- [x] Tipo de usuário é "usuario"

---

#### 1.2 POST - Login

**Postman:**

```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "login": "joao_silva",
  "senha": "Senha123456"
}
```

**cURL:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "login": "joao_silva",
    "senha": "Senha123456"
  }'
```

**Resposta Esperada (200):**

```json
{
  "sucesso": true,
  "mensagem": "Login realizado com sucesso",
  "dados": {
    "usuario": {
      "id": 3,
      "login": "joao_silva",
      "email": "joao@email.com",
      "nome_usuario": "João Silva",
      "tipo_usuario": "usuario"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Testes:**

- [x] Status 200
- [x] Token retornado
- [x] Token diferente a cada login (não reutilizado)
- [x] Senha não retornada

---

#### 1.3 POST - Login com Credenciais Inválidas

**Teste de Erro:**

```
POST http://localhost:3000/api/auth/login
{
  "login": "joao_silva",
  "senha": "SenhaErrada123"
}
```

**Resposta Esperada (401):**

```json
{
  "sucesso": false,
  "mensagem": "Login ou senha inválidos"
}
```

**Testes:**

- [x] Status 401
- [x] Mensagem clara de erro
- [x] Nenhum token retornado

---

#### 1.4 GET - Obter Perfil (Requer Token)

**Postman:**

```
GET http://localhost:3000/api/auth/perfil
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**cURL:**

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
curl -X GET http://localhost:3000/api/auth/perfil \
  -H "Authorization: Bearer $TOKEN"
```

**Resposta Esperada (200):**

```json
{
  "sucesso": true,
  "mensagem": "Perfil obtido com sucesso",
  "dados": {
    "id": 3,
    "login": "joao_silva",
    "email": "joao@email.com",
    "nome_usuario": "João Silva",
    "tipo_usuario": "usuario",
    "data_cadastro": "2026-01-20 10:30:45"
  }
}
```

**Testes:**

- [x] Status 200
- [x] Dados do usuário corretos
- [x] Campo senha NÃO é retornado

---

#### 1.5 GET - Perfil sem Token (Erro)

**Teste:**

```
GET http://localhost:3000/api/auth/perfil
(SEM header Authorization)
```

**Resposta Esperada (401):**

```json
{
  "sucesso": false,
  "mensagem": "Token não fornecido"
}
```

**Testes:**

- [x] Status 401
- [x] Erro claro indicando token ausente

---

### FASE 2: SERVIÇOS

#### 2.1 GET - Listar Todos os Serviços

**Postman:**

```
GET http://localhost:3000/api/servicos
```

**Resposta Esperada (200):**

```json
{
  "sucesso": true,
  "mensagem": "Serviços listados com sucesso",
  "dados": {
    "servicos": [
      {
        "id": 1,
        "nome_prestador": "Pedro Engenheiro",
        "desc_servico": "Especialista em reformas...",
        "imagem_url": "https://...",
        "nota_media": "0.00",
        "total_avaliacoes": 0,
        "categorias": ["Engenheiro(a) Civil"]
      }
    ],
    "total": 1,
    "pagina": 1,
    "limite": 10
  }
}
```

**Testes:**

- [x] Status 200
- [x] Array de serviços
- [x] Cada serviço tem categorias
- [x] Total e paginação presentes

---

#### 2.2 GET - Listar com Filtro de Categoria

**Postman:**

```
GET http://localhost:3000/api/servicos?categoria=6&pagina=1&limite=10
```

**Query Params:**

- `categoria`: ID da categoria (opcional)
- `pagina`: Número da página (default: 1)
- `limite`: Itens por página (default: 10)

**Testes:**

- [x] Filtra por categoria
- [x] Paginação funciona
- [x] Retorna apenas serviços ativos

---

#### 2.3 GET - Detalhes de Um Serviço

**Postman:**

```
GET http://localhost:3000/api/servicos/1
```

**Resposta Esperada (200):**

```json
{
  "sucesso": true,
  "mensagem": "Serviço obtido com sucesso",
  "dados": {
    "id": 1,
    "nome_prestador": "Pedro Engenheiro",
    "desc_servico": "Especialista em reformas estruturais...",
    "imagem_url": "https://images.unsplash.com/photo-1541888946425...",
    "email": "pedro@email.com",
    "telefone_contato": "11999998888",
    "nota_media": "0.00",
    "total_avaliacoes": 0,
    "categorias": ["Engenheiro(a) Civil"]
  }
}
```

**Testes:**

- [x] Status 200
- [x] Todos os dados presentes
- [x] Categorias em array

---

#### 2.4 POST - Criar Novo Serviço (Prestador)

**Pré-requisito:** Token de prestador

**Postman:**

```
POST http://localhost:3000/api/servicos
Authorization: Bearer <token_prestador>
Content-Type: application/json

{
  "nome_prestador": "Carlos Eletricista",
  "desc_servico": "Especialista em instalação elétrica residencial e comercial",
  "imagem_url": "https://images.unsplash.com/photo-1621905267537-b85fb17ec35c",
  "telefone_contato": "11987654321",
  "categorias": [5, 6]
}
```

**Resposta Esperada (201):**

```json
{
  "sucesso": true,
  "mensagem": "Serviço criado com sucesso",
  "dados": {
    "id": 4,
    "id_usuario": 2,
    "nome_prestador": "Carlos Eletricista",
    "desc_servico": "Especialista em instalação...",
    "categorias": [5, 6]
  }
}
```

**Testes:**

- [x] Status 201
- [x] ID do serviço retornado
- [x] Categorias associadas
- [x] Apenas prestador pode criar

---

#### 2.5 POST - Tentar Criar Serviço como Usuário Comum (Erro)

**Teste:**

```
POST http://localhost:3000/api/servicos
Authorization: Bearer <token_usuario>
(mesmo JSON acima)
```

**Resposta Esperada (403):**

```json
{
  "sucesso": false,
  "mensagem": "Acesso negado. Apenas prestadores"
}
```

**Testes:**

- [x] Status 403 (Forbidden)
- [x] Mensagem clara
- [x] Serviço NÃO foi criado

---

#### 2.6 PUT - Editar Serviço

**Pré-requisito:** Token do proprietário

**Postman:**

```
PUT http://localhost:3000/api/servicos/4
Authorization: Bearer <token_proprietario>
Content-Type: application/json

{
  "nome_prestador": "Carlos Eletricista - Master",
  "desc_servico": "Mais de 10 anos de experiência",
  "imagem_url": "https://...",
  "telefone_contato": "11999999999",
  "categorias": [5, 6, 9]
}
```

**Resposta Esperada (200):**

```json
{
  "sucesso": true,
  "mensagem": "Serviço atualizado com sucesso",
  "dados": {
    "id": 4,
    "nome_prestador": "Carlos Eletricista - Master",
    "desc_servico": "Mais de 10 anos...",
    "categorias": [5, 6, 9]
  }
}
```

**Testes:**

- [x] Status 200
- [x] Dados atualizados
- [x] Categorias atualizadas

---

#### 2.7 DELETE - Deletar Serviço (Soft Delete)

**Pré-requisito:** Token do proprietário

**Postman:**

```
DELETE http://localhost:3000/api/servicos/4
Authorization: Bearer <token_proprietario>
```

**Resposta Esperada (200):**

```json
{
  "sucesso": true,
  "mensagem": "Serviço deletado com sucesso"
}
```

**Verificação no BD:**

```sql
SELECT * FROM tb_servico WHERE id = 4;
-- Deve retornar ativo = 0
```

**Testes:**

- [x] Status 200
- [x] Serviço marcado como inativo (ativo=0)
- [x] Não é hard delete

---

#### 2.8 GET - Meus Serviços (Prestador)

**Pré-requisito:** Token de prestador

**Postman:**

```
GET http://localhost:3000/api/servicos/meus
Authorization: Bearer <token_prestador>
```

**Resposta Esperada (200):**

```json
{
  "sucesso": true,
  "mensagem": "Serviços obtidos com sucesso",
  "dados": [
    {
      "id": 1,
      "nome_prestador": "Pedro Engenheiro",
      "nota_media": "0.00",
      "total_avaliacoes": 0,
      "ativo": 1,
      "data_cadastro": "2026-01-20 10:00:00"
    }
  ]
}
```

**Testes:**

- [x] Lista apenas serviços do prestador logado
- [x] Inclui serviços inativos (ativo=0)
- [x] Mostra estatísticas

---

### FASE 3: AVALIAÇÕES

#### 3.1 POST - Criar Avaliação

**Pré-requisito:** Qualquer usuário logado, serviço deve existir

**Postman:**

```
POST http://localhost:3000/api/avaliacoes
Authorization: Bearer <token>
Content-Type: application/json

{
  "id_servico": 1,
  "nota_preco": 5,
  "nota_tempo_execucao": 4,
  "nota_higiene": 5,
  "nota_educacao": 5,
  "comentario": "Excelente profissional! Voltaria a contratar."
}
```

**Resposta Esperada (201):**

```json
{
  "sucesso": true,
  "mensagem": "Avaliação criada com sucesso",
  "dados": {
    "id": 1,
    "id_servico": 1,
    "id_usuario": 3,
    "nota_preco": 5,
    "nota_tempo_execucao": 4,
    "nota_higiene": 5,
    "nota_educacao": 5,
    "comentario": "Excelente profissional...",
    "data_avaliacao": "2026-01-20 11:30:00"
  }
}
```

**Verificação no BD:**

```sql
-- Verificar que nota_media foi recalculada
SELECT nota_media, total_avaliacoes FROM tb_servico WHERE id = 1;
-- Deve mostrar: nota_media = 4.75, total_avaliacoes = 1
```

**Testes:**

- [x] Status 201
- [x] Avaliação inserida
- [x] nota_media do serviço atualizada
- [x] total_avaliacoes incrementado

---

#### 3.2 POST - Tentar Avaliar 2x o Mesmo Serviço (Erro)

**Teste:**

```
POST http://localhost:3000/api/avaliacoes
Authorization: Bearer <token>
(mesmo JSON acima - id_servico=1 novamente)
```

**Resposta Esperada (409):**

```json
{
  "sucesso": false,
  "mensagem": "Você já avaliou este serviço"
}
```

**Testes:**

- [x] Status 409 (Conflict)
- [x] Mensagem clara
- [x] Avaliação NÃO foi duplicada

---

#### 3.3 GET - Avaliações de um Serviço

**Postman:**

```
GET http://localhost:3000/api/servicos/1/avaliacoes
```

**Resposta Esperada (200):**

```json
{
  "sucesso": true,
  "mensagem": "Avaliações obtidas com sucesso",
  "dados": [
    {
      "id": 1,
      "nota_preco": 5,
      "nota_tempo_execucao": 4,
      "nota_higiene": 5,
      "nota_educacao": 5,
      "comentario": "Excelente profissional!",
      "nome_usuario": "João Silva",
      "data_avaliacao": "2026-01-20 11:30:00"
    }
  ]
}
```

**Testes:**

- [x] Lista ordenada por data DESC (mais recentes primeiro)
- [x] Inclui nome do avaliador
- [x] Status 200

---

#### 3.4 GET - Minhas Avaliações (Usuário)

**Pré-requisito:** Qualquer usuário logado

**Postman:**

```
GET http://localhost:3000/api/avaliacoes/minhas
Authorization: Bearer <token>
```

**Resposta Esperada (200):**

```json
{
  "sucesso": true,
  "mensagem": "Suas avaliações obtidas com sucesso",
  "dados": [
    {
      "id": 1,
      "id_servico": 1,
      "nome_prestador": "Pedro Engenheiro",
      "nota_preco": 5,
      "nota_tempo_execucao": 4,
      "nota_higiene": 5,
      "nota_educacao": 5,
      "comentario": "Excelente profissional!",
      "data_avaliacao": "2026-01-20 11:30:00"
    }
  ]
}
```

**Testes:**

- [x] Lista apenas avaliações do usuário logado
- [x] Inclui informações do serviço

---

#### 3.5 GET - Avaliações Recebidas (Prestador)

**Pré-requisito:** Token de prestador

**Postman:**

```
GET http://localhost:3000/api/avaliacoes/recebidas
Authorization: Bearer <token_prestador>
```

**Resposta Esperada (200):**

```json
{
  "sucesso": true,
  "mensagem": "Avaliações recebidas obtidas com sucesso",
  "dados": [
    {
      "id": 1,
      "id_servico": 1,
      "nome_servico": "Pedro Engenheiro",
      "nome_usuario": "João Silva",
      "nota_preco": 5,
      "nota_tempo_execucao": 4,
      "nota_higiene": 5,
      "nota_educacao": 5,
      "comentario": "Excelente profissional!",
      "data_avaliacao": "2026-01-20 11:30:00"
    }
  ]
}
```

**Testes:**

- [x] Lista apenas avaliações dos serviços do prestador
- [x] Mostrar nome do avaliador

---

#### 3.6 PUT - Editar Avaliação

**Pré-requisito:** Token de quem fez a avaliação

**Postman:**

```
PUT http://localhost:3000/api/avaliacoes/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "nota_preco": 4,
  "nota_tempo_execucao": 4,
  "nota_higiene": 4,
  "nota_educacao": 5,
  "comentario": "Bom, mas poderia melhorar no preço"
}
```

**Resposta Esperada (200):**

```json
{
  "sucesso": true,
  "mensagem": "Avaliação atualizada com sucesso",
  "dados": {
    "id": 1,
    "nota_preco": 4,
    ...
  }
}
```

**Verificação:**

```sql
-- Verificar que nota_media foi recalculada
SELECT nota_media FROM tb_servico WHERE id = 1;
```

**Testes:**

- [x] Status 200
- [x] Avaliação atualizada
- [x] nota_media recalculada

---

#### 3.7 DELETE - Deletar Avaliação

**Pré-requisito:** Token de quem fez a avaliação

**Postman:**

```
DELETE http://localhost:3000/api/avaliacoes/1
Authorization: Bearer <token>
```

**Resposta Esperada (200):**

```json
{
  "sucesso": true,
  "mensagem": "Avaliação deletada com sucesso"
}
```

**Verificação:**

```sql
-- Verificar que nota_media foi recalculada
SELECT nota_media, total_avaliacoes FROM tb_servico WHERE id = 1;
-- Deve voltar para 0 e 0 se era a única
```

**Testes:**

- [x] Status 200
- [x] Avaliação deletada
- [x] nota_media recalculada (deve diminuir)

---

## 📊 TESTE DE MÉDIA COMPLETO

Este teste valida se o cálculo de média está funcionando corretamente.

### Cenário: 3 Avaliações

**Avaliação 1:**

```
nota_preco: 5
nota_tempo_execucao: 5
nota_higiene: 5
nota_educacao: 5
Média individual: (5+5+5+5)/4 = 5.00
```

**Avaliação 2:**

```
nota_preco: 3
nota_tempo_execucao: 3
nota_higiene: 3
nota_educacao: 3
Média individual: (3+3+3+3)/4 = 3.00
```

**Avaliação 3:**

```
nota_preco: 4
nota_tempo_execucao: 4
nota_higiene: 4
nota_educacao: 4
Média individual: (4+4+4+4)/4 = 4.00
```

**Resultado Esperado:**

```
nota_media = (5 + 3 + 4) / 3 = 4.00
total_avaliacoes = 3
```

**Verificação:**

```sql
SELECT nota_media, total_avaliacoes FROM tb_servico WHERE id = 1;
-- Resultado: nota_media = 4.00, total_avaliacoes = 3
```

---

## 🔍 TESTE DE SEGURANÇA

### 1. SQL Injection

```
GET /api/servicos?categoria=1; DROP TABLE tb_servico;--
Esperado: Tratado como string, sem execução
```

### 2. XSS em Comentário

```
POST /api/avaliacoes
{
  ...
  "comentario": "<script>alert('XSS')</script>"
}
Esperado: Salvo como string, não executado
```

### 3. Acesso sem Autenticação

```
PUT /api/servicos/1
(sem token)
Esperado: 401 Unauthorized
```

### 4. Acesso com Permissão Incorreta

```
DELETE /api/servicos/1
Authorization: Bearer <token_usuario_comum>
Esperado: 403 Forbidden
```

---

## 📈 TESTE DE PAGINAÇÃO

**Teste 1: Primeira página**

```
GET /api/servicos?pagina=1&limite=5
```

**Teste 2: Segunda página**

```
GET /api/servicos?pagina=2&limite=5
```

**Esperado:**

- Página 1: 5 itens (IDs 1-5)
- Página 2: 5 itens (IDs 6-10)
- Cada item diferente

---

## 🎯 CHECKLIST DE TODOS OS TESTES

### Autenticação ✅

- [ ] Registro novo usuário → 201
- [ ] Registro usuário duplicado → 409
- [ ] Login válido → 200 + token
- [ ] Login inválido → 401
- [ ] Obter perfil com token → 200
- [ ] Obter perfil sem token → 401
- [ ] Token inválido → 401

### Serviços ✅

- [ ] GET listar todos → 200
- [ ] GET com filtro categoria → 200
- [ ] GET detalhes → 200
- [ ] POST criar (prestador) → 201
- [ ] POST criar (usuário) → 403
- [ ] PUT editar (proprietário) → 200
- [ ] PUT editar (outro) → 403
- [ ] DELETE → 200 + ativo=0
- [ ] GET meus (prestador) → 200

### Avaliações ✅

- [ ] POST criar → 201
- [ ] POST duplicada → 409
- [ ] GET lista de serviço → 200
- [ ] GET minhas → 200
- [ ] GET recebidas (prestador) → 200
- [ ] PUT editar → 200 + média recalculada
- [ ] DELETE → 200 + média recalculada

---

**Última atualização:** 20 de janeiro de 2026  
**Total de Testes:** 35+  
**Tempo Estimado:** 2-3 horas
