/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    serverAPI: process.env.SERVER_API
  },
  publicRuntimeConfig: {
    imageUrl: process.env.IMAGE_URL,
    API: process.env.PUBLIC_API,
    socketEndpoint: process.env.SOCKET_URL
  },
  experimental: {
    outputStandalone: true,
  },
}

module.exports = nextConfig
