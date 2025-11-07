import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Rotas públicas do site
  site: router({
    getHeroContent: publicProcedure.query(async () => {
      const { getHeroContent } = await import("./db-queries");
      return await getHeroContent();
    }),
    getPracticeAreas: publicProcedure.query(async () => {
      const { getPracticeAreas } = await import("./db-queries");
      return await getPracticeAreas();
    }),
    getTeamMembers: publicProcedure.query(async () => {
      const { getTeamMembers } = await import("./db-queries");
      return await getTeamMembers();
    }),
    getTeamMemberById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const { getTeamMemberById } = await import("./db-queries");
        return await getTeamMemberById(input.id);
      }),
    getAssociatedLawyers: publicProcedure.query(async () => {
      const { getAssociatedLawyers } = await import("./db-queries");
      return await getAssociatedLawyers();
    }),
    getAboutContent: publicProcedure.query(async () => {
      const { getAboutContent } = await import("./db-queries");
      return await getAboutContent();
    }),
    getAboutPage: publicProcedure.query(async () => {
      const { getAboutPage } = await import("./db-queries");
      return await getAboutPage();
    }),
    getContactInfo: publicProcedure.query(async () => {
      const { getContactInfo } = await import("./db-queries");
      return await getContactInfo();
    }),
    getSiteSettings: publicProcedure.query(async () => {
      const { getSiteSettings } = await import("./db-queries");
      return await getSiteSettings();
    }),
    getPublishedBlogs: publicProcedure.query(async () => {
      const { getPublishedBlogs } = await import("./db-queries");
      return await getPublishedBlogs();
    }),
    getPracticeAreaBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const { getPracticeAreaBySlug } = await import("./db-queries");
        return await getPracticeAreaBySlug(input.slug);
      }),
    getSettings: publicProcedure.query(async () => {
      const { getSiteSettings } = await import("./db-queries");
      return await getSiteSettings();
    }),
  }),

  // Rotas administrativas (protegidas)
  admin: router({
    // Hero Content
    updateHeroContent: protectedProcedure
      .input(
        z.object({
          title: z.string().optional(),
          subtitle: z.string().optional(),
          ctaText: z.string().optional(),
          ctaLink: z.string().optional(),
          backgroundImage: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { updateHeroContent } = await import("./db-mutations");
        return await updateHeroContent(input);
      }),

    // Practice Areas
    createPracticeArea: protectedProcedure
      .input(
        z.object({
          title: z.string(),
          slug: z.string(),
          description: z.string().optional(),
          content: z.string().optional(),
          detailedContent: z.string().optional(),
          featuredImage: z.string().optional(),
          icon: z.string().optional(),
          displayOrder: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { createPracticeArea } = await import("./db-mutations");
        return await createPracticeArea(input);
      }),

    updatePracticeArea: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          slug: z.string().optional(),
          description: z.string().optional(),
          content: z.string().optional(),
          detailedContent: z.string().optional(),
          featuredImage: z.string().optional(),
          icon: z.string().optional(),
          displayOrder: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { id, ...data } = input;
        const { updatePracticeArea } = await import("./db-mutations");
        return await updatePracticeArea(id, data);
      }),

    deletePracticeArea: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { deletePracticeArea } = await import("./db-mutations");
        return await deletePracticeArea(input.id);
      }),

    // Team Members
    createTeamMember: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          position: z.string(),
          bio: z.string().optional(),
          oab: z.string().optional(),
          image: z.string().optional(),
          displayOrder: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { createTeamMember } = await import("./db-mutations");
        return await createTeamMember(input);
      }),

    updateTeamMember: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          position: z.string().optional(),
          bio: z.string().optional(),
          oab: z.string().optional(),
          image: z.string().optional(),
          displayOrder: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { id, ...data } = input;
        const { updateTeamMember } = await import("./db-mutations");
        return await updateTeamMember(id, data);
      }),

    deleteTeamMember: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { deleteTeamMember } = await import("./db-mutations");
        return await deleteTeamMember(input.id);
      }),

    // About Content
    updateAboutContent: protectedProcedure
      .input(
        z.object({
          title: z.string().optional(),
          subtitle: z.string().optional(),
          content: z.string().optional(),
          image: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { updateAboutContent } = await import("./db-mutations");
        return await updateAboutContent(input);
      }),

    // About Page (nova estrutura completa)
    updateAboutPage: protectedProcedure
      .input(
        z.object({
          heroTitle: z.string().optional(),
          heroBackgroundImage: z.string().optional(),
          historyTitle: z.string().optional(),
          historySubtitle: z.string().optional(),
          historyContent: z.string().optional(),
          historyImage: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { updateAboutPage } = await import("./db-mutations");
        return await updateAboutPage(input);
      }),

    // Site Settings
    updateSiteSettings: protectedProcedure
      .input(
        z.object({
          siteName: z.string().optional(),
          logoUrl: z.string().optional(),
          faviconUrl: z.string().optional(),
          socialMedia: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { updateSiteSettings } = await import("./db-mutations");
        return await updateSiteSettings(input);
      }),

    // Blogs
    getAllBlogs: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const { getAllBlogs } = await import("./db-mutations");
      return await getAllBlogs();
    }),

    createBlog: protectedProcedure
      .input(
        z.object({
          title: z.string(),
          slug: z.string(),
          content: z.string(),
          excerpt: z.string().optional(),
          featuredImage: z.string().optional(),
          author: z.string().optional(),
          published: z.number().optional(),
          publishedAt: z.date().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { createBlog } = await import("./db-mutations");
        return await createBlog(input);
      }),

    updateBlog: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          slug: z.string().optional(),
          content: z.string().optional(),
          excerpt: z.string().optional(),
          featuredImage: z.string().optional(),
          author: z.string().optional(),
          published: z.number().optional(),
          publishedAt: z.date().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { id, ...data } = input;
        const { updateBlog } = await import("./db-mutations");
        return await updateBlog(id, data);
      }),

    deleteBlog: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { deleteBlog } = await import("./db-mutations");
        return await deleteBlog(input.id);
      }),

    // Upload de Imagem
    uploadImage: protectedProcedure
      .input(
        z.object({
          imageData: z.string(),
          originalName: z.string(),
          context: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { uploadImage } = await import("./image-upload");
        return await uploadImage(input.imageData, input.originalName, input.context);
      }),
  }),
});

export type AppRouter = typeof appRouter;
