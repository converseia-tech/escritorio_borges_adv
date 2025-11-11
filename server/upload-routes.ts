import { Request, Response, Express } from "express";
import multer, { FileFilterCallback } from "multer";
import { uploadImage } from "./image-upload";

// Configure multer for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    // Allow only image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

export function registerUploadRoutes(app: Express) {
  // Single file upload endpoint
  app.post("/api/upload", upload.single("file"), async (req: Request, res: Response) => {
    try {
      console.log("[Upload] 📤 Recebendo arquivo...");
      
      if (!req.file) {
        console.error("[Upload] ❌ Nenhum arquivo recebido");
        return res.status(400).json({ error: "No file uploaded" });
      }

      console.log("[Upload] 📄 Arquivo:", {
        nome: req.file.originalname,
        tamanho: `${(req.file.size / 1024).toFixed(2)} KB`,
        tipo: req.file.mimetype
      });

      // Get context from request body (optional)
      const context = req.body.context || "borges-advogados-site";
      console.log("[Upload] 🏷️  Contexto:", context);

      // Upload to S3/storage
      const result = await uploadImage(
        req.file.buffer,
        req.file.originalname,
        context
      );

      console.log("[Upload] ✅ Upload concluído:", result.url);

      res.json({
        url: result.url,
        key: result.key,
        message: "File uploaded successfully",
      });
    } catch (error) {
      console.error("[Upload] ❌ Erro no upload:", error);
      res.status(500).json({
        error: "Failed to upload file",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Multiple files upload endpoint (optional, for future use)
  app.post("/api/upload-multiple", upload.array("files", 10), async (req: Request, res: Response) => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const context = req.body.context || "borges-advogados-site";
      const results = [];

      for (const file of req.files) {
        const result = await uploadImage(
          file.buffer,
          file.originalname,
          context
        );
        results.push(result);
      }

      res.json({
        files: results,
        message: `${results.length} file(s) uploaded successfully`,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        error: "Failed to upload files",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });
}
