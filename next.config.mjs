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
  // GitHub Pages configuration - Update this to match your repository name
  basePath: process.env.NODE_ENV === 'production' ? '/FlowCreate' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/FlowCreate/' : '',
  // Static export configuration
  output: 'export',
}

export default nextConfig