// next.config.js
module.exports = {
  output: 'export',
  images: {
    unoptimized: true
  },
  async rewrites() {
    const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';
    return [
      {
        source: '/api/:path*',
        destination: `${NEXT_PUBLIC_API_BASE_URL}/api/:path*`
      }
    ];
  }
};