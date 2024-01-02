import db from "db"
import { Connection, Transaction } from "@solana/web3.js"

async function burnTokens(value: any) {
  console.log("Burning tokens for user:", value.pubkey)
  console.log("Signature:", value.tx)

  const verified = await verifyTransaction(value.tx)

  console.log("Verified:", verified)

  let user = await db.wallet.findFirst({ where: { pubkey: value.pubkey } })

  console.log("User:", user)

  if (!user) {
    user = await db.wallet.create({
      data: { pubkey: value.pubkey, burnedTokens: value.additionalBurnedTokens },
    })
  } else {
    user = await db.wallet.update({
      where: { id: user.id },
      data: { burnedTokens: user.burnedTokens + value.additionalBurnedTokens },
    })
  }

  return user
}

export default burnTokens

const verifyTransaction = async (signature: string) => {
  const connection = new Connection("https://api.mainnet-beta.solana.com")

  try {
    const transaction = await connection.getTransaction(signature)
    if (transaction) {
      console.log("Transaction exists!")
      return true
      // Additional verification logic can be added here
    } else {
      console.log("Transaction does not exist.")
      return false
    }
  } catch (error) {
    console.error("Error verifying transaction:", error)
    return false
  }
}
