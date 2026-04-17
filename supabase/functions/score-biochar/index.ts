import Anthropic from "npm:@anthropic-ai/sdk";

const client = new Anthropic();

Deno.serve(async (req: Request) => {
  const { image_url, farmer_id } = await req.json();

  // Fetch image and convert to base64
  const imageResponse = await fetch(image_url);
  const imageBuffer = await imageResponse.arrayBuffer();
  const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));
  const mediaType = "image/jpeg";

  const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType,
              data: base64Image,
            },
          },
          {
            type: "text",
            text: `You are an expert biochar quality analyst for a carbon credit verification system. Analyze this biochar photo.

Return ONLY valid JSON, no other text:
{
  "quality_score": <1-5 integer>,
  "carbon_tier": <"standard"|"premium"|"ultra">,
  "estimated_carbon_pct": <0-100 number>,
  "color_assessment": "<one sentence>",
  "structure_assessment": "<one sentence>",
  "improvement_tip": "<one actionable sentence>",
  "credit_price_usd": <number>,
  "confidence": <"low"|"medium"|"high">,
  "is_valid_biochar": <boolean>
}

SCORING:
5/ultra ($75-85/t): Matte jet black, highly porous, chunky, >80% C
4/premium ($60-74/t): Dark black, good porosity, minor gray, 65-80% C
3/standard ($40-59/t): Dark brown-black, moderate structure, 50-65% C
2/standard ($20-39/t): Mostly brown/gray, poor structure, 30-50% C
1/rejected: Gray ash, unburned material, <30% C
If not biochar: is_valid_biochar: false, quality_score: 0`,
          },
        ],
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "{}";

  let result;
  try {
    result = JSON.parse(text);
  } catch {
    result = { is_valid_biochar: false, quality_score: 0, confidence: "low" };
  }

  return new Response(JSON.stringify(result), {
    headers: { "Content-Type": "application/json" },
  });
});
