import { eq } from "drizzle-orm";
import { getDb } from "./db";
import {
  heroContent,
  practiceAreas,
  teamMembers,
  aboutContent,
  aboutPage,
  contactInfo,
  associatedLawyers,
  siteSettings,
  blogs,
  chatSettings,
} from "../drizzle/schema";
import { queryCache } from "./query-cache";

// =====================================================
// HERO CONTENT MUTATIONS
// =====================================================

export async function updateHeroContent(data: {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db.select().from(heroContent).limit(1);

  // Invalidate cache
  queryCache.invalidate('hero_content');

  if (existing.length === 0) {
    const result = await db.insert(heroContent).values(data as any);
    return result;
  } else {
    const result = await db
      .update(heroContent)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(heroContent.id, existing[0].id));
    return result;
  }
}

// =====================================================
// PRACTICE AREAS MUTATIONS
// =====================================================

export async function createPracticeArea(data: {
  title: string;
  slug: string;
  description?: string;
  content?: string;
  icon?: string;
  displayOrder?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  queryCache.invalidate('practice_areas'); // Invalidate cache
  
  const result = await db.insert(practiceAreas).values(data as any);
  return result;
}

export async function updatePracticeArea(
  id: number,
  data: {
    title?: string;
    slug?: string;
    description?: string;
    content?: string;
    icon?: string;
    displayOrder?: number;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  queryCache.invalidate('practice_areas'); // Invalidate cache

  const result = await db
    .update(practiceAreas)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(practiceAreas.id, id));
  return result;
}

export async function deletePracticeArea(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.delete(practiceAreas).where(eq(practiceAreas.id, id));
  return result;
}

// =====================================================
// TEAM MEMBERS MUTATIONS
// =====================================================

export async function createTeamMember(data: {
  name: string;
  position: string;
  bio?: string;
  oab?: string;
  image?: string;
  displayOrder?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(teamMembers).values(data as any);
  return result;
}

export async function updateTeamMember(
  id: number,
  data: {
    name?: string;
    position?: string;
    bio?: string;
    oab?: string;
    image?: string;
    displayOrder?: number;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .update(teamMembers)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(teamMembers.id, id));
  return result;
}

export async function deleteTeamMember(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.delete(teamMembers).where(eq(teamMembers.id, id));
  return result;
}

// =====================================================
// ABOUT CONTENT MUTATIONS
// =====================================================

export async function updateAboutContent(data: {
  title?: string;
  subtitle?: string;
  content?: string;
  image?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db.select().from(aboutContent).limit(1);

  if (existing.length === 0) {
    const result = await db.insert(aboutContent).values(data as any);
    return result;
  } else {
    const result = await db
      .update(aboutContent)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(aboutContent.id, existing[0].id));
    return result;
  }
}

// =====================================================
// ABOUT PAGE MUTATIONS (nova estrutura)
// =====================================================

export async function updateAboutPage(data: {
  heroTitle?: string;
  heroBackgroundImage?: string;
  historyTitle?: string;
  historySubtitle?: string;
  historyContent?: string;
  historyImage?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db.select().from(aboutPage).limit(1);

  if (existing.length === 0) {
    const result = await db.insert(aboutPage).values(data as any);
    return result;
  } else {
    const result = await db
      .update(aboutPage)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(aboutPage.id, existing[0].id));
    return result;
  }
}

// =====================================================
// SITE SETTINGS MUTATIONS
// =====================================================

export async function updateSiteSettings(data: {
  siteName?: string;
  logoUrl?: string;
  faviconUrl?: string;
  socialMedia?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db.select().from(siteSettings).limit(1);

  if (existing.length === 0) {
    const result = await db.insert(siteSettings).values(data as any);
    return result;
  } else {
    const result = await db
      .update(siteSettings)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(siteSettings.id, existing[0].id));
    return result;
  }
}

// =====================================================
// BLOGS MUTATIONS
// =====================================================

export async function createBlog(data: {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  author?: string;
  published?: number;
  publishedAt?: Date;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(blogs).values(data as any);
  return result;
}

export async function updateBlog(
  id: number,
  data: {
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    featuredImage?: string;
    author?: string;
    published?: number;
    publishedAt?: Date;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .update(blogs)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(blogs.id, id));
  return result;
}

export async function deleteBlog(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.delete(blogs).where(eq(blogs.id, id));
  return result;
}

export async function getAllBlogs() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(blogs).orderBy(blogs.createdAt);
}

// =====================================================
// CHAT SETTINGS MUTATIONS
// =====================================================

export async function updateChatSettings(data: {
  enabled: boolean;
  type: "whatsapp" | "custom";
  whatsappNumber?: string;
  whatsappMessage?: string;
  customScript?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Converter boolean para number (0/1)
  const dbData = {
    ...data,
    enabled: data.enabled ? 1 : 0,
  };

  // Verificar se já existe uma configuração
  const existing = await db.select().from(chatSettings).limit(1);

  if (existing.length > 0) {
    // Atualizar configuração existente
    const result = await db
      .update(chatSettings)
      .set({ ...dbData, updatedAt: new Date() })
      .where(eq(chatSettings.id, existing[0].id))
      .returning();
    
    return result[0];
  } else {
    // Criar nova configuração
    const result = await db
      .insert(chatSettings)
      .values(dbData)
      .returning();
    
    return result[0];
  }
}
