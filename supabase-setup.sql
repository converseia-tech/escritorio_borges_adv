-- =====================================================
-- SQL SETUP COMPLETO PARA SUPABASE (PostgreSQL)
-- Borges Advogados Associados
-- =====================================================

-- Remover tabelas existentes (cuidado em produção!)
DROP TABLE IF EXISTS blogs CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS contact_info CASCADE;
DROP TABLE IF EXISTS about_content CASCADE;
DROP TABLE IF EXISTS associated_lawyers CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS practice_areas CASCADE;
DROP TABLE IF EXISTS hero_content CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Criar tabela de usuários
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  open_id VARCHAR(64) NOT NULL UNIQUE,
  name TEXT,
  email VARCHAR(320),
  login_method VARCHAR(64),
  role VARCHAR(20) DEFAULT 'user' NOT NULL CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  last_signed_in TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Criar índice para open_id
CREATE INDEX idx_users_openid ON users(open_id);

-- =====================================================
-- TABELA: hero_content
-- =====================================================
CREATE TABLE hero_content (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL DEFAULT 'Borges Advogados Associados',
  subtitle TEXT NOT NULL DEFAULT 'Transformando desafios jurídicos complexos em soluções eficazes e personalizadas',
  cta_text VARCHAR(100) DEFAULT 'ENTRE EM CONTATO',
  cta_link VARCHAR(255) DEFAULT '/#contato',
  background_image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Inserir dados padrão
INSERT INTO hero_content (title, subtitle, cta_text, cta_link)
VALUES (
  'Borges Advogados Associados',
  'Transformando desafios jurídicos complexos em soluções eficazes e personalizadas',
  'ENTRE EM CONTATO',
  '/#contato'
);

-- =====================================================
-- TABELA: practice_areas
-- =====================================================
CREATE TABLE practice_areas (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  detailed_content TEXT,
  featured_image TEXT,
  icon VARCHAR(50) DEFAULT 'briefcase',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Criar índice para slug
CREATE INDEX idx_practice_areas_slug ON practice_areas(slug);

-- Inserir áreas de atuação padrão
INSERT INTO practice_areas (title, slug, description, detailed_content, icon, display_order) VALUES
('Bancário - FRAUDES', 'bancario-fraudes', 
  'RMC e Empréstimos Consignados: Para entender melhor, RMC significa Reserva de Margem Consignável, relacionada a fraudes bancárias...', 
  'O Direito Bancário trata das fraudes envolvendo RMC (Reserva de Margem Consignável) e empréstimos consignados. Nosso escritório atua na defesa de vítimas de fraudes bancárias, buscando a restituição de valores indevidamente descontados e a reparação de danos morais.',
  'bank', 0),
('Família', 'familia', 
  'O Direito de Família aborda questões relacionadas a casamento, divórcio, guarda de filhos, pensão alimentícia, partilha de bens e...', 
  'O Direito de Família cuida das relações familiares, incluindo casamento, união estável, divórcio, guarda de filhos, pensão alimentícia, inventário e partilha de bens. Nossa equipe oferece atendimento humanizado e personalizado para resolver conflitos familiares da melhor forma possível.',
  'users', 1),
('Trabalhista', 'trabalhista', 
  'O Direito Trabalhista regula as relações entre empregadores e empregados, garantindo direitos como férias, 13º salário, FGTS...', 
  'O Direito Trabalhista protege os direitos dos trabalhadores, garantindo o cumprimento das normas trabalhistas como pagamento de salários, férias, 13º salário, FGTS, horas extras, adicional noturno, e indenizações por demissão sem justa causa. Atuamos tanto na defesa de empregados quanto de empregadores.',
  'briefcase', 2),
('Consumidor', 'consumidor', 
  'O Direito do Consumidor visa proteger os direitos e interesses dos consumidores em relações de consumo, garantindo qualidade, segurança e respeito aos...', 
  'O Direito do Consumidor protege os consumidores contra práticas abusivas, produtos defeituosos, serviços inadequados, cobranças indevidas, negativação irregular e propaganda enganosa. Lutamos para garantir seus direitos em relações de consumo.',
  'shopping-cart', 3),
('Previdenciário', 'previdenciario', 
  'O Direito Previdenciário trata das normas e princípios relacionados à Previdência Social, incluindo aposentadorias, pensões, auxílios e benefícios por...', 
  'O Direito Previdenciário garante o acesso aos benefícios previdenciários como aposentadorias (por idade, tempo de contribuição, invalidez), pensão por morte, auxílio-doença, auxílio-acidente, salário-maternidade, entre outros. Auxiliamos na concessão e revisão de benefícios do INSS.',
  'shield', 4);

-- =====================================================
-- TABELA: team_members
-- =====================================================
CREATE TABLE team_members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  bio TEXT,
  oab VARCHAR(50),
  image TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Inserir membros da equipe padrão
INSERT INTO team_members (name, position, oab, display_order) VALUES
('Lucas Borges Languer', 'Advogado Sócio Fundador e CEO', 'OAB/SC 40.598', 0),
('Patrícia Alves', 'Advogada Sócia Controladora', 'OAB/RS 37.731', 1),
('Eduarda Carpes', 'Advogada', 'OAB/SC 70.699', 2),
('Hemily Machado', 'Advogada', 'OAB/SC 68.234', 3),
('Milena Schoenell', 'Advogada', 'OAB/SC 71.456', 4),
('Débora Mendes', 'Advogada', 'OAB/SC 69.123', 5),
('Laura Garcia', 'Advogada', 'OAB/SC 72.890', 6),
('João Vitor Correa', 'Advogado', 'OAB/SC 70.234', 7),
('Bruno da Motta', 'Advogado', 'OAB/SC 68.901', 8),
('Ana Clara Borges', 'Estagiária', NULL, 9);

-- =====================================================
-- TABELA: associated_lawyers
-- =====================================================
CREATE TABLE associated_lawyers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  oab VARCHAR(50) NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Inserir advogados associados
INSERT INTO associated_lawyers (name, oab, display_order) VALUES
('Dra. Patrícia Alves', 'OAB/RS 37.731', 0),
('Dra. Eduarda Carpes', 'OAB/SC 70.699', 1);

-- =====================================================
-- TABELA: about_content
-- =====================================================
CREATE TABLE about_content (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL DEFAULT 'Borges Advogados Associados',
  subtitle VARCHAR(255) DEFAULT 'CONHEÇA NOSSA HISTÓRIA',
  content TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Inserir conteúdo sobre nós
INSERT INTO about_content (title, subtitle, content) VALUES (
  'Borges Advogados Associados',
  'CONHEÇA NOSSA HISTÓRIA',
  'O escritório Borges Advogados Associados, atua com uma equipe de advogados experientes nas principais áreas do Direito. Acreditamos numa advocacia moderna e que caminha junto com seu cliente. O sucesso de nossos clientes é o nosso sucesso.'
);

-- =====================================================
-- TABELA: contact_info
-- =====================================================
CREATE TABLE contact_info (
  id SERIAL PRIMARY KEY,
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(320),
  hours JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Inserir informações de contato
INSERT INTO contact_info (address, phone, email, hours) VALUES (
  'Rua Exemplo, 123 - Centro, Florianópolis - SC',
  '(48) 3333-4444',
  'contato@borgesadv.com.br',
  '{"Segunda-feira": "09:00 - 18:00", "Terça-feira": "09:00 - 18:00", "Quarta-feira": "09:00 - 18:00", "Quinta-feira": "09:00 - 18:00", "Sexta-feira": "09:00 - 17:00"}'::jsonb
);

-- =====================================================
-- TABELA: site_settings
-- =====================================================
CREATE TABLE site_settings (
  id SERIAL PRIMARY KEY,
  site_name VARCHAR(255) DEFAULT 'Borges Advogados Associados',
  logo_url TEXT,
  favicon_url TEXT,
  social_media JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Inserir configurações do site
INSERT INTO site_settings (site_name, social_media) VALUES (
  'Borges Advogados Associados',
  '{"instagram": "https://instagram.com/borgesadv", "facebook": "https://facebook.com/borgesadv", "whatsapp": "+5548999999999"}'::jsonb
);

-- =====================================================
-- TABELA: blogs
-- =====================================================
CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  author VARCHAR(255),
  published SMALLINT DEFAULT 0 CHECK (published IN (0, 1)),
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Criar índices
CREATE INDEX idx_blogs_slug ON blogs(slug);
CREATE INDEX idx_blogs_published ON blogs(published);

-- Inserir posts de blog padrão
INSERT INTO blogs (title, slug, content, excerpt, author, published, published_at) VALUES
(
  'Entenda seus direitos em casos de fraude bancária com RMC',
  'entenda-seus-direitos-fraude-bancaria-rmc',
  '<h2>O que é RMC (Reserva de Margem Consignável)?</h2>
<p>A RMC é uma modalidade de crédito que permite ao correntista utilizar uma margem já reservada em seu benefício, como INSS ou folha de pagamento, para contratar empréstimos de forma mais rápida.</p>

<h2>Como ocorrem as fraudes?</h2>
<p>Infelizmente, muitos aposentados e pensionistas têm sido vítimas de fraudes envolvendo a contratação indevida de empréstimos consignados através da RMC. Os golpes mais comuns incluem:</p>
<ul>
  <li>Contratação de empréstimos sem autorização do titular</li>
  <li>Utilização indevida de dados pessoais</li>
  <li>Descontos em benefícios sem conhecimento prévio</li>
  <li>Falsificação de assinaturas em contratos</li>
</ul>

<h2>Seus direitos</h2>
<p>Se você foi vítima de fraude bancária, você tem direito a:</p>
<ul>
  <li>Cancelamento imediato dos contratos fraudulentos</li>
  <li>Devolução integral dos valores descontados</li>
  <li>Indenização por danos morais</li>
  <li>Reparação pelos transtornos causados</li>
</ul>

<h2>Como o Borges Advogados pode ajudar</h2>
<p>Nossa equipe especializada em Direito Bancário atua na defesa de vítimas de fraudes, garantindo seus direitos e buscando a melhor solução para seu caso. Entre em contato conosco para uma consulta.</p>',
  'Saiba como identificar fraudes bancárias envolvendo RMC e conheça seus direitos. Nossa equipe está pronta para ajudar você a recuperar seus valores.',
  'Lucas Borges Languer',
  1,
  NOW() - INTERVAL '30 days'
),
(
  'Guia completo sobre pensão alimentícia: direitos e deveres',
  'guia-completo-pensao-alimenticia',
  '<h2>O que é pensão alimentícia?</h2>
<p>A pensão alimentícia é um valor pago mensalmente por um dos pais (ou ambos) para custear as despesas básicas dos filhos, como alimentação, moradia, educação, saúde e lazer.</p>

<h2>Quem tem direito?</h2>
<p>Têm direito à pensão alimentícia:</p>
<ul>
  <li>Filhos menores de idade</li>
  <li>Filhos maiores de idade em formação universitária (até 24 anos)</li>
  <li>Filhos com deficiência (sem limite de idade)</li>
  <li>Ex-cônjuge em casos específicos</li>
</ul>

<h2>Como é calculado o valor?</h2>
<p>O valor da pensão alimentícia é calculado com base em três critérios principais:</p>
<ul>
  <li><strong>Necessidade</strong> de quem recebe</li>
  <li><strong>Possibilidade</strong> de quem paga</li>
  <li><strong>Proporcionalidade</strong> entre ambos</li>
</ul>
<p>Geralmente, o valor gira em torno de 30% da renda líquida do alimentante quando há apenas um filho, podendo variar conforme o caso.</p>

<h2>Como solicitar pensão alimentícia?</h2>
<p>A solicitação deve ser feita através de uma ação judicial, onde será necessário comprovar:</p>
<ul>
  <li>Vínculo de parentesco (certidão de nascimento)</li>
  <li>Necessidades do alimentando</li>
  <li>Capacidade financeira do alimentante</li>
</ul>

<h2>Atraso no pagamento</h2>
<p>O não pagamento da pensão alimentícia pode resultar em:</p>
<ul>
  <li>Prisão civil (até 3 meses)</li>
  <li>Penhora de bens</li>
  <li>Desconto direto em folha de pagamento</li>
  <li>Protesto do nome</li>
</ul>

<h2>Conte com nossa ajuda</h2>
<p>O Borges Advogados Associados possui ampla experiência em casos de pensão alimentícia. Nossa equipe está pronta para orientar você em todas as etapas do processo.</p>',
  'Entenda tudo sobre pensão alimentícia: quem tem direito, como calcular o valor, como solicitar e o que fazer em caso de inadimplência.',
  'Patrícia Alves',
  1,
  NOW() - INTERVAL '25 days'
),
(
  'Direitos trabalhistas: o que você precisa saber ao ser demitido',
  'direitos-trabalhistas-demissao',
  '<h2>Tipos de demissão</h2>
<p>Existem diferentes tipos de rescisão de contrato de trabalho, cada uma com direitos específicos:</p>

<h3>Demissão sem justa causa</h3>
<p>Quando o empregador decide encerrar o contrato sem motivo grave. Neste caso, o trabalhador tem direito a:</p>
<ul>
  <li>Aviso prévio (trabalhado ou indenizado)</li>
  <li>Saldo de salário</li>
  <li>Férias vencidas + 1/3</li>
  <li>Férias proporcionais + 1/3</li>
  <li>13º salário proporcional</li>
  <li>Saque do FGTS + multa de 40%</li>
  <li>Seguro-desemprego</li>
</ul>

<h3>Demissão com justa causa</h3>
<p>Ocorre quando o empregado comete falta grave. Direitos:</p>
<ul>
  <li>Saldo de salário</li>
  <li>Férias vencidas + 1/3 (se houver)</li>
</ul>

<h3>Pedido de demissão</h3>
<p>Quando o próprio empregado decide sair. Direitos:</p>
<ul>
  <li>Saldo de salário</li>
  <li>Férias vencidas + 1/3</li>
  <li>Férias proporcionais + 1/3</li>
  <li>13º salário proporcional</li>
</ul>

<h2>Prazos para pagamento</h2>
<p>A empresa tem até 10 dias corridos após o término do contrato para pagar todas as verbas rescisórias. O não cumprimento deste prazo gera multa equivalente a um salário do trabalhador.</p>

<h2>Homologação</h2>
<p>Contratos com mais de 1 ano devem ser homologados no sindicato da categoria ou no Ministério do Trabalho.</p>

<h2>Quando procurar um advogado?</h2>
<p>Recomendamos buscar orientação jurídica quando:</p>
<ul>
  <li>A empresa não pagar as verbas rescisórias</li>
  <li>Houver dúvidas sobre os valores pagos</li>
  <li>A demissão por justa causa for injusta</li>
  <li>Existirem horas extras ou benefícios não pagos</li>
</ul>

<h2>Como podemos ajudar</h2>
<p>O escritório Borges Advogados Associados possui ampla experiência em Direito do Trabalho. Analisamos seu caso gratuitamente e buscamos garantir todos os seus direitos.</p>',
  'Saiba quais são seus direitos ao ser demitido, prazos para pagamento e quando é necessário procurar um advogado trabalhista.',
  'Eduarda Carpes',
  1,
  NOW() - INTERVAL '20 days'
),
(
  'Negativação indevida: como limpar seu nome e receber indenização',
  'negativacao-indevida-limpar-nome',
  '<h2>O que é negativação indevida?</h2>
<p>A negativação indevida ocorre quando seu nome é incluído em cadastros de proteção ao crédito (SPC, Serasa) sem que haja uma dívida real, ou quando os procedimentos legais não foram seguidos corretamente.</p>

<h2>Casos comuns de negativação indevida</h2>
<ul>
  <li>Dívida já paga mas não baixada</li>
  <li>Fraude ou roubo de identidade</li>
  <li>Dívida prescrita (mais de 5 anos)</li>
  <li>Negativação sem notificação prévia</li>
  <li>Cobrança de dívida não reconhecida</li>
  <li>Manutenção após acordo de pagamento</li>
</ul>

<h2>Seus direitos</h2>
<p>Quando você é vítima de negativação indevida, você tem direito a:</p>

<h3>1. Exclusão imediata do nome</h3>
<p>O primeiro passo é solicitar a retirada do seu nome dos cadastros negativos, o que pode ser feito através de notificação extrajudicial ou liminar judicial.</p>

<h3>2. Indenização por danos morais</h3>
<p>A negativação indevida gera dano moral presumido, ou seja, não é necessário comprovar prejuízo. Os valores de indenização variam geralmente entre R$ 5.000,00 e R$ 15.000,00, dependendo do caso.</p>

<h3>3. Indenização por danos materiais</h3>
<p>Se você conseguir comprovar prejuízos financeiros (como perda de negócio, juros pagos a mais, etc.), também pode receber indenização por danos materiais.</p>

<h2>Prazo de notificação</h2>
<p>Antes de negativar seu nome, a empresa DEVE:</p>
<ul>
  <li>Enviar notificação prévia ao consumidor</li>
  <li>Aguardar 10 dias após a notificação</li>
  <li>Informar o valor exato da dívida</li>
</ul>
<p>Se isso não foi feito, a negativação é irregular.</p>

<h2>Como proceder?</h2>
<ol>
  <li><strong>Consulte seu CPF</strong> nos sites do Serasa e SPC</li>
  <li><strong>Identifique</strong> as negativações indevidas</li>
  <li><strong>Reúna documentos</strong> (comprovantes de pagamento, extratos, etc.)</li>
  <li><strong>Procure um advogado</strong> especializado</li>
</ol>

<h2>Quanto tempo demora?</h2>
<p>Com medida judicial, é possível obter liminar para excluir o nome em poucos dias. O processo completo pode levar de 6 meses a 1 ano.</p>

<h2>Nossa atuação</h2>
<p>O Borges Advogados Associados é especialista em casos de negativação indevida. Oferecemos:</p>
<ul>
  <li>Análise gratuita do seu caso</li>
  <li>Ação rápida para limpar seu nome</li>
  <li>Busca pela maior indenização possível</li>
  <li>Acompanhamento até o final do processo</li>
</ul>',
  'Seu nome foi negativado injustamente? Saiba como limpar seu CPF rapidamente e ainda receber indenização por danos morais.',
  'Hemily Machado',
  1,
  NOW() - INTERVAL '15 days'
),
(
  'Aposentadoria por idade: requisitos e como solicitar',
  'aposentadoria-idade-requisitos',
  '<h2>O que é aposentadoria por idade?</h2>
<p>A aposentadoria por idade é um benefício previdenciário concedido aos trabalhadores que atingem determinada idade e cumprem o tempo mínimo de contribuição ao INSS.</p>

<h2>Requisitos após a Reforma da Previdência (2019)</h2>

<h3>Para homens:</h3>
<ul>
  <li><strong>Idade mínima:</strong> 65 anos</li>
  <li><strong>Tempo de contribuição:</strong> 15 anos (180 meses)</li>
</ul>

<h3>Para mulheres:</h3>
<ul>
  <li><strong>Idade mínima:</strong> 62 anos (regra de transição até 2023)</li>
  <li><strong>Tempo de contribuição:</strong> 15 anos (180 meses)</li>
</ul>

<h3>Trabalhadores rurais:</h3>
<ul>
  <li><strong>Homens:</strong> 60 anos</li>
  <li><strong>Mulheres:</strong> 55 anos</li>
  <li><strong>Comprovação:</strong> 15 anos de atividade rural</li>
</ul>

<h2>Como calcular o valor do benefício?</h2>
<p>O valor é calculado da seguinte forma:</p>
<ol>
  <li>Média de todos os salários desde julho/1994</li>
  <li>60% dessa média + 2% por ano que exceder 20 anos de contribuição (homens) ou 15 anos (mulheres)</li>
</ol>

<h3>Exemplo prático:</h3>
<p>Homem com 65 anos e 25 anos de contribuição:</p>
<ul>
  <li>Média salarial: R$ 3.000,00</li>
  <li>Base: 60% de R$ 3.000,00 = R$ 1.800,00</li>
  <li>Adicional: 5 anos acima de 20 x 2% = 10%</li>
  <li>Total: R$ 1.800,00 + 10% = R$ 1.980,00</li>
</ul>

<h2>Documentos necessários</h2>
<ul>
  <li>RG e CPF</li>
  <li>Comprovante de residência</li>
  <li>Carteira de trabalho</li>
  <li>Carnês de contribuição (se autônomo)</li>
  <li>Certidões de nascimento dos filhos (se houver)</li>
  <li>Certidão de casamento ou união estável</li>
</ul>

<h2>Como solicitar?</h2>
<p>O pedido pode ser feito:</p>
<ul>
  <li><strong>Pela internet:</strong> Site ou aplicativo Meu INSS</li>
  <li><strong>Por telefone:</strong> 135</li>
  <li><strong>Presencialmente:</strong> Agência do INSS (com agendamento prévio)</li>
</ul>

<h2>Prazo de análise</h2>
<p>O INSS tem até 45 dias para analisar o pedido. Caso seja negado, é possível recorrer administrativamente ou judicialmente.</p>

<h2>E se meu pedido foi negado?</h2>
<p>Muitos pedidos são negados indevidamente por:</p>
<ul>
  <li>Erro no cálculo do tempo de contribuição</li>
  <li>Não reconhecimento de períodos especiais</li>
  <li>Documentação incompleta</li>
  <li>Falhas sistêmicas do INSS</li>
</ul>

<h2>Como podemos ajudar</h2>
<p>O Borges Advogados Associados é especializado em Direito Previdenciário:</p>
<ul>
  <li>Análise completa do seu tempo de contribuição</li>
  <li>Auxílio no pedido administrativo</li>
  <li>Recurso de benefícios negados</li>
  <li>Revisão de aposentadorias com valores incorretos</li>
  <li>Ações judiciais contra o INSS</li>
</ul>

<p>Entre em contato conosco e agende uma consulta. Nossa equipe está pronta para garantir seus direitos previdenciários!</p>',
  'Entenda os requisitos para aposentadoria por idade após a Reforma da Previdência, como calcular o valor e como fazer o pedido no INSS.',
  'Lucas Borges Languer',
  1,
  NOW() - INTERVAL '10 days'
);

-- =====================================================
-- TRIGGERS PARA ATUALIZAR updated_at
-- =====================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger em todas as tabelas
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_hero_content_updated_at ON hero_content;
CREATE TRIGGER update_hero_content_updated_at BEFORE UPDATE ON hero_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_practice_areas_updated_at ON practice_areas;
CREATE TRIGGER update_practice_areas_updated_at BEFORE UPDATE ON practice_areas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_team_members_updated_at ON team_members;
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_associated_lawyers_updated_at ON associated_lawyers;
CREATE TRIGGER update_associated_lawyers_updated_at BEFORE UPDATE ON associated_lawyers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_about_content_updated_at ON about_content;
CREATE TRIGGER update_about_content_updated_at BEFORE UPDATE ON about_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_contact_info_updated_at ON contact_info;
CREATE TRIGGER update_contact_info_updated_at BEFORE UPDATE ON contact_info
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blogs_updated_at ON blogs;
CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON blogs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- CONCLUÍDO!
-- =====================================================
-- Todas as tabelas foram criadas com sucesso.
-- Você pode agora usar o painel administrativo para gerenciar o conteúdo.
