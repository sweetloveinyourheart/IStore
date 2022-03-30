import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { store } from '../redux/store'
import { SessionProvider } from "next-auth/react"
import { SocketProvider } from '../contexts/Socket'
import AuthGuard from '../contexts/Auth'
import Head from 'next/head'

function MyApp({
  Component,
  pageProps: { session, ...pageProps }
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <SocketProvider>
        <AuthGuard>
          <Provider store={store}>
            <Head>
              <meta charSet="utf-8" />
              <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
              <meta
                name="viewport"
                content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
              />
              <meta name="description" content="Description" />
              <meta name="keywords" content="Keywords" />
              <link rel="manifest" href="/manifest.json" />
              <link rel="icon" href="/favicon.ico" />
              <link rel="apple-touch-icon" href="/apple-icon.png"></link>
              <meta name="theme-color" content="#d12032" />
            </Head>
            <Component {...pageProps} />
          </Provider>
        </AuthGuard>
      </SocketProvider>
    </SessionProvider>
  )
}

export default MyApp
