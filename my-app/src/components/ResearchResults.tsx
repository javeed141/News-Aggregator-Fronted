import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
          <div className="space-y-3 text-sm leading-relaxed text-foreground/90 overflow-x-auto [&_table]:my-3 [&_table]:w-full [&_table]:border-collapse [&_table]:border [&_th]:border [&_th]:bg-muted/70 [&_th]:p-2.5 [&_th]:font-semibold [&_td]:border [&_td]:p-2.5 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_h2]:mt-4 [&_h2]:mb-1 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1 [&_h3]:text-base [&_h3]:font-medium [&_p]:mb-2 [&_p:last-child]:mb-0">
            <Markdown remarkPlugins={[remarkGfm]}>{result.answer}</Markdown>
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
