import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../db.js";
import { getUserFromRequest } from "./supabase-auth.js";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  // Get user from Supabase session
  user = await getUserFromRequest(opts.req);

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
