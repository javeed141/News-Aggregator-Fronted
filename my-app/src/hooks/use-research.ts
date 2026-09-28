import { useCallback, useEffect, useRef, useState } from "react";

import { researchNewsStream } from "@/api/client";
import type { ResearchResponse, StreamEvent } from "@/types/research";

export type ResearchStepItem = {
  id: string;
  message: string;
  status?: string;
};

type ResearchState = {
  data: ResearchResponse | null;
  error: string | null;
  isLoading: boolean;
  steps: ResearchStepItem[];
  currentStepMessage: string;
};

export function useResearch() {
  const requestRef = useRef<AbortController | null>(null);
  const [state, setState] = useState<ResearchState>({
    data: null,
    error: null,
    isLoading: false,
    steps: [],
    currentStepMessage: "",
  });

  const research = useCallback(async (query: string) => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;

    setState({
      data: null,
      error: null,
      isLoading: true,
      steps: [],
      currentStepMessage: "Starting research...",
    });

    const handleEvent = (event: StreamEvent) => {
      if (event.type === "step") {
        setState((prev) => ({
          ...prev,
          currentStepMessage: event.message,
          steps: [
            ...prev.steps,
            {
              id: `${event.step}-${Date.now()}-${Math.random()}`,
              message: event.message,
              status: event.status,
            },
          ],
        }));
      }
    };

    try {
      const data = await researchNewsStream(query, handleEvent, controller.signal);
      setState((prev) => ({
        ...prev,
        data,
        error: null,
        isLoading: false,
      }));
    } catch (requestError) {
      if (requestError instanceof DOMException && requestError.name === "AbortError") {
        return;
      }

      setState((prev) => ({
        ...prev,
        data: null,
        error:
          requestError instanceof Error
            ? requestError.message
            : "Could not connect to the research API.",
        isLoading: false,
      }));
    }
  }, []);

  useEffect(() => {
    return () => requestRef.current?.abort();
  }, []);

  return { ...state, research };
}
