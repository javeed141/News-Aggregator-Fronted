import type { ResearchResponse, StreamEvent } from "@/types/research";

const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

type ApiErrorPayload = {
  detail?: string;
  message?: string;
};

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  const body = await response.text();
  let payload: T | ApiErrorPayload | null = null;

  if (body) {
    try {
      payload = JSON.parse(body) as T | ApiErrorPayload;
    } catch {
      if (!response.ok) {
        throw new ApiError(body, response.status);
      }
    }
  }

  if (!response.ok) {
    const errorPayload = payload as ApiErrorPayload | null;
    throw new ApiError(
      errorPayload?.detail ??
        errorPayload?.message ??
        "The request failed. Please try again.",
      response.status
    );
  }

  if (payload === null) {
    throw new ApiError("The server returned an empty response.", response.status);
  }

  return payload as T;
}

export async function researchNews(
  query: string,
  signal?: AbortSignal
): Promise<ResearchResponse> {
  const response = await fetch(`${API_URL}/news/research`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
    signal,
  });

  return parseResponse<ResearchResponse>(response);
}

export async function researchNewsStream(
  query: string,
  onEvent: (event: StreamEvent) => void,
  signal?: AbortSignal
): Promise<ResearchResponse> {
  const response = await fetch(`${API_URL}/news/research/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let message = "The request failed. Please try again.";
    try {
      const json = JSON.parse(errorText);
      message = json.detail || json.message || message;
    } catch {
      if (errorText) message = errorText;
    }
    throw new ApiError(message, response.status);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new ApiError("No stream reader available.", 500);

  const decoder = new TextDecoder();
  let buffer = "";
  let finalResult: ResearchResponse | null = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n\n");
    buffer = parts.pop() ?? "";

    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.startsWith("data: ")) {
        try {
          const parsed = JSON.parse(trimmed.slice(6)) as StreamEvent;
          onEvent(parsed);
          if (parsed.type === "result") {
            finalResult = { answer: parsed.answer, sources: parsed.sources };
          } else if (parsed.type === "error") {
            throw new ApiError(parsed.message, 500);
          }
        } catch (e) {
          if (e instanceof ApiError) throw e;
          console.warn("Failed to parse SSE line:", part, e);
        }
      }
    }
  }

  if (!finalResult) {
    throw new ApiError("Stream ended without returning a result.", 500);
  }

  return finalResult;
}
