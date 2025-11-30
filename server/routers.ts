import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

// Helper to check if user has admin role
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

// Helper to check if user is admin or facilitator
const facilitatorProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin' && ctx.user.role !== 'facilitator') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Facilitator or admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ============ USER & PROFILE ============
  users: router({
    getAll: protectedProcedure.query(async () => {
      return await db.getAllUsers();
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getUserById(input.id);
      }),
    
    getProfile: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        return await db.getProfileByUserId(input.userId);
      }),
    
    updateProfile: protectedProcedure
      .input(z.object({
        company: z.string().optional(),
        segment: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
        bio: z.string().optional(),
        avatarUrl: z.string().optional(),
        linkedinUrl: z.string().optional(),
        facebookUrl: z.string().optional(),
        instagramUrl: z.string().optional(),
        websiteUrl: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.upsertProfile({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true };
      }),
  }),

  // ============ GROUPS ============
  groups: router({
    getAll: protectedProcedure.query(async () => {
      return await db.getAllGroups();
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getGroupById(input.id);
      }),
    
    create: adminProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        facilitatorId: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createGroup(input);
        return { success: true };
      }),
    
    getMembers: protectedProcedure
      .input(z.object({ groupId: z.number() }))
      .query(async ({ input }) => {
        return await db.getGroupMembers(input.groupId);
      }),
    
    addMember: facilitatorProcedure
      .input(z.object({
        groupId: z.number(),
        userId: z.number(),
      }))
      .mutation(async ({ input }) => {
        await db.addMemberToGroup(input.groupId, input.userId);
        return { success: true };
      }),
    
    removeMember: facilitatorProcedure
      .input(z.object({
        groupId: z.number(),
        userId: z.number(),
      }))
      .mutation(async ({ input }) => {
        await db.removeMemberFromGroup(input.groupId, input.userId);
        return { success: true };
      }),
  }),

  // ============ ACTIVITIES ============
  activities: router({
    create: protectedProcedure
      .input(z.object({
        type: z.enum(['referral', 'business', 'meeting', 'testimonial']),
        toUserId: z.number().optional(),
        groupId: z.number().optional(),
        title: z.string().optional(),
        description: z.string(),
        value: z.number().optional(),
        points: z.number().default(10),
        activityDate: z.date(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createActivity({
          fromUserId: ctx.user.id,
          ...input,
        });
        
        // Create notification for toUser if exists
        if (input.toUserId) {
          await db.createNotification({
            userId: input.toUserId,
            type: input.type,
            title: `Nova ${input.type === 'referral' ? 'indicação' : input.type === 'business' ? 'negócio' : input.type === 'meeting' ? 'reunião' : 'depoimento'}`,
            message: `${ctx.user.name} registrou uma atividade relacionada a você.`,
            relatedType: 'activity',
          });
        }
        
        return { success: true };
      }),
    
    getByUser: protectedProcedure
      .input(z.object({ 
        userId: z.number().optional(),
        limit: z.number().default(50),
      }))
      .query(async ({ ctx, input }) => {
        const userId = input.userId || ctx.user.id;
        return await db.getActivitiesByUser(userId, input.limit);
      }),
    
    getRecent: protectedProcedure
      .input(z.object({ limit: z.number().default(50) }))
      .query(async ({ input }) => {
        return await db.getRecentActivities(input.limit);
      }),
  }),

  // ============ GAMIFICATION ============
  gamification: router({
    getLeaderboard: protectedProcedure
      .input(z.object({
        month: z.number().optional(),
        limit: z.number().default(10),
      }))
      .query(async ({ input }) => {
        const now = new Date();
        const month = input.month || parseInt(
          now.getFullYear().toString() + 
          (now.getMonth() + 1).toString().padStart(2, '0')
        );
        return await db.getMonthlyLeaderboard(month, input.limit);
      }),
    
    getUserScore: protectedProcedure
      .input(z.object({
        userId: z.number().optional(),
        month: z.number().optional(),
      }))
      .query(async ({ ctx, input }) => {
        const userId = input.userId || ctx.user.id;
        const now = new Date();
        const month = input.month || parseInt(
          now.getFullYear().toString() + 
          (now.getMonth() + 1).toString().padStart(2, '0')
        );
        return await db.getUserScore(userId, month);
      }),
  }),

  // ============ MEETINGS ============
  meetings: router({
    create: facilitatorProcedure
      .input(z.object({
        groupId: z.number(),
        title: z.string(),
        description: z.string().optional(),
        meetingDate: z.date(),
        location: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createMeeting(input);
        return { success: true };
      }),
    
    getByGroup: protectedProcedure
      .input(z.object({ groupId: z.number() }))
      .query(async ({ input }) => {
        return await db.getMeetingsByGroup(input.groupId);
      }),
    
    getAll: protectedProcedure.query(async () => {
      return await db.getAllMeetings();
    }),
  }),

  // ============ GUESTS ============
  guests: router({
    create: facilitatorProcedure
      .input(z.object({
        name: z.string(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        company: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createGuest({
          ...input,
          invitedBy: ctx.user.id,
        });
        return { success: true };
      }),
    
    addToMeeting: facilitatorProcedure
      .input(z.object({
        meetingId: z.number(),
        guestId: z.number(),
      }))
      .mutation(async ({ input }) => {
        await db.addGuestToMeeting(input.meetingId, input.guestId);
        return { success: true };
      }),
    
    getByMeeting: protectedProcedure
      .input(z.object({ meetingId: z.number() }))
      .query(async ({ input }) => {
        return await db.getMeetingGuests(input.meetingId);
      }),
  }),

  // ============ CONTENTS ============
  contents: router({
    create: adminProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        category: z.string().optional(),
        type: z.enum(['video', 'document', 'presentation', 'link']),
        url: z.string(),
        thumbnailUrl: z.string().optional(),
        fileKey: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createContent({
          ...input,
          createdBy: ctx.user.id,
        });
        return { success: true };
      }),
    
    getAll: protectedProcedure.query(async ({ ctx }) => {
      // Guests should not have access to contents
      if (ctx.user.role === 'guest') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Guests cannot access contents' });
      }
      return await db.getAllContents();
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        if (ctx.user.role === 'guest') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Guests cannot access contents' });
        }
        return await db.getContentById(input.id);
      }),
  }),

  // ============ NOTIFICATIONS ============
  notifications: router({
    getMyNotifications: protectedProcedure
      .input(z.object({ limit: z.number().default(50) }))
      .query(async ({ ctx, input }) => {
        return await db.getUserNotifications(ctx.user.id, input.limit);
      }),
    
    markAsRead: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.markNotificationAsRead(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
