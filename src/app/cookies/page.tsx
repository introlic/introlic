import React from 'react';
import type { Metadata } from 'next';
import ComplianceLayout from '@/components/ComplianceLayout';

export const metadata: Metadata = {
  title: 'Cookie Policy | Browser Storage Spec',
  description: 'Cookie and local storage policy at Introlic. We do not use profiling cookies. Discover how we utilize necessary session keys.',
  alternates: { canonical: '/cookies' },
  openGraph: {
    title: 'Cookie Policy | Introlic AI',
    description: 'Browser cookie and local storage specifications for the Introlic platform.',
    url: 'https://introlic.in/cookies',
  },
};

const cookieSections = [
  {
    id: 'essential-cookies',
    title: 'Necessary System Cookies',
    content: (
      <>
        <p>
          Necessary cookies are required for the fundamental operation of the Introlic administrative cockpit and secure endpoints. These are loaded directly by our servers and do not collect any personally identifiable tracker information:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li><strong>Authentication Session:</strong> A cookie storing your cryptographically signed JWT payload to authorize admin privileges.</li>
          <li><strong>Security & CSRF:</strong> Cookies utilized to verify client origins and prevent cross-site request forgery attacks during account form actions.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'local-storage',
    title: 'Local Browser Preferences',
    content: (
      <>
        <p>
          We rely extensively on modern HTML5 Local Storage (`localStorage`) instead of legacy cookie trackers to preserve your workspace choices on this domain.
        </p>
        <p>
          Unlike cookies, local storage values remain isolated inside your browser and are never transmitted to our telemetry servers on page loads. We utilize local storage for:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>Preserving layout preferences (such as One-by-one vs Line-wise view modes in the Projects and Research admin panels).</li>
          <li>Caching unsaved draft inputs in markdown text editors to prevent work loss on reload.</li>
          <li>Storing custom author roles and local state configurations.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'zero-trackers',
    title: 'Zero Third-Party Pixels',
    content: (
      <>
        <p>
          Introlic does not integrate advertising remarketing trackers, behavior profiling scripts, or social sharing SDKs that silently deploy tracking beacons on your system.
        </p>
        <p>
          We believe in strict client-side sandboxing. Your browsing habits remain localized on your own hardware.
        </p>
      </>
    ),
  },
  {
    id: 'control-storage',
    title: 'Managing Browser Storage',
    content: (
      <>
        <p>
          You have complete control over browser-level storage objects. You can modify your settings to block cookies, clear storage caches, or notify you when cookies are set.
        </p>
        <p>
          Please note that blocking essential auth cookies will prevent you from logging into the project administration panels and publishing whitepapers.
        </p>
      </>
    ),
  },
];

export default function CookiesPage() {
  return (
    <ComplianceLayout
      title="Cookie Policy"
      subtitle="Technical breakdown of local storage parameters and essential session keys utilized on the Introlic network."
      lastUpdated="JUN 2026"
      iconName="cookies"
      sections={cookieSections}
    />
  );
}
