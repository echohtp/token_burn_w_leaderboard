import { Routes, BlitzPage } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import { useState } from "react"
import Navbar from "src/core/components/Navbar"
import getTopWalletsQuery from "src/users/queries/getTopWallets"

type LeaderboardEntry = {
  pubkey: string
  totalBurned: number
}

const Leaderboard = () => {
  const [topWallets] = useQuery(getTopWalletsQuery, null)
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    topWallets.map((wallet) => ({ pubkey: wallet.pubkey, totalBurned: wallet.burnedTokens }))
  )

  return (
    <div className="mt-4 w-full items-center justify-center mx-auto">
      <table className="table-auto w-full p-4">
        <thead>
          <tr>
            <th className="px-4 py-2 justify-center">🐲</th>
            <th className="px-4 py-2">🔥</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((entry, index) => (
            <tr key={index}>
              <td className="border px-4 py-2 text-center">{entry.pubkey}</td>
              <td className="border px-4 py-2 text-center">{entry.totalBurned}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Leaderboard
