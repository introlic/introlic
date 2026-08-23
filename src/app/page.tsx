import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Foundations from "@/components/Foundations";
import OurVision from "@/components/OurVision";
import Roadmap from "@/components/Roadmap";
import FAQ from "@/components/FAQ";
import Blog from "@/components/Blog";
import SovereignUplink from "@/components/SovereignUplink";

export const metadata: Metadata = {
  title: {
    absolute: "Introlic | Independent AI Research & Systems Lab"
  },
  description: "Introlic is an independent technology lab focused on Discrete Diffusion Language Models (DLMs), SEDD architectures, and sovereign AI systems. Founded in India, building for the world.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Foundations />
      <OurVision />
      <Roadmap />
      <Blog />
      <FAQ />
      <SovereignUplink />
    </>
  );
}
