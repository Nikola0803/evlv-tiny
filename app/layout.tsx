import type { Metadata } from "next";
import "./globals.css";
import "./mobile.css";

export const metadata: Metadata = {
  title: "EVLV | Choose Your Path",
  description: "Explore EVLV Peptides, EVLV Today, ZooNetics, or schedule a call with the EVLV team.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
