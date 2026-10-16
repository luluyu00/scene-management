/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // GitHub Pages project site: https://<user>.github.io/scene-management/
  basePath: process.env.BASE_PATH || '',
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
