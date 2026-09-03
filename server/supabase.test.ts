import { afterEach, describe, expect, it } from "vitest";
import { getSupabaseAdmin } from "./supabase";

afterEach(() => {
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
});

describe("Supabase server configuration", () => {
  it("does not create a client when server credentials are absent", () => {
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    expect(getSupabaseAdmin()).toBeNull();
  });
});
