import { supabase } from './supabase'

export const checkPermission = async (moduloSlug) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  // 1. Busca o perfil e o cargo do usuário logado
  const { data: perfil } = await supabase
    .from('usuarios')
    .select('nivel_id, niveis_acesso(nome)')
    .eq('id', user.id)
    .single()

  // Se o cara não tem nível nenhum, barra na hora
  if (!perfil || !perfil.nivel_id) return false

  // 2. Se o cara for 'Super Admin', ele tem a chave mestre da fábrica, entra em tudo!
  if (perfil.niveis_acesso?.nome === 'Super Admin') return true

  // 3. Se for outro cargo, verifica se ele tem o carimbo (permissão) específico
  const { data: permissao } = await supabase
    .from('permissoes_acesso')
    .select('*')
    .eq('nivel_id', perfil.nivel_id)
    .eq('modulo_slug', moduloSlug)
    .single()

  // Retorna true se achou a permissão, false se não achou
  return !!permissao
}