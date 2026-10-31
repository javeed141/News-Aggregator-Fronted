import type { FormEvent } from "react";
import { Search, Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SearchFormProps = {
  query: string;
  onQueryChange: (query: string) => void;
  onSubmit: (e: FormEvent) => void;
  loading: boolean;
  error: string | null;
};

export function SearchForm({
  query,
  onQueryChange,
  onSubmit,
  loading,
  error,
}: SearchFormProps) {
  return (
    <Card className="mx-auto max-w-4xl shadow-sm">
      <CardHeader>
        <CardTitle>What would you like to know?</CardTitle>
        <CardDescription>
          Search recent stories about AI, technology, business, or world events.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="What are the latest developments in AI agents?"
            className="h-10 flex-1"
            disabled={loading}
          />
          <Button type="submit" disabled={loading} className="h-10 gap-2">
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Search className="size-4" />
            )}
            {loading ? "Searching..." : "Research"}
          </Button>
        </form>

        {error && (
          <p className="mt-3 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

