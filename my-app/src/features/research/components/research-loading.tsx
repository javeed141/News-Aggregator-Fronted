import { useEffect, useState } from "react";
import { LoaderCircle, Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

type ResearchStep = {
  id: string;
  label: string;
  detail: string;
};

const researchSteps: ResearchStep[] = [
  { id: "understand", label: "Understanding", detail: "Your question" },
  { id: "search", label: "Searching", detail: "Recent news" },
  { id: "fetch", label: "Fetching", detail: "Articles" },
  { id: "inspect", label: "Inspecting", detail: "Evidence" },
  { id: "deduplicate", label: "Filtering", detail: "Duplicates" },
  { id: "compare", label: "Comparing", detail: "Sources" },
  { id: "synthesize", label: "Answering", detail: "Final summary" },
];

export function ResearchLoading() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (activeStep >= researchSteps.length - 1) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setActiveStep((current) => current + 1);
    }, 2000);

    return () => window.clearTimeout(timeout);
  }, [activeStep]);

  const currentStep = researchSteps[activeStep];

  return (
    <Card className="border-border/70 bg-card/80 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Sparkles className="size-4 text-violet-500" />
          Researching your question
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">
          <div className="flex items-center gap-4">
            <div className="flex size-11 items-center justify-center rounded-full border border-violet-500/40 bg-violet-500/10 text-violet-600 dark:text-violet-300">
              <LoaderCircle className="size-5 animate-spin" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-violet-600 dark:text-violet-300">
                In progress
              </p>
              <h3 className="mt-1 text-xl font-semibold text-foreground">{currentStep.label}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{currentStep.detail}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

