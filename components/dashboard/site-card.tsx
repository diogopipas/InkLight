"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRelativeDate } from "@/lib/utils";

export type SiteCardProps = {
  id: string;
  url: string;
  lastScan?: Date | string | null;
  issuesCount: number;
};

export function SiteCard({ id, url, lastScan, issuesCount }: SiteCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function editSite() {
    const nextUrl = window.prompt("Update website URL", url);
    if (nextUrl === null) {
      return;
    }
    const trimmed = nextUrl.trim();
    if (!trimmed) {
      setError("URL cannot be empty");
      return;
    }

    setLoading(true);
    setError(null);
    const response = await fetch("/api/update-site", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteId: id, url: trimmed }),
    });
    setLoading(false);
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data?.message ?? "Unable to update site");
      return;
    }
    window.location.reload();
  }

  async function runScan() {
    setLoading(true);
    setError(null);
    const response = await fetch("/api/run-scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteId: id }),
    });
    setLoading(false);
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data?.message ?? "Unable to run scan");
      return;
    }
    window.location.href = `/dashboard/site/${id}`;
  }

  async function deleteSite() {
    if (!confirm(`Delete ${url}?`)) return;
    setLoading(true);
    const response = await fetch("/api/delete-site", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteId: id }),
    });
    setLoading(false);
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data?.message ?? "Unable to delete site");
      return;
    }
    window.location.reload();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="truncate">{url}</CardTitle>
        <CardDescription>
          Last scan: {lastScan ? formatRelativeDate(lastScan) : "Never"}
          <br />
          {issuesCount} issues tracked
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button size="sm" asChild variant="secondary">
          <Link href={`/dashboard/site/${id}`}>View results</Link>
        </Button>
        <Button size="sm" onClick={runScan} disabled={loading}>
          {loading ? "Running…" : "Run scan"}
        </Button>
        <Button size="sm" variant="outline" onClick={editSite} disabled={loading}>
          Edit URL
        </Button>
        <Button size="sm" variant="destructive" onClick={deleteSite} disabled={loading}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
