import { useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import Script from "next/script"
import React, { useEffect } from "react"

const JupiterSwap: React.FC = () => {
  const wallet = useWallet()

  useEffect(() => {
    const PLATFORM_FEE_AND_ACCOUNTS = {
      referralAccount: new PublicKey(process.env.NEXT_PUBLIC_REFERRAL_ADDRESS!),
      feeBps: 100,
    }

    //@ts-ignore
    if (wallet && window && window.Jupiter) {
      //@ts-ignore
      window.Jupiter.init({
        passThroughWallet: wallet,
        displayMode: "integrated",
        integratedTargetId: "integrated-terminal",
        endpoint: process.env.NEXT_PUBLIC_RPC_URL!,
        platformFeeAndAccounts: PLATFORM_FEE_AND_ACCOUNTS,
        strictTokenList: false,
        formProps: {
          fixedOutputMint: true,
          initialOutputMint: process.env.NEXT_PUBLIC_TOKEN_ADDRESS!,
        },
      })
    }
  }, [wallet])

  return (
    <>
      <Script src="https://terminal.jup.ag/main-v2.js" />

      <div className="bg-gray-700 rounded-lg">
        <div id="integrated-terminal">&nbsp;</div>
      </div>
    </>
  )
}

export default JupiterSwap
