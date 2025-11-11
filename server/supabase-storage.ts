import { createClient } from '@supabase/supabase-js';

// ⚠️ IMPORTANTE: Backend usa variáveis SEM VITE_ prefix!
// VITE_ = Frontend (React) | SEM VITE_ = Backend (Node.js)
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Verificar se as credenciais estão configuradas
if (!supabaseUrl || !supabaseKey) {
  console.error('[Supabase Storage] ❌ ERRO: Variáveis de ambiente não configuradas!');
  console.error('[Supabase Storage] Configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no arquivo .env');
  console.error('[Supabase Storage] (SEM o prefixo VITE_ - isso é backend Node.js!)');
}

// ✅ Criar cliente Supabase com SERVICE_ROLE_KEY (bypass RLS)
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('[Supabase Storage] ✅ Cliente inicializado com SERVICE_ROLE_KEY');
console.log('[Supabase Storage] URL:', supabaseUrl);

export { supabase, supabaseUrl, supabaseKey };

/**
 * Upload de arquivo para Supabase Storage
 * @param file Buffer do arquivo
 * @param fileName Nome do arquivo
 * @param bucket Nome do bucket (padrão: 'images')
 * @returns URL pública do arquivo
 */
export async function uploadToSupabase(
  file: Buffer,
  fileName: string,
  bucket: string = 'images'
): Promise<{ url: string; path: string }> {
  // Verificar se Supabase está configurado
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase não configurado! Configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env');
  }
  
  try {
    // Gerar nome único para evitar conflitos
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `${timestamp}-${randomString}.${fileExtension}`;
    const filePath = `uploads/${uniqueFileName}`;

    console.log(`[Supabase Storage] 📤 Upload iniciado`);
    console.log(`[Supabase Storage] 📄 Arquivo: ${filePath}`);
    console.log(`[Supabase Storage] 🗂️  Bucket: ${bucket}`);
    console.log(`[Supabase Storage] 🔑 Usando: SERVICE_ROLE_KEY (bypass RLS)`);

    // ✅ Upload com SERVICE_ROLE_KEY (funciona sem autenticação!)
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        contentType: getContentType(fileExtension || ''),
        upsert: true  // Permite sobrescrever se existir
      });

    if (error) {
      console.error('[Supabase Storage] ❌ Erro no upload:', error);
      
      // Mensagem de erro amigável
      if (error.message.includes('not found')) {
        throw new Error(`Bucket "${bucket}" não encontrado. Crie o bucket 'images' no Supabase Storage!`);
      }
      
      throw new Error(`Falha no upload: ${error.message}`);
    }

    console.log('[Supabase Storage] ✅ Upload concluído:', data);

    // Obter URL pública
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    console.log('[Supabase Storage] 🌐 URL pública:', publicUrlData.publicUrl);

    return {
      url: publicUrlData.publicUrl,
      path: filePath
    };
  } catch (error) {
    console.error('[Supabase Storage] ❌ Error:', error);
    throw error;
  }
}

/**
 * Deletar arquivo do Supabase Storage
 * @param filePath Caminho do arquivo
 * @param bucket Nome do bucket
 */
export async function deleteFromSupabase(
  filePath: string,
  bucket: string = 'images'
): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('[Supabase Storage] Delete error:', error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  } catch (error) {
    console.error('[Supabase Storage] Error:', error);
    throw error;
  }
}

/**
 * Determinar Content-Type baseado na extensão do arquivo
 */
function getContentType(extension: string): string {
  const contentTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    ico: 'image/x-icon',
  };

  return contentTypes[extension.toLowerCase()] || 'application/octet-stream';
}
