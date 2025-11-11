import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerUploadRoutes } from "../upload-routes";
import { registerConfigRoutes } from "../config-routes";
import { registerSupabaseTestRoutes } from "../storage-test-routes";
import blogApiRouter from "../api-blog";
import marketingConfigRouter from "../marketing-config";
import supabaseTestRouter from "../supabase-test";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  console.log("[Server] 🚀 Iniciando servidor...");
  console.log("[Server] 📦 NODE_ENV:", process.env.NODE_ENV);
  console.log("[Server] 🔌 PORT:", process.env.PORT || "3000 (default)");
  
  const app = express();
  const server = createServer(app);
  
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  
  console.log("[Server] ✅ Body parser configurado");
  
  // Health check endpoint (CRÍTICO para Render!)
  app.get("/health", (req, res) => {
    res.status(200).json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });
  
  console.log("[Server] ✅ Health check endpoint criado");
  
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  console.log("[Server] ✅ OAuth routes registradas");
  
  // File upload routes
  registerUploadRoutes(app);
  console.log("[Server] ✅ Upload routes registradas");
  
  // Config routes (Supabase credentials)
  registerConfigRoutes(app);
  console.log("[Server] ✅ Config routes registradas");
  
  // Storage test routes (verificar e criar bucket)
  registerSupabaseTestRoutes(app);
  console.log("[Server] ✅ Storage test routes registradas");
  
  // Supabase connection test
  app.use("/api", supabaseTestRouter);
  console.log("[Server] ✅ Supabase test routes registradas");
  
  // Marketing configuration (Meta Pixel, GA4, API Key)
  app.use("/api", marketingConfigRouter);
  console.log("[Server] ✅ Marketing config routes registradas");
  
  // Blog REST API for N8N integration
  app.use("/api/blog", blogApiRouter);
  console.log("[Server] ✅ Blog API routes registradas");
  
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  console.log("[Server] ✅ tRPC middleware configurado");
  
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    console.log("[Server] 🔧 Modo desenvolvimento - configurando Vite...");
    await setupVite(app, server);
    console.log("[Server] ✅ Vite configurado");
  } else {
    console.log("[Server] 📦 Modo produção - servindo arquivos estáticos...");
    serveStatic(app);
    console.log("[Server] ✅ Arquivos estáticos configurados");
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`[Server] ⚠️  Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, "0.0.0.0", () => {
    console.log(`[Server] 🎉 Server running on http://0.0.0.0:${port}/`);
    console.log(`[Server] 🌐 Environment: ${process.env.NODE_ENV || 'production'}`);
    console.log(`[Server] ✅ Ready to accept connections!`);
  });
  
  // Error handling
  server.on("error", (error: any) => {
    console.error("[Server] ❌ Server error:", error);
    if (error.code === "EADDRINUSE") {
      console.error(`[Server] Port ${port} is already in use`);
    }
    process.exit(1);
  });
  
  // Graceful shutdown
  process.on("SIGTERM", () => {
    console.log("[Server] 🛑 SIGTERM received, shutting down gracefully");
    server.close(() => {
      console.log("[Server] ✅ Server closed");
      process.exit(0);
    });
  });
}

// Start with timeout protection
const startTimeout = setTimeout(() => {
  console.error("[Server] ❌ TIMEOUT: Server took too long to start (>60s)");
  console.error("[Server] Check DATABASE_URL and other env variables");
  process.exit(1);
}, 60000); // 60 seconds

startServer()
  .then(() => {
    clearTimeout(startTimeout);
    console.log("[Server] ✅ Startup completed successfully");
  })
  .catch((error) => {
    clearTimeout(startTimeout);
    console.error("[Server] ❌ Fatal error during startup:", error);
    process.exit(1);
  });
