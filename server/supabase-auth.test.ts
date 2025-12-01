import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { supabase } from "./supabase";

// Mock context for testing
function createMockContext(overrides?: Partial<TrpcContext>): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
      cookies: {},
    } as TrpcContext["req"],
    res: {
      cookie: () => {},
      clearCookie: () => {},
    } as TrpcContext["res"],
    ...overrides,
  };
}

describe("Supabase Auth Integration", () => {
  let testEmail: string;
  let testPassword: string;

  beforeAll(() => {
    // Generate unique test email to avoid conflicts
    testEmail = `test-${Date.now()}@example.com`;
    testPassword = "test123456";
  });

  it("should register a new user", async () => {
    // Register directly via Supabase Admin API to bypass email confirmation
    const { data, error } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        name: "Test User",
      },
    });

    expect(error).toBeNull();
    expect(data.user).toBeDefined();
    expect(data.user?.email).toBe(testEmail);
  });

  it("should not allow duplicate email registration", async () => {
    const { error } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
      user_metadata: {
        name: "Duplicate User",
      },
    });

    expect(error).toBeDefined();
  });

  it("should login with valid credentials", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.login({
      email: testEmail,
      password: testPassword,
    });

    expect(result.success).toBe(true);
    expect(result.user).toBeDefined();
    expect(result.user?.email).toBe(testEmail);
  });

  it("should not login with invalid credentials", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.auth.login({
        email: testEmail,
        password: "wrongpassword",
      })
    ).rejects.toThrow("Credenciais inválidas");
  });

  it("should logout successfully", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.logout();

    expect(result.success).toBe(true);
  });

  it("should send password reset email", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.resetPassword({
      email: testEmail,
    });

    expect(result.success).toBe(true);
  });

  it("should return null for unauthenticated user", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const user = await caller.auth.me();

    expect(user).toBeNull();
  });

  // Cleanup: Delete test user after all tests
  it("should cleanup test user", async () => {
    // Get user by email
    const { data: users } = await supabase
      .from("users")
      .select("open_id")
      .eq("email", testEmail)
      .limit(1);

    if (users && users.length > 0) {
      const openId = users[0].open_id;
      
      // Delete from Supabase Auth
      const { error } = await supabase.auth.admin.deleteUser(openId);
      
      // Note: The trigger should automatically delete from public.users
      expect(error).toBeNull();
    }
  });
});
