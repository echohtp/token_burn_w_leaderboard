import { useEffect, useState } from "react"

import { useMutation } from "@blitzjs/rpc"
import { BlitzPage } from "@blitzjs/next"
import Navbar from "src/core/components/Navbar"
import { Formik, Form, Field, useFormik, useFormikContext } from "formik"
import burnTokens from "src/auth/mutations/burn"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Connection, PublicKey, Transaction, clusterApiUrl } from "@solana/web3.js"
import { createBurnCheckedInstruction, getAssociatedTokenAddress } from "@solana/spl-token"
import Leaderboard from "src/core/components/Leaderboard"
import Script from "next/script"

const Home: BlitzPage = () => {
  const [burnMutation] = useMutation(burnTokens)

  const { connected, publicKey, signTransaction } = useWallet()
  const wallet = useWallet()
  const { connection } = useConnection()

  const [tokenBalance, setTokenBalance] = useState<number | null>(null)

  useEffect(() => {
    const fetchTokenBalance = async () => {
      try {
        console.log("Fetching token balance...")

        const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL!, "confirmed")
        const tokenPublicKey = new PublicKey(process.env.NEXT_PUBLIC_TOKEN_ADDRESS!)

        console.log(`publicKey: ${publicKey}`)
        console.log(`tokenPublicKey: ${tokenPublicKey}`)

        let balance = await connection.getParsedTokenAccountsByOwner(publicKey!, {
          mint: tokenPublicKey,
        })
        balance = balance.value[0]?.account.data.parsed.info.tokenAmount.uiAmount

        console.log(`balance: ${balance}`)

        setTokenBalance(Number(balance))
      } catch (error) {
        console.error("Error fetching token balance:", error)
      }
    }
    fetchTokenBalance()
  }, [connected, publicKey])

  useEffect(() => {
    const PLATFORM_FEE_AND_ACCOUNTS = {
      referralAccount: new PublicKey("2XEYFwLBkLUxkQx5ZpFAAMzWhQxS4A9QzjhcPhUwhfwy"),
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

  const handleSubmit = async (values: {
    pubkey: string
    additionalBurnedTokens: number
    tx: string
  }) => {
    try {
      if (!signTransaction) return

      console.log("Burning tokens...")
      console.log(values)
      const account = await getAssociatedTokenAddress(
        new PublicKey(process.env.NEXT_PUBLIC_TOKEN_ADDRESS!),
        publicKey!
      )

      const tx = new Transaction().add(
        createBurnCheckedInstruction(
          account, // PublicKey of Owner's Associated Token Account
          new PublicKey(process.env.NEXT_PUBLIC_TOKEN_ADDRESS!), // Public Key of the Token Mint Address
          publicKey!, // Public Key of Owner's Wallet
          values.additionalBurnedTokens * 10 ** Number(process.env.NEXT_PUBLIC_MINT_DECIMALS!), // Number of tokens to burn
          Number(process.env.NEXT_PUBLIC_MINT_DECIMALS!) // Number of Decimals of the Token Mint
        )
      )

      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
      tx.feePayer = publicKey!

      const signed = await signTransaction(tx)
      const signature = await connection.sendRawTransaction(signed.serialize())

      console.log("Signature:", signature)
      values.tx = signature

      await burnMutation(values)
      console.log("Tokens burned successfully!")
    } catch (error) {
      console.error("Error burning tokens:", error)
    }
  }

  return (
    <>
      <Script src="https://terminal.jup.ag/main-v2.js" />
      <div className="min-h-full">
        <div className="text-center py-4">
          <WalletMultiButton />
        </div>
        <hr />
        <div className="w-1/2 mx-auto pt-4">
          <h1 className="text-4xl font-bold text-center">Top Burners</h1>
          <Leaderboard />
        </div>
        {connected ? (
          <>
            <div className="py-10">
              <main>
                {tokenBalance > 0 ? (
                  <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Formik
                      initialValues={{
                        additionalBurnedTokens: 0,
                        pubkey: publicKey?.toBase58(),
                        tx: "",
                      }}
                      onSubmit={handleSubmit}
                    >
                      {({ setFieldValue }) => (
                        <Form className="flex flex-col items-center">
                          <p
                            onClick={() => {
                              setFieldValue("additionalBurnedTokens", tokenBalance?.toFixed(0))
                            }}
                            className="my-2 font-medium text-blue-500 hover:underline cursor-pointer"
                          >
                            Balance: {tokenBalance?.toFixed(0)}
                          </p>
                          <Field
                            id="additionalBurnedTokens"
                            name="additionalBurnedTokens"
                            type="float"
                            className="border border-gray-300 rounded-md p-2 mb-4"
                            min={0}
                            max={tokenBalance}
                          />

                          <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-4 rounded-md"
                          >
                            Burn
                          </button>
                        </Form>
                      )}
                    </Formik>
                  </div>
                ) : (
                  <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 text-center">
                    <p className="text-xl mb-4">
                      You must have tokens in your wallet to burn them. Put a jupiter swap here
                    </p>
                    <div className="w-1/2 mx-auto">
                      <div className="bg-gray-700 rounded-lg">
                        <div id="integrated-terminal">&nbsp;</div>
                      </div>
                    </div>
                  </div>
                )}
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
                <p className="text-xl mb-4">
                  You must connect your wallet to burn tokens. Click the button below to connect
                  your wallet.
                </p>
                <WalletMultiButton />
              </div>
            </main>
          </div>
        )}
      </div>
    </>
  )
}

export default Home
