// api/index.ts
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
import { TRPCError } from "@trpc/server";

// server/_core/env.ts
var ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
};

// server/_core/notification.ts
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// shared/const.ts
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/supabase.ts
import { createClient } from "@supabase/supabase-js";
var supabaseUrl = process.env.SUPABASE_URL || "https://wawnsuwrnsdfaowfhqjz.supabase.co";
var supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhd25zdXdybnNkZmFvd2ZocWp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NDI0MDYsImV4cCI6MjA4MDAxODQwNn0.StzgKU08CV7dPwtHBCfSRsemc_G0aKum4wK9TBev1LA";
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("[Supabase] Missing environment variables!");
  console.error("[Supabase] SUPABASE_URL:", supabaseUrl ? "SET" : "MISSING");
  console.error("[Supabase] SUPABASE_ANON_KEY:", supabaseAnonKey ? "SET" : "MISSING");
}
console.log("[Supabase] Initializing client with URL:", supabaseUrl);
var supabase = createClient(supabaseUrl, supabaseAnonKey);
var supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
var supabaseAdmin = supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
}) : supabase;

// server/_core/supabase-auth.ts
async function getUserFromRequest(req) {
  const accessToken = req.cookies?.["sb-access-token"];
  const refreshToken = req.cookies?.["sb-refresh-token"];
  if (!accessToken) {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const { data: { user }, error: error2 } = await supabase.auth.getUser(token);
      if (error2 || !user) {
        return null;
      }
      return await getUserFromSupabaseUser(user.id);
    }
    return null;
  }
  const { data: { session }, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken
  });
  if (error || !session) {
    return null;
  }
  return await getUserFromSupabaseUser(session.user.id);
}
async function getUserFromSupabaseUser(supabaseUserId) {
  const { data, error } = await supabase.from("users").select("*").eq("open_id", supabaseUserId).single();
  if (error || !data) {
    return null;
  }
  return {
    id: data.id,
    open_id: data.open_id,
    name: data.name,
    email: data.email,
    login_method: data.login_method,
    role: data.role,
    created_at: data.created_at,
    updated_at: data.updated_at,
    last_signed_in: data.last_signed_in
  };
}
function setAuthCookies(res, accessToken, refreshToken) {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1e3,
    // 7 days
    path: "/"
  };
  res.cookie("sb-access-token", accessToken, cookieOptions);
  res.cookie("sb-refresh-token", refreshToken, cookieOptions);
}
function clearAuthCookies(res) {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: -1,
    path: "/"
  };
  res.clearCookie("sb-access-token", cookieOptions);
  res.clearCookie("sb-refresh-token", cookieOptions);
}

// server/routers.ts
import { z as z2 } from "zod";

// server/db.ts
async function getAllUsers() {
  const { data, error } = await supabaseAdmin.from("users").select("*").order("name");
  if (error) throw new Error(error.message);
  return data || [];
}
async function getUserById(id) {
  const { data, error } = await supabaseAdmin.from("users").select("*").eq("id", id).single();
  if (error || !data) return void 0;
  return data;
}
async function getProfileByUserId(userId) {
  const { data, error } = await supabaseAdmin.from("profiles").select("*").eq("user_id", userId).single();
  if (error || !data) return void 0;
  return data;
}
async function upsertProfile(profile) {
  const { data: existing } = await supabaseAdmin.from("profiles").select("id").eq("user_id", profile.userId).single();
  const profileData = {
    user_id: profile.userId,
    phone: profile.phone,
    company: profile.company,
    position: profile.position,
    address: profile.address,
    city: profile.city,
    state: profile.state,
    zip_code: profile.zipCode,
    bio: profile.bio,
    avatar_url: profile.avatarUrl,
    linkedin_url: profile.linkedinUrl,
    facebook_url: profile.facebookUrl,
    instagram_url: profile.instagramUrl,
    website_url: profile.websiteUrl
  };
  if (existing) {
    await supabaseAdmin.from("profiles").update(profileData).eq("user_id", profile.userId);
  } else {
    await supabaseAdmin.from("profiles").insert(profileData);
  }
}
async function getAllGroups() {
  const { data, error } = await supabaseAdmin.from("groups").select("*").eq("is_active", true).order("name");
  if (error) throw new Error(error.message);
  return data || [];
}
async function getGroupById(id) {
  const { data, error } = await supabaseAdmin.from("groups").select("*").eq("id", id).single();
  if (error || !data) return void 0;
  return data;
}
async function createGroup(group) {
  await supabaseAdmin.from("groups").insert(group);
}
async function getGroupMembers(groupId) {
  const { data, error } = await supabaseAdmin.from("group_members").select(`
      id,
      joined_at,
      is_facilitator,
      users!group_members_user_id_fkey (
        id,
        name,
        email,
        role
      )
    `).eq("group_id", groupId);
  if (error) throw new Error(error.message);
  return data || [];
}
async function addMemberToGroup(groupId, userId) {
  await supabaseAdmin.from("group_members").insert({
    group_id: groupId,
    user_id: userId,
    is_facilitator: false
  });
}
async function removeMemberFromGroup(groupId, userId) {
  await supabaseAdmin.from("group_members").delete().eq("group_id", groupId).eq("user_id", userId);
}
async function createActivity(activity) {
  await supabaseAdmin.from("activities").insert({
    user_id: activity.fromUserId,
    type: activity.type,
    title: activity.title,
    description: activity.description,
    to_user_id: activity.toUserId,
    value: activity.value,
    points: activity.points,
    activity_date: activity.activityDate.toISOString()
  });
  const month = activity.activityDate.getMonth() + 1;
  const year = activity.activityDate.getFullYear();
  await updateUserScore(
    activity.fromUserId,
    month,
    year,
    activity.type,
    activity.points,
    activity.value || 0
  );
}
async function getRecentActivities(limit = 50) {
  const { data, error } = await supabaseAdmin.from("activities").select(`
      *,
      from_user:users!activities_user_id_fkey (id, name, email),
      to_user:users!activities_to_user_id_fkey (id, name, email)
    `).order("created_at", { ascending: false }).limit(limit);
  if (error) throw new Error(error.message);
  return data || [];
}
async function getActivitiesByUser(userId, limit = 50) {
  const { data, error } = await supabaseAdmin.from("activities").select("*").or(`user_id.eq.${userId},to_user_id.eq.${userId}`).order("activity_date", { ascending: false }).limit(limit);
  if (error) throw new Error(error.message);
  return data || [];
}
async function updateUserScore(userId, month, year, activityType, points, businessValue = 0) {
  const { data: existing } = await supabaseAdmin.from("scores").select("*").eq("user_id", userId).eq("month", month).eq("year", year).single();
  if (existing) {
    const updates = {
      total_points: existing.total_points + points
    };
    switch (activityType) {
      case "referral":
        updates.referral_count = existing.referral_count + 1;
        break;
      case "business":
        updates.business_count = existing.business_count + 1;
        updates.total_business_value = existing.total_business_value + businessValue;
        break;
      case "meeting":
        updates.meeting_count = existing.meeting_count + 1;
        break;
      case "testimonial":
        updates.testimonial_count = existing.testimonial_count + 1;
        break;
    }
    await supabaseAdmin.from("scores").update(updates).eq("user_id", userId).eq("month", month).eq("year", year);
  } else {
    await supabaseAdmin.from("scores").insert({
      user_id: userId,
      month,
      year,
      total_points: points,
      referral_count: activityType === "referral" ? 1 : 0,
      business_count: activityType === "business" ? 1 : 0,
      meeting_count: activityType === "meeting" ? 1 : 0,
      testimonial_count: activityType === "testimonial" ? 1 : 0,
      total_business_value: activityType === "business" ? businessValue : 0
    });
  }
}
async function getUserScore(userId, month, year) {
  const now = /* @__PURE__ */ new Date();
  const targetMonth = month || now.getMonth() + 1;
  const targetYear = year || now.getFullYear();
  const { data, error } = await supabaseAdmin.from("scores").select("*").eq("user_id", userId).eq("month", targetMonth).eq("year", targetYear).single();
  if (error || !data) return void 0;
  return data;
}
async function getMonthlyLeaderboard(month, year, limit = 10) {
  const now = /* @__PURE__ */ new Date();
  const targetMonth = month || now.getMonth() + 1;
  const targetYear = year || now.getFullYear();
  const { data, error } = await supabaseAdmin.from("scores").select(`
      *,
      users!scores_user_id_fkey (id, name, email)
    `).eq("month", targetMonth).eq("year", targetYear).order("total_points", { ascending: false }).limit(limit);
  if (error) throw new Error(error.message);
  return data || [];
}
async function getAllMeetings() {
  const { data, error } = await supabaseAdmin.from("meetings").select("*").order("meeting_date", { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}
async function getMeetingsByGroup(groupId) {
  const { data, error } = await supabaseAdmin.from("meetings").select("*").eq("group_id", groupId).order("meeting_date", { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}
async function createMeeting(meeting) {
  await supabaseAdmin.from("meetings").insert({
    group_id: meeting.groupId,
    title: meeting.title,
    description: meeting.description,
    meeting_date: meeting.meetingDate.toISOString(),
    location: meeting.location,
    created_by: meeting.createdBy
  });
}
async function getMeetingGuests(meetingId) {
  const { data, error } = await supabaseAdmin.from("meeting_guests").select(`
      *,
      guests!meeting_guests_guest_id_fkey (*)
    `).eq("meeting_id", meetingId);
  if (error) throw new Error(error.message);
  return data || [];
}
async function addGuestToMeeting(meetingId, guestId) {
  await supabaseAdmin.from("meeting_guests").insert({
    meeting_id: meetingId,
    guest_id: guestId
  });
}
async function createGuest(guest) {
  await supabaseAdmin.from("guests").insert({
    name: guest.name,
    email: guest.email,
    phone: guest.phone,
    company: guest.company,
    invited_by: guest.invitedBy,
    notes: guest.notes
  });
}
async function getAllContents() {
  const { data, error } = await supabaseAdmin.from("contents").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}
async function getContentById(id) {
  const { data, error } = await supabaseAdmin.from("contents").select("*").eq("id", id).single();
  if (error || !data) return void 0;
  return data;
}
async function createContent(content) {
  await supabaseAdmin.from("contents").insert({
    title: content.title,
    description: content.description,
    type: content.type,
    url: content.url,
    category: content.category,
    created_by: content.createdBy
  });
}
async function createNotification(notification) {
  await supabaseAdmin.from("notifications").insert({
    user_id: notification.userId,
    title: notification.title,
    message: notification.message,
    type: notification.type
  });
}
async function getUserNotifications(userId, limit = 50) {
  const { data, error } = await supabaseAdmin.from("notifications").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(limit);
  if (error) throw new Error(error.message);
  return data || [];
}
async function markNotificationAsRead(id) {
  await supabaseAdmin.from("notifications").update({ is_read: true }).eq("id", id);
}

// server/routers.ts
import { TRPCError as TRPCError3 } from "@trpc/server";
var adminProcedure2 = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError3({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});
var facilitatorProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin" && ctx.user.role !== "facilitator") {
    throw new TRPCError3({ code: "FORBIDDEN", message: "Facilitator or admin access required" });
  }
  return next({ ctx });
});
var appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    register: publicProcedure.input(z2.object({
      email: z2.string().email(),
      password: z2.string().min(6),
      name: z2.string().min(2)
    })).mutation(async ({ input, ctx }) => {
      const { data, error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: {
            name: input.name
          }
        }
      });
      if (error) {
        throw new TRPCError3({ code: "BAD_REQUEST", message: error.message });
      }
      if (data.session) {
        setAuthCookies(ctx.res, data.session.access_token, data.session.refresh_token);
      }
      return { success: true, user: data.user };
    }),
    login: publicProcedure.input(z2.object({
      email: z2.string().email(),
      password: z2.string()
    })).mutation(async ({ input, ctx }) => {
      try {
        console.log("[Login] Tentando login para:", input.email);
        const { data, error } = await supabase.auth.signInWithPassword({
          email: input.email,
          password: input.password
        });
        if (error) {
          console.error("[Login] Erro do Supabase:", error);
          throw new TRPCError3({
            code: "UNAUTHORIZED",
            message: "Credenciais inv\xE1lidas. Verifique seu email e senha."
          });
        }
        if (!data.session) {
          console.error("[Login] Sem sess\xE3o retornada");
          throw new TRPCError3({
            code: "UNAUTHORIZED",
            message: "Erro ao criar sess\xE3o. Tente novamente."
          });
        }
        console.log("[Login] Login bem-sucedido para:", input.email);
        setAuthCookies(ctx.res, data.session.access_token, data.session.refresh_token);
        return { success: true, user: data.user };
      } catch (error) {
        console.error("[Login] Erro inesperado:", error);
        if (error instanceof TRPCError3) {
          throw error;
        }
        throw new TRPCError3({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao processar login. Tente novamente."
        });
      }
    }),
    logout: publicProcedure.mutation(async ({ ctx }) => {
      await supabase.auth.signOut();
      clearAuthCookies(ctx.res);
      return { success: true };
    }),
    resetPassword: publicProcedure.input(z2.object({ email: z2.string().email() })).mutation(async ({ input }) => {
      const { error } = await supabase.auth.resetPasswordForEmail(input.email);
      if (error) {
        throw new TRPCError3({ code: "BAD_REQUEST", message: error.message });
      }
      return { success: true };
    })
  }),
  // ============ USER & PROFILE ============
  users: router({
    getAll: protectedProcedure.query(async () => {
      return await getAllUsers();
    }),
    getById: protectedProcedure.input(z2.object({ id: z2.number() })).query(async ({ input }) => {
      return await getUserById(input.id);
    }),
    getProfile: protectedProcedure.input(z2.object({ userId: z2.number() })).query(async ({ input }) => {
      return await getProfileByUserId(input.userId);
    }),
    updateProfile: protectedProcedure.input(z2.object({
      company: z2.string().optional(),
      segment: z2.string().optional(),
      phone: z2.string().optional(),
      address: z2.string().optional(),
      city: z2.string().optional(),
      state: z2.string().optional(),
      zipCode: z2.string().optional(),
      bio: z2.string().optional(),
      avatarUrl: z2.string().optional(),
      linkedinUrl: z2.string().optional(),
      facebookUrl: z2.string().optional(),
      instagramUrl: z2.string().optional(),
      websiteUrl: z2.string().optional()
    })).mutation(async ({ ctx, input }) => {
      await upsertProfile({
        userId: ctx.user.id,
        ...input
      });
      return { success: true };
    })
  }),
  // ============ GROUPS ============
  groups: router({
    getAll: protectedProcedure.query(async () => {
      return await getAllGroups();
    }),
    getById: protectedProcedure.input(z2.object({ id: z2.number() })).query(async ({ input }) => {
      return await getGroupById(input.id);
    }),
    create: adminProcedure2.input(z2.object({
      name: z2.string(),
      description: z2.string().optional(),
      facilitatorId: z2.number().optional()
    })).mutation(async ({ input }) => {
      await createGroup(input);
      return { success: true };
    }),
    getMembers: protectedProcedure.input(z2.object({ groupId: z2.number() })).query(async ({ input }) => {
      return await getGroupMembers(input.groupId);
    }),
    addMember: facilitatorProcedure.input(z2.object({
      groupId: z2.number(),
      userId: z2.number()
    })).mutation(async ({ input }) => {
      await addMemberToGroup(input.groupId, input.userId);
      return { success: true };
    }),
    removeMember: facilitatorProcedure.input(z2.object({
      groupId: z2.number(),
      userId: z2.number()
    })).mutation(async ({ input }) => {
      await removeMemberFromGroup(input.groupId, input.userId);
      return { success: true };
    })
  }),
  // ============ ACTIVITIES ============
  activities: router({
    create: protectedProcedure.input(z2.object({
      type: z2.enum(["referral", "business", "meeting", "testimonial"]),
      toUserId: z2.number().optional(),
      groupId: z2.number().optional(),
      title: z2.string().optional(),
      description: z2.string(),
      value: z2.number().optional(),
      points: z2.number().default(10),
      activityDate: z2.date()
    })).mutation(async ({ ctx, input }) => {
      await createActivity({
        fromUserId: ctx.user.id,
        ...input
      });
      if (input.toUserId) {
        await createNotification({
          userId: input.toUserId,
          type: input.type,
          title: `Nova ${input.type === "referral" ? "indica\xE7\xE3o" : input.type === "business" ? "neg\xF3cio" : input.type === "meeting" ? "reuni\xE3o" : "depoimento"}`,
          message: `${ctx.user.name} registrou uma atividade relacionada a voc\xEA.`
        });
      }
      return { success: true };
    }),
    getByUser: protectedProcedure.input(z2.object({
      userId: z2.number().optional(),
      limit: z2.number().default(50)
    })).query(async ({ ctx, input }) => {
      const userId = input.userId || ctx.user.id;
      return await getActivitiesByUser(userId, input.limit);
    }),
    getRecent: protectedProcedure.input(z2.object({ limit: z2.number().default(50) })).query(async ({ input }) => {
      return await getRecentActivities(input.limit);
    })
  }),
  // ============ GAMIFICATION ============
  gamification: router({
    getLeaderboard: protectedProcedure.input(z2.object({
      month: z2.number().optional(),
      limit: z2.number().default(10)
    })).query(async ({ input }) => {
      const now = /* @__PURE__ */ new Date();
      const month = input.month || parseInt(
        now.getFullYear().toString() + (now.getMonth() + 1).toString().padStart(2, "0")
      );
      return await getMonthlyLeaderboard(month, input.limit);
    }),
    getUserScore: protectedProcedure.input(z2.object({
      userId: z2.number().optional(),
      month: z2.number().optional()
    })).query(async ({ ctx, input }) => {
      const userId = input.userId || ctx.user.id;
      const now = /* @__PURE__ */ new Date();
      const month = input.month || parseInt(
        now.getFullYear().toString() + (now.getMonth() + 1).toString().padStart(2, "0")
      );
      return await getUserScore(userId, month);
    })
  }),
  // ============ MEETINGS ============
  meetings: router({
    create: facilitatorProcedure.input(z2.object({
      groupId: z2.number().optional(),
      title: z2.string(),
      description: z2.string().optional(),
      meetingDate: z2.date(),
      location: z2.string()
    })).mutation(async ({ ctx, input }) => {
      await createMeeting({
        ...input,
        createdBy: ctx.user.id
      });
      return { success: true };
    }),
    getByGroup: protectedProcedure.input(z2.object({ groupId: z2.number() })).query(async ({ input }) => {
      return await getMeetingsByGroup(input.groupId);
    }),
    getAll: protectedProcedure.query(async () => {
      return await getAllMeetings();
    })
  }),
  // ============ GUESTS ============
  guests: router({
    create: facilitatorProcedure.input(z2.object({
      name: z2.string(),
      email: z2.string().email().optional(),
      phone: z2.string().optional(),
      company: z2.string().optional(),
      notes: z2.string().optional()
    })).mutation(async ({ ctx, input }) => {
      await createGuest({
        ...input,
        invitedBy: ctx.user.id
      });
      return { success: true };
    }),
    addToMeeting: facilitatorProcedure.input(z2.object({
      meetingId: z2.number(),
      guestId: z2.number()
    })).mutation(async ({ input }) => {
      await addGuestToMeeting(input.meetingId, input.guestId);
      return { success: true };
    }),
    getByMeeting: protectedProcedure.input(z2.object({ meetingId: z2.number() })).query(async ({ input }) => {
      return await getMeetingGuests(input.meetingId);
    })
  }),
  // ============ CONTENTS ============
  contents: router({
    create: adminProcedure2.input(z2.object({
      title: z2.string(),
      description: z2.string().optional(),
      category: z2.string().optional(),
      type: z2.enum(["video", "document", "presentation", "link"]),
      url: z2.string(),
      thumbnailUrl: z2.string().optional(),
      fileKey: z2.string().optional()
    })).mutation(async ({ ctx, input }) => {
      await createContent({
        ...input,
        createdBy: ctx.user.id
      });
      return { success: true };
    }),
    getAll: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role === "guest") {
        throw new TRPCError3({ code: "FORBIDDEN", message: "Guests cannot access contents" });
      }
      return await getAllContents();
    }),
    getById: protectedProcedure.input(z2.object({ id: z2.number() })).query(async ({ ctx, input }) => {
      if (ctx.user.role === "guest") {
        throw new TRPCError3({ code: "FORBIDDEN", message: "Guests cannot access contents" });
      }
      return await getContentById(input.id);
    })
  }),
  // ============ UPLOAD ============
  upload: router({
    getUploadUrl: protectedProcedure.input(z2.object({
      fileName: z2.string(),
      fileType: z2.string(),
      bucket: z2.enum(["avatars", "documents", "videos"])
    })).mutation(async () => {
      return { uploadUrl: "/api/upload", method: "POST" };
    })
  }),
  // ============ NOTIFICATIONS ============
  notifications: router({
    getMyNotifications: protectedProcedure.input(z2.object({ limit: z2.number().default(50) })).query(async ({ ctx, input }) => {
      return await getUserNotifications(ctx.user.id, input.limit);
    }),
    markAsRead: protectedProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ input }) => {
      await markNotificationAsRead(input.id);
      return { success: true };
    })
  })
});

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  user = await getUserFromRequest(opts.req);
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// api/index.ts
var app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.url}`);
  next();
});
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext
  })
);
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
var index_default = app;
export {
  index_default as default
};
