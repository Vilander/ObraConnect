-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Tempo de geração: 25/01/2026 às 17:59
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `obraconnect_db`
--
CREATE DATABASE IF NOT EXISTS `obraconnect_db` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `obraconnect_db`;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_avaliacao`
--

DROP TABLE IF EXISTS `tb_avaliacao`;
CREATE TABLE `tb_avaliacao` (
  `id` int(11) NOT NULL,
  `id_servico` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `nota_preco` tinyint(4) NOT NULL CHECK (`nota_preco` between 1 and 5),
  `nota_tempo_execucao` tinyint(4) NOT NULL CHECK (`nota_tempo_execucao` between 1 and 5),
  `nota_higiene` tinyint(4) NOT NULL CHECK (`nota_higiene` between 1 and 5),
  `nota_educacao` tinyint(4) NOT NULL CHECK (`nota_educacao` between 1 and 5),
  `comentario` text DEFAULT NULL,
  `data_avaliacao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `tb_avaliacao`
--

INSERT INTO `tb_avaliacao` (`id`, `id_servico`, `id_usuario`, `nota_preco`, `nota_tempo_execucao`, `nota_higiene`, `nota_educacao`, `comentario`, `data_avaliacao`) VALUES
(1, 1, 1, 5, 4, 5, 5, 'Excelente profissional, muito educado!', '2026-01-22 19:08:35'),
(2, 2, 1, 5, 4, 3, 4, 'Teste de avaliação', '2026-01-25 14:18:21'),
(3, 4, 3, 3, 4, 2, 4, 'ok', '2026-01-25 15:37:01');

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_categoria`
--

DROP TABLE IF EXISTS `tb_categoria`;
CREATE TABLE `tb_categoria` (
  `id` int(11) NOT NULL,
  `nome_categoria` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `tb_categoria`
--

INSERT INTO `tb_categoria` (`id`, `nome_categoria`) VALUES
(2, 'Armador(a) de Ferragens'),
(1, 'Arquiteto(a)'),
(3, 'Azulejista / Pisagista'),
(4, 'Bombeiro(a) Hidráulico / Encanador(a)'),
(5, 'Calheiro(a)'),
(6, 'Carpinteiro(a)'),
(7, 'Desentupidor(a)'),
(8, 'Designer de Interiores'),
(9, 'Eletricista'),
(10, 'Engenheiro(a) Civil'),
(11, 'Gesseiro(a)'),
(12, 'Impermeabilizador(a)'),
(13, 'Instalador(a) de Ar Condicionado'),
(14, 'Instalador(a) de Drywall'),
(15, 'Instalador(a) de Gás'),
(16, 'Instalador(a) de Sistemas de Segurança'),
(17, 'Jardineiro(a) / Paisagista'),
(18, 'Limpador(a) Pós-Obra'),
(19, 'Marceneiro(a)'),
(20, 'Marido de Aluguel'),
(21, 'Mestre de Obras'),
(22, 'Montador(a) de Andaimes'),
(23, 'Montador(a) de Móveis'),
(25, 'Pedreiro(a)'),
(26, 'Pintor(a)'),
(27, 'Serralheiro(a)'),
(28, 'Técnico(a) em Edificações'),
(24, 'Terraplanagem'),
(29, 'Topógrafo(a)'),
(30, 'Vidraceiro(a)');

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_categoria_atendida`
--

DROP TABLE IF EXISTS `tb_categoria_atendida`;
CREATE TABLE `tb_categoria_atendida` (
  `id_servico` int(11) NOT NULL,
  `id_categoria` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_servico`
--

DROP TABLE IF EXISTS `tb_servico`;
CREATE TABLE `tb_servico` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `titulo` varchar(100) DEFAULT NULL,
  `nome_prestador` varchar(100) NOT NULL,
  `desc_servico` text NOT NULL,
  `imagem_url` varchar(500) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefone_contato` varchar(20) DEFAULT NULL,
  `nota_media` decimal(3,2) DEFAULT 0.00,
  `total_avaliacoes` int(11) DEFAULT 0,
  `ativo` tinyint(1) DEFAULT 1,
  `data_cadastro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `tb_servico`
--

INSERT INTO `tb_servico` (`id`, `id_usuario`, `titulo`, `nome_prestador`, `desc_servico`, `imagem_url`, `email`, `telefone_contato`, `nota_media`, `total_avaliacoes`, `ativo`, `data_cadastro`) VALUES
(1, 1, NULL, 'Reforma Total - Promoção', 'Agora com pintura inclusa', 'http://nova-foto.com', NULL, NULL, 4.75, 1, 0, '2026-01-20 20:23:51'),
(2, 1, NULL, '\"Serviço com Foto\"', '\"Teste de upload\"', 'http://localhost:3001/uploads/1768948573443-image.png', NULL, NULL, 4.00, 1, 1, '2026-01-20 22:36:13'),
(3, 1, NULL, 'Arquiteto X', 'Arquiteto em americana', 'http://localhost:3001/uploads/1769351607699-casa.jpg', NULL, NULL, 0.00, 0, 1, '2026-01-25 14:33:27'),
(4, 4, 'Pedreiro', 'Pedreiro Jose Antonio', 'Pedreiro com experiencia', 'http://localhost:3001/uploads/1769355379648-casa.jpg', NULL, NULL, 3.25, 1, 1, '2026-01-25 15:36:19');

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_usuario`
--

DROP TABLE IF EXISTS `tb_usuario`;
CREATE TABLE `tb_usuario` (
  `id` int(11) NOT NULL,
  `login` varchar(50) NOT NULL,
  `senha` char(64) NOT NULL,
  `nome_usuario` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `tipo_usuario` varchar(50) NOT NULL DEFAULT 'usuario',
  `data_cadastro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `tb_usuario`
--

INSERT INTO `tb_usuario` (`id`, `login`, `senha`, `nome_usuario`, `email`, `telefone`, `tipo_usuario`, `data_cadastro`) VALUES
(1, 'admin', '$2b$10$tN8el4BhPZfAYtQSg/8XsOpOXSsmWT77fW2I0MK2BmX7yQ2VRW2Xe', 'Administrador', 'vilander.costa@gmail.com', '19993223509', 'admin', '2026-01-20 18:13:57'),
(2, 'josé', '$2b$10$f3uw0JbWIxIY3yP95/xUI.wncxJ/vgC0P/Ln/JotUHyvuR0Swlhna', 'josé', 'jose@email.com', NULL, 'usuario', '2026-01-22 19:39:12'),
(3, 'aline', '$2b$10$dOIh00LEeBu5lT38sm9Rueeo5nToldA1ppU9YNUcyKh.bJWobiTci', 'Aline Costa', 'aline@teste.com', NULL, 'usuario', '2026-01-25 14:28:43'),
(4, 'jose-antonio', '$2b$10$GyByPscflcANbpeOVSJr7ejBoGntNiCp6joyZFNNyZS1lmBIXwTEK', 'José Antonio', 'jose@teste.com', NULL, 'prestador', '2026-01-25 15:35:18');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `tb_avaliacao`
--
ALTER TABLE `tb_avaliacao`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_servico` (`id_servico`);

--
-- Índices de tabela `tb_categoria`
--
ALTER TABLE `tb_categoria`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nome_categoria` (`nome_categoria`);

--
-- Índices de tabela `tb_categoria_atendida`
--
ALTER TABLE `tb_categoria_atendida`
  ADD PRIMARY KEY (`id_servico`,`id_categoria`),
  ADD KEY `id_categoria` (`id_categoria`);

--
-- Índices de tabela `tb_servico`
--
ALTER TABLE `tb_servico`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Índices de tabela `tb_usuario`
--
ALTER TABLE `tb_usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `login` (`login`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `tb_avaliacao`
--
ALTER TABLE `tb_avaliacao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `tb_categoria`
--
ALTER TABLE `tb_categoria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT de tabela `tb_servico`
--
ALTER TABLE `tb_servico`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `tb_usuario`
--
ALTER TABLE `tb_usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `tb_avaliacao`
--
ALTER TABLE `tb_avaliacao`
  ADD CONSTRAINT `tb_avaliacao_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `tb_usuario` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tb_avaliacao_ibfk_2` FOREIGN KEY (`id_servico`) REFERENCES `tb_servico` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `tb_categoria_atendida`
--
ALTER TABLE `tb_categoria_atendida`
  ADD CONSTRAINT `tb_categoria_atendida_ibfk_1` FOREIGN KEY (`id_servico`) REFERENCES `tb_servico` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tb_categoria_atendida_ibfk_2` FOREIGN KEY (`id_categoria`) REFERENCES `tb_categoria` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `tb_servico`
--
ALTER TABLE `tb_servico`
  ADD CONSTRAINT `tb_servico_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `tb_usuario` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
