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

