import React from 'react';
import type { Metadata } from 'next';
import ComplianceLayout from '@/components/ComplianceLayout';

export const metadata: Metadata = {
  title: 'Ethics Manifest | Foundational Mandate',
  description: 'Introlic Ethics Manifest. Explore our principles of technological sovereignty, mathematical objectivity, bare-metal efficiency, and user vector ownership.',
  alternates: { canonical: '/ethics' },
  openGraph: {
    title: 'Ethics Manifest | Introlic AI',
    description: 'The core philosophical and engineering principles guiding Introlic.',
    url: 'https://introlic.in/ethics',
  },
};

const ethicsSections = [
  {
    id: 'sovereign-tech',
    title: 'Technological Sovereignty',
    content: (
      <>
        <p>
          Historically, the global flow of intelligence has been dominated by a handful of tech conglomerates. Talent from India has built and scaled these monopolies, yet we remain consumer dependents of their proprietary foundational wrappers.
        </p>
        <p>
          We believe India must build native foundational technology, not just application wrappers. Introlic is engineered to break dependency on foreign model providers by developing high-performance, parallel-diffusion foundational architectures right here, for the global stage.
        </p>
      </>
    ),
  },
  {
    id: 'neutrality',
    title: 'Algorithmic Objectivity',
    content: (
      <>
        <p>
          Algorithms have become weaponized mechanisms for behavioral conditioning. Modern search indexes and news feeds are tuned to maximize engagement through polarization and curated filters.
        </p>
        <p>
          Introlic rejects algorithmic bias. Our search index and model inference paths are designed for mathematical truth and objective retrieval. We do not track user query logs to customize feeds, nor do we suppress information to conform to advertiser guidelines.
        </p>
      </>
    ),
  },
  {
    id: 'bare-metal',
    title: 'Bare-Metal Efficiency & Stewardship',
    content: (
      <>
        <p>
          Computational overhead is a significant driver of carbon emissions. Modern software development has grown bloated, relying on layers of wrappers that waste compute cycles and degrade performance.
        </p>
        <p>
          At Introlic, efficiency is an ethical imperative. We design our code at the hardware-native layers—utilizing optimized C++/CUDA, Rust, and low-level custom kernels. By bypassing heavy abstractions, we achieve maximum token throughput per watt, minimizing the carbon footprint of foundational intelligence.
        </p>
      </>
    ),
  },
  {
    id: 'data-ownership',
    title: 'User Vector Ownership',
    content: (
      <>
        <p>
          Your digital identity, vectors, and contributions should remain yours. The current digital public square treats users as monetization targets.
        </p>
        <p>
          Introlic is committed to building decentralized social and data ecosystems. We design platforms where your data vector is cryptographically isolated and controlled entirely by you. No centralized data brokers, no surveillance profiling, and absolute data agency.
        </p>
      </>
    ),
  },
];

export default function EthicsPage() {
  return (
    <ComplianceLayout
      title="Ethics Manifest"
      subtitle="The structural core, mathematical objectivity, and technological sovereignty principles driving Introlic's development."
      lastUpdated="JUN 2026"
      iconName="ethics"
      sections={ethicsSections}
    />
  );
}
