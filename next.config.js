/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    const csp = `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self' data:;
      media-src 'self' blob: data:;
      connect-src 'self' https://api.openai.com;
      frame-src 'none';
    `.replace(/\n/g, '').trim();

    return [
      {
        source: '/(.*)', // works just like '/:path*'
        headers: [
          {
            key: 'Content-Security-Policy',
            value: csp,
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
