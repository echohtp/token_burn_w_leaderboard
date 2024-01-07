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
        <div className="w-1/2 mx-auto pt-4 text-center pb-4">
          <WalletMultiButton />
        </div>
        <hr className="w-2/3 mx-auto border-t-1 border-gray-300" />

        <div className="w-1/2 mx-auto pt-4 text-center">
          <Leaderboard />
        </div>

        <div className="w-1/2 mx-auto pt-4 text-center h-[250px]">
          <Burn />
        </div>

        <div className={`w-1/2 mx-auto pt-4 text-center ${!connected && "blur"}`}>
          <JupiterSwap />
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Home
