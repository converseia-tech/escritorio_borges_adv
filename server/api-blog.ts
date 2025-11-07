import { Router, Request, Response } from "express";
import { apiKeyAuth } from "./api-auth";
import { getDb } from "./db";
import { blogs } from "../drizzle/schema-pg";
import { eq } from "drizzle-orm";

const router = Router();

/**
 * Interface do payload de blog
 */
interface BlogPayload {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  author?: string;
  tags?: string[];
  published?: boolean;
}

/**
 * GET /api/blog/test
 * Endpoint de teste para validar que a API está funcionando
 */
router.get("/test", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    message: "Blog API is working",
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/blog/list
 * Lista todos os posts (requer autenticação)
 */
router.get("/list", apiKeyAuth, async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({
        error: "Database not available",
      });
    }

    const allBlogs = await db.select().from(blogs);

    res.json({
      success: true,
      count: allBlogs.length,
      data: allBlogs,
    });
  } catch (error) {
    console.error("❌ [API Blog] Error listing blogs:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * POST /api/blog/create
 * Cria um novo post de blog (requer autenticação)
 */
router.post("/create", apiKeyAuth, async (req: Request, res: Response) => {
  try {
    const payload: BlogPayload = req.body;

    // Validação básica
    if (!payload.title || !payload.slug || !payload.content) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Missing required fields: title, slug, content",
      });
    }

    const db = await getDb();
    if (!db) {
      return res.status(500).json({
        error: "Database not available",
      });
    }

    // Verificar se slug já existe
    const existing = await db
      .select()
      .from(blogs)
      .where(eq(blogs.slug, payload.slug))
      .limit(1);

    if (existing.length > 0) {
      return res.status(409).json({
        error: "Conflict",
        message: "A blog post with this slug already exists",
      });
    }

    // Criar novo blog
    const newBlog = await db
      .insert(blogs)
      .values({
        title: payload.title,
        slug: payload.slug,
        content: payload.content,
        excerpt: payload.excerpt || null,
        featuredImage: payload.featuredImage || null,
        author: payload.author || null,
        published: payload.published ? 1 : 0,
        publishedAt: payload.published ? new Date() : null,
      })
      .returning();

    console.log("✅ [API Blog] Created:", newBlog[0].slug);

    res.status(201).json({
      success: true,
      message: "Blog post created successfully",
      data: newBlog[0],
    });
  } catch (error) {
    console.error("❌ [API Blog] Error creating blog:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * POST /api/blog/update
 * Atualiza um post existente (requer autenticação)
 */
router.post("/update", apiKeyAuth, async (req: Request, res: Response) => {
  try {
    const payload: BlogPayload & { id?: number } = req.body;

    if (!payload.id && !payload.slug) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Missing required field: id or slug",
      });
    }

    const db = await getDb();
    if (!db) {
      return res.status(500).json({
        error: "Database not available",
      });
    }

    // Encontrar o blog
    const condition = payload.id
      ? eq(blogs.id, payload.id)
      : eq(blogs.slug, payload.slug!);

    const existing = await db.select().from(blogs).where(condition).limit(1);

    if (existing.length === 0) {
      return res.status(404).json({
        error: "Not Found",
        message: "Blog post not found",
      });
    }

    // Atualizar
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (payload.title) updateData.title = payload.title;
    if (payload.content) updateData.content = payload.content;
    if (payload.excerpt !== undefined) updateData.excerpt = payload.excerpt;
    if (payload.featuredImage !== undefined)
      updateData.featuredImage = payload.featuredImage;
    if (payload.author !== undefined) updateData.author = payload.author;
    if (payload.published !== undefined) {
      updateData.published = payload.published ? 1 : 0;
      if (payload.published && !existing[0].publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    const updated = await db
      .update(blogs)
      .set(updateData)
      .where(eq(blogs.id, existing[0].id))
      .returning();

    console.log("✅ [API Blog] Updated:", updated[0].slug);

    res.json({
      success: true,
      message: "Blog post updated successfully",
      data: updated[0],
    });
  } catch (error) {
    console.error("❌ [API Blog] Error updating blog:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * POST /api/blog/delete
 * Deleta um post (requer autenticação)
 */
router.post("/delete", apiKeyAuth, async (req: Request, res: Response) => {
  try {
    const { id, slug } = req.body;

    if (!id && !slug) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Missing required field: id or slug",
      });
    }

    const db = await getDb();
    if (!db) {
      return res.status(500).json({
        error: "Database not available",
      });
    }

    // Encontrar o blog
    const condition = id ? eq(blogs.id, id) : eq(blogs.slug, slug);

    const existing = await db.select().from(blogs).where(condition).limit(1);

    if (existing.length === 0) {
      return res.status(404).json({
        error: "Not Found",
        message: "Blog post not found",
      });
    }

    // Deletar
    await db.delete(blogs).where(eq(blogs.id, existing[0].id));

    console.log("✅ [API Blog] Deleted:", existing[0].slug);

    res.json({
      success: true,
      message: "Blog post deleted successfully",
      data: { id: existing[0].id, slug: existing[0].slug },
    });
  } catch (error) {
    console.error("❌ [API Blog] Error deleting blog:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
