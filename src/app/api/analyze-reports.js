import OpenAI from "openai";

const configuration = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY, // Access the API key from environment variables
});

const openai = new OpenAI(configuration);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { reports, goalUsage } = req.body;

    // Calculate total usage
    const totalUsage = reports.reduce((acc, report) => acc + report.usage, 0);

    const prompt = `
      Analyze the following data:
      Reports: ${JSON.stringify(reports)}
      Goal Usage: ${goalUsage}
      Total Usage: ${totalUsage}

      Provide a short summary comparing the total usage with the goal usage.
    `;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
      });

      const summary = response.data.choices[0].message.content;
      res.status(200).json({ summary });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Failed to analyze reports" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
