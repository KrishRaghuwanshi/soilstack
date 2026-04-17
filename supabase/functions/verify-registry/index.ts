import { createClient } from "npm:@supabase/supabase-js";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

// PUBLIC endpoint — no auth required
Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const hash = url.searchParams.get("hash");

  if (!hash) {
    return new Response(
      JSON.stringify({ error: "Missing hash parameter" }),
      { status: 400 }
    );
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  try {
    const { data } = await supabase
      .from("credit_registry")
      .select(
        "issued_at, tonnes, carbon_tier, is_retired, farmer_id, cooperative_id"
      )
      .eq("credit_hash", hash)
      .single();

    return new Response(
      JSON.stringify({
        exists: !!data,
        issued_at: data?.issued_at ?? null,
        tonnes: data?.tonnes ?? null,
        carbon_tier: data?.carbon_tier ?? null,
        is_retired: data?.is_retired ?? false,
        platform: "SoilStack",
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch {
    return new Response(
      JSON.stringify({ exists: false, platform: "SoilStack" }),
      { headers: { "Content-Type": "application/json" } }
    );
  }
});
