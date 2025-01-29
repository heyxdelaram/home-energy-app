import OpenAI from "openai";

const configuration = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const openai = new OpenAI(configuration);

export async function POST(req) {
  try {
    const { reports, goalUsage } = await req.json();

    // Validate input data
    if (!reports || !Array.isArray(reports) || reports.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid reports data" }), { status: 400 });
    }

    // Calculate total usage
    const totalUsage = reports.reduce((acc, report) => acc + (report.usage || 0), 0);

    const prompt = `
      Analyze the following data:
      Reports: ${JSON.stringify(reports)}
      Goal Usage: ${goalUsage}
      Total Usage: ${totalUsage}

      Provide a short summary comparing the total usage with the goal usage.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
    });

    const summary = response.data.choices[0].message.content;
    return new Response(JSON.stringify({ summary }), { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Failed to analyze reports" }), { status: 500 });
  }
}
