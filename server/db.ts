import { eq, and, desc, sql, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, profiles, InsertProfile, groups, InsertGroup,
  groupMembers, InsertGroupMember, activities, InsertActivity,
  scores, InsertScore, meetings, InsertMeeting, guests, InsertGuest,
  meetingGuests, InsertMeetingGuest, contents, InsertContent,
  notifications, InsertNotification
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ USER MANAGEMENT ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(users).orderBy(users.name);
}

// ============ PROFILE MANAGEMENT ============

export async function getProfileByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertProfile(profile: InsertProfile) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await getProfileByUserId(profile.userId);
  
  if (existing) {
    await db.update(profiles).set(profile).where(eq(profiles.userId, profile.userId));
  } else {
    await db.insert(profiles).values(profile);
  }
}

// ============ GROUP MANAGEMENT ============

export async function getAllGroups() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(groups).where(eq(groups.isActive, true)).orderBy(groups.name);
}

export async function getGroupById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(groups).where(eq(groups.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createGroup(group: InsertGroup) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(groups).values(group);
}

export async function getGroupMembers(groupId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select({
      id: groupMembers.id,
      userId: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      joinedAt: groupMembers.joinedAt,
    })
    .from(groupMembers)
    .innerJoin(users, eq(groupMembers.userId, users.id))
    .where(eq(groupMembers.groupId, groupId));
}

export async function addMemberToGroup(groupId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(groupMembers).values({ groupId, userId });
}

export async function removeMemberFromGroup(groupId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(groupMembers).where(
    and(
      eq(groupMembers.groupId, groupId),
      eq(groupMembers.userId, userId)
    )
  );
}

// ============ ACTIVITY MANAGEMENT ============

export async function createActivity(activity: InsertActivity) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(activities).values(activity);
  
  // Update scores
  const month = parseInt(
    activity.activityDate.getFullYear().toString() + 
    (activity.activityDate.getMonth() + 1).toString().padStart(2, '0')
  );
  
  await updateUserScore(activity.fromUserId, month, activity.type, activity.points || 0, activity.value || 0);
}

export async function getActivitiesByUser(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(activities)
    .where(
      sql`${activities.fromUserId} = ${userId} OR ${activities.toUserId} = ${userId}`
    )
    .orderBy(desc(activities.activityDate))
    .limit(limit);
}

export async function getRecentActivities(limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(activities)
    .orderBy(desc(activities.createdAt))
    .limit(limit);
}

// ============ SCORE/GAMIFICATION MANAGEMENT ============

export async function updateUserScore(
  userId: number, 
  month: number, 
  activityType: string, 
  points: number,
  businessValue: number = 0
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await db
    .select()
    .from(scores)
    .where(and(eq(scores.userId, userId), eq(scores.month, month)))
    .limit(1);
  
  if (existing.length > 0) {
    const current = existing[0];
    const updates: Partial<InsertScore> = {
      totalPoints: (current.totalPoints || 0) + points,
    };
    
    switch (activityType) {
      case 'referral':
        updates.referralCount = (current.referralCount || 0) + 1;
        break;
      case 'business':
        updates.businessCount = (current.businessCount || 0) + 1;
        updates.totalBusinessValue = (current.totalBusinessValue || 0) + businessValue;
        break;
      case 'meeting':
        updates.meetingCount = (current.meetingCount || 0) + 1;
        break;
      case 'testimonial':
        updates.testimonialCount = (current.testimonialCount || 0) + 1;
        break;
    }
    
    await db.update(scores).set(updates).where(eq(scores.id, current.id));
  } else {
    const newScore: InsertScore = {
      userId,
      month,
      totalPoints: points,
      referralCount: activityType === 'referral' ? 1 : 0,
      businessCount: activityType === 'business' ? 1 : 0,
      meetingCount: activityType === 'meeting' ? 1 : 0,
      testimonialCount: activityType === 'testimonial' ? 1 : 0,
      totalBusinessValue: activityType === 'business' ? businessValue : 0,
    };
    
    await db.insert(scores).values(newScore);
  }
}

export async function getMonthlyLeaderboard(month: number, limit: number = 10) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select({
      userId: scores.userId,
      userName: users.name,
      totalPoints: scores.totalPoints,
      referralCount: scores.referralCount,
      businessCount: scores.businessCount,
      meetingCount: scores.meetingCount,
      testimonialCount: scores.testimonialCount,
      totalBusinessValue: scores.totalBusinessValue,
    })
    .from(scores)
    .innerJoin(users, eq(scores.userId, users.id))
    .where(eq(scores.month, month))
    .orderBy(desc(scores.totalPoints))
    .limit(limit);
}

export async function getUserScore(userId: number, month: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db
    .select()
    .from(scores)
    .where(and(eq(scores.userId, userId), eq(scores.month, month)))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

// ============ MEETING MANAGEMENT ============

export async function createMeeting(meeting: InsertMeeting) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(meetings).values(meeting);
}

export async function getMeetingsByGroup(groupId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(meetings)
    .where(eq(meetings.groupId, groupId))
    .orderBy(desc(meetings.meetingDate));
}

export async function getAllMeetings() {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(meetings)
    .orderBy(desc(meetings.meetingDate));
}

// ============ GUEST MANAGEMENT ============

export async function createGuest(guest: InsertGuest) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(guests).values(guest);
}

export async function addGuestToMeeting(meetingId: number, guestId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(meetingGuests).values({ meetingId, guestId });
}

export async function getMeetingGuests(meetingId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select({
      id: meetingGuests.id,
      guestId: guests.id,
      name: guests.name,
      email: guests.email,
      phone: guests.phone,
      company: guests.company,
      attended: meetingGuests.attended,
    })
    .from(meetingGuests)
    .innerJoin(guests, eq(meetingGuests.guestId, guests.id))
    .where(eq(meetingGuests.meetingId, meetingId));
}

// ============ CONTENT MANAGEMENT ============

export async function createContent(content: InsertContent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(contents).values(content);
}

export async function getAllContents() {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(contents)
    .where(eq(contents.isActive, true))
    .orderBy(desc(contents.createdAt));
}

export async function getContentById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(contents).where(eq(contents.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============ NOTIFICATION MANAGEMENT ============

export async function createNotification(notification: InsertNotification) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(notifications).values(notification);
}

export async function getUserNotifications(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

export async function markNotificationAsRead(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
}
