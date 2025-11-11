-- Migration: Adicionar tabela de configurações de chat
-- Created: 2025-11-11
-- Description: Adiciona tabela para gerenciar WhatsApp e scripts de chat personalizados

-- Criar tabela chat_settings
CREATE TABLE IF NOT EXISTS chat_settings (
  id SERIAL PRIMARY KEY,
  enabled SMALLINT NOT NULL DEFAULT 0,
  type VARCHAR(20) NOT NULL DEFAULT 'whatsapp',
  whatsapp_number VARCHAR(20),
  whatsapp_message TEXT,
  custom_script TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Inserir configuração padrão
INSERT INTO chat_settings (enabled, type, whatsapp_number, whatsapp_message)
VALUES (0, 'whatsapp', '', 'Olá! Gostaria de mais informações.')
ON CONFLICT DO NOTHING;

-- Verificar se a tabela foi criada
SELECT tablename FROM pg_tables WHERE tablename = 'chat_settings';
