import '@/styles/globals.css'
import "7.css/dist/7.scoped.css"
import type { AppProps } from 'next/app'
import { WindowProvider } from '@/window_context/WindowContextAPI'

export default function App({ Component, pageProps }: AppProps) {
  return <WindowProvider>
    <Component {...pageProps} />
  </WindowProvider>
}
