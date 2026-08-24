import { Exo_2, JetBrains_Mono } from "next/font/google";
import type { Metadata } from "next";
import "@/styles/globals.css";
import "@/styles/animations.css";
import "@/styles/hud.css";
import { SystemShell } from "@/components/system/SystemShell";

const exo = Exo_2({
  subsets: ["latin"],
  variable: "--font-exo",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Spencer — Operations System",
  description: "Personal software engineering portfolio",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${exo.variable} ${jetbrains.variable}`}>
      <body>
        <SystemShell>{children}</SystemShell>
      </body>
    </html>
  );
}
