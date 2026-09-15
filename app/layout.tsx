import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { PageTransitionProvider } from "@/components/marketing/page-transition";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-landing-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Jengaflow — Site spending and construction progress",
  description:
    "Track materials, labour, deliveries, and site progress in one project record. Built for construction owners, clerks, and foremen.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <PageTransitionProvider>{children}</PageTransitionProvider>
      </body>
    </html>
  );
}
