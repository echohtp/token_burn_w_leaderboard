import { useEffect, useState } from "react"

import { useMutation } from "@blitzjs/rpc"
import { BlitzPage } from "@blitzjs/next"
import Navbar from "src/core/components/Navbar"
import { Formik, Form, Field } from "formik"
import burnTokens from "src/auth/mutations/burn"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Connection, PublicKey, Transaction, clusterApiUrl } from "@solana/web3.js"
import { createBurnCheckedInstruction, getAssociatedTokenAddress } from "@solana/spl-token"

const Home: BlitzPage = () => {
  const [burnMutation] = useMutation(burnTokens)

  const { connected, publicKey, signTransaction } = useWallet()
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

  // Rest of your code...

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
      <Navbar />
      {connected ? (
        <>
          <WalletMultiButton />
          <p>Balance: {tokenBalance}</p>
          <Formik
            initialValues={{
              additionalBurnedTokens: 0,
              pubkey: publicKey?.toBase58(),
              tx: "4hH5wcq6vL9u2Wr8jtywD8czuAFfm2ZT815aKs5shutkQJv6hyvxbJHXW2tDyMdHMtwCNT9BTWnZBCKK4P1rKPmS",
            }}
            onSubmit={handleSubmit}
          >
            <Form className="flex flex-col items-center">
              <Field
                name="additionalBurnedTokens"
                type="number"
                className="border border-gray-300 rounded-md p-2 mb-4"
                max={tokenBalance}
              />

              <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md">
                Burn
              </button>
            </Form>
          </Formik>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-4">Connect your wallet to burn tokens</h1>
          <p className="text-xl mb-4">
            You must connect your wallet to burn tokens. Click the button below to connect your
            wallet.
          </p>
          <WalletMultiButton />
        </div>
      )}
    </>
  )
}

export default Home
