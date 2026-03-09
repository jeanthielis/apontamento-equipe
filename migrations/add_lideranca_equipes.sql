-- Migração: Adicionar vínculos de liderança na tabela equipes
-- Execute este SQL no painel do Supabase > SQL Editor

-- Adiciona coluna para o Supervisor da equipe
ALTER TABLE equipes
ADD COLUMN IF NOT EXISTS supervisor_id UUID REFERENCES usuarios(id) ON DELETE SET NULL;

-- Adiciona coluna para o Coordenador da equipe
ALTER TABLE equipes
ADD COLUMN IF NOT EXISTS coordenador_id UUID REFERENCES usuarios(id) ON DELETE SET NULL;

-- Índices para melhorar performance das buscas por liderança
CREATE INDEX IF NOT EXISTS idx_equipes_supervisor ON equipes(supervisor_id);
CREATE INDEX IF NOT EXISTS idx_equipes_coordenador ON equipes(coordenador_id);

-- Comentários descritivos nas colunas
COMMENT ON COLUMN equipes.supervisor_id IS 'Referência ao usuário que é Supervisor desta equipe';
COMMENT ON COLUMN equipes.coordenador_id IS 'Referência ao usuário que é Coordenador desta equipe';
