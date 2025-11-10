import { Router } from "express";
import { Pool } from "pg";

const router = Router();

router.post("/test-supabase", async (req, res) => {
  try {
    const { databaseUrl } = req.body;

    if (!databaseUrl) {
      return res.status(400).json({
        success: false,
        message: "Database URL is required",
      });
    }

    console.log("[Supabase Test] Testing connection...");

    // Create a temporary connection pool
    const pool = new Pool({
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false,
      },
      connectionTimeoutMillis: 5000, // 5 seconds timeout
      max: 1, // Only 1 connection for testing
    });

    try {
      // Test the connection with a simple query
      const result = await pool.query("SELECT NOW() as current_time, version() as pg_version");
      
      await pool.end();

      console.log("[Supabase Test] ✅ Connection successful");
      console.log("[Supabase Test] PostgreSQL version:", result.rows[0].pg_version);

      return res.json({
        success: true,
        message: "Connection successful",
        data: {
          connected_at: result.rows[0].current_time,
          version: result.rows[0].pg_version,
        },
      });
    } catch (dbError) {
      await pool.end().catch(() => {});
      
      console.error("[Supabase Test] ❌ Connection failed:", (dbError as Error).message);
      
      return res.status(500).json({
        success: false,
        message: `Database connection failed: ${(dbError as Error).message}`,
      });
    }
  } catch (error) {
    console.error("[Supabase Test] Error:", error);
    return res.status(500).json({
      success: false,
      message: `Failed to test connection: ${(error as Error).message}`,
    });
  }
});

export default router;
