import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";

export type AccessibilityViolation = {
  id: string;
  impact: string | null;
  description: string;
  help: string;
  nodes: {
    html: string;
    target: string[];
  }[];
};

export type AccessibilityReport = {
  violations: AccessibilityViolation[];
};

export async function runAccessibilityScan(url: string): Promise<AccessibilityReport> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "networkidle" });
    const axe = new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]);
    const results = await axe.analyze();

    return {
      violations: results.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact ?? "",
        description: violation.description,
        help: violation.help,
        nodes: violation.nodes.map((node) => ({
          html: node.html,
          target: node.target as string[],
        })),
      })),
    };
  } finally {
    await browser.close();
  }
}
