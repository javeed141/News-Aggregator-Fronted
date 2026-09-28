export type Source = {
  title: string;
  source: string;
  url: string;
  published_at: string;
};

export type ResearchResponse = {
  answer: string;
  sources: Source[];
};

export type StreamEvent =
  | {
      type: "step";
      step: string;
      message: string;
      count?: number;
      url?: string;
      status?: string;
    }
  | {
      type: "result";
      answer: string;
      sources: Source[];
    }
  | {
      type: "error";
      message: string;
    };
