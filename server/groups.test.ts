import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { TRPCError } from "@trpc/server";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(role: 'admin' | 'facilitator' | 'member' | 'guest' = 'member'): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("groups", () => {
  it("should get all groups", async () => {
    const { ctx } = createAuthContext('member');
    const caller = appRouter.createCaller(ctx);

    const groups = await caller.groups.getAll();

    expect(Array.isArray(groups)).toBe(true);
  });

  it("should allow admin to create group", async () => {
    const { ctx } = createAuthContext('admin');
    const caller = appRouter.createCaller(ctx);

    const result = await caller.groups.create({
      name: 'Test Group',
      description: 'A test group for networking',
    });

    expect(result).toEqual({ success: true });
  });

  it("should not allow member to create group", async () => {
    const { ctx } = createAuthContext('member');
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.groups.create({
        name: 'Test Group',
        description: 'A test group for networking',
      })
    ).rejects.toThrow();
  });

  it("should get group members", async () => {
    const { ctx } = createAuthContext('facilitator');
    const caller = appRouter.createCaller(ctx);

    const members = await caller.groups.getMembers({ groupId: 1 });

    expect(Array.isArray(members)).toBe(true);
  });
});
