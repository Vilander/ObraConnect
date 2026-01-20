# 🗺️ ROADMAP DETALHADO - OBRACONNECT BACKEND

## LEGENDA

- 🔴 CRÍTICA (Bloqueador)
- 🟡 ALTA (Necessária)
- 🟢 NORMAL (Desejável)
- 🟣 EXTRA (Bônus)

---

## 📅 SEMANA 1: SETUP & AUTENTICAÇÃO

### DIA 1: Configuração Inicial

#### Manhã (2h)

- [ ] **Criar pasta /backend**

  - `mkdir backend && cd backend`
  - Resultado esperado: Pasta vazia criada

- [ ] **Inicializar npm**

  - `npm init -y`
  - Resultado esperado: package.json criado

- [ ] **Instalar dependências** 🔴
  ```bash
  npm install express mysql2 bcryptjs jsonwebtoken cors dotenv joi
  npm install --save-dev nodemon
  ```
  - Resultado esperado: node_modules criado, package-lock.json

#### Tarde (3h)

- [ ] **Criar estrutura de pastas**

  ```
  backend/
  ├── src/
  │   ├── config/
  │   ├── controllers/
  │   ├── routes/
  │   ├── middlewares/
  │   ├── services/
  │   └── utils/
  └── .env
  ```

- [ ] **Criar arquivo .env** 🔴
  - Copiar from GUIA_PRATICO_BACKEND.md
  - Testar valores (MySQL está rodando?)
- [ ] **Criar arquivo .gitignore**

  - node_modules/
  - .env
  - \*.log

- [ ] **Testar conexão MySQL**
  - Criar src/config/database.js
  - Executar: `node -e "require('./src/config/database.js')"`
  - Resultado esperado: ✅ Conectado ao banco de dados MySQL

---

### DIA 2-3: Autenticação JWT

#### Passo 1: Utilitários (1h)

- [ ] **src/utils/criptografia.js**

  - Funções: hashSenha, compararSenha
  - Teste: Hash uma senha e compare

- [ ] **src/utils/validadores.js**
  - Schemas Joi: registro, login, serviço, avaliação
  - Teste: Validar um objeto com schema

#### Passo 2: Configuração (1h)

- [ ] **src/config/constants.js**

  - TIPO_USUARIO, MENSAGENS, STATUS_HTTP

- [ ] **src/services/tokenService.js**
  - Funções: gerarToken, verificarToken
  - Teste: Gerar token e decodificar

#### Passo 3: Middlewares (2h)

- [ ] **src/middlewares/autenticacao.js** 🔴

  - verificarToken (extrair e validar JWT)
  - verificarAdmin
  - verificarPrestador
  - Teste: Header inválido deve retornar 401

- [ ] **src/middlewares/validacao.js**

  - validarDados (wrapper para Joi)
  - Teste: Dados inválidos devem retornar 400

- [ ] **src/middlewares/erros.js**
  - tratarErroGlobal (catch-all)

#### Passo 4: Controller de Autenticação (2h)

- [ ] **src/controllers/authController.js** 🔴

  - `registro(req, res)` - POST /api/auth/registro

    - Validar login e email únicos
    - Hash da senha com bcryptjs
    - Retornar token
    - Teste: Registrar novo usuário, verificar BD

  - `login(req, res)` - POST /api/auth/login

    - Buscar usuário por login/email
    - Comparar senha
    - Retornar token
    - Teste: Login com credenciais válidas/inválidas

  - `obterPerfil(req, res)` - GET /api/auth/perfil
    - Requer autenticação
    - Retornar dados do usuário logado
    - Teste: Acessar sem token (401), com token (200)

#### Passo 5: Rotas de Autenticação (1h)

- [ ] **src/routes/authRoutes.js** 🔴
  ```javascript
  router.post(
    "/registro",
    validarDados(schemaRegistro),
    authController.registro
  );
  router.post("/login", validarDados(schemaLogin), authController.login);
  router.get("/perfil", verificarToken, authController.obterPerfil);
  ```

#### Passo 6: Servidor Principal (1h)

- [ ] **src/servidor.js** 🔴
  - Express setup
  - CORS configurado para http://localhost:5173
  - Rotas de auth
  - Health check endpoint: GET /api/health
  - Erro 404 handler
  - Teste: npm run dev deve iniciar sem erros

#### Passo 7: Testes de Autenticação (2h)

- [ ] **Teste com Postman/Insomnia**

  - POST /api/auth/registro

    - Teste 1: Dados válidos → 201 com token
    - Teste 2: Login duplicado → 409
    - Teste 3: Email inválido → 400

  - POST /api/auth/login

    - Teste 1: Credenciais válidas → 200 com token
    - Teste 2: Senha errada → 401
    - Teste 3: Usuário não existe → 401

  - GET /api/auth/perfil
    - Teste 1: Sem token → 401
    - Teste 2: Com token inválido → 401
    - Teste 3: Com token válido → 200 com perfil
    - Teste 4: Verificar que senha NÃO é retornada

**CHECKPOINT 1**:

- [x] Backend iniciando sem erros
- [x] Conexão com MySQL OK
- [x] 3 endpoints de autenticação funcionando
- [x] JWT gerado e validado
- [x] Senhas hashadas com bcryptjs
- [x] CORS configurado
- [x] Postman testes passando

---

## 📅 SEMANA 2: CRUD DE SERVIÇOS

### DIA 4-5: Serviços (CRUD Completo)

#### Passo 1: Controller de Serviços (3h)

- [ ] **src/controllers/servicoController.js** 🔴

  - `listarServicos(req, res)` - GET /api/servicos

    - Query params: categoria, pagina, limite
    - SELECT com JOIN para categorias
    - Paginação (LIMIT/OFFSET)
    - Teste: /api/servicos → lista 10 serviços
    - Teste: /api/servicos?categoria=5 → filtra
    - Teste: /api/servicos?pagina=2 → segunda página

  - `obterDetalhesServico(req, res)` - GET /api/servicos/:id

    - Buscar com categorias (JOIN)
    - Retornar todas as informações
    - Teste: /api/servicos/1 → detalhes completos

  - `criarServico(req, res)` - POST /api/servicos 🔴

    - Requer autenticação + tipo=prestador
    - Validar dados com Joi
    - Inserir em tb_servico
    - Inserir categorias em tb_categoria_atendida
    - Teste: Criar como prestador → 201
    - Teste: Criar como usuário comum → 403

  - `editarServico(req, res)` - PUT /api/servicos/:id

    - Requer autenticação + ser o proprietário
    - Atualizar tb_servico
    - Atualizar categorias
    - Teste: Editar próprio serviço → 200
    - Teste: Editar serviço alheio → 403

  - `deletarServico(req, res)` - DELETE /api/servicos/:id

    - Soft delete (UPDATE ativo = 0)
    - Requer ser proprietário
    - Teste: Deletar → 200
    - Teste: Verificar que ainda existe no BD (ativo=0)

  - `meusServicos(req, res)` - GET /api/servicos/meus
    - Requer autenticação + prestador
    - Listar apenas serviços do prestador logado
    - Teste: Get /api/servicos/meus → lista

#### Passo 2: Rotas de Serviços (1h)

- [ ] **src/routes/servicoRoutes.js** 🔴
  ```javascript
  router.get("/", servicoController.listarServicos);
  router.get(
    "/meus",
    verificarToken,
    verificarPrestador,
    servicoController.meusServicos
  );
  router.get("/:id", servicoController.obterDetalhesServico);
  router.post(
    "/",
    verificarToken,
    verificarPrestador,
    validarDados(schemaServico),
    servicoController.criarServico
  );
  router.put(
    "/:id",
    verificarToken,
    validarDados(schemaServico),
    servicoController.editarServico
  );
  router.delete("/:id", verificarToken, servicoController.deletarServico);
  ```

#### Passo 3: Testes Completos (2h)

- [ ] **Teste GET /api/servicos**

  - Teste 1: Sem parâmetros → lista todos ativos
  - Teste 2: Com categoria → filtra
  - Teste 3: Paginação → verifica LIMIT/OFFSET

- [ ] **Teste POST /api/servicos**

  - Teste 1: Prestador com dados válidos → 201
  - Teste 2: Usuário comum → 403
  - Teste 3: Sem autenticação → 401
  - Teste 4: Dados faltando → 400

- [ ] **Teste PUT /api/servicos/:id**

  - Teste 1: Proprietário → 200
  - Teste 2: Outro usuário → 403
  - Teste 3: Serviço não existe → 404

- [ ] **Teste DELETE /api/servicos/:id**
  - Teste 1: Proprietário → 200
  - Teste 2: Outro usuário → 403
  - Teste 3: Verificar que ficou ativo=0

**CHECKPOINT 2**:

- [x] GET /api/servicos funcionando
- [x] GET /api/servicos/:id funcionando
- [x] POST /api/servicos funcionando (apenas prestador)
- [x] PUT /api/servicos/:id funcionando
- [x] DELETE /api/servicos/:id funcionando (soft delete)
- [x] Categorias associadas corretamente
- [x] Paginação funcionando
- [x] Permissões por tipo de usuário OK

---

## 📅 SEMANA 3: AVALIAÇÕES

### DIA 6-7: Sistema de Avaliações

#### Passo 1: Controller de Avaliações (3h)

- [ ] **src/controllers/avaliacaoController.js** 🔴

  - `criarAvaliacao(req, res)` - POST /api/avaliacoes

    - Requer autenticação
    - Receber: id_servico, nota_preco, nota_tempo_execucao, nota_higiene, nota_educacao, comentario
    - Validar notas (1-5)
    - Verificar se serviço existe
    - Verificar limite de 1 avaliação por usuário (UNIQUE constraint)
    - Inserir em tb_avaliacao
    - **ATUALIZAR NOTA_MEDIA** em tb_servico
    - Teste: Criar avaliação → 201
    - Teste: Tentar avaliar 2x → erro
    - Teste: Verificar que nota_media foi atualizada

  - `obterAvaliacoesServico(req, res)` - GET /api/servicos/:id/avaliacoes

    - Listar todas as avaliações de um serviço
    - Ordenar por data DESC
    - Incluir nome do avaliador
    - Teste: /api/servicos/1/avaliacoes → lista com nomes

  - `minhasAvaliacoes(req, res)` - GET /api/avaliacoes/minhas

    - Requer autenticação
    - Listar avaliações que o usuário fez
    - Teste: Lista próprias avaliações

  - `avaliacoeReceibidas(req, res)` - GET /api/avaliacoes/recebidas

    - Requer autenticação + prestador
    - Listar avaliações recebidas nos seus serviços
    - Teste: Prestador vê suas avaliações

  - `editarAvaliacao(req, res)` - PUT /api/avaliacoes/:id

    - Requer ser o autor da avaliação
    - Atualizar notas e comentário
    - Recalcular nota_media do serviço
    - Teste: Editar própria avaliação → 200

  - `deletarAvaliacao(req, res)` - DELETE /api/avaliacoes/:id
    - Soft delete ou hard delete
    - Recalcular nota_media
    - Teste: Deletar → 200

#### Passo 2: Query Crítica - Recalcular Nota Média (1h)

- [ ] **Implementar função recalcularNotaMedia()** 🔴
  ```sql
  UPDATE tb_servico SET
    nota_media = (
      SELECT AVG((nota_preco + nota_tempo_execucao + nota_higiene + nota_educacao) / 4)
      FROM tb_avaliacao
      WHERE id_servico = ?
    ),
    total_avaliacoes = (
      SELECT COUNT(*) FROM tb_avaliacao WHERE id_servico = ?
    )
  WHERE id = ?;
  ```
  - Executar após CREATE, UPDATE, DELETE de avaliação
  - Teste: Criar 3 avaliações, verificar média

#### Passo 3: Rotas de Avaliações (1h)

- [ ] **src/routes/avaliacaoRoutes.js** 🔴
  ```javascript
  router.post(
    "/",
    verificarToken,
    validarDados(schemaAvaliacao),
    avaliacaoController.criarAvaliacao
  );
  router.get("/minhas", verificarToken, avaliacaoController.minhasAvaliacoes);
  router.get(
    "/recebidas",
    verificarToken,
    verificarPrestador,
    avaliacaoController.avaliacaoesRecebidas
  );
  router.put("/:id", verificarToken, avaliacaoController.editarAvaliacao);
  router.delete("/:id", verificarToken, avaliacaoController.deletarAvaliacao);
  ```

#### Passo 4: Testes Completos (2h)

- [ ] **Teste POST /api/avaliacoes**

  - Teste 1: Criar com notas válidas → 201
  - Teste 2: Nota fora de range (0 ou 6) → 400
  - Teste 3: Avaliar 2x → erro

- [ ] **Teste GET /api/servicos/:id/avaliacoes**

  - Teste 1: Lista avaliações com nomes
  - Teste 2: Verifica que nota_media foi calculada

- [ ] **Teste de Recálculo de Média** 🔴
  - Teste 1: Criar avaliação com nota 5 → nota_media = 5
  - Teste 2: Criar outra com nota 3 → nota_media = 4
  - Teste 3: Deletar uma → nota_media = 5 novamente
  - Resultado: Média sempre correta

**CHECKPOINT 3**:

- [x] POST /api/avaliacoes funcionando
- [x] GET /api/servicos/:id/avaliacoes funcionando
- [x] Nota média recalculada corretamente
- [x] Total de avaliações incrementado
- [x] Permissão de 1 avaliação por usuário
- [x] Testes de média passando

---

## 📅 SEMANA 4: INTEGRAÇÃO & TESTES

### DIA 8-9: Integração com Frontend

#### Passo 1: Atualizar API Config no Frontend (1h)

- [ ] **src/configuracao/api.js (Frontend)**
  ```javascript
  const API_BASE_URL = "http://localhost:3000/api";
  ```
  - Verificar se backend está rodando em 3000
  - Teste: Abrir console e tentar fetch

#### Passo 2: Testar Fluxo Completo (2h)

- [ ] **Fluxo 1: Registro → Login → Ver Serviços**

  - Teste 1: Registrar novo usuário
  - Teste 2: Fazer login
  - Teste 3: Verificar que token está em localStorage
  - Teste 4: Página inicial carrega serviços
  - Resultado: ✅ Fluxo completo OK

- [ ] **Fluxo 2: Prestador Cria Serviço**

  - Teste 1: Registrar como prestador
  - Teste 2: Clica em "Novo Serviço"
  - Teste 3: Preenche formulário
  - Teste 4: Verifica que foi criado no BD
  - Resultado: ✅ Serviço aparece na lista

- [ ] **Fluxo 3: Usuário Avalia Serviço**
  - Teste 1: Clica em um serviço
  - Teste 2: Deixa avaliação
  - Teste 3: Nota média é atualizada
  - Teste 4: Comentário aparece na lista
  - Resultado: ✅ Avaliação funciona

#### Passo 3: Debug de CORS (1h)

- [ ] **Se houver erro de CORS**
  - Verificar erro exato no console
  - Adicionar origin em backend CORS
  - Verificar método HTTP (GET, POST, etc)
  - Teste: Recarregar página

#### Passo 4: Teste de Segurança (1h)

- [ ] **Verificar Permissões**
  - Teste 1: Usuário comum tenta criar serviço → deve falhar
  - Teste 2: Usuário tenta editar serviço alheio → deve falhar
  - Teste 3: Sem token tenta acessar rota protegida → 401
  - Resultado: ✅ Permissões OK

**CHECKPOINT 4**:

- [x] Frontend + Backend integrados
- [x] Fluxo de autenticação completo
- [x] Fluxo de criação de serviço
- [x] Fluxo de avaliação
- [x] Sem erros de CORS
- [x] Permissões funcionando
- [x] Dados persistindo no BD

---

## 📅 SEMANA 5: APRIMORAMENTOS & DEPLOY

### DIA 10: Testes Finais

#### Passo 1: Testes Estruturados (2h)

- [ ] **Coleção Postman Completa**

  - 20+ testes criados
  - Todos passando (verde)
  - Coverage de erro (401, 403, 404, 400, 500)

- [ ] **Teste de Performance**

  - GET /api/servicos com 100+ registros
  - Deve retornar em < 500ms

- [ ] **Teste de Segurança**
  - SQL Injection em search
  - XSS em comentários
  - CSRF em POST/PUT/DELETE

#### Passo 2: Documentação (1h)

- [ ] **Atualizar README.md do Backend**

  ```markdown
  # ObraConnect Backend

  ## Setup
  ```

  npm install
  npm run dev

  ```

  ## Endpoints
  - POST /api/auth/registro
  - ...
  ```

#### Passo 3: Cleanup & Otimização (1h)

- [ ] **Remover console.log desnecessários**
- [ ] **Adicionar logging estruturado**
- [ ] **Verificar tratamento de erros em toda parte**

**CHECKPOINT 5**:

- [x] 100% dos endpoints testados
- [x] Documentação completa
- [x] Sem erros no console
- [x] Performance aceitável
- [x] Segurança validada
- [x] Pronto para produção

---

## 🎯 CHECKLIST FINAL

### Backend Completo ✅

- [ ] Autenticação com JWT
- [ ] CRUD de Usuários
- [ ] CRUD de Serviços
- [ ] CRUD de Avaliações
- [ ] CRUD de Categorias
- [ ] Permissões por tipo de usuário
- [ ] Validação robusta (Joi)
- [ ] Tratamento de erros
- [ ] CORS configurado
- [ ] Soft delete implementado
- [ ] Nota média recalculada
- [ ] Pool de conexões MySQL
- [ ] Variáveis de ambiente
- [ ] .gitignore correto
- [ ] Documentação
- [ ] Postman collection

### Frontend Integrado ✅

- [ ] Autenticação funcionando
- [ ] Listagem de serviços
- [ ] Detalhes de serviço
- [ ] Criar serviço (prestador)
- [ ] Editar serviço
- [ ] Deixar avaliação
- [ ] Ver histórico de avaliações
- [ ] Sem erros de CORS
- [ ] Token armazenado corretamente
- [ ] Logout limpa storage
- [ ] Fluxos completos testados

### Banco de Dados ✅

- [ ] 5 tabelas criadas
- [ ] Relacionamentos OK
- [ ] Dados iniciais inseridos
- [ ] Índices criados
- [ ] Backup feito
- [ ] Schema documentado

### Documentação ✅

- [ ] SUMARIO_EXECUTIVO.md
- [ ] ANALISE_COMPLETA_BACKEND.md
- [ ] GUIA_PRATICO_BACKEND.md
- [ ] FLUXOGRAMAS_SISTEMA.md
- [ ] README.md backend
- [ ] Postman collection

---

## 🚀 PRÓXIMAS FASES (FUTURO)

### Fase 2: Melhorias

- [ ] Upload de imagens (AWS S3)
- [ ] Sistema de chat
- [ ] Notificações email
- [ ] Dashboard para admin
- [ ] Relatórios
- [ ] Sistema de cupons
- [ ] Histórico de transações

### Fase 3: Produção

- [ ] Deploy em servidor (Heroku, DigitalOcean)
- [ ] Configurar HTTPS/SSL
- [ ] Monitoramento e logs
- [ ] Backup automático
- [ ] CI/CD pipeline
- [ ] Testes automatizados

### Fase 4: Scaling

- [ ] Cache Redis
- [ ] Message queue
- [ ] Microserviços
- [ ] Elasticsearch
- [ ] GraphQL API

---

## 📊 MÉTRICAS DE PROGRESSO

| Semana | Fase          | % Completo | Status          |
| ------ | ------------- | ---------- | --------------- |
| 1      | Setup + Auth  | 0%         | ⏳ Não iniciado |
| 2      | Serviços      | 0%         | ⏳ Não iniciado |
| 3      | Avaliações    | 0%         | ⏳ Não iniciado |
| 4      | Integração    | 0%         | ⏳ Não iniciado |
| 5      | Testes Finais | 0%         | ⏳ Não iniciado |

---

**Versão**: 1.0  
**Data**: 20 de janeiro de 2026  
**Tempo Total Estimado**: 18-25 horas
