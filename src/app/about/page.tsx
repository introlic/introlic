import React from 'react';
import type { Metadata } from 'next';
import SovereignUplink from '@/components/SovereignUplink';
import AboutHero from '@/components/about/AboutHero';
import TheVisionary from '@/components/about/TheVisionary';
import CoreValues from '@/components/about/CoreValues';
import FAQ from '@/components/FAQ';

export const metadata: Metadata = {
  title: 'About | The Origin of Introlic',
  description:
    "In 2019, a question in India asked why there was no Indian company among the world's greatest tech builders. That question built Introlic. Learn our story.",
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Introlic — The Origin Story',
    description:
      'From a single question in 2019 to live platforms and a mission to put India on the map of foundational technology.',
    url: 'https://introlic.in/about',
  },
};

const aboutFaqs = [
  {
    id: "01",
    question: "Who is mr.Faiz and what is the origin of Introlic?",
    answer: "mr.Faiz is a systems engineer and founder based in India. Starting his development journey at age 12, he engineered a high-scale side platform that reached over 13,000 active users. Recognizing the deep efficiency bottlenecks in legacy Transformer stacks and the untapped gold mine of non-autoregressive models, he founded Introlic in 2026 to pioneer Discrete Diffusion Language Models (DLMs) and SEDD architectures."
  },
  {
    id: "02",
    question: "Why was the peak 13,000-user platform shut down in 2025?",
    answer: "The platform was launched on Oct 6, 2024, as a proof of concept. Exactly one year later, on Oct 6, 2025, it was deliberately shut down. The shutdown was a strategic decision: the platform's core goal of proving premium products can be built from scratch without capital had been achieved, allowing resources to pivot fully towards Introlic's core engine infrastructure."
  },
  {
    id: "03",
    question: "What is the meaning of 'Built in India · For the World'?",
    answer: "Historically, India built the engineering talent that scaled global tech monopolies. Introlic is designed to shift that center of gravity. We believe India must build foundational technology companies, not just application wrappers. We are engineering the next-generation inference backbone natively to be deployed globally."
  },
  {
    id: "04",
    question: "How is Introlic funded and what is its operational philosophy?",
    answer: "Introlic is an independent engineering lab backed by its founding team's resources and dedicated research initiatives. We prioritize architectural autonomy, high engineering velocity, and long-term value creation."
  }
];

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <TheVisionary />
      <CoreValues />
      <FAQ 
        items={aboutFaqs} 
        title={
          <>
            Ecosystem<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-700">Briefing.</span>
          </>
        }
        subtitle="Inquiry logs, strategic reset clarifications, and foundational mandates."
      />
      <SovereignUplink />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": "https://introlic.in/#organization",
                "name": "Introlic",
                "url": "https://introlic.in",
                "logo": "https://introlic.in/icon.png",
                "founders": [
                  {
                    "@type": "Person",
                    "name": "Faiz Shah",
                    "jobTitle": "Founder",
                    "sameAs": "https://x.com/MrUniqers"
                  },
                  {
                    "@type": "Person",
                    "name": "mr.Faiz",
                    "jobTitle": "Co-Founder",
                    "sameAs": "https://x.com/MF9CODING"
                  }
                ],
                "chiefExecutiveOfficer": {
                  "@type": "Person",
                  "name": "Shaurya Fatania",
                  "jobTitle": "Chief Executive Officer (CEO)",
                  "sameAs": "https://www.instagram.com/edit.elligence/"
                },
                "sameAs": [
                  "https://x.com/introlics",
                  "https://github.com/introlic",
                  "https://www.instagram.com/introlics/",
                  "https://youtube.com/@introlics",
                  "https://threads.net/@introlics",
                  "https://linkedin.com/company/introlic"
                ],
                "description": "Independent AI Research & Systems Lab."
              },
              {
                "@type": "FAQPage",
                "@id": "https://introlic.in/about/#faq",
                "mainEntity": aboutFaqs.map(faq => ({
                  "@type": "Question",
                  "name": faq.question,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                  }
                }))
              }
            ]
          })
        }}
      />
    </>
  );
}
