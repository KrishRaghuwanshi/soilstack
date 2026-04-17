import { createClient } from "npm:@supabase/supabase-js";
import { createHash } from "node:crypto";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req: Request) => {
  const { submission_id } = await req.json();
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  // Fetch full submission
  const { data: sub, error } = await supabase
    .from("submissions")
    .select("*, farmers(*)")
    .eq("id", submission_id)
    .single();

  if (error || !sub) {
    return new Response(
      JSON.stringify({ error: "Submission not found" }),
      { status: 404 }
    );
  }

  // Verify all three checks passed
  if (!sub.ai_verified || !sub.satellite_verified || !sub.validator_verified) {
    return new Response(
      JSON.stringify({ error: "Not all verifications complete" }),
      { status: 400 }
    );
  }

  // Generate unique credit hash
  const lat = sub.burial_gps?.coordinates?.[1]?.toFixed(6) || "0";
  const lng = sub.burial_gps?.coordinates?.[0]?.toFixed(6) || "0";
  const date = sub.created_at.split("T")[0];
  const hashInput = `${lat}_${lng}_${date}_${sub.farmer_id}`;
  const hash = createHash("sha256").update(hashInput).digest("hex");

  // Check for duplicate
  const { data: existing } = await supabase
    .from("credit_registry")
    .select("id")
    .eq("credit_hash", hash)
    .single();

  if (existing) {
    return new Response(
      JSON.stringify({ error: "Duplicate credit detected" }),
      { status: 409 }
    );
  }

  // Issue credit to registry
  await supabase.from("credit_registry").insert({
    credit_hash: hash,
    submission_id: sub.id,
    farmer_id: sub.farmer_id,
    cooperative_id: sub.farmers?.cooperative_id,
    tonnes: sub.estimated_tonnes,
    quality_score: sub.quality_score,
    carbon_tier: sub.carbon_tier,
    price_usd: sub.credit_price_usd,
  });

  // Update submission status
  await supabase
    .from("submissions")
    .update({
      credit_hash: hash,
      credit_minted: true,
      credit_minted_at: new Date().toISOString(),
      status: "minted",
    })
    .eq("id", submission_id);

  return new Response(
    JSON.stringify({ success: true, credit_hash: hash }),
    { headers: { "Content-Type": "application/json" } }
  );
});
