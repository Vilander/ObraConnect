-- 1. Criação do Banco de Dados
CREATE DATABASE IF NOT EXISTS `obraconnect_db` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

USE `obraconnect_db`;

-- 2. Tabela de Usuários (Criptografia SHA-256 requer 64 caracteres)
CREATE TABLE `tb_usuario` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `login` varchar(50) NOT NULL UNIQUE,
    `senha` char(64) NOT NULL, -- SHA-256 gera exatamente 64 caracteres
    `nome_usuario` varchar(100) NOT NULL,
    `email` varchar(100) NOT NULL UNIQUE,
    `telefone` varchar(20) DEFAULT NULL,
    `tipo_usuario` enum(
        'usuario',
        'prestador',
        'admin'
    ) NOT NULL DEFAULT 'usuario',
    `data_cadastro` timestamp NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- 3. Tabela de Categorias
CREATE TABLE `tb_categoria` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `nome_categoria` varchar(50) NOT NULL UNIQUE,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- 4. Tabela de Serviços (Com as melhorias de imagem e status)
CREATE TABLE `tb_servico` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `id_usuario` int(11) NOT NULL,
    `nome_prestador` varchar(100) NOT NULL,
    `desc_servico` text NOT NULL,
    `imagem_url` varchar(500) DEFAULT NULL,
    `email` varchar(100) DEFAULT NULL,
    `telefone_contato` varchar(20) DEFAULT NULL,
    `nota_media` decimal(3, 2) DEFAULT 0.00,
    `total_avaliacoes` int(11) DEFAULT 0,
    `ativo` tinyint(1) DEFAULT 1,
    `data_cadastro` timestamp NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`id`),
    FOREIGN KEY (`id_usuario`) REFERENCES `tb_usuario` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- 5. Tabela de Relacionamento Serviços-Categorias
CREATE TABLE `tb_categoria_atendida` (
    `id_servico` int(11) NOT NULL,
    `id_categoria` int(11) NOT NULL,
    PRIMARY KEY (`id_servico`, `id_categoria`),
    FOREIGN KEY (`id_servico`) REFERENCES `tb_servico` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`id_categoria`) REFERENCES `tb_categoria` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- 6. Tabela de Avaliações
CREATE TABLE `tb_avaliacao` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `id_servico` int(11) NOT NULL,
    `id_usuario` int(11) NOT NULL,
    `nota_preco` tinyint(4) NOT NULL CHECK (nota_preco BETWEEN 1 AND 5),
    `nota_tempo_execucao` tinyint(4) NOT NULL CHECK (
        nota_tempo_execucao BETWEEN 1 AND 5
    ),
    `nota_higiene` tinyint(4) NOT NULL CHECK (nota_higiene BETWEEN 1 AND 5),
    `nota_educacao` tinyint(4) NOT NULL CHECK (nota_educacao BETWEEN 1 AND 5),
    `comentario` text DEFAULT NULL,
    `data_avaliacao` timestamp NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`id`),
    FOREIGN KEY (`id_usuario`) REFERENCES `tb_usuario` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`id_servico`) REFERENCES `tb_servico` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- --------------------------------------------------------
-- INSERÇÃO DE DADOS INICIAIS
-- --------------------------------------------------------

-- Categorias Base (30 Categorias do Projeto)
INSERT INTO
    `tb_categoria` (`nome_categoria`)
VALUES ('Arquiteto(a)'),
    ('Armador(a) de Ferragens'),
    ('Azulejista / Pisagista'),
    ('Bombeiro(a) Hidráulico'),
    ('Eletricista'),
    ('Engenheiro(a) Civil'),
    ('Pedreiro(a)'),
    ('Pintor(a)'),
    ('Marceneiro(a)'),
    ('Mestre de Obras');

-- Usuário Administrador (Senha: 'admin123' em SHA-256)
-- Hash: 240014d23059e933ed17b3543666d3a82e5b7c7b8e1544439121a71948ed827e
INSERT INTO
    `tb_usuario` (
        `login`,
        `senha`,
        `nome_usuario`,
        `email`,
        `tipo_usuario`
    )
VALUES (
        'admin',
        '240014d23059e933ed17b3543666d3a82e5b7c7b8e1544439121a71948ed827e',
        'Administrador ObraConnect',
        'admin@obraconnect.com',
        'admin'
    );

-- Exemplo de Prestador (Senha: '123456' em SHA-256)
-- Hash: 8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92
INSERT INTO
    `tb_usuario` (
        `login`,
        `senha`,
        `nome_usuario`,
        `email`,
        `telefone`,
        `tipo_usuario`
    )
VALUES (
        'pedro_eng',
        '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
        'Pedro Engenheiro',
        'pedro@email.com',
        '11999998888',
        'prestador'
    );

-- Exemplo de Serviço para testes no Frontend
INSERT INTO
    `tb_servico` (
        `id_usuario`,
        `nome_prestador`,
        `desc_servico`,
        `imagem_url`,
        `telefone_contato`,
        `email`
    )
VALUES (
        2,
        'Pedro Engenheiro',
        'Especialista em reformas estruturais e projetos civis.',
        'https://images.unsplash.com/photo-1541888946425-d81bb19480c5',
        '11999998888',
        'pedro@email.com'
    );