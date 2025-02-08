/**
 * POST request handler to process a prompt and generate a summary using Hugging Face API.
 * 
 * @param {Request} req - The incoming HTTP request object containing the prompt in the body.
 * @returns {Response} - The HTTP response containing either the generated summary or an error message.
 */
export async function POST(req) {
  try {
    // Log that the API endpoint has been called
    console.log("API endpoint called");

    // Parse the incoming request body and extract the prompt
    const requestBody = await req.json();
    const prompt = requestBody.prompt;
    console.log("Received prompt:", prompt);

    // If no prompt is provided, return a 400 error response
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Missing prompt in request" }),
        { status: 400 }
      );
    }

    // Send the request to Hugging Face API for text summarization
    const hfResponse = await fetch("https://api-inference.huggingface.co/models/sshleifer/distilbart-cnn-12-6", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`, // Authorization token
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt }), // Send prompt as input
    });

    // If Hugging Face API response is not successful, log the error and return a response
    if (!hfResponse.ok) {
      const errorText = await hfResponse.text();
      console.error("Hugging Face API error:", errorText);
      return new Response(
        JSON.stringify({ error: errorText }),
        { status: hfResponse.status }
      );
    }

    // Parse the successful Hugging Face API response
    const data = await hfResponse.json();
    console.log("Hugging Face Response:", JSON.stringify(data, null, 2)); // Log response for debugging

    // Check if the expected summary field is present in the response
    const summary = data?.[0]?.summary_text || data?.generated_text || data?.text;
    console.log(summary);

    // If no summary is found, return a 500 error response
    if (!summary) {
      return new Response(
        JSON.stringify({ error: "Unexpected response format" }),
        { status: 500 }
      );
    }

    // Return the summary in the response
    return new Response(JSON.stringify({ summary }), { status: 200 });
  } catch (error) {
    // Catch any other errors, log them, and return a 500 error response
    console.error("Error in API function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to analyze reports" }),
      { status: 500 }
    );
  }
}
