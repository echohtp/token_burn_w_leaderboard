import { BlitzPage } from "@blitzjs/next"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import Leaderboard from "src/core/components/Leaderboard"
import Burn from "src/core/components/Burn"
import JupiterSwap from "src/core/components/JupiterSwap"
import Footer from "src/core/components/Footer"

const Home: BlitzPage = () => {
  const { connected } = useWallet()

  return (
    <>
      <div className="min-h-full">
        <div className="text-center py-4">
          <WalletMultiButton />
        </div>
        <hr />
        <div className="w-1/2 mx-auto pt-4 text-center">
          <Leaderboard />
        </div>
        <>
          {connected ? (
            <>
              <div className="py-10">
                <main>
                  <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-gray-100 rounded-lg px-5 pt-5 pb-5 w-1/2 mx-auto">
                      <Burn />
                    </div>
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 text-center pt-2">
                      {/* <p className="text-xl mb-4">You must have tokens in your wallet to burn them</p> */}
                      <div className="w-1/2 mx-auto">
                        <div className="bg-gray-100 rounded-lg px-5 pt-5 pb-5">
                          <p className="text-2xl mb-4">Need some tokens to burn?</p>
                          <JupiterSwap />
                        </div>
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </>
          ) : (
            <div className="py-10">
              <header>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900"></h1>
                </div>
              </header>
              <main>
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 text-center">
                  <p className="text-xl mb-4">Connect above to join the token burn!</p>
                </div>
              </main>
            </div>
          )}
        </>
      </div>
      <Footer />
    </>
  )
}

export default Home
