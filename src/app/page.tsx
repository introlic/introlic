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
    absolute: "Introlic | Independent Technology Startup"
  },
  description: "Introlic is an independent startup founded by mr.Faiz, focused on building websites, apps, and games to achieve global visibility, paving the way for our ultimate goal: foundational AI.",
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
