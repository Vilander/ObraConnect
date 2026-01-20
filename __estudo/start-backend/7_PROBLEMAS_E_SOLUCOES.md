# ⚠️ PROBLEMAS ENCONTRADOS E SOLUÇÕES

## 📍 PROBLEMAS NO BANCO DE DADOS

### 1. ❌ SHA-256 em vez de bcryptjs (CRÍTICO)

**Problema:**

- Banco usa SHA-256 para armazenar senhas
- SHA-256 é MD-based, não é ideal para senhas
- Sem salt adequado é vulnerável

**Impacto:**

- 🔴 Risco de segurança alto
- Senhas podem ser quebradas com rainbow tables

**Solução Recomendada:**

```javascript
// NÃO FAÇA:
const hash = crypto.createHash("sha256").update(senha).digest("hex");

// FAÇA:
const bcrypt = require("bcryptjs");
const hash = await bcrypt.hash(senha, 10);
```

**Implementação:**

- Use bcryptjs no authController.js
- Senhas antigas serão "perdidas" (força reset)
- Ou migre com função de conversão

**Status**: ✅ Será corrigido no backend (não altere BD)

---

### 2. ❌ Duplicação de Dados (email/telefone)

**Problema:**

```sql
-- Dados duplicados em:
tb_usuario: email, telefone
tb_servico: email, telefone_contato
```

**Impacto:**

- 🟡 Redundância aumenta chance de inconsistência
- Se usuário muda email, serviço fica com email antigo

**Soluções:**

**Opção A: Remover de tb_servico (recomendado)**

```sql
ALTER TABLE tb_servico DROP COLUMN email;
ALTER TABLE tb_servico DROP COLUMN telefone_contato;

-- Use do tb_usuario via JOIN
SELECT u.email, u.telefone FROM tb_servico s
JOIN tb_usuario u ON s.id_usuario = u.id;
```

**Opção B: Manter flexibilidade**

```sql
-- Deixar as colunas, aceitar que podem diferir
-- Útil se prestador quer email diferente para comercial
```

**Recomendação**: Opção A (mais limpo)

**Status**: 🟡 Considere migrar, não crítico

---

### 3. ❌ Sem Soft Delete

**Problema:**

```sql
-- Quando deletar, os dados sumirem:
DELETE FROM tb_servico WHERE id = 1;
```

**Impacto:**

- 🟡 Sem auditoria
- Impossível recuperar
- Avaliações ficam órfãs

**Solução:**

```sql
-- Adicionar coluna ativo
ALTER TABLE tb_servico ADD COLUMN ativo TINYINT(1) DEFAULT 1;
ALTER TABLE tb_usuario ADD COLUMN ativo TINYINT(1) DEFAULT 1;
ALTER TABLE tb_avaliacao ADD COLUMN ativo TINYINT(1) DEFAULT 1;

-- Sempre filtrar:
SELECT * FROM tb_servico WHERE ativo = 1;

-- "Deletar" = desativar:
UPDATE tb_servico SET ativo = 0 WHERE id = 1;
```

**Status**: ✅ Será implementado no backend

---

### 4. ❌ Sem Limite de 1 Avaliação por Usuário

**Problema:**

```sql
-- Um usuário pode avaliar 10x o mesmo serviço:
INSERT INTO tb_avaliacao (...) VALUES (...); -- 1ª vez OK
INSERT INTO tb_avaliacao (...) VALUES (...); -- 2ª vez OK (BUG!)
```

**Impacto:**

- 🔴 Nota média pode ser manipulada
- Um usuário bota 100 notas 5 e estraga média

**Solução BD:**

```sql
-- Adicionar UNIQUE constraint:
ALTER TABLE tb_avaliacao
ADD UNIQUE INDEX uk_usuario_servico (id_usuario, id_servico);

-- Agora retorna erro 1062 (DUPLICATE ENTRY) na 2ª tentativa
```

**Solução Backend:**

```javascript
try {
  await conexao.execute("INSERT INTO tb_avaliacao ...");
} catch (erro) {
  if (erro.code === "ER_DUP_ENTRY") {
    return res.status(409).json({
      sucesso: false,
      mensagem: "Você já avaliou este serviço",
    });
  }
}
```

**Status**: ✅ Será implementado no backend + BD

---

## 📍 PROBLEMAS NO FRONTEND

### 5. ❌ Nenhuma Integração com API

**Problema:**

- Frontend usa apenas localStorage
- 0 endpoints implementados
- Sem comunicação com backend

**Impacto:**

- 🔴 Não funciona sem backend
- Dados não persistem
- Login apenas visual

**Solução:**

- Implementar backend (este projeto)
- Atualizar configuração API (EXEMPLOS_API.md)
- Testar integração completa

**Status**: 🟡 Aguardando backend

---

### 6. ❌ Sem Tratamento de Erros de Rede

**Problema:**

```javascript
// Sem try/catch:
const res = await fetch(...);
const data = res.json(); // Se falhar, app quebra
```

**Solução:**

```javascript
try {
  const res = await fetch(...);
  if (!res.ok) throw new Error('Erro na API');
  const data = await res.json();
} catch (erro) {
  console.error('Erro:', erro);
  mostrarMensagemErro('Falha na conexão');
}
```

**Status**: 🟡 Melhorias futuras

---

## 📍 PROBLEMAS NA ARQUITETURA

### 7. ⚠️ Sem Autenticação Real

**Problema:**

```javascript
// Frontend localStorage apenas:
localStorage.setItem('usuario', JSON.stringify({...}));
// Qualquer um pode alterar localStorage
```

**Impacto:**

- 🔴 Usuário pode se passar por outro
- Dados de perfil podem ser falsificados

**Solução:**

- Implementar JWT no backend
- Frontend apenas armazena token
- Backend valida token em cada requisição

**Status**: ✅ Será implementado

---

### 8. ⚠️ Sem Validação no Backend

**Problema:**

```javascript
// Se alguém enviar dados inválidos:
POST /api/servicos
{
  "nota_media": -999,  // Válido?
  "email": "não_é_email",  // Válido?
  "categorias": "texto"  // Array esperado
}
// Pode corromper dados
```

**Solução:**

- Usar Joi para validação
- Rejeitar dados inválidos com 400
- Nunca confiar em entrada

**Status**: ✅ Será implementado

---

## 📍 PROBLEMAS DE SEGURANÇA

### 9. 🔴 SQL Injection Potencial

**Problema:**

```javascript
// Perigoso:
const query = `SELECT * FROM tb_usuario WHERE login = '${login}'`;
conexao.execute(query);

// Se login = "'; DROP TABLE tb_usuario; --"
// Comando se torna: SELECT * FROM tb_usuario WHERE login = ''; DROP TABLE tb_usuario; --'
```

**Solução:**

```javascript
// Seguro (usar placeholders):
const [usuarios] = await conexao.execute(
  "SELECT * FROM tb_usuario WHERE login = ?",
  [login] // Parâmetro separado
);
```

**Status**: ✅ Será implementado com mysql2

---

### 10. 🔴 XSS (Cross-Site Scripting)

**Problema:**

```javascript
// Salvar comentário sem sanitizar:
const comentario = "<script>alert('XSS')</script>";
INSERT INTO tb_avaliacao (..., comentario) VALUES (..., ?);

// Se retornar e renderizar sem escape:
<p>{comentario}</p>  // Script pode executar
```

**Solução:**

```javascript
// React já escapa por padrão:
<p>{comentario}</p>; // React converte em string

// Ou sanitizar explicitamente:
const sanitizado = DOMPurify.sanitize(comentario);
```

**Status**: ✅ React protege, mas backend deve validar

---

## 📍 PROBLEMAS DE PERFORMANCE

### 11. ⚠️ Sem Paginação

**Problema:**

```sql
SELECT * FROM tb_servico;  -- Se tiver 100k registros = lento
```

**Impacto:**

- 🟡 Página carrega lentamente
- Alto uso de memória/banda

**Solução:**

```sql
SELECT * FROM tb_servico
WHERE ativo = 1
LIMIT 10 OFFSET 0;  -- Página 1, 10 itens

-- Página 2:
LIMIT 10 OFFSET 10;
```

**Status**: ✅ Será implementado

---

### 12. ⚠️ Sem Índices Adequados

**Problema:**

```sql
-- Queries lentas sem índices:
SELECT * FROM tb_servico WHERE id_usuario = 5;  -- FULL TABLE SCAN
```

**Solução:**

```sql
-- Adicionar índices:
CREATE INDEX idx_servico_usuario ON tb_servico(id_usuario);
CREATE INDEX idx_avaliacao_servico ON tb_avaliacao(id_servico);
CREATE INDEX idx_usuario_login ON tb_usuario(login);
```

**Status**: 🟡 Considere depois

---

## 📊 MATRIZ DE SEVERIDADE

| #   | Problema             | Severidade | Impacto     | Quando Resolver |
| --- | -------------------- | ---------- | ----------- | --------------- |
| 1   | SHA-256              | 🔴 CRÍTICA | Segurança   | Imediatamente   |
| 2   | Duplicação           | 🟡 ALTA    | Manutenção  | Semana 1        |
| 3   | Sem Soft Delete      | 🟡 ALTA    | Auditoria   | Semana 1        |
| 4   | Sem limite Avaliação | 🔴 CRÍTICA | Dados       | Semana 1        |
| 5   | Sem API              | 🔴 CRÍTICA | Funcional   | Agora           |
| 6   | Sem error handling   | 🟡 ALTA    | UX          | Semana 2        |
| 7   | Sem autenticação     | 🔴 CRÍTICA | Segurança   | Agora           |
| 8   | Sem validação        | 🔴 CRÍTICA | Segurança   | Agora           |
| 9   | SQL Injection        | 🔴 CRÍTICA | Segurança   | Agora           |
| 10  | XSS                  | 🟡 ALTA    | Segurança   | Semana 2        |
| 11  | Sem paginação        | 🟡 ALTA    | Performance | Semana 2        |
| 12  | Sem índices          | 🟢 NORMAL  | Performance | Semana 3        |

---

## ✅ PLANO DE AÇÃO

### ANTES DE COMEÇAR

- [x] Ler este documento
- [x] Entender problemas
- [x] Planejar soluções

### SEMANA 1 (CRÍTICO)

- [ ] **Corrigir #1**: Usar bcryptjs em vez de SHA-256
- [ ] **Corrigir #4**: Adicionar UNIQUE(id_usuario, id_servico)
- [ ] **Corrigir #5-9**: Implementar backend com validação
- [ ] **Corrigir #7**: Autenticação JWT

### SEMANA 2 (IMPORTANTE)

- [ ] **Corrigir #2**: Considerar remover duplicação
- [ ] **Corrigir #3**: Adicionar soft delete
- [ ] **Corrigir #6**: Tratamento de erros
- [ ] **Corrigir #10**: Escapar dados (já faz React)

### SEMANA 3+ (OTIMIZAÇÃO)

- [ ] **Corrigir #11**: Implementar paginação
- [ ] **Corrigir #12**: Adicionar índices
- [ ] Monitoring
- [ ] Backup

---

## 🧪 COMO VERIFICAR CORREÇÕES

### Após Implementar Autenticação

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login": "pedro_eng", "senha": "123456"}'

# Deve retornar:
# ✅ Token JWT (não SHA-256)
# ✅ Usuário info
# ❌ Nunca a senha
```

### Após Adicionar UNIQUE

```bash
# Tentar avaliar 2x:
curl -X POST http://localhost:3000/api/avaliacoes \
  -H "Authorization: Bearer TOKEN" \
  -d '{...}'

# 1ª vez: 201 Created ✅
# 2ª vez: 409 Conflict ✅ (não 201)
```

### Após Implementar Validação

```bash
# Enviar email inválido:
curl -X POST http://localhost:3000/api/auth/registro \
  -d '{"email": "não_é_email"}'

# Deve retornar: 400 Bad Request ✅
```

---

## 📞 DÚVIDAS FREQUENTES

**P: Preciso corrigir SHA-256 antes de começar?**  
R: Não, o novo backend usará bcryptjs. Senhas antigas ficarão inativas.

**P: Qual problema é mais urgente?**  
R: Todos os 🔴 críticos. Comece com #5 (implementar backend).

**P: Posso ignorar alguns problemas?**  
R: Não recomendo. Todos afetam produção. Veja matriz de severidade.

**P: Quanto tempo para corrigir tudo?**  
R: 18-25 horas para implementação completa. Veja ROADMAP_DETALHADO.md

---

## 🔧 FERRAMENTAS PARA DEBUG

### Verificar Query SQL

```sql
EXPLAIN SELECT * FROM tb_servico WHERE id_usuario = 5;
-- Mostra se usa índice ou full scan
```

### Ver Plano de Execução

```sql
EXPLAIN EXTENDED SELECT * FROM tb_servico;
```

### Monitorar Conexões MySQL

```sql
SHOW PROCESSLIST;
-- Vê queries rodando
```

### Check Constraints

```sql
SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_NAME = 'tb_avaliacao' AND COLUMN_NAME = 'id_usuario';
```

---

**Documento de Problemas**  
**Versão**: 1.0  
**Data**: 20 de janeiro de 2026  
**Status**: Todos os problemas têm solução mapeada
