import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ResearchForm } from "@/features/research/components/research-form";
import { ResearchLoading } from "@/features/research/components/research-loading";
import { ResearchResults } from "@/features/research/components/research-results";
import { useResearch } from "@/hooks/use-research";

export function ResearchPage() {
  const { data, error, isLoading, research } = useResearch();

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-4 text-center">
          <Badge variant="secondary" className="gap-1.5 px-3 py-1">
            <Sparkles className="size-3.5" />
            GenAI News Research
          </Badge>
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Ask the news.
            </h1>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Search recent stories and get a concise, source-backed answer
              from your research assistant.
            </p>
          </div>
        </header>

        <ResearchForm error={error} isLoading={isLoading} onSubmit={research} />

        {isLoading && <ResearchLoading />}
        {data && !isLoading && <ResearchResults result={data} />}
        {!data && !isLoading && !error && (
          <p className="text-center text-sm text-muted-foreground">
            Your answer will appear here with links to the original reporting.
          </p>
        )}
      </div>
    </main>
  );
}

