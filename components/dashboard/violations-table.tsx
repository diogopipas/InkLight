"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export type Violation = {
  id: string;
  impact: string | null;
  description: string;
  help: string;
  nodes: {
    html: string;
    target: string[];
  }[];
};

const impacts = ["all", "critical", "serious", "moderate", "minor"] as const;

type ImpactFilter = (typeof impacts)[number];

export function ViolationsTable({ violations }: { violations: Violation[] }) {
  const [filter, setFilter] = useState<ImpactFilter>("all");
  const filtered = useMemo(() => {
    if (filter === "all") return violations;
    return violations.filter((violation) => violation.impact === filter);
  }, [filter, violations]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {impacts.map((impact) => (
          <Button
            key={impact}
            size="sm"
            variant={impact === filter ? "default" : "outline"}
            onClick={() => setFilter(impact)}
          >
            {impact === "all" ? "All" : impact.charAt(0).toUpperCase() + impact.slice(1)}
          </Button>
        ))}
      </div>
      <div className="overflow-hidden rounded-2xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Issue</TableHead>
              <TableHead>Impact</TableHead>
              <TableHead>Nodes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((violation) => (
              <TableRow key={violation.id} className="align-top">
                <TableCell>
                  <p className="font-semibold">{violation.id}</p>
                  <p className="text-sm text-muted-foreground">{violation.description}</p>
                  <a href={violation.help} className="text-xs text-primary" target="_blank" rel="noreferrer">
                    Remediation guide
                  </a>
                </TableCell>
                <TableCell>
                  <Badge variant={severityVariant(violation.impact)} className="capitalize">
                    {violation.impact ?? "unknown"}
                  </Badge>
                </TableCell>
                <TableCell className="space-y-3">
                  {violation.nodes.slice(0, 3).map((node, index) => (
                    <div key={index} className="rounded-lg bg-muted p-3 text-xs">
                      <p className="font-mono text-[11px] text-slate-700">{truncate(node.html)}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground">{node.target.join(" → ")}</p>
                    </div>
                  ))}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                  No violations for this filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function severityVariant(impact: string | null | undefined) {
  switch (impact) {
    case "critical":
      return "destructive";
    case "serious":
      return "secondary";
    case "moderate":
      return "outline";
    case "minor":
      return "default";
    default:
      return "outline";
  }
}

function truncate(value: string) {
  if (value.length <= 120) return value;
  return value.slice(0, 120) + "…";
}
