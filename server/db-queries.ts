import { eq, asc, desc } from "drizzle-orm";
import { getDb } from "./db";
import { 
  heroContent, 
  practiceAreas, 
  teamMembers, 
  aboutContent, 
  contactInfo,
  associatedLawyers,
  siteSettings,
  blogs
} from "../drizzle/schema-pg";

// Hero Content
export async function getHeroContent() {
  const db = await getDb();
  if (!db) return null;
  try {
    const result = await db.select().from(heroContent).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('[DB Query Error] getHeroContent:', error);
    return null;
  }
}

// Practice Areas
export async function getPracticeAreas() {
  const db = await getDb();
  if (!db) {
    console.log('[DB Query] Database not available');
    return [];
  }
  try {
    console.log('[DB Query] Fetching practice areas...');
    const results = await db.select().from(practiceAreas).orderBy(asc(practiceAreas.displayOrder));
    console.log('[DB Query] Found', results.length, 'practice areas');
    return results;
  } catch (error) {
    console.error('[DB Query Error] getPracticeAreas:', error);
    return [];
  }
}

export async function getPracticeAreaBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(practiceAreas).where(eq(practiceAreas.slug, slug)).limit(1);
  return result[0] || null;
}

// Team Members
export async function getTeamMembers() {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select().from(teamMembers).orderBy(asc(teamMembers.displayOrder));
  } catch (error) {
    console.error('[DB Query Error] getTeamMembers:', error);
    return [];
  }
}

export async function getTeamMemberById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(teamMembers).where(eq(teamMembers.id, id)).limit(1);
  return result[0] || null;
}

// Associated Lawyers
export async function getAssociatedLawyers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(associatedLawyers).orderBy(asc(associatedLawyers.displayOrder));
}

// About Content
export async function getAboutContent() {
  const db = await getDb();
  if (!db) return null;
  try {
    const result = await db.select().from(aboutContent).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('[DB Query Error] getAboutContent:', error);
    return null;
  }
}

// Contact Info
export async function getContactInfo() {
  const db = await getDb();
  if (!db) return null;
  try {
    const result = await db.select().from(contactInfo).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('[DB Query Error] getContactInfo:', error);
    return null;
  }
}

// Site Settings
export async function getSiteSettings() {
  const db = await getDb();
  if (!db) return null;
  try {
    const result = await db.select().from(siteSettings).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('[DB Query Error] getSiteSettings:', error);
    return null;
  }
}

// Blogs
export async function getPublishedBlogs() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(blogs).where(eq(blogs.published, 1)).orderBy(desc(blogs.publishedAt));
}

export async function getBlogBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(blogs).where(eq(blogs.slug, slug)).limit(1);
  return result[0] || null;
}
