/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

const nextConfig = withPWA({
  reactStrictMode: true,
  images: {
    domains: [process.env.IMAGE_HOST]
  },
  serverRuntimeConfig: {
    serverAPI: process.env.SERVER_API
  },
  publicRuntimeConfig: {
    imageUrl: process.env.IMAGE_URL,
    API: process.env.PUBLIC_API,
    socketEndpoint: process.env.SOCKET_URL
  },
  pwa: {
    dest: 'public',
    runtimeCaching
  },
  experimental: {
    outputStandalone: true,
  },
})

module.exports = nextConfig
