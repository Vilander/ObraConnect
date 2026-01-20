# 🗄️ Estrutura do Banco de Dados MySQL

## Esquema de Tabelas

### 1. Tabela `usuarios`

Armazena informações dos usuários cadastrados no sistema.

```sql
CREATE TABLE usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  login VARCHAR(50) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL, -- Hash da senha
  nome_usuario VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  telefone VARCHAR(20),
  data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ultima_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2. Tabela `categorias`

Lista de categorias de serviços disponíveis (30 categorias).

```sql
CREATE TABLE categorias (
  id_categoria INT AUTO_INCREMENT PRIMARY KEY,
  nome_categoria VARCHAR(100) UNIQUE NOT NULL,
  descricao TEXT,
  ativo BOOLEAN DEFAULT TRUE,
  data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3. Tabela `servicos`

Informações sobre os serviços cadastrados pelos prestadores.

```sql
CREATE TABLE servicos (
  id_servico INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  nome_prestador VARCHAR(100) NOT NULL,
  desc_servico TEXT NOT NULL,
  imagem_url VARCHAR(500),
  telefone_contato VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  nota_media DECIMAL(3,2) DEFAULT 0.00,
  total_avaliacoes INT DEFAULT 0,
  ativo BOOLEAN DEFAULT TRUE,
  data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ultima_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  INDEX idx_nota_media (nota_media),
  INDEX idx_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 4. Tabela `servicos_categorias`

Tabela de relacionamento muitos-para-muitos entre serviços e categorias.

```sql
CREATE TABLE servicos_categorias (
  id_servico INT NOT NULL,
  id_categoria INT NOT NULL,
  data_associacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (id_servico, id_categoria),
  FOREIGN KEY (id_servico) REFERENCES servicos(id_servico) ON DELETE CASCADE,
  FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 5. Tabela `avaliacoes`

Avaliações feitas pelos usuários sobre os serviços contratados.

```sql
CREATE TABLE avaliacoes (
  id_avaliacao INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_servico INT NOT NULL,
  nota_preco INT NOT NULL CHECK (nota_preco BETWEEN 1 AND 5),
  nota_tempo_execucao INT NOT NULL CHECK (nota_tempo_execucao BETWEEN 1 AND 5),
  nota_higiene INT NOT NULL CHECK (nota_higiene BETWEEN 1 AND 5),
  nota_educacao INT NOT NULL CHECK (nota_educacao BETWEEN 1 AND 5),
  comentario TEXT,
  data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  FOREIGN KEY (id_servico) REFERENCES servicos(id_servico) ON DELETE CASCADE,
  UNIQUE KEY unique_usuario_servico (id_usuario, id_servico),
  INDEX idx_servico (id_servico)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 6. Tabela `favoritos`

Serviços favoritados pelos usuários.

```sql
CREATE TABLE favoritos (
  id_usuario INT NOT NULL,
  id_servico INT NOT NULL,
  data_favorito TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (id_usuario, id_servico),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  FOREIGN KEY (id_servico) REFERENCES servicos(id_servico) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 7. Tabela `contratacoes` (Opcional)

Registro de solicitações de contratação.

```sql
CREATE TABLE contratacoes (
  id_contratacao INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_servico INT NOT NULL,
  status ENUM('pendente', 'aceito', 'recusado', 'concluido', 'cancelado') DEFAULT 'pendente',
  mensagem TEXT,
  data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_resposta TIMESTAMP NULL,
  
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  FOREIGN KEY (id_servico) REFERENCES servicos(id_servico) ON DELETE CASCADE,
  INDEX idx_status (status),
  INDEX idx_usuario (id_usuario),
  INDEX idx_servico (id_servico)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 📊 Dados Iniciais para Categorias

```sql
INSERT INTO categorias (nome_categoria) VALUES
('Arquiteto(a)'),
('Armador(a) de Ferragens'),
('Azulejista / Pisagista'),
('Bombeiro(a) Hidráulico / Encanador(a)'),
('Calheiro(a)'),
('Carpinteiro(a)'),
('Desentupidor(a)'),
('Designer de Interiores'),
('Eletricista'),
('Engenheiro(a) Civil'),
('Gesseiro(a)'),
('Impermeabilizador(a)'),
('Instalador(a) de Ar Condicionado'),
('Instalador(a) de Drywall'),
('Instalador(a) de Gás'),
('Instalador(a) de Sistemas de Segurança'),
('Jardineiro(a) / Paisagista'),
('Limpador(a) Pós-Obra'),
('Marceneiro(a)'),
('Marido de Aluguel'),
('Mestre de Obras'),
('Montador(a) de Andaimes'),
('Montador(a) de Móveis'),
('Terraplanagem'),
('Pedreiro(a)'),
('Pintor(a)'),
('Serralheiro(a)'),
('Técnico(a) em Edificações'),
('Topógrafo(a)'),
('Vidraceiro(a)');
```

## 🔄 Triggers Úteis

### Trigger para atualizar nota média do serviço

```sql
DELIMITER //

CREATE TRIGGER atualizar_nota_media_insert
AFTER INSERT ON avaliacoes
FOR EACH ROW
BEGIN
  UPDATE servicos 
  SET 
    nota_media = (
      SELECT AVG((nota_preco + nota_tempo_execucao + nota_higiene + nota_educacao) / 4.0)
      FROM avaliacoes 
      WHERE id_servico = NEW.id_servico
    ),
    total_avaliacoes = (
      SELECT COUNT(*) 
      FROM avaliacoes 
      WHERE id_servico = NEW.id_servico
    )
  WHERE id_servico = NEW.id_servico;
END//

CREATE TRIGGER atualizar_nota_media_delete
AFTER DELETE ON avaliacoes
FOR EACH ROW
BEGIN
  UPDATE servicos 
  SET 
    nota_media = COALESCE((
      SELECT AVG((nota_preco + nota_tempo_execucao + nota_higiene + nota_educacao) / 4.0)
      FROM avaliacoes 
      WHERE id_servico = OLD.id_servico
    ), 0),
    total_avaliacoes = (
      SELECT COUNT(*) 
      FROM avaliacoes 
      WHERE id_servico = OLD.id_servico
    )
  WHERE id_servico = OLD.id_servico;
END//

DELIMITER ;
```

## 📝 Consultas SQL Úteis

### Buscar serviços com suas categorias

```sql
SELECT 
  s.id_servico,
  s.nome_prestador,
  s.desc_servico,
  s.imagem_url,
  s.nota_media,
  s.total_avaliacoes,
  s.telefone_contato,
  s.email,
  GROUP_CONCAT(c.nome_categoria SEPARATOR ', ') as categorias
FROM servicos s
LEFT JOIN servicos_categorias sc ON s.id_servico = sc.id_servico
LEFT JOIN categorias c ON sc.id_categoria = c.id_categoria
WHERE s.ativo = TRUE
GROUP BY s.id_servico
ORDER BY s.nota_media DESC;
```

### Buscar avaliações de um serviço específico

```sql
SELECT 
  a.id_avaliacao,
  a.nota_preco,
  a.nota_tempo_execucao,
  a.nota_higiene,
  a.nota_educacao,
  a.comentario,
  a.data_avaliacao,
  u.nome_usuario,
  ((a.nota_preco + a.nota_tempo_execucao + a.nota_higiene + a.nota_educacao) / 4.0) as nota_media
FROM avaliacoes a
INNER JOIN usuarios u ON a.id_usuario = u.id_usuario
WHERE a.id_servico = ?
ORDER BY a.data_avaliacao DESC;
```

### Buscar favoritos de um usuário

```sql
SELECT 
  s.id_servico,
  s.nome_prestador,
  s.desc_servico,
  s.imagem_url,
  s.nota_media,
  s.total_avaliacoes,
  GROUP_CONCAT(c.nome_categoria SEPARATOR ', ') as categorias
FROM favoritos f
INNER JOIN servicos s ON f.id_servico = s.id_servico
LEFT JOIN servicos_categorias sc ON s.id_servico = sc.id_servico
LEFT JOIN categorias c ON sc.id_categoria = c.id_categoria
WHERE f.id_usuario = ? AND s.ativo = TRUE
GROUP BY s.id_servico
ORDER BY f.data_favorito DESC;
```

### Buscar serviços por categoria

```sql
SELECT 
  s.id_servico,
  s.nome_prestador,
  s.desc_servico,
  s.nota_media,
  s.total_avaliacoes
FROM servicos s
INNER JOIN servicos_categorias sc ON s.id_servico = sc.id_servico
INNER JOIN categorias c ON sc.id_categoria = c.id_categoria
WHERE c.nome_categoria = ? AND s.ativo = TRUE
ORDER BY s.nota_media DESC;
```

### Buscar estatísticas de avaliações de um usuário

```sql
SELECT 
  COUNT(*) as total_avaliacoes,
  AVG((nota_preco + nota_tempo_execucao + nota_higiene + nota_educacao) / 4.0) as media_geral,
  AVG(nota_preco) as media_preco,
  AVG(nota_tempo_execucao) as media_tempo,
  AVG(nota_higiene) as media_higiene,
  AVG(nota_educacao) as media_educacao
FROM avaliacoes
WHERE id_usuario = ?;
```

## 🔐 Índices para Otimização

```sql
-- Índices já definidos nas tabelas acima, mas aqui está um resumo:

-- Tabela servicos
CREATE INDEX idx_usuario ON servicos(id_usuario);
CREATE INDEX idx_nota_media ON servicos(nota_media);
CREATE INDEX idx_ativo ON servicos(ativo);

-- Tabela avaliacoes
CREATE INDEX idx_servico ON avaliacoes(id_servico);
CREATE INDEX idx_usuario ON avaliacoes(id_usuario);

-- Tabela favoritos (PKs já funcionam como índices)
-- Tabela servicos_categorias (PKs já funcionam como índices)
```

## 🚀 Script de Criação Completo

Para criar todas as tabelas de uma vez:

```sql
-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS obraconnect_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE obraconnect_db;

-- [Cole aqui todas as definições de tabelas na ordem correta]
-- 1. usuarios
-- 2. categorias
-- 3. servicos
-- 4. servicos_categorias
-- 5. avaliacoes
-- 6. favoritos
-- 7. contratacoes

-- [Insira as categorias]

-- [Crie os triggers]
```

## 📦 Backup e Restauração

### Criar backup
```bash
mysqldump -u usuario -p obraconnect_db > backup_obraconnect.sql
```

### Restaurar backup
```bash
mysql -u usuario -p obraconnect_db < backup_obraconnect.sql
```

---

**Nota**: Certifique-se de usar senhas fortes e criptografadas (bcrypt) para a coluna `senha` na tabela `usuarios`.
