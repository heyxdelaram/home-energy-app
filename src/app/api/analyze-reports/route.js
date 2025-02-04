import { Sumana } from "next/font/google";

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

    // Send the request to Hugging Face
    const hfResponse = await fetch("https://api-inference.huggingface.co/models/sshleifer/distilbart-cnn-12-6", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    // Check if the response is successful
    if (!hfResponse.ok) {
      const errorText = await hfResponse.text();
      console.error("Hugging Face API error:", errorText);
      return new Response(
        JSON.stringify({ error: errorText }),
        { status: hfResponse.status }
      );
    }

    // Parse the response JSON
    const data = await hfResponse.json();
    console.log("Hugging Face Response:", JSON.stringify(data, null, 2)); // Log response to see structure

    // Check if response contains expected summary field
    const summary = data?.[0]?.summary_text || data?.generated_text || data?.text;
    console.log(summary)
    if (!summary) {
      return new Response(
        JSON.stringify({ error: "Unexpected response format" }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify({ summary }), { status: 200 });
  } catch (error) {
    console.error("Error in API function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to analyze reports" }),
      { status: 500 }
    );
  }
}
