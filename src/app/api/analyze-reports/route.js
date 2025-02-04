import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY environment variable!");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    console.log("API endpoint called");
    const requestBody = await req.json();
    const prompt = requestBody.prompt;
    console.log("Received prompt:", prompt);

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Missing prompt in request" }),
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
    });

    console.log("OpenAI Response:", JSON.stringify(response, null, 2));

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
    if (error.code === "insufficient_quota") {
      return new Response(
        JSON.stringify({
          error:
            "Quota exceeded. Please check your OpenAI plan and billing details.",
        }),
        { status: 429 }
      );
    }
    return new Response(
      JSON.stringify({ error: error.message || "Failed to analyze reports" }),
      { status: 500 }
    );
  }
}
