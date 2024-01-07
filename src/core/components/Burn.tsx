import { useEffect, useState } from "react"
import burnTokens from "src/auth/mutations/burn"
import { Formik, Form, Field, useFormik, useFormikContext } from "formik"

import { Connection, PublicKey, Transaction, clusterApiUrl } from "@solana/web3.js"
import { createBurnCheckedInstruction, getAssociatedTokenAddress } from "@solana/spl-token"
import { useMutation } from "@blitzjs/rpc"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"

const Burn = () => {
  const [burnMutation] = useMutation(burnTokens)
  const [tokenBalance, setTokenBalance] = useState<number>(0)

  const { connected, publicKey, signTransaction } = useWallet()
  const wallet = useWallet()
  const { connection } = useConnection()

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

  const handleSubmit = async (values: {
    pubkey: string
    additionalBurnedTokens: number
    tx: string
    twitterAccount: string
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
      <Formik
        initialValues={{
          additionalBurnedTokens: 0,
          pubkey: publicKey?.toBase58(),
          twitterAccount: "",
          tx: "",
        }}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form className="flex flex-col items-center">
            <p
              onClick={() => {
                setFieldValue("additionalBurnedTokens", tokenBalance)
              }}
              className="my-2 font-medium text-blue-500 hover:underline cursor-pointer"
            >
              Balance: {tokenBalance}
            </p>
            <Field
              className="inline-block"
              id="additionalBurnedTokens"
              name="additionalBurnedTokens"
              type="float"
              className="border border-gray-300 rounded-md p-2 mb-4"
              min={0}
              max={tokenBalance}
            />

            <Field
              className="inline-block"
              id="twitterAccount"
              name="twitterAccount"
              type="string"
              className="border border-gray-300 rounded-md p-2 mb-4"
              placeholder="Twitter Account (optional)"
            />

            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md inline-block"
            >
              Burn
            </button>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default Burn
