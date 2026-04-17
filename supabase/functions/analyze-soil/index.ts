import Anthropic from "npm:@anthropic-ai/sdk";

const client = new Anthropic();

Deno.serve(async (req: Request) => {
  const { image_url, farmer_id } = await req.json();

  const imageResponse = await fetch(image_url);
  const imageBuffer = await imageResponse.arrayBuffer();
  const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));
  const mediaType = "image/jpeg";

  const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 512,
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
            text: `Analyze this soil sample photo submitted by a smallholder farmer who has been applying biochar to their field.

Return ONLY valid JSON:
{
  "darkness_score": <0-100, where 100 is richest black soil>,
  "estimated_organic_matter_pct": <0-10 number>,
  "color_description": "<one sentence>",
  "biochar_visible": <boolean>,
  "health_assessment": "<one positive sentence about soil health>",
  "recommendation": "<one actionable recommendation>"
}`,
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
    result = {
      darkness_score: 0,
      estimated_organic_matter_pct: 0,
      color_description: "Unable to analyze",
      biochar_visible: false,
      health_assessment: "Unable to assess",
      recommendation: "Please retake the photo in better lighting",
    };
  }

  return new Response(JSON.stringify(result), {
    headers: { "Content-Type": "application/json" },
  });
});
