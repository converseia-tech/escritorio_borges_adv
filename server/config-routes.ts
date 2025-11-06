import { Request, Response, Express } from "express";
import fs from "fs";
import path from "path";

interface SupabaseCredentials {
  url: string;
  anonKey: string;
  serviceRole: string;
  databaseUrl: string;
}

export function registerConfigRoutes(app: Express) {
  // Test Supabase connection
  app.post("/api/test-supabase", async (req: Request, res: Response) => {
    try {
      const { databaseUrl } = req.body;

      if (!databaseUrl) {
        return res.status(400).json({ error: "Database URL is required" });
      }

      // Try to connect to the database
      const postgres = (await import("postgres")).default;
      const sql = postgres(databaseUrl, { ssl: "require", max: 1 });

      // Simple query to test connection
      await sql`SELECT 1 as test`;
      await sql.end();

      res.json({
        success: true,
        message: "Connection successful!",
      });
    } catch (error) {
      console.error("Supabase connection test error:", error);
      res.status(500).json({
        success: false,
        error: "Connection failed",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Save Supabase credentials to .env file
  app.post("/api/save-supabase-credentials", async (req: Request, res: Response) => {
    try {
      const { url, anonKey, serviceRole, databaseUrl } = req.body as SupabaseCredentials;

      if (!databaseUrl) {
        return res.status(400).json({ error: "Database URL is required" });
      }

      // Path to .env file
      const envPath = path.join(process.cwd(), ".env");

      // Read current .env file
      let envContent = "";
      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, "utf-8");
      }

      // Update DATABASE_URL
      const lines = envContent.split("\n");
      let updated = false;

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith("DATABASE_URL=")) {
          lines[i] = `DATABASE_URL=${databaseUrl}`;
          updated = true;
          break;
        }
      }

      // If DATABASE_URL doesn't exist, add it
      if (!updated) {
        lines.push(`DATABASE_URL=${databaseUrl}`);
      }

      // Write back to .env
      fs.writeFileSync(envPath, lines.join("\n"), "utf-8");

      res.json({
        success: true,
        message: "Credentials saved successfully! Please restart the server to apply changes.",
        requiresRestart: true,
      });
    } catch (error) {
      console.error("Error saving credentials:", error);
      res.status(500).json({
        success: false,
        error: "Failed to save credentials",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Get current DATABASE_URL (without exposing the password)
  app.get("/api/supabase-config", (req: Request, res: Response) => {
    try {
      const databaseUrl = process.env.DATABASE_URL || "";
      
      // Mask password in URL
      let maskedUrl = databaseUrl;
      if (databaseUrl) {
        maskedUrl = databaseUrl.replace(/:([^@]+)@/, ":****@");
      }

      res.json({
        databaseUrl: maskedUrl,
        isConfigured: !!databaseUrl,
      });
    } catch (error) {
      res.status(500).json({
        error: "Failed to get config",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });
}
