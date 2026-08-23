import React from "react";
import type { Metadata } from "next";
import DocsClient from "./DocsClient";

export const metadata: Metadata = {
  title: "Research Documentation — Introlic",
  description: "Introlic's research plan, architecture, and roadmap for building Discrete Diffusion Language Models (DLMs) and SEDD-based sovereign AI in India. Phase-by-phase research documentation.",
  alternates: {
    canonical: "/docs",
  },
};

export default function DocsPage() {
  return <DocsClient />;
}
