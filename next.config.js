/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'replicate.delivery',
      },
      {
        protocol: 'https',
        hostname: 'replicate.com',
      },
    ],
  },
  // API routes body 크기 제한 증가 (다중 이미지 base64 인코딩)
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
}

module.exports = nextConfig
