import { createClient } from '@supabase/supabase-js';

// Supabase client para Storage
const supabaseUrl = 'https://qzcdkfaaivwpfdpxchpl.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6Y2RrZmFhaXZ3cGZkcHhjaHBsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjA5OTEyMSwiZXhwIjoyMDc3Njc1MTIxfQ.Z6txcid7SzcuwigCPtLO9Ie-VBT2GRnNTcsXYwD78Vo';

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
  try {
    // Gerar nome único para evitar conflitos
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `${timestamp}-${randomString}.${fileExtension}`;
    const filePath = `uploads/${uniqueFileName}`;

    // Upload do arquivo
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        contentType: getContentType(fileExtension || ''),
        upsert: false
      });

    if (error) {
      console.error('[Supabase Storage] Upload error:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    // Obter URL pública
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

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
