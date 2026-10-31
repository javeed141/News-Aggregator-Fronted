import { useState } from "react";
import type { FormEvent } from "react";
import { Sparkles, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SearchForm } from "@/components/SearchForm";
import { ResearchResults } from "@/components/ResearchResults";
import type { ResearchResponse } from "@/types/research";

const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

function App() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResearchResponse | null>(null);

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();

    if (trimmed.length < 3) {
      setError("Please enter at least 3 characters.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/news/research`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(
          errData?.detail || `Request failed with status ${response.status}`
        );
      }

      const data: ResearchResponse = await response.json();
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load research.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <header className="space-y-3 text-center">
          <Badge variant="secondary" className="gap-1.5 px-3 py-1">
            <Sparkles className="size-3.5" />
            GenAI News Research
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ask the News
          </h1>
          <p className="mx-auto max-w-xl text-sm text-muted-foreground">
            Search recent stories and get a concise, source-backed answer with
            original reporting links.
          </p>
        </header>

        {/* Search Input using shadcn UI components */}
        <SearchForm
          query={query}
          onQueryChange={setQuery}
          onSubmit={handleSearch}
          loading={loading}
          error={error}
        />

        {/* Loading Indicator using shadcn Card */}
        {loading && (
          <Card className="border-border/70 bg-card/80 p-8 text-center shadow-sm">
            <CardContent className="flex flex-col items-center justify-center gap-3 p-0">
              <Loader2 className="size-7 animate-spin text-primary" />
              <p className="text-sm font-medium text-foreground">
                Searching news sources and synthesizing answer...
              </p>
              <p className="text-xs text-muted-foreground">
                This usually takes 3 to 6 seconds.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Results Component rendering Markdown and Sources */}
        {result && !loading && <ResearchResults result={result} />}
      </div>
    </main>
  );
}

export default App;
