import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";
import express from "express";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/trpc", createExpressMiddleware({
  router: appRouter,
  createContext,
}));

app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    env: {
      db: !!process.env.DATABASE_URL,
      supabase: !!process.env.SUPABASE_URL
    }
  });
});

export default app;
