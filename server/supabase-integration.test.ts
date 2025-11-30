import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { supabaseAdmin } from "./supabase";
import * as db from "./db";

describe("Supabase Integration Tests", () => {
  let testUserId: number;
  let testGroupId: number;
  let testMeetingId: number;

  beforeAll(async () => {
    // Clean up test data before running tests
    await supabaseAdmin.from('activities').delete().like('description', 'TEST_%');
    await supabaseAdmin.from('scores').delete().eq('user_id', 99999);
    await supabaseAdmin.from('users').delete().eq('open_id', 'test-user-123');
    
    // Create a test user
    await db.upsertUser({
      openId: 'test-user-123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'member',
    });

    const user = await db.getUserByOpenId('test-user-123');
    if (user) {
      testUserId = user.id;
    }
  });

  afterAll(async () => {
    // Clean up test data after all tests
    await supabaseAdmin.from('activities').delete().like('description', 'TEST_%');
    await supabaseAdmin.from('scores').delete().eq('user_id', testUserId);
    await supabaseAdmin.from('users').delete().eq('open_id', 'test-user-123');
  });

  describe("User Management", () => {
    it("should create and retrieve user", async () => {
      const user = await db.getUserByOpenId('test-user-123');
      
      expect(user).toBeDefined();
      expect(user?.name).toBe('Test User');
      expect(user?.email).toBe('test@example.com');
      expect(user?.role).toBe('member');
    });

    it("should update existing user", async () => {
      await db.upsertUser({
        openId: 'test-user-123',
        name: 'Updated Test User',
        email: 'updated@example.com',
      });

      const user = await db.getUserByOpenId('test-user-123');
      expect(user?.name).toBe('Updated Test User');
      expect(user?.email).toBe('updated@example.com');
    });

    it("should get all users", async () => {
      const users = await db.getAllUsers();
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
    });
  });

  describe("Profile Management", () => {
    it("should create and retrieve profile", async () => {
      await db.upsertProfile({
        userId: testUserId,
        company: 'Test Company',
        position: 'Test Position',
        phone: '123456789',
      });

      const profile = await db.getProfileByUserId(testUserId);
      expect(profile).toBeDefined();
      expect(profile?.company).toBe('Test Company');
      expect(profile?.position).toBe('Test Position');
    });

    it("should update existing profile", async () => {
      await db.upsertProfile({
        userId: testUserId,
        company: 'Updated Company',
        bio: 'Test bio',
      });

      const profile = await db.getProfileByUserId(testUserId);
      expect(profile?.company).toBe('Updated Company');
      expect(profile?.bio).toBe('Test bio');
    });
  });

  describe("Activity Management", () => {
    it("should create referral activity", async () => {
      await db.createActivity({
        fromUserId: testUserId,
        type: 'referral',
        description: 'TEST_Referral activity',
        points: 10,
        activityDate: new Date(),
      });

      const activities = await db.getActivitiesByUser(testUserId);
      const referral = activities.find(a => a.description === 'TEST_Referral activity');
      
      expect(referral).toBeDefined();
      expect(referral?.type).toBe('referral');
      expect(referral?.points).toBe(10);
    });

    it("should create business activity with value", async () => {
      await db.createActivity({
        fromUserId: testUserId,
        type: 'business',
        description: 'TEST_Business activity',
        value: 100000, // R$ 1000.00 in cents
        points: 50,
        activityDate: new Date(),
      });

      const activities = await db.getActivitiesByUser(testUserId);
      const business = activities.find(a => a.description === 'TEST_Business activity');
      
      expect(business).toBeDefined();
      expect(business?.type).toBe('business');
      expect(business?.value).toBe(100000);
      expect(business?.points).toBe(50);
    });

    it("should get recent activities", async () => {
      const activities = await db.getRecentActivities(10);
      expect(Array.isArray(activities)).toBe(true);
    });
  });

  describe("Gamification", () => {
    it("should track user score", async () => {
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      const score = await db.getUserScore(testUserId, month, year);
      
      expect(score).toBeDefined();
      expect(score?.total_points).toBeGreaterThan(0);
      expect(score?.referral_count).toBeGreaterThanOrEqual(1);
      expect(score?.business_count).toBeGreaterThanOrEqual(1);
    });

    it("should get monthly leaderboard", async () => {
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      const leaderboard = await db.getMonthlyLeaderboard(month, year, 10);
      
      expect(Array.isArray(leaderboard)).toBe(true);
    });
  });

  describe("Group Management", () => {
    it("should create group", async () => {
      await db.createGroup({
        name: 'Test Group',
        description: 'Test group description',
      });

      const groups = await db.getAllGroups();
      const testGroup = groups.find(g => g.name === 'Test Group');
      
      expect(testGroup).toBeDefined();
      if (testGroup) {
        testGroupId = testGroup.id;
      }
    });

    it("should add member to group", async () => {
      if (testGroupId) {
        await db.addMemberToGroup(testGroupId, testUserId);
        
        const members = await db.getGroupMembers(testGroupId);
        expect(members.length).toBeGreaterThan(0);
      }
    });

    it("should get all groups", async () => {
      const groups = await db.getAllGroups();
      expect(Array.isArray(groups)).toBe(true);
      expect(groups.length).toBeGreaterThan(0);
    });
  });

  describe("Meeting Management", () => {
    it("should create meeting", async () => {
      const meetingDate = new Date();
      meetingDate.setDate(meetingDate.getDate() + 7); // Next week

      await db.createMeeting({
        groupId: testGroupId,
        title: 'Test Meeting',
        description: 'Test meeting description',
        meetingDate,
        location: 'Test Location',
        createdBy: testUserId,
      });

      const meetings = await db.getAllMeetings();
      const testMeeting = meetings.find(m => m.title === 'Test Meeting');
      
      expect(testMeeting).toBeDefined();
      if (testMeeting) {
        testMeetingId = testMeeting.id;
      }
    });

    it("should get all meetings", async () => {
      const meetings = await db.getAllMeetings();
      expect(Array.isArray(meetings)).toBe(true);
    });
  });

  describe("Guest Management", () => {
    it("should create guest", async () => {
      await db.createGuest({
        name: 'Test Guest',
        email: 'guest@example.com',
        company: 'Guest Company',
        invitedBy: testUserId,
      });

      const guests = await db.getAllGuests();
      const testGuest = guests.find(g => g.name === 'Test Guest');
      
      expect(testGuest).toBeDefined();
      expect(testGuest?.email).toBe('guest@example.com');
    });

    it("should get all guests", async () => {
      const guests = await db.getAllGuests();
      expect(Array.isArray(guests)).toBe(true);
      expect(guests.length).toBeGreaterThan(0);
    });
  });

  describe("Content Management", () => {
    it("should create content", async () => {
      await db.createContent({
        title: 'Test Content',
        description: 'Test content description',
        type: 'document',
        url: 'https://example.com/test.pdf',
        category: 'Test Category',
        createdBy: testUserId,
      });

      const contents = await db.getAllContents();
      const testContent = contents.find(c => c.title === 'Test Content');
      
      expect(testContent).toBeDefined();
      expect(testContent?.type).toBe('document');
    });

    it("should get all contents", async () => {
      const contents = await db.getAllContents();
      expect(Array.isArray(contents)).toBe(true);
    });
  });
});
