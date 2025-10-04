/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // GitHub Pages configuration
  basePath: process.env.NODE_ENV === 'production' ? '/flowcreate' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/flowcreate/' : '',
  // Static export configuration
  output: 'export',
}

export default nextConfig