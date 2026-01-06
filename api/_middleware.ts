import type { VercelRequest, VercelResponse } from "@vercel/node";

export const config = {
  runtime: "nodejs20.x",
};

// Este arquivo existe apenas para NÃO quebrar o build da Vercel.
// A Vercel trata qualquer arquivo em /api como Serverless Function.
// Se não houver default export, o deploy pode falhar.
export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method && req.method !== "GET") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  return res.status(200).json({
    ok: true,
    env: {
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasSupabaseKey: !!(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY),
      nodeEnv: process.env.NODE_ENV ?? null,
    },
  });
}
