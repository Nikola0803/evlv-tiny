import type { Metadata } from "next";
import "./globals.css";
import "./mobile.css";

export const metadata: Metadata = {
  title: "EVLV Today | Pep Talk",
  description: "Book a free 15-minute EVLV Today Pep Talk, explore wellness optimisation, or visit the EVLV family of brands.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
