import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://static.cloudflareinsights.com; connect-src 'self' https://cloudflareinsights.com https://*.cloudflareinsights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' blob: data:; font-src 'self' https://fonts.gstatic.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';"
  }
];

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    "introlic.in", 
    "*.introlic.in", 
    "introlic.site", 
    "*.introlic.site", 
    "localhost:3000", 
    "127.0.0.1:3000"
  ],
  experimental: {
    serverActions: {
      allowedOrigins: [
        "introlic.in",
        "*.introlic.in",
        "www.introlic.in",
        "introlic.site", 
        "*.introlic.site", 
        "www.introlic.site",
        "localhost:3000", 
        "localhost:3004", 
        "127.0.0.1:3000", 
        "127.0.0.1:3004"
      ],
    },
  },
  // Image optimization: Sharp already compresses and optimizes uploads to WebP on upload
  images: {
    unoptimized: true,
  },
  // Simple indicator setting for Next.js 15+ compatibility
  devIndicators: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
