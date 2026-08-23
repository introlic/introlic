import React, { Suspense } from 'react';
import { Metadata } from 'next';
import ContactContent from '@/components/contact/ContactContent';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Connect with the Introlic engineering and research teams for collaborations, recruitment, or telemetry access.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Us | Introlic',
    description: 'Connect with the Introlic engineering and research teams.',
    url: 'https://introlic.in/contact',
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <div className="relative">
      <Suspense fallback={null}>
        <ContactContent />
      </Suspense>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact Introlic",
            "description": "Contact form and transmission channels to get in touch with Introlic.",
            "url": "https://introlic.in/contact",
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer support",
              "email": "support@introlic.in",
              "url": "https://introlic.in/contact"
            }
          })
        }}
      />
    </div>
  );
}
