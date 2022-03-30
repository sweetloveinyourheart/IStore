import getConfig from 'next/config'
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()

export const nextImageUrl = (url: string) => publicRuntimeConfig.imageUrl + url

export const serverSideAPI = serverRuntimeConfig.serverAPI
export const clientSideAPI = publicRuntimeConfig.API
export const socketEndpoint = publicRuntimeConfig.socketEndpoint