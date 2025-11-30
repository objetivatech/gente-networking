import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
    email: `test${userId}@example.com`,
    name: `Test User ${userId}`,
    loginMethod: "manus",
    role: 'member',
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

describe("gamification", () => {
  it("should get monthly leaderboard", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const leaderboard = await caller.gamification.getLeaderboard({ limit: 10 });

    expect(Array.isArray(leaderboard)).toBe(true);
  });

  it("should get user score for current month", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const score = await caller.gamification.getUserScore({});

    // Score can be undefined if no activities yet
    expect(score === undefined || typeof score === 'object').toBe(true);
  });

  it("should get user score for specific user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const score = await caller.gamification.getUserScore({ userId: 1 });

    expect(score === undefined || typeof score === 'object').toBe(true);
  });
});
