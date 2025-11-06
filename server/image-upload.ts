import { uploadToSupabase, deleteFromSupabase } from "./supabase-storage";
import crypto from "crypto";

/**
 * Upload de imagem para Supabase Storage com nome otimizado para SEO
 * @param imageData - Buffer ou base64 da imagem
 * @param originalName - Nome original do arquivo
 * @param context - Contexto da imagem (ex: "borges-advogados-equipe")
 * @returns URL pública da imagem
 */
export async function uploadImage(
  imageData: Buffer | string,
  originalName: string,
  context: string = "borges-advogados"
): Promise<{ url: string; key: string }> {
  // Gerar sufixo aleatório para evitar enumeração
  const randomSuffix = crypto.randomBytes(8).toString("hex");
  
  // Extrair extensão do arquivo
  const ext = originalName.split(".").pop()?.toLowerCase() || "jpg";
  
  // Criar nome SEO-friendly
  const seoName = context
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  
  // Criar nome do arquivo
  const fileName = `${seoName}-${randomSuffix}.${ext}`;
  
  // Converter base64 para buffer se necessário
  let buffer: Buffer;
  if (typeof imageData === "string") {
    // Remover prefixo data:image/...;base64, se existir
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
    buffer = Buffer.from(base64Data, "base64");
  } else {
    buffer = imageData;
  }
  
  // Upload para Supabase Storage
  const result = await uploadToSupabase(buffer, fileName, "images");
  
  return {
    url: result.url,
    key: result.path,
  };
}

/**
 * Extrair nome do contexto a partir de uma string
 * Ex: "Lucas Borges Languer" -> "borges-advogados-lucas-borges-languer"
 */
export function generateImageContext(name: string, prefix: string = "borges-advogados"): string {
  const cleanName = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  
  return `${prefix}-${cleanName}`;
}
