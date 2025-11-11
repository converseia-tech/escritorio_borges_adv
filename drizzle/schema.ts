import { integer, pgEnum, pgTable, serial, text, timestamp, varchar, smallint } from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use snake_case to match PostgreSQL conventions.
 */

// Enum para role
export const roleEnum = pgEnum("role", ["user", "admin"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("open_id", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("login_method", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastSignedIn: timestamp("last_signed_in").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Advogados Associados (sidebar)
export const associatedLawyers = pgTable("associated_lawyers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  oab: varchar("oab", { length: 100 }).notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type AssociatedLawyer = typeof associatedLawyers.$inferSelect;
export type InsertAssociatedLawyer = typeof associatedLawyers.$inferInsert;

// Conteúdo do Hero Section
export const heroContent = pgTable("hero_content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  ctaText: varchar("cta_text", { length: 100 }).notNull(),
  ctaLink: varchar("cta_link", { length: 255 }).default("/contato"),
  backgroundImage: text("background_image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type HeroContent = typeof heroContent.$inferSelect;
export type InsertHeroContent = typeof heroContent.$inferInsert;

// Áreas de Atuação
export const practiceAreas = pgTable("practice_areas", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  description: text("description"),
  detailedContent: text("detailed_content"),
  featuredImage: text("featured_image"),
  icon: varchar("icon", { length: 100 }),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type PracticeArea = typeof practiceAreas.$inferSelect;
export type InsertPracticeArea = typeof practiceAreas.$inferInsert;

// Membros da Equipe
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  position: varchar("position", { length: 200 }).notNull(),
  bio: text("bio"),
  image: text("image"),
  oab: varchar("oab", { length: 100 }),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = typeof teamMembers.$inferInsert;

// Conteúdo Sobre Nós
export const aboutContent = pgTable("about_content", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  subtitle: varchar("subtitle", { length: 300 }),
  content: text("content").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type AboutContent = typeof aboutContent.$inferSelect;
export type InsertAboutContent = typeof aboutContent.$inferInsert;

// Página Sobre Nós (nova estrutura completa)
export const aboutPage = pgTable("about_page", {
  id: serial("id").primaryKey(),
  // Hero Section
  heroTitle: varchar("hero_title", { length: 200 }).notNull().default("Sobre nós"),
  heroBackgroundImage: text("hero_background_image"),
  // História Section
  historyTitle: varchar("history_title", { length: 200 }).notNull().default("Conheça nossa história"),
  historySubtitle: varchar("history_subtitle", { length: 300 }),
  historyContent: text("history_content").notNull(),
  historyImage: text("history_image"), // Imagem da equipe
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type AboutPage = typeof aboutPage.$inferSelect;
export type InsertAboutPage = typeof aboutPage.$inferInsert;

// Informações de Contato
export const contactInfo = pgTable("contact_info", {
  id: serial("id").primaryKey(),
  phone: varchar("phone", { length: 50 }),
  address: text("address"),
  email: varchar("email", { length: 320 }),
  whatsapp: varchar("whatsapp", { length: 50 }),
  hours: text("hours"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ContactInfo = typeof contactInfo.$inferSelect;
export type InsertContactInfo = typeof contactInfo.$inferInsert;

// Blogs
export const blogs = pgTable("blogs", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 300 }).notNull(),
  slug: varchar("slug", { length: 300 }).notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  featuredImage: text("featured_image"),
  author: varchar("author", { length: 200 }),
  authorBio: text("author_bio"), // Biografia do autor
  authorPhoto: text("author_photo"), // Foto do autor
  published: smallint("published").notNull().default(0),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Blog = typeof blogs.$inferSelect;
export type InsertBlog = typeof blogs.$inferInsert;

// Imagens dos Blogs
export const blogImages = pgTable("blog_images", {
  id: serial("id").primaryKey(),
  blogId: integer("blog_id").notNull(),
  imageUrl: text("image_url").notNull(),
  altText: text("alt_text"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type BlogImage = typeof blogImages.$inferSelect;
export type InsertBlogImage = typeof blogImages.$inferInsert;

// Configurações do Site
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  logoUrl: text("logo_url"),
  faviconUrl: text("favicon_url"),
  socialMedia: text("social_media"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type SiteSettings = typeof siteSettings.$inferSelect;
export type InsertSiteSettings = typeof siteSettings.$inferInsert;

// Configurações de Chat/Pop-up
export const chatSettings = pgTable("chat_settings", {
  id: serial("id").primaryKey(),
  enabled: smallint("enabled").notNull().default(0), // 0 = false, 1 = true
  type: varchar("type", { length: 20 }).notNull().default("whatsapp"), // "whatsapp" ou "custom"
  whatsappNumber: varchar("whatsapp_number", { length: 20 }),
  whatsappMessage: text("whatsapp_message"),
  customScript: text("custom_script"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ChatSettings = typeof chatSettings.$inferSelect;
export type InsertChatSettings = typeof chatSettings.$inferInsert;