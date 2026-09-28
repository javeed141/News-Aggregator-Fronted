import type { ResearchResponse } from "@/types/research";

const API_URL =
  import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

type ApiErrorPayload = {
  detail?: string;
  message?: string;
};

export class ApiError extends Error {
  readonly status: number;

  constructor(
    message: string,
    status: number,
  ) {
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
      response.status,
    );
  }

  if (payload === null) {
    throw new ApiError("The server returned an empty response.", response.status);
  }

  return payload as T;
}

export async function researchNews(
  query: string,
  signal?: AbortSignal,
): Promise<ResearchResponse> {
  const response = await fetch(`${API_URL}/news/research`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
    signal,
  });

  return parseResponse<ResearchResponse>(response);
}
