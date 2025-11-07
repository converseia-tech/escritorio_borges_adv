-- Migration: Create about_page table
-- Created: 2025-11-06
-- Description: Nova tabela para gerenciar a página completa "Sobre Nós" com hero section e história

CREATE TABLE IF NOT EXISTS about_page (
  id SERIAL PRIMARY KEY,
  hero_title VARCHAR(200) NOT NULL DEFAULT 'Sobre nós',
  hero_background_image TEXT,
  history_title VARCHAR(200) NOT NULL DEFAULT 'Conheça nossa história',
  history_subtitle VARCHAR(300),
  history_content TEXT NOT NULL,
  history_image TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Inserir registro padrão
INSERT INTO about_page (
  hero_title,
  history_title,
  history_content
) VALUES (
  'Sobre nós',
  'Borges Advogados Associados',
  '<p>O escritório Borges Advogados Associados, atua com uma equipe de advogados experientes nas principais áreas do Direito.</p>

<p>Acreditamos numa advocacia moderna e que caminha junto com seu cliente. O sucesso está no trabalho árduo, incansável e inconformado. Estamos presentes na luta e pelos direitos de nossos clientes.</p>

<p>Fundado com o objetivo de oferecer serviços jurídicos de excelência, nosso escritório de advocacia alia seriedade, competência, compromisso com prazos, empatia e confiança para atender às necessidades de nossos clientes. Com foco em fraudes bancárias e atuação nas áreas de direito civil, direito de família e sucessões, direito trabalhista, direito do consumidor e direito previdenciário, somos guiados pela busca constante por soluções inovadoras e eficazes, valorizando a ética e a transparência em todas as nossas ações.</p>

<p>Sediado na cidade de Criciúma-SC desde 2018, nosso escritório conta com a expertise do advogado Lucas Borges, além de uma equipe de advogados altamente qualificados e dedicados a enfrentar os mais diversos desafios jurídicos. Juntos, compartilhamos a visão de um atendimento personalizado, pautado na empatia e na compreensão das particularidades de cada caso.</p>

<p>Nosso compromisso com prazos é uma das características que nos diferencia no mercado, pois entendemos que o tempo é um fator crucial para o sucesso de nossos clientes. A confiança é a base para o estabelecimento de relações duradouras e, por isso, prezamos pela integridade e sigilo das informações compartilhadas conosco.</p>

<p>Convidamos você a conhecer nosso escritório e nossa equipe, e a descobrir como podemos auxiliar na resolução de suas demandas jurídicas.</p>'
);
