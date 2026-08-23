import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnalyticsTracker from "@/components/AnalyticsTracker";

export const metadata: Metadata = {
  title: {
    default: "Introlic | Foundational AI Research Lab",
    template: "%s | Introlic"
  },
  description: "Revolutionizing the deep end of intelligence through extreme math optimization, kernel fusion, and parallel diffusion architectures. Engineering a sovereign digital ecosystem.",
  keywords: [
    "Introlic",
    "Introlic AI",
    "introlic.in",
    "introlics",
    "mr.faiz",
    "Faiz Shah",
    "Sovereign AI",
    "Inference Optimization",
    "Kernel Fusion",
    "Parallel Diffusion",
    "AI Research India",
    "Parallel Intelligence",
    "Systems Builder India"
  ],
  authors: [{ name: "Introlic Engineering Team" }],
  creator: "Introlic",
  publisher: "Introlic AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://introlic.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Introlic | Independent AI Research & Systems Lab",
    description: "Engineering next-generation model architectures, high-speed generative systems, and modern digital platforms.",
    url: "https://introlic.in",
    siteName: "Introlic",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Introlic | Independent AI Research & Systems Lab",
    description: "Engineering fast, efficient, and unconstrained technology from first principles.",
    creator: "@introlics",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico" }
    ],
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    yandex: process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION || "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased bg-black text-white">
        <AnalyticsTracker />
        <Navbar />

        <main>{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Introlic",
              "url": "https://introlic.in",
              "logo": "https://introlic.in/icon.png",
              "sameAs": [
                "https://x.com/introlics",
                "https://github.com/introlic",
                "https://www.instagram.com/introlics/",
                "https://youtube.com/@introlics",
                "https://threads.net/@introlics",
                "https://linkedin.com/company/introlic"
              ],
              "description": "Independent AI Research & Systems Lab building fast, efficient technology from first principles."
            })
          }}
        />
      </body>
    </html>
  );
}
