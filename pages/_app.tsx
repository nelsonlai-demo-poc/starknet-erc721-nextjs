import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { StarknetProvider, InjectedConnector } from '@starknet-react/core'

function MyApp({ Component, pageProps }: AppProps) {
  return <StarknetProvider connectors={[new InjectedConnector()]}>
    <Component {...pageProps} />
  </StarknetProvider>
}

export default MyApp
