// next.config.js
module.exports = {
  async rewrites() {
    const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
    return [
      {
        source: '/api/:path*',
        destination: `${NEXT_PUBLIC_API_BASE_URL}/api/:path*`
      }
    ];
  }
};