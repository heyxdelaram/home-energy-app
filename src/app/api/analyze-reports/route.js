import OpenAI from "openai";
import { report } from "process";

const openai = new OpenAI({
  apiKey:,
});

export async function POST(req) {
  try {
    // ✅ Parse JSON safely
    const requestBody = await req.json();
    const prompt = requestBody.prompt;

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Missing prompt in request" }),
        { status: 400 }
      );
    }

    // ✅ Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
    });

    // ✅ Debug: Log OpenAI response
    console.log("OpenAI Response:", JSON.stringify(response, null, 2));

    // ✅ Ensure choices[0].message.content exists
    const summary = response.choices?.[0]?.message?.content;
    if (!summary) {
      return new Response(
        JSON.stringify({ error: "Unexpected OpenAI response format" }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify({ summary }), { status: 200 });
  } catch (error) {
    console.error("Error in API function:", error);

    // ✅ Return detailed error messages
    return new Response(
      JSON.stringify({ error: error.message || "Failed to analyze reports" }),
      { status: 500 }
    );
  }
}
