import Swal from 'sweetalert2'

// O "Toast" flutuante (canto superior direito) para avisos rápidos
export const toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3500,
  timerProgressBar: true,
  customClass: {
    popup: 'rounded-2xl shadow-xl border border-slate-200 font-sans'
  },
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer
    toast.onmouseleave = Swal.resumeTimer
  }
})

// O Alerta Central (Para fazer perguntas, pedir textos ou confirmar exclusões)
export const alerta = Swal.mixin({
  customClass: {
    popup: 'rounded-3xl shadow-2xl border border-slate-100 font-sans',
    confirmButton: 'bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors mx-2',
    cancelButton: 'bg-rose-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-rose-600 transition-colors mx-2',
    input: 'rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 px-4 py-3'
  },
  buttonsStyling: false // Desliga o estilo padrão feio do SweetAlert para usar o nosso Tailwind
})
//3. NOSSO TRADUTOR DE ERROS DO BANCO DE DADOS
export const traduzirErro = (error) => {
  if (!error) return "Ocorreu um erro inesperado."

  const msg = error.message || ""
  const code = error.code || ""

  // Tradução pelo Código do Erro (Mais preciso)
  if (code === '23505') return "Este cadastro já existe no sistema (Ex: Matrícula ou Nome duplicado)."
  if (code === '23503') return "Não é possível excluir, pois este item já está sendo usado em outro lugar (ex: DDS ou Diário)."
  if (code === '23514') return "Um dos valores preenchidos não é permitido pelo sistema."

  // Tradução por palavras-chave (Para erros de Autenticação/Login)
  if (msg.includes("duplicate key")) return "Este registro já está cadastrado."
  if (msg.includes("Invalid login credentials")) return "Email ou senha incorretos."
  if (msg.includes("User already registered")) return "Este email já possui cadastro."
  if (msg.includes("Password should be at least")) return "A senha é muito fraca (mínimo de 6 caracteres)."
  if (msg.includes("network")) return "Falha na conexão. Verifique sua internet."
  if (msg.includes("JWT")) return "Sua sessão expirou. Atualize a página e faça login novamente."

  // Se for um erro novo que não mapeamos, ele mostra uma mensagem genérica
  return "Ocorreu uma falha na comunicação com o servidor. Tente novamente."
}