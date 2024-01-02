import { Ctx } from "blitz"
import db from "db"

export default async function getTopWalletsQuery(_ = null, { session }: Ctx) {
  const wallets = await db.wallet.findMany({
    take: 10,
    orderBy: {
      burnedTokens: "desc",
    },
  })

  return wallets
}
