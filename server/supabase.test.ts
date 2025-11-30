import { describe, expect, it } from "vitest";
import { supabase, supabaseAdmin } from "./supabase";

describe("Supabase Connection", () => {
  it("should connect to Supabase with anon key", async () => {
    // Test basic connection by querying users table
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    // Should not have error (even if no data)
    expect(error).toBeNull();
  });

  it("should connect to Supabase with service role key", async () => {
    // Test admin connection
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1);

    // Should not have error
    expect(error).toBeNull();
  });

  it("should have correct Supabase URL configured", () => {
    const url = process.env.SUPABASE_URL;
    expect(url).toBeDefined();
    expect(url).toContain('supabase.co');
  });

  it("should have Supabase keys configured", () => {
    const anonKey = process.env.SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_KEY;
    
    expect(anonKey).toBeDefined();
    expect(anonKey).toMatch(/^eyJ/); // JWT format
    expect(serviceKey).toBeDefined();
    expect(serviceKey).toMatch(/^eyJ/); // JWT format
  });
});
