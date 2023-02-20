import '@/styles/globals.css'
import "7.css/dist/7.scoped.css"
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
