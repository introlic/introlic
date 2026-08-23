import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Introlic | Foundational AI Research Lab',
    short_name: 'Introlic',
    description: 'Revolutionizing the deep end of intelligence through extreme math optimization, kernel fusion, and parallel diffusion architectures.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#00a3ff',
    icons: [
      {
        src: '/icon.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  };
}
