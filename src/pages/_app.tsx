import { ErrorFallbackProps, ErrorComponent, ErrorBoundary, AppProps } from "@blitzjs/next"
import { AuthenticationError, AuthorizationError } from "blitz"
import React, { Suspense, useMemo } from "react"
import { withBlitz } from "src/blitz-client"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import "src/styles/globals.css"

import "src/core/styles/index.css"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { clusterApiUrl } from "@solana/web3.js"

require("@solana/wallet-adapter-react-ui/styles.css")

function RootErrorFallback({ error }: ErrorFallbackProps) {
  if (error instanceof AuthenticationError) {
    return <div>Error: You are not authenticated</div>
  } else if (error instanceof AuthorizationError) {
    return (
      <ErrorComponent
        statusCode={error.statusCode}
        title="Sorry, you are not authorized to access this"
      />
    )
  } else {
    return (
      <ErrorComponent
        statusCode={(error as any)?.statusCode || 400}
        title={error.message || error.name}
      />
    )
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)

  // You can also provide a custom RPC endpoint.
  const endpoint = process.env.NEXT_PUBLIC_RPC_URL!

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <Suspense fallback="Loading...">
            <ErrorBoundary FallbackComponent={RootErrorFallback}>
              {getLayout(<Component {...pageProps} />)}
            </ErrorBoundary>
          </Suspense>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default withBlitz(MyApp)
