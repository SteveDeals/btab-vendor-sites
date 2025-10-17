/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'localhost',
      'api.btab.app',
      'staging.btab.app',
      'vendors.btab.app',
      'temp2.homeware.furniture' // For scraped furniture images
    ],
  },
  env: {
    BTAB_API_KEY: process.env.BTAB_API_KEY,
    VENDOR_ID: process.env.VENDOR_ID,
  },
  // Allow API proxying in development
  async rewrites() {
    return process.env.NODE_ENV === 'development' ? [
      {
        source: '/api/btab/:path*',
        destination: 'http://localhost:3000/api/v1/:path*'
      }
    ] : [];
  },
}

module.exports = nextConfig