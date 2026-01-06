import { Request, Response, Express } from "express";
import { supabase } from "./supabase-storage";

export function registerSupabaseTestRoutes(app: Express) {
  // Endpoint para testar configuração do Supabase Storage
  app.get("/api/test-storage", async (req: Request, res: Response) => {
    try {
      console.log("[Storage Test] 🧪 Testando conexão com Supabase Storage...");
      
      // 1. Verificar variáveis de ambiente (SEM VITE_ no backend!)
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
      
      console.log("[Storage Test] 📋 Credenciais:");
      console.log("- URL:", supabaseUrl ? "✅ Configurada" : "❌ Não configurada");
      console.log("- Key:", supabaseKey ? "✅ Configurada" : "❌ Não configurada");
      
      // 2. Listar buckets
      console.log("[Storage Test] 📦 Listando buckets...");
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        console.error("[Storage Test] ❌ Erro ao listar buckets:", bucketsError);
        return res.status(500).json({
          success: false,
          error: "Erro ao listar buckets",
          message: bucketsError.message,
          details: bucketsError
        });
      }
      console.log("[Storage Test] 📦 Buckets encontrados:", buckets?.length || 0);
      buckets?.forEach(bucket => {
        console.log(`  - ${bucket.name} (${bucket.public ? 'público' : 'privado'})`);
      });
      
      // 3. Verificar se bucket 'images' existe
      const imagesBucket = buckets?.find(b => b.name === 'images');
      
      if (!imagesBucket) {
        console.warn("[Storage Test] ⚠️ Bucket 'images' não encontrado!");
        return res.status(400).json({
          success: false,
          error: "Bucket 'images' não existe",
          message: "Você precisa criar o bucket 'images' no Supabase Storage",
          buckets: buckets?.map(b => b.name) || [],
          instructions: "Veja o arquivo EXECUTAR_PRIMEIRO.md para instruções"
        });
      }
      
      console.log("[Storage Test] ✅ Bucket 'images' encontrado!");
      console.log(`  - Público: ${imagesBucket.public ? 'Sim' : 'Não'}`);
      
      // 4. Testar acesso ao bucket
      console.log("[Storage Test] 📁 Testando acesso ao bucket 'images'...");
      const { data: files, error: filesError } = await supabase.storage
        .from('images')
        .list('', { limit: 1 });
      
      if (filesError) {
        console.error("[Storage Test] ❌ Erro ao acessar bucket:", filesError);
        return res.status(500).json({
          success: false,
          error: "Erro ao acessar bucket 'images'",
          message: filesError.message,
          details: filesError
        });
      }
      
      console.log("[Storage Test] ✅ Acesso ao bucket OK!");
      console.log(`  - Arquivos encontrados: ${files?.length || 0}`);
      
      // Resposta de sucesso
      res.json({
        success: true,
        message: "Supabase Storage configurado corretamente! ✅",
        details: {
          url: supabaseUrl,
          buckets: buckets?.map(b => ({
            name: b.name,
            public: b.public,
            id: b.id
          })),
          imagesBucket: {
            exists: true,
            public: imagesBucket.public,
            filesCount: files?.length || 0
          }
        }
      });
      
    } catch (error) {
      console.error("[Storage Test] ❌ Erro geral:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao testar Supabase Storage",
        message: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });
  
  // Endpoint para criar bucket automaticamente
  app.post("/api/create-images-bucket", async (req: Request, res: Response) => {
    try {
      console.log("[Storage] 🔨 Tentando criar bucket 'images'...");
      
      const { data, error } = await supabase.storage.createBucket('images', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      });
      
      if (error) {
        if (error.message.includes('already exists')) {
          console.log("[Storage] ℹ️ Bucket 'images' já existe");
          return res.json({
            success: true,
            message: "Bucket 'images' já existe",
            alreadyExists: true
          });
        }
        
        console.error("[Storage] ❌ Erro ao criar bucket:", error);
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }
      
      console.log("[Storage] ✅ Bucket 'images' criado com sucesso!");
      
      res.json({
        success: true,
        message: "Bucket 'images' criado com sucesso! ✅",
        data
      });
      
    } catch (error) {
      console.error("[Storage] ❌ Erro:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });
}
