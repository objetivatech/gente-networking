import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

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

describe("activities", () => {
  it("should create a referral activity", async () => {
    const { ctx } = createAuthContext('member');
    const caller = appRouter.createCaller(ctx);

    const result = await caller.activities.create({
      type: 'referral',
      description: 'Indicação de cliente para João',
      points: 10,
      activityDate: new Date(),
    });

    expect(result).toEqual({ success: true });
  });

  it("should create a business activity with value", async () => {
    const { ctx } = createAuthContext('member');
    const caller = appRouter.createCaller(ctx);

    const result = await caller.activities.create({
      type: 'business',
      description: 'Fechamento de contrato de consultoria',
      value: 50000, // R$ 500,00 in cents
      points: 20,
      activityDate: new Date(),
    });

    expect(result).toEqual({ success: true });
  });

  it("should get recent activities", async () => {
    const { ctx } = createAuthContext('member');
    const caller = appRouter.createCaller(ctx);

    const activities = await caller.activities.getRecent({ limit: 10 });

    expect(Array.isArray(activities)).toBe(true);
  });

  it("should get activities by user", async () => {
    const { ctx } = createAuthContext('member');
    const caller = appRouter.createCaller(ctx);

    const activities = await caller.activities.getByUser({ limit: 10 });

    expect(Array.isArray(activities)).toBe(true);
  });
});
