import { useCallback, useEffect, useRef, useState } from "react";

import { researchNews } from "@/api/client";
import type { ResearchResponse } from "@/types/research";

type ResearchState = {
  data: ResearchResponse | null;
  error: string | null;
  isLoading: boolean;
};

export function useResearch() {
  const requestRef = useRef<AbortController | null>(null);
  const [state, setState] = useState<ResearchState>({
    data: null,
    error: null,
    isLoading: false,
  });

  const research = useCallback(async (query: string) => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;

    setState({ data: null, error: null, isLoading: true });

    try {
      const data = await researchNews(query, controller.signal);
      setState({ data, error: null, isLoading: false });
    } catch (requestError) {
      if (requestError instanceof DOMException && requestError.name === "AbortError") {
        return;
      }

      setState({
        data: null,
        error:
          requestError instanceof Error
            ? requestError.message
            : "Could not connect to the research API.",
        isLoading: false,
      });
    }
  }, []);

  useEffect(() => {
    return () => requestRef.current?.abort();
  }, []);

  return { ...state, research };
}

