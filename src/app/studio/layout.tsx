import type { Metadata } from "next";
import type { ReactNode } from "react";

import "../globals.css";

export const metadata: Metadata = {
  title: "Studio | MIST ARCHITECT",
  description: "Content management backend for MIST ARCHITECT."
};

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <html data-scroll-behavior="smooth" lang="en">
      <body>{children}</body>
    </html>
  );
}
