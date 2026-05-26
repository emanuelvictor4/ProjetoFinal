-- phpMyAdmin SQL Dump
-- version 4.2.11
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 19-Set-2017 às 20:07
-- Versão do servidor: 5.6.21
-- PHP Version: 5.6.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `unisale`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `usuarios`
--


CREATE TABLE IF NOT EXISTS `usuarios` (
`idusuarios` int(10) unsigned NOT NULL,
  `cpf` varchar(11) DEFAULT NULL,
  `nome` varchar(40) DEFAULT NULL,
  `celular` varchar(32) DEFAULT NULL,
  `email` varchar(32) DEFAULT NULL,
  `login` varchar(60) NOT NULL,
  `senha` varchar(32) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `feedbacks` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `idusuario` int(10) unsigned NOT NULL,
  `nome` varchar(40) NOT NULL,
  `mensagem` text NOT NULL,
  `nota` tinyint(1) NOT NULL,
  `criado_em` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`idusuario`) REFERENCES `usuarios`(`idusuarios`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `usuarios`
--

INSERT INTO `usuarios` (`idusuarios`, `cpf`, `nome`, `celular`, `email`, `login`, `senha`) VALUES
(1, '12345678901', 'admin', '(18)989897766', 'admin@gmail.com.br', 'admin@gmail.com.br', md5('1234'));

--
-- Indexes for dumped tables
--

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
 ADD PRIMARY KEY (`idusuarios`), ADD UNIQUE KEY `login` (`login`), ADD KEY `documento` (`cpf`), ADD KEY `endemail` (`email`), ADD KEY `login_2` (`login`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
MODIFY `idusuarios` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=9;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
