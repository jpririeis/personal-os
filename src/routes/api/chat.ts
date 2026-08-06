import { createFileRoute } from "@tanstack/react-router";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

const SYSTEM_PROMPT = `You are APEX Coach, the athlete's private endurance coach inside their personal dashboard.
Context: the athlete is training for an Ironman 70.3 on September 11 and is in a 6-week progressive peak block.
Weekly structure: Mon swim, Tue indoor bike + run, Wed swim, Thu run, Fri outdoor bike, Sat brick (outdoor bike + run).
Fueling: homemade electrolyte master mix (pink Himalayan salt, potassium chloride, magnesium malate) and a
maltodextrin + fructose intra-workout drink scaled by session duration (60/90/120 min).
Answer with short, confident, practical coaching cues. Prefer bullet points and concrete numbers.
Never give medical advice; flag anything that sounds like injury or illness and suggest professional care.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as { messages?: unknown };
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) {
          return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        }

        const gateway = createOpenAICompatible({
          name: "lovable",
          baseURL: "https://ai.gateway.lovable.dev/v1",
          headers: { "Lovable-API-Key": apiKey },
        });

        const result = streamText({
          model: gateway("google/gemini-3.6-flash"),
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});
