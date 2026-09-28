import { LoaderCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { ResearchStepItem } from "@/hooks/use-research";

type ResearchLoadingProps = {
  currentStepMessage: string;
  steps: ResearchStepItem[];
};

export function ResearchLoading({ currentStepMessage, steps }: ResearchLoadingProps) {
  return (
    <Card className="border-border/70 bg-card/80 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Sparkles className="size-4 text-violet-500 animate-pulse" />
          Researching your question in real-time
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">
          <div className="flex items-center gap-4">
            <div className="flex size-11 items-center justify-center rounded-full border border-violet-500/40 bg-violet-500/10 text-violet-600 dark:text-violet-300">
              <LoaderCircle className="size-5 animate-spin" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-violet-600 dark:text-violet-300 font-semibold">
                Live Status
              </p>
              <h3 className="mt-1 text-lg font-medium text-foreground transition-all">
                {currentStepMessage || "Processing request..."}
              </h3>
            </div>
          </div>
        </div>

        {steps.length > 0 && (
          <div className="max-h-48 overflow-y-auto space-y-2 rounded-lg border bg-muted/20 p-3 text-xs">
            {steps.map((step) => (
              <div key={step.id} className="flex items-start gap-2 text-muted-foreground">
                <CheckCircle2 className="size-3.5 mt-0.5 shrink-0 text-violet-500" />
                <span className="break-words">{step.message}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
