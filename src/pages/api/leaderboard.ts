import { NextApiRequest, NextApiResponse } from "next"
import { useQuery } from "@blitzjs/rpc"
import getTopWalletsQuery from "src/users/queries/getTopWallets"

export default async function GetLeaderboard(req: NextApiRequest, res: NextApiResponse) {
  // Your API logic goes here

  // Fetch the top 10 wallets by burnedTokens

  res.status(200).json({ topWallets })
}
