import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { SYSTEM_PROMPT } from "./chat.server";

const FRIENDLY_ERROR = "I'm having trouble right now. Please email me at humairyousaf66@gmail.com.";

const chatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(500),
      }),
    )
    .min(1)
    .max(20),
});

type ChatMessage = z.infer<typeof chatInput>["messages"][number];
type ProviderResult = { status: "success"; reply: string } | { status: "retry" };

const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;
const buckets = new Map<string, number[]>();

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent";
const GROQ_MODEL = "openai/gpt-oss-120b";

function describeNetworkError(error: unknown) {
  if (!(error instanceof Error)) return "unknown network error";
  const cause = error.cause as { code?: string; message?: string } | undefined;
  return [error.name, error.message, cause?.code, cause?.message].filter(Boolean).join(" | ");
}

async function fetchWithTimeout(url: string, init: RequestInit) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15_000);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function askGroq(
  apiKey: string | undefined,
  messages: ChatMessage[],
  providerName: string,
): Promise<ProviderResult> {
  if (!apiKey) return { status: "retry" };

  try {
    const response = await fetchWithTimeout(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.4,
        max_tokens: 500,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      }),
    });

    if (!response.ok) {
      console.error(`${providerName} failed with status ${response.status}`);
      return { status: "retry" };
    }

    const json = (await response.json()) as {
      choices?: { finish_reason?: string; message?: { content?: string } }[];
    };
    const reply = json.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      console.error(
        `${providerName} returned no text (finish reason: ${json.choices?.[0]?.finish_reason ?? "unknown"})`,
      );
    }
    return reply ? { status: "success", reply } : { status: "retry" };
  } catch (error) {
    console.error(`${providerName} request failed: ${describeNetworkError(error)}`);
    return { status: "retry" };
  }
}

async function askGemini(
  apiKey: string | undefined,
  messages: ChatMessage[],
): Promise<ProviderResult> {
  if (!apiKey) return { status: "retry" };

  try {
    const response = await fetchWithTimeout(`${GEMINI_URL}?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: messages.map((message) => ({
          role: message.role === "assistant" ? "model" : "user",
          parts: [{ text: message.content }],
        })),
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 500,
        },
      }),
    });

    if (!response.ok) {
      console.error(`Gemini failed with status ${response.status}`);
      return { status: "retry" };
    }

    const json = (await response.json()) as {
      candidates?: {
        finishReason?: string;
        content?: { parts?: { text?: string }[] };
      }[];
    };
    const reply = json.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("")
      .trim();
    if (!reply) {
      console.error(
        `Gemini returned no text (finish reason: ${json.candidates?.[0]?.finishReason ?? "unknown"})`,
      );
    }
    return reply ? { status: "success", reply } : { status: "retry" };
  } catch (error) {
    console.error(`Gemini request failed: ${describeNetworkError(error)}`);
    return { status: "retry" };
  }
}

export const sendChatMessage = createServerFn({ method: "POST" })
  .validator((input: unknown) => chatInput.parse(input))
  .handler(async ({ data }) => {
    const ip =
      getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() ??
      getRequestHeader("x-real-ip") ??
      "unknown";
    const now = Date.now();
    const recent = (buckets.get(ip) ?? []).filter((timestamp) => now - timestamp < RATE_WINDOW_MS);

    if (recent.length >= RATE_LIMIT) {
      return {
        reply: null,
        error: "You're sending messages a little too quickly — please wait a moment and try again.",
      };
    }

    recent.push(now);
    buckets.set(ip, recent);

    const messages = data.messages.slice(-10);
    const providers = [
      () => askGroq(process.env["GROQ_API_KEY_1"], messages, "Groq primary"),
      () => askGemini(process.env["GEMINI_API_KEY"], messages),
      () => askGroq(process.env["GROQ_API_KEY_2"], messages, "Groq secondary"),
    ];

    for (const provider of providers) {
      const result = await provider();
      if (result.status === "success") {
        return { reply: result.reply, error: null };
      }
    }

    return { reply: null, error: FRIENDLY_ERROR };
  });
