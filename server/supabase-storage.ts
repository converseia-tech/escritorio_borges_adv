import { createClient } from '@supabase/supabase-js';

// Supabase client para Storage
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://qzcdkfaaivwpfdpxchpl.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6Y2RrZmFhaXZ3cGZkcHhjaHBsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMDc1NzU5OSwiZXhwIjoyMDQ2MzMzNTk5fQ.1YJMN01hl9CXcOhpJOz33FdpxQFDy5yFdqfHWWWfMiQ';

// Verificar se as credenciais estão configuradas
if (!supabaseUrl || !supabaseKey) {
  console.error('[Supabase Storage] ERRO: Variáveis de ambiente não configuradas!');
  console.error('[Supabase Storage] Configure VITE_SUPABASE_URL e VITE_SUPABASE_SERVICE_ROLE_KEY no arquivo .env');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

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
  if (!supabaseUrl || !supabaseKey || supabaseKey.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6Y2RrZmFhaXZ3cGZkcHhjaHBsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMDc1NzU5OSwiZXhwIjoyMDQ2MzMzNTk5fQ')) {
    // Usar a chave hardcoded como fallback
    console.log('[Supabase Storage] Usando credenciais do ambiente');
  }
  
  try {
    // Gerar nome único para evitar conflitos
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `${timestamp}-${randomString}.${fileExtension}`;
    const filePath = `uploads/${uniqueFileName}`;

    console.log(`[Supabase Storage] Iniciando upload: ${filePath} para bucket: ${bucket}`);

    // Upload do arquivo
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        contentType: getContentType(fileExtension || ''),
        upsert: false
      });

    if (error) {
      console.error('[Supabase Storage] Upload error:', error);
      
      // Mensagem de erro amigável
      if (error.message.includes('not found')) {
        throw new Error(`Bucket "${bucket}" não encontrado no Supabase Storage. Crie o bucket primeiro.`);
      }
      
      throw new Error(`Falha ao fazer upload: ${error.message}`);
    }

    console.log('[Supabase Storage] Upload concluído:', data);

    // Obter URL pública
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    console.log('[Supabase Storage] URL pública gerada:', publicUrlData.publicUrl);

    return {
      url: publicUrlData.publicUrl,
      path: filePath
    };
  } catch (error) {
    console.error('[Supabase Storage] Error:', error);
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
