import { Request, Response, NextFunction } from "express";

/**
 * Middleware de autenticação por API Key
 * Valida o token Bearer no header Authorization
 */
export function apiKeyAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Missing Authorization header",
    });
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer") {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Authorization type must be Bearer",
    });
  }

  const validApiKey = process.env.API_AUTH_KEY;

  if (!validApiKey) {
    console.error("⚠️ API_AUTH_KEY not configured in environment");
    return res.status(500).json({
      error: "Internal Server Error",
      message: "API authentication not configured",
    });
  }

  if (token !== validApiKey) {
    return res.status(403).json({
      error: "Forbidden",
      message: "Invalid API key",
    });
  }

  // Token válido, prosseguir
  next();
}
