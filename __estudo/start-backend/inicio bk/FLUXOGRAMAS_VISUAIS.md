# 🎯 FLUXOGRAMAS VISUAIS: Entender como o Sistema Funciona

## 1️⃣ FLUXO DE REGISTRO (Novo Usuário)

```
┌─────────────────────────────────────────────────────────────────┐
│                      USUÁRIO NOVO                               │
│              Tela de Registro (Frontend)                         │
│                                                                  │
│  ┌────────────────────────────────────────┐                    │
│  │ Nome: João Silva                       │                    │
│  │ Email: joao@email.com                  │                    │
│  │ Login: joao123                         │                    │
│  │ Senha: ●●●●●●                         │                    │
│  │ [Registrar]                            │                    │
│  └────────────────────────────────────────┘                    │
└─────────────────────────────────────────────────────────────────┘
                           │
                           │ POST /api/auth/registro
                           │ JSON: {nome, email, login, senha}
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Node.js)                          │
│                                                                  │
│  1. Recebe os dados do usuário                                 │
│  2. Valida: Todos os campos foram preenchidos?                 │
│  3. Verifica: Este email/login já existe?                      │
│  4. Criptografa: "123456" → "$2a$10$alkdj..."                 │
│  5. Insere: INSERT INTO oc__tb_usuario (...)                   │
│                                                                  │
│  ✓ Sucesso! 201 Created                                         │
└─────────────────────────────────────────────────────────────────┘
                           │
                           │ Resposta JSON
                           │ {id_usuario: 1, mensagem: "..."}
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                   Frontend React                                │
│                                                                  │
│  Mostra mensagem de sucesso                                    │
│  "Cadastro realizado! Faça login agora"                        │
│                                                                  │
│  localStorage: (vazio)                                          │
│  Status: NÃO logado                                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2️⃣ FLUXO DE LOGIN (Autenticação com JWT)

```
┌─────────────────────────────────────────────────────────────────┐
│                   Frontend React                                │
│                La Tela de Login                                  │
│                                                                  │
│  ┌────────────────────────────────────────┐                    │
│  │ Login: joao123                         │                    │
│  │ Senha: ●●●●●●                         │                    │
│  │ [Entrar]                               │                    │
│  └────────────────────────────────────────┘                    │
└─────────────────────────────────────────────────────────────────┘
                           │
                           │ POST /api/auth/login
                           │ JSON: {login, senha}
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Node.js)                          │
│                                                                  │
│  1. Busca usuário: SELECT * WHERE login = ?                    │
│  2. Encontrou? SIM                                              │
│     └─ senha_banco = "$2a$10$..."                              │
│  3. Verifica: bcrypt.compare(senha_digitada, senha_banco)       │
│     └─ Retorna: true (senhas combinam)                          │
│  4. Gera Token JWT:                                             │
│     {                                                           │
│        "id": 1,                                                 │
│        "login": "joao123",                                      │
│        "email": "joao@email.com",                               │
│        "tipo_usuario": "usuario",                               │
│        "exp": 1706851200  ← Expira em 24 horas                 │
│     }                                                           │
│     Assinado com SEGREDO_JWT do .env                           │
│                                                                  │
│  ✓ Sucesso! 200 OK                                              │
└─────────────────────────────────────────────────────────────────┘
                           │
                           │ Resposta JSON
                           │ {
                           │    token: "eyJhbGc...",
                           │    usuario: {id, nome, email, tipo}
                           │ }
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                   Frontend React                                │
│                                                                  │
│  localStorage.setItem("token", "eyJhbGc...")                   │
│  localStorage.setItem("usuario", JSON.stringify(...))           │
│                                                                  │
│  localStorage agora tem:                                        │
│  {                                                              │
│    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6I...",               │
│    "usuario": "{"id": 1, "nome": "João", ...}"                │
│  }                                                              │
│                                                                  │
│  🎉 Usuário logado!                                             │
│  Redireciona para /home                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3️⃣ FLUXO DE REQUISIÇÃO PROTEGIDA (Com Token)

```
┌─────────────────────────────────────────────────────────────────┐
│               Frontend: Usuário Clica em                         │
│               "Ver Meus Serviços"                                │
└─────────────────────────────────────────────────────────────────┘
                           │
                           │ Recupera token do localStorage
                           │ token = "eyJhbGc..."
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend React                               │
│                                                                  │
│  api.get("/api/servicos/meus-servicos")                        │
│                                                                  │
│  Interceptador automático adiciona:                             │
│  Headers {                                                      │
│    Authorization: "Bearer eyJhbGc..."                           │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
                           │
                           │ GET /api/servicos/meus-servicos
                           │ Header: Authorization: Bearer eyJhbGc...
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                  BACKEND Express                                │
│                  Router: servicoRoutes.js                       │
│                                                                  │
│  Requisição chega no middleware: verificarToken                │
│  ↓                                                              │
│  ┌──────────────────────────────────────┐                      │
│  │ [MIDDLEWARE: verificarToken]         │                      │
│  │ 1. Busca header "authorization"      │                      │
│  │    └─ "Bearer eyJhbGc..."            │                      │
│  │ 2. Separa a palavra "Bearer"         │                      │
│  │    └─ token = "eyJhbGc..."           │                      │
│  │ 3. jwt.verify(token, SEGREDO_JWT)    │                      │
│  │    └─ Se válido, coloca req.usuario  │                      │
│  │    └─ Se inválido, retorna erro 403  │                      │
│  │ 4. Chama next() se tudo ok           │                      │
│  └──────────────────────────────────────┘                      │
│  ↓ (Middleware passou! Token é válido)                         │
│  ┌──────────────────────────────────────┐                      │
│  │ [CONTROLADOR: listarMeusServicos]    │                      │
│  │ const usuarioLogado = req.usuario    │                      │
│  │   = {                                │                      │
│  │       id: 1,                         │                      │
│  │       login: "joao123",              │                      │
│  │       email: "joao@email.com",       │                      │
│  │       tipo_usuario: "usuario"        │                      │
│  │     }                                │                      │
│  │                                      │                      │
│  │ SELECT * FROM oc__tb_servico         │                      │
│  │ WHERE id_usuario = 1                 │                      │
│  │                                      │                      │
│  │ ✓ Retorna 200 OK com serviços       │                      │
│  └──────────────────────────────────────┘                      │
└─────────────────────────────────────────────────────────────────┘
                           │
                           │ Resposta JSON Array
                           │ [
                           │   {id: 1, titulo: "...", ...},
                           │   {id: 2, titulo: "...", ...}
                           │ ]
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                   Frontend React                                │
│                                                                  │
│  Mostra lista de serviços do usuário                           │
│                                                                  │
│  • Instalação de Tomadas                                       │
│  • Pintura de Parede                                           │
│  • Conserto de Porta                                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4️⃣ FLUXO DE CRIAÇÃO DE SERVIÇO (Com Upload)

```
┌──────────────────────────────────────────────────────────────┐
│             Frontend: Formulário de Novo Serviço              │
│                                                               │
│  ┌──────────────────────────────────┐                        │
│  │ Título: Instalação de Tomadas    │                        │
│  │ Descrição: Instalo tomadas...    │                        │
│  │ Imagem: [Selecionar arquivo] ✓   │                        │
│  │ [Criar Serviço]                  │                        │
│  └──────────────────────────────────┘                        │
└──────────────────────────────────────────────────────────────┘
                           │
                           │ Cria FormData
                           │ form.append("titulo", "...")
                           │ form.append("descricao", "...")
                           │ form.append("imagem", FileObject)
                           │
                           │ POST /api/servicos
                           │ Header: Authorization: Bearer token
                           │ Header: Content-Type: multipart/form-data
                           ↓
┌──────────────────────────────────────────────────────────────┐
│                    BACKEND: Multer                            │
│                                                               │
│  1. Multer intercepta a requisição                           │
│  2. Processa o arquivo enviado                              │
│  3. Gera nome único: 1706762400000-foto.jpg                 │
│  4. Salva em /uploads/                                       │
│  5. Coloca em req.file:                                      │
│     {                                                        │
│       fieldname: "imagem",                                   │
│       originalname: "foto.jpg",                              │
│       filename: "1706762400000-foto.jpg",                    │
│       path: "uploads/1706762400000-foto.jpg",                │
│       ...                                                    │
│     }                                                        │
│  6. req.body tem os outros campos                           │
│  7. Passa para o controlador                                 │
└──────────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────┐
│          BACKEND: servicoController.criarServico              │
│                                                               │
│  1. Valida: Usuário é prestador?                            │
│  2. Valida: Título e descrição foram preenchidos?           │
│  3. Monta URL da imagem:                                     │
│     "http://localhost:3001/uploads/1706762400000-foto.jpg"  │
│  4. INSERT INTO oc__tb_servico                              │
│     {                                                        │
│       id_usuario: 1,                                         │
│       titulo: "Instalação de Tomadas",                       │
│       desc_servico: "Instalo tomadas...",                    │
│       imagem_url: "http://localhost:3001/uploads/...",       │
│       data_cadastro: NOW()                                   │
│     }                                                        │
│  5. ✓ Sucesso! 201 Created                                   │
│     {                                                        │
│       id_servico: 5,                                         │
│       imagem: "http://localhost:3001/uploads/..."            │
│     }                                                        │
└──────────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────┐
│              Frontend: Mostrar Confirmação                    │
│                                                               │
│  ✅ Serviço criado com sucesso!                              │
│     Seu serviço agora está disponível!                       │
│                                                               │
│  Redireciona para /meus-servicos                            │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│         Banco de Dados (MySQL)                                │
│                                                               │
│  oc__tb_servico                                              │
│  ┌──────────────────────────────────────────────┐            │
│  │ id │ id_usuario │ titulo         │ imagem_url │ ...       │
│  ├──────────────────────────────────────────────┤            │
│  │ 1  │ 1          │ Pintura        │ /uploads/... │         │
│  │ 2  │ 1          │ Conserto       │ /uploads/... │         │
│  │ ... │            │                │            │         │
│  │ 5  │ 1          │ Instalação... │ /uploads/1... │ ← NOVO │
│  └──────────────────────────────────────────────┘            │
│                                                               │
│  Disco do Servidor (/uploads/)                               │
│  ├─ 1706762400000-foto.jpg                                   │
│  ├─ 1706762400001-imagem.jpg                                 │
│  └─ 1706762400002-documento.jpg                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 5️⃣ FLUXO DE AVALIAÇÃO

```
┌───────────────────────────────────────────────────────────────┐
│          Frontend: Tela do Serviço (ID: 1)                    │
│                                                                │
│  ┌─────────────────────────────────────────────┐             │
│  │ Instalação de Tomadas                       │             │
│  │ Por: João Silva                             │             │
│  │ Nota: 4.5/5 (8 avaliações)                  │             │
│  │                                             │             │
│  │ ┌────────────────────────────────────────┐ │             │
│  │ │ Avalie este Serviço:                  │ │             │
│  │ │                                        │ │             │
│  │ │ Preço: ☆☆☆☆☆ (5)                    │ │             │
│  │ │ Tempo: ☆☆☆☆☆ (4)                    │ │             │
│  │ │ Higiene: ☆☆☆☆☆ (5)                  │ │             │
│  │ │ Educação: ☆☆☆☆☆ (5)                 │ │             │
│  │ │ Comentário: Excelente!                │ │             │
│  │ │ [Enviar Avaliação]                    │ │             │
│  │ └────────────────────────────────────────┘ │             │
│  └─────────────────────────────────────────────┘             │
└───────────────────────────────────────────────────────────────┘
                           │
                           │ POST /api/avaliacoes
                           │ Body: {
                           │   id_servico: 1,
                           │   nota_preco: 5,
                           │   nota_tempo: 4,
                           │   nota_higiene: 5,
                           │   nota_educacao: 5,
                           │   comentario: "Excelente!"
                           │ }
                           │ Header: Authorization: Bearer token
                           ↓
┌───────────────────────────────────────────────────────────────┐
│              BACKEND: avaliacaoController                     │
│                                                                │
│  1. Valida: Notas estão entre 1 e 5? ✓                       │
│  2. Verifica Duplicidade:                                    │
│     SELECT * FROM oc__tb_avaliacao                           │
│     WHERE id_usuario = 2 AND id_servico = 1                  │
│     └─ Nenhum resultado = Primeira avaliação ✓               │
│  3. INSERT INTO oc__tb_avaliacao                             │
│     {                                                        │
│       id_servico: 1,                                         │
│       id_usuario: 2,                                         │
│       nota_preco: 5,                                         │
│       nota_tempo_execucao: 4,                                │
│       nota_higiene: 5,                                       │
│       nota_educacao: 5,                                      │
│       comentario: "Excelente!",                              │
│       data_avaliacao: NOW()                                  │
│     }                                                        │
│  4. RECALCULA a nota média do serviço:                       │
│     UPDATE oc__tb_servico                                    │
│     SET nota_media = (                                       │
│       SELECT AVG((nota_preco +                               │
│                   nota_tempo_execucao +                      │
│                   nota_higiene +                             │
│                   nota_educacao) / 4)                        │
│       FROM oc__tb_avaliacao                                  │
│       WHERE id_servico = 1                                   │
│     )                                                        │
│     └─ Nova nota_media: 4.67                                 │
│  5. ✓ Sucesso! 201 Created                                   │
│     "Avaliação enviada com sucesso!"                         │
└───────────────────────────────────────────────────────────────┘
                           ↓
┌───────────────────────────────────────────────────────────────┐
│           Frontend: Mostrar Confirmação                       │
│                                                                │
│  ✅ Obrigado! Sua avaliação foi registrada                   │
│                                                                │
│  Recarrega a página                                           │
│  └─ Agora mostra "Nota: 4.67/5 (9 avaliações)"              │
│                                                                │
│  Mostra todas as avaliações:                                  │
│  ┌──────────────────────────────────┐                        │
│  │ Maria - ☆☆☆☆☆ - "Excelente!"  │                        │
│  │ Pedro - ☆☆☆☆ - "Muito bom"    │                        │
│  │ ...                             │                        │
│  └──────────────────────────────────┘                        │
└───────────────────────────────────────────────────────────────┘
```

---

## 6️⃣ FLUXO: Token Inválido ou Expirado

```
┌──────────────────────────────────────────────────────────────┐
│           Usuário estava logado em casa                       │
│              Fecha o navegador                                │
│                  24+ horas depois...                          │
│             Abre novamente e tenta acessar                    │
│           "Ver Meus Serviços" (token no localStorage)        │
└──────────────────────────────────────────────────────────────┘
                           │
                           │ Token salvo ainda está lá:
                           │ "eyJhbGciOiJIUzI1NiIsInR5cCI6I..."
                           │
                           │ Mas ele EXPIROU!
                           │ (expiresIn: "24h" faz 25+ horas)
                           │
                           │ GET /api/servicos/meus-servicos
                           │ Header: Authorization: Bearer [EXPIRADO]
                           ↓
┌──────────────────────────────────────────────────────────────┐
│            BACKEND: verificarToken middleware                │
│                                                               │
│  jwt.verify(token, SEGREDO_JWT)                             │
│  └─ Erro: TokenExpiredError!                                │
│                                                               │
│  catch (erro) {                                              │
│    res.status(403).json({                                    │
│      erro: "Token inválido ou expirado."                    │
│    })                                                        │
│  }                                                           │
│                                                               │
│  ✗ Erro 403 Forbidden                                        │
└──────────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────┐
│             Frontend React                                    │
│                                                               │
│  Pega erro 403                                               │
│  └─ "Token inválido ou expirado"                            │
│                                                               │
│  if (erro.status === 403) {                                  │
│    localStorage.removeItem("token");                         │
│    localStorage.removeItem("usuario");                       │
│    window.location.href = "/login";                          │
│  }                                                           │
│                                                               │
│  ⚠️ Redireciona para a tela de login                        │
│  "Sua sessão expirou. Por favor, faça login novamente."     │
└──────────────────────────────────────────────────────────────┘
                           │
                           │ Usuário faz login novamente
                           │ Recebe novo token
                           │ localStorage atualizado
                           │
                           ↓
┌──────────────────────────────────────────────────────────────┐
│                   Volta a funcionar! ✓                        │
│           Token novo é válido por mais 24 horas              │
└──────────────────────────────────────────────────────────────┘
```

---

## 7️⃣ FLUXO: Dados no Banco de Dados

```
┌─────────────────────────────────────────────────────────────┐
│                   Banco de Dados MySQL                       │
│                   Database: obraconnect                       │
└─────────────────────────────────────────────────────────────┘

Tabela: oc__tb_usuario
┌──────────────────────────────────────────────────────────┐
│ id │ nome_usuario │ email           │ login         │ ... │
├──────────────────────────────────────────────────────────┤
│ 1  │ João Silva   │ joao@email.com  │ joao123       │ ... │
│ 2  │ Maria Santos │ maria@email.com │ maria456      │ ... │
│ 3  │ Pedro Costa  │ pedro@email.com │ pedro789      │ ... │
└──────────────────────────────────────────────────────────┘

Tabela: oc__tb_servico
┌───────────────────────────────────────────────────────────────┐
│ id │ id_usuario │ titulo        │ desc_servico      │ nota_media │
├───────────────────────────────────────────────────────────────┤
│ 1  │ 1          │ Inst. Tomadas │ Instalo tomadas...│ 4.75       │
│ 2  │ 1          │ Pin. Parede   │ Pinto paredes...  │ 4.50       │
│ 3  │ 2          │ Cons. Porta   │ Conserto de...    │ 4.25       │
└───────────────────────────────────────────────────────────────┘

Tabela: oc__tb_avaliacao
┌──────────────────────────────────────────────────────────┐
│ id │ id_servico │ id_usuario │ nota_preco │ comentario   │
├──────────────────────────────────────────────────────────┤
│ 1  │ 1          │ 2          │ 5          │ "Excelente!" │
│ 2  │ 1          │ 3          │ 4          │ "Muito bom"  │
│ 3  │ 2          │ 2          │ 5          │ "Perfeito!"  │
└──────────────────────────────────────────────────────────┘

Relacionamentos (Foreign Keys):
┌─────────────────────────────────┐
│   oc__tb_usuario (id=1)         │
│        João Silva               │
│         ↓            ↓           │
│  ┌────────────┐  ┌────────────┐ │
│  │ Serviço 1  │  │ Serviço 2  │ │
│  │ (id=1)     │  │ (id=2)     │ │
│  └────────────┘  └────────────┘ │
│        ↓                  ↓      │
│  ┌──────────────────────────┐   │
│  │  Avaliações recebidas:   │   │
│  │  Avaliação 1 (por Maria) │   │
│  │  Avaliação 2 (por Pedro) │   │
│  └──────────────────────────┘   │
└─────────────────────────────────┘
```

---

## 8️⃣ MAPA COMPLETO DO SISTEMA

```
                    ┌─────────────────────┐
                    │  Frontend (React)   │
                    │  Navegador do User  │
                    └──────────────┬──────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
              HTTP/HTTPS                    HTTP/HTTPS
              (Port 3000/5173)            (Port 3001)
                    │                             │
    ┌───────────────┼─────────────────────────────┼──────────┐
    │               │                             │          │
    │       ┌───────▼─────────────────┐          │          │
    │       │   src/                  │          │          │
    │       ├─ components/            │          │          │
    │       ├─ api/                   │──────────┤          │
    │       ├─ hooks/                 │          │          │
    │       └─ styles/                │          │          │
    │                                  │          │          │
    │  (Frontend React)                │  Backend │          │
    │                                  │  Node.js │    MySQL │
    │                           ┌──────▼──────┐   │          │
    │                           │  Express    │   │          │
    │                           │  app.js     │   │          │
    │                           └──────┬──────┘   │          │
    │                                  │          │          │
    │  ┌──────────────────────────────┼──────────┤          │
    │  │                               │          │          │
    │  │       POST /api/auth/login ───┤──────────┤          │
    │  │       POST /api/auth/registro ┤          │          │
    │  │                               │   Routes│          │
    │  │   GET /api/servicos ──────────┤────────┐│          │
    │  │   POST /api/servicos ─────────┤        ││          │
    │  │                               │ Control│          │
    │  │  POST /api/avaliacoes ────────┤ lers & │          │
    │  │                               │Middlewares          │
    │  │                               │        ││          │
    │  └──────────────────────────────────────┬─┘          │
    │                                  │      │            │
    │                           ┌──────▼──────▼────┐        │
    │                           │ Banco de Dados   │──┐     │
    │                           │ MySQL            │  │     │
    │                           │                  │  │     │
    │                           │ oc__tb_usuario   │  │     │
    │                           │ oc__tb_servico   │  │     │
    │                           │ oc__tb_avaliacao │  │     │
    │                           └──────────────────┘  │     │
    │                                                 │     │
    └─────────────────────────────────────────────────┴─────┘

                       └──oc__tb_usuario com 500 usuarios
                       └──Serviços com milhares de registros
                       └──Avaliações com dados históricos
```

---

## 📊 RESUMO: O QUE ACONTECE EM CADA PASSO

| Passo | O que acontece | Onde | Status |
|-------|---|---|---|
| 1. Usuário digita login/senha | Dados coletados | Frontend | 👤 Tela |
| 2. Clica "Entrar" | Requisição é enviada | Network | 📡 HTTP |
| 3. Backend recebe | Express processa | Backend | 🔧 Node.js |
| 4. Valida credenciais | Busca no MySQL | Backend | 🔍 Database |
| 5. Verifica senha | Bcrypt compara | Backend | 🔐 Segurança |
| 6. Gera Token | JWT assinado | Backend | 🎟️ Geração |
| 7. Retorna resposta | JSON com token | Network | 📡 HTTP |
| 8. Frontend guarda | localStorage | Frontend | 💾 Storage |
| 9. Faz requisição nova | Inclui token | Network | 📡 HTTP |
| 10. Backend valida | Middleware verifica | Backend | ✅ Autorização |
| 11. Executa ação | Controlador trabalha | Backend | 🔧 Lógica |
| 12. Retorna dados | JSON com resultado | Network | 📡 HTTP |
| 13. Frontend mostra | Renderiza na tela | Frontend | 👁️ Tela |

---

Vale a pena ler estas fluxogramas várias vezes! Compreender o fluxo de dados é essencial para corrigir problemas. 🎯
