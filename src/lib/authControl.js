import { supabase } from './supabase'

export const checkPermission = async (slug) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  // Busca o nível do usuário e as permissões dele
  const { data: perfil } = await supabase
    .from('usuarios')
    .select('nivel_id, niveis_acesso(nome)')
    .eq('id', user.id)
    .single()

  // Super Admin sempre acessa tudo
  if (perfil?.niveis_acesso?.nome === 'Super Admin') return true

  const { data: permissao } = await supabase
    .from('permissoes_acesso')
    .select('*')
    .eq('nivel_id', perfil.nivel_id)
    .eq('modulo_slug', slug)
    .single()

  return !!permissao
}