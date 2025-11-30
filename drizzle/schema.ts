import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extended with role field for access control.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["admin", "facilitator", "member", "guest"]).default("member").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Extended user profiles with additional information
 */
export const profiles = mysqlTable("profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  company: text("company"),
  segment: text("segment"),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 2 }),
  zipCode: varchar("zipCode", { length: 10 }),
  bio: text("bio"),
  avatarUrl: text("avatarUrl"),
  linkedinUrl: text("linkedinUrl"),
  facebookUrl: text("facebookUrl"),
  instagramUrl: text("instagramUrl"),
  websiteUrl: text("websiteUrl"),
  classification: varchar("classification", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;

/**
 * Groups/Teams for networking
 */
export const groups = mysqlTable("groups", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  facilitatorId: int("facilitatorId").references(() => users.id, { onDelete: "set null" }),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Group = typeof groups.$inferSelect;
export type InsertGroup = typeof groups.$inferInsert;

/**
 * Association table between users and groups
 */
export const groupMembers = mysqlTable("groupMembers", {
  id: int("id").autoincrement().primaryKey(),
  groupId: int("groupId").notNull().references(() => groups.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
});

export type GroupMember = typeof groupMembers.$inferSelect;
export type InsertGroupMember = typeof groupMembers.$inferInsert;

/**
 * Activities: referrals, business, meetings, testimonials
 */
export const activities = mysqlTable("activities", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["referral", "business", "meeting", "testimonial"]).notNull(),
  fromUserId: int("fromUserId").notNull().references(() => users.id, { onDelete: "cascade" }),
  toUserId: int("toUserId").references(() => users.id, { onDelete: "cascade" }),
  groupId: int("groupId").references(() => groups.id, { onDelete: "set null" }),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  value: int("value"), // For business activities (in cents)
  points: int("points").default(0).notNull(),
  activityDate: timestamp("activityDate").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = typeof activities.$inferInsert;

/**
 * Gamification scores (monthly)
 */
export const scores = mysqlTable("scores", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  groupId: int("groupId").references(() => groups.id, { onDelete: "set null" }),
  month: int("month").notNull(), // YYYYMM format
  totalPoints: int("totalPoints").default(0).notNull(),
  referralCount: int("referralCount").default(0).notNull(),
  businessCount: int("businessCount").default(0).notNull(),
  meetingCount: int("meetingCount").default(0).notNull(),
  testimonialCount: int("testimonialCount").default(0).notNull(),
  totalBusinessValue: int("totalBusinessValue").default(0).notNull(), // in cents
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Score = typeof scores.$inferSelect;
export type InsertScore = typeof scores.$inferInsert;

/**
 * Meetings/Events
 */
export const meetings = mysqlTable("meetings", {
  id: int("id").autoincrement().primaryKey(),
  groupId: int("groupId").notNull().references(() => groups.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  meetingDate: timestamp("meetingDate").notNull(),
  location: text("location"),
  isCompleted: boolean("isCompleted").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Meeting = typeof meetings.$inferSelect;
export type InsertMeeting = typeof meetings.$inferInsert;

/**
 * Guests for meetings
 */
export const guests = mysqlTable("guests", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  company: text("company"),
  invitedBy: int("invitedBy").references(() => users.id, { onDelete: "set null" }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Guest = typeof guests.$inferSelect;
export type InsertGuest = typeof guests.$inferInsert;

/**
 * Association table between guests and meetings
 */
export const meetingGuests = mysqlTable("meetingGuests", {
  id: int("id").autoincrement().primaryKey(),
  meetingId: int("meetingId").notNull().references(() => meetings.id, { onDelete: "cascade" }),
  guestId: int("guestId").notNull().references(() => guests.id, { onDelete: "cascade" }),
  attended: boolean("attended").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MeetingGuest = typeof meetingGuests.$inferSelect;
export type InsertMeetingGuest = typeof meetingGuests.$inferInsert;

/**
 * Strategic contents (videos, documents, presentations)
 */
export const contents = mysqlTable("contents", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  type: mysqlEnum("type", ["video", "document", "presentation", "link"]).notNull(),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnailUrl"),
  fileKey: text("fileKey"), // S3 file key if uploaded
  isActive: boolean("isActive").default(true).notNull(),
  createdBy: int("createdBy").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Content = typeof contents.$inferSelect;
export type InsertContent = typeof contents.$inferInsert;

/**
 * Notifications
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  relatedId: int("relatedId"), // ID of related activity, meeting, etc.
  relatedType: varchar("relatedType", { length: 50 }), // Type of related entity
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),
  groupMemberships: many(groupMembers),
  activities: many(activities),
  scores: many(scores),
  notifications: many(notifications),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));

export const groupsRelations = relations(groups, ({ one, many }) => ({
  facilitator: one(users, {
    fields: [groups.facilitatorId],
    references: [users.id],
  }),
  members: many(groupMembers),
  activities: many(activities),
  meetings: many(meetings),
}));

export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
  group: one(groups, {
    fields: [groupMembers.groupId],
    references: [groups.id],
  }),
  user: one(users, {
    fields: [groupMembers.userId],
    references: [users.id],
  }),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  fromUser: one(users, {
    fields: [activities.fromUserId],
    references: [users.id],
  }),
  toUser: one(users, {
    fields: [activities.toUserId],
    references: [users.id],
  }),
  group: one(groups, {
    fields: [activities.groupId],
    references: [groups.id],
  }),
}));

export const scoresRelations = relations(scores, ({ one }) => ({
  user: one(users, {
    fields: [scores.userId],
    references: [users.id],
  }),
  group: one(groups, {
    fields: [scores.groupId],
    references: [groups.id],
  }),
}));

export const meetingsRelations = relations(meetings, ({ one, many }) => ({
  group: one(groups, {
    fields: [meetings.groupId],
    references: [groups.id],
  }),
  guests: many(meetingGuests),
}));

export const guestsRelations = relations(guests, ({ one, many }) => ({
  invitedBy: one(users, {
    fields: [guests.invitedBy],
    references: [users.id],
  }),
  meetings: many(meetingGuests),
}));

export const meetingGuestsRelations = relations(meetingGuests, ({ one }) => ({
  meeting: one(meetings, {
    fields: [meetingGuests.meetingId],
    references: [meetings.id],
  }),
  guest: one(guests, {
    fields: [meetingGuests.guestId],
    references: [guests.id],
  }),
}));

export const contentsRelations = relations(contents, ({ one }) => ({
  creator: one(users, {
    fields: [contents.createdBy],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));
