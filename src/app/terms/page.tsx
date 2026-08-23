import React from 'react';
import type { Metadata } from 'next';
import ComplianceLayout from '@/components/ComplianceLayout';

export const metadata: Metadata = {
  title: 'Terms of Service | System Mandate',
  description: 'Operating guidelines, platform sovereignty parameters, and query parameters for Introlic. Read the terms governing our XT-Class AI systems.',
  alternates: { canonical: '/terms' },
  openGraph: {
    title: 'Terms of Service | Introlic AI',
    description: 'System rules and execution constraints governing the Introlic XT-Class architecture.',
    url: 'https://introlic.in/terms',
  },
};

const termsSections = [
  {
    id: 'alignment',
    title: 'System Alignment & Consent',
    content: (
      <>
        <p>
          By connecting to the Introlic core network interface or accessing any native token reasoning nodes (collectively, the &quot;System&quot;), you acknowledge full alignment with these Terms of Service. If you do not agree to these terms, you must sever all network connection vectors immediately.
        </p>
        <p>
          Introlic reserves the right to modify these operational constraints at any time. Your continued utilization of our systems following updates indicates acceptance of the revised protocol directives.
        </p>
      </>
    ),
  },
  {
    id: 'sovereignty',
    title: 'Architectural Sovereignty',
    content: (
      <>
        <p>
          Introlic operates as an independent foundries laboratory. The systems, models, and networks hosted on this domain are engineered from first-principles. 
        </p>
        <p>
          You are granted a non-transferable, non-exclusive, terminable license to query our inference models. You strictly agree not to:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>Reverse-engineer, decompile, or extract the weight matrices of our parallel diffusion architectures.</li>
          <li>Scrape model outputs to train competing foreign-wrapper models or datasets.</li>
          <li>Bypass our native bare-metal execution nodes to insert intermediary tracking layers.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'accounts',
    title: 'Access Credentials & Privileges',
    content: (
      <>
        <p>
          Certain sections of our workspace (such as the Projects and Research Admin panels) require a cryptographically signed JSON Web Token (JWT) account. You are solely responsible for protecting your credentials.
        </p>
        <p>
          Any attempt to scale privileges, perform credential stuffing, or exploit system endpoints will result in an immediate and automated IP and account suspensory block.
        </p>
      </>
    ),
  },
  {
    id: 'operational',
    title: 'Operational Limits & Uptime',
    content: (
      <>
        <p>
          Our public inference API operates under strict rate-limiting controls to prevent compute starvation. Standard accounts are bound by standard query limits. Over-querying will trigger automated HTTP 429 cooling protocols.
        </p>
        <p>
          While we strive for continuous token throughput, Introlic makes no guarantees of 100% uptime. Maintenance shutdowns, compile cycles, and hardware updates may temporarily sever connection vectors without prior notice.
        </p>
      </>
    ),
  },
  {
    id: 'liability',
    title: 'Operational Disclaimer',
    content: (
      <>
        <p>
          THE INTROLIC CORE SYSTEM AND GENERATED TOKENS ARE PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. INTROLIC SPECIFICALLY DISCLAIMS ANY AND ALL WARRANTIES OF MATHEMATICAL TRUTH OR FITNESS FOR DOWNTIME-CRITICAL ENVIRONMENTS.
        </p>
        <p>
          IN NO EVENT SHALL INTROLIC, ITS FOUNDERS, OR CONTRIBUTORS BE LIABLE FOR ANY QUANTUM DATA LOSS, SHARD DECAY, OR COMPUTE OVERHEAD INCURRED VIA YOUR INTERACTION WITH THE DOMAIN.
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <ComplianceLayout
      title="Terms of Service"
      subtitle="The operational mandates, system limits, and architectural covenants governing Introlic systems."
      lastUpdated="JUN 2026"
      iconName="terms"
      sections={termsSections}
    />
  );
}
