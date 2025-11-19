import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/components/providers/session-provider";
import { SiteHeader } from "@/components/navigation/site-header";
import { getCurrentSession } from "@/lib/auth";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Inklight — Automated Accessibility Scanner",
  description: "Monitor and fix accessibility issues with automated WCAG scans.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getCurrentSession();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider session={session}>
          <SiteHeader session={session} />
          <main className="min-h-[calc(100vh-64px)] bg-muted/20">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
