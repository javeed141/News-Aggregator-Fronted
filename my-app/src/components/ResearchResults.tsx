import Markdown from "react-markdown";
import { ExternalLink } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ResearchResponse } from "@/types/research";

type ResearchResultsProps = {
  result: ResearchResponse;
};

export function ResearchResults({ result }: ResearchResultsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      {/* Answer Section */}
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>Research Summary</CardTitle>
          <CardDescription>
            Synthesized from the latest available news articles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 leading-relaxed text-foreground/90 text-sm">
            <Markdown>{result.answer}</Markdown>
          </div>
        </CardContent>
      </Card>

      {/* Sources Section */}
      <Card className="min-w-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Sources</CardTitle>
            <CardDescription>Original reporting</CardDescription>
          </div>
          <Badge variant="secondary">
            {result.sources.length}{" "}
            {result.sources.length === 1 ? "article" : "articles"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          {result.sources.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No sources returned.
            </p>
          ) : (
            result.sources.map((src) => (
              <a
                key={src.url}
                href={src.url}
                target="_blank"
                rel="noreferrer"
                className="group block rounded-lg border p-3 transition-colors hover:bg-muted"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="line-clamp-2 text-sm font-medium leading-snug group-hover:text-primary">
                    {src.title}
                  </p>
                  <ExternalLink className="size-3.5 shrink-0 text-muted-foreground group-hover:text-primary" />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {src.source} · {src.published_at}
                </p>
              </a>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
