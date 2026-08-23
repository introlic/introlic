import React from 'react';
import type { Metadata } from 'next';
import ComplianceLayout from '@/components/ComplianceLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy | Core Privacy Protocol',
  description: 'Introlic privacy standards. We operate on a zero-surveillance, zero-profiling, and mathematical query isolation model. Learn how we handle your data.',
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: 'Privacy Policy | Introlic AI',
    description: 'Privacy specifications and mathematical isolation mandates at Introlic.',
    url: 'https://introlic.in/privacy',
  },
};

const privacySections = [
  {
    id: 'sovereign-privacy',
    title: 'Zero Surveillance Mandate',
    content: (
      <>
        <p>
          Legacy tech stacks have turned the web into an ad-driven profiling mechanism. Introlic operates under a strict Zero Surveillance Mandate.
        </p>
        <p>
          We do not embed third-party tracking pixels (e.g. Meta pixel, Google Analytics, or other ad trackers) on our domain. We do not construct user profiling graphs, and we do not monetize your queries, search history, or personal data.
        </p>
      </>
    ),
  },
  {
    id: 'data-collection',
    title: 'Minimal Data Sharding',
    content: (
      <>
        <p>
          We only store data that is mathematically necessary to execute platform operations:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li><strong>Authentication Data:</strong> Your username, email address, password hash, and metadata (role, status) required to access the admin panels.</li>
          <li><strong>Operational Telemetry:</strong> Log attempts and security event logs to protect our infrastructure from automated attacks.</li>
          <li><strong>Submission Metadata:</strong> Data you explicitly transmit through our contact channels, project forms, or recruitment portals.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'search-query-isolation',
    title: 'Search Index Processing',
    content: (
      <>
        <p>
          Our search indexing is built on mathematical retrieval models. Queries processed by the Introlic search nodes are computed strictly in-memory.
        </p>
        <p>
          We do not associate query strings with authenticated user accounts. We do not sell or lease search queries to third-party data aggregators.
        </p>
      </>
    ),
  },
  {
    id: 'encryption-security',
    title: 'Cryptographic Security & JWT',
    content: (
      <>
        <p>
          All data transactions between your client browser and Introlic nodes are secured using Transport Layer Security (TLS). 
        </p>
        <p>
          User sessions are signed cryptographically using JSON Web Token (JWT) payloads with HMAC SHA-256 algorithms. This ensures that session data cannot be manipulated by intermediate proxies.
        </p>
      </>
    ),
  },
  {
    id: 'user-rights',
    title: 'Account Cleansing Protocols',
    content: (
      <>
        <p>
          You retain complete ownership over your digital footprint. If you choose to terminate your node account, you may request database cleansing.
        </p>
        <p>
          Once verified, all user record rows in primary databases will be purged. Backups are cleared in standard rotation cycles.
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <ComplianceLayout
      title="Privacy Policy"
      subtitle="How Introlic handles identity payloads, token query parameters, and mathematical search records under a zero-surveillance model."
      lastUpdated="JUN 2026"
      iconName="privacy"
      sections={privacySections}
    />
  );
}
