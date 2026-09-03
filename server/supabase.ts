import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;
  if (!client) {
    client = createClient(url, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return client;
}

export async function insertDeliveryToken(input: {
  tokenHash: string;
  email: string;
  storageKey: string;
  expiresAt: Date;
}) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase is not configured");
  const { error } = await supabase.from("delivery_tokens").insert({
    token_hash: input.tokenHash,
    email: input.email,
    storage_key: input.storageKey,
    expires_at: input.expiresAt.toISOString(),
  });
  if (error) throw error;
}

export async function consumeDeliveryTokenRecord(tokenHash: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase || !tokenHash) return null;
  const { data, error } = await supabase
    .from("delivery_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("token_hash", tokenHash)
    .is("used_at", null)
    .gt("expires_at", new Date().toISOString())
    .select("id, token_hash, email, storage_key, expires_at, used_at, created_at")
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function recordWebhookEvent(eventId: string, eventName: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase is not configured");
  const { error } = await supabase.from("processed_webhook_events").insert({
    event_id: eventId,
    event_name: eventName,
  });
  if (!error) return { duplicate: false } as const;
  if (error.code === "23505") return { duplicate: true } as const;
  throw error;
}
