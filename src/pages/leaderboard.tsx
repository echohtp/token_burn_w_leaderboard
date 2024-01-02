import { Routes, BlitzPage } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import { useState } from "react"
import Navbar from "src/core/components/Navbar"
import getTopWalletsQuery from "src/users/queries/getTopWallets"

type LeaderboardEntry = {
  pubkey: string
  totalBurned: number
}

const LeaderboardPage: BlitzPage = () => {
  const [topWallets] = useQuery(getTopWalletsQuery, null)
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    topWallets.map((wallet) => ({ pubkey: wallet.pubkey, totalBurned: wallet.burnedTokens }))
  )

  return (
    <>
      <Navbar />
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Pubkey</th>
            <th className="px-4 py-2">Total Burned</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((entry, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{entry.pubkey}</td>
              <td className="border px-4 py-2">{entry.totalBurned}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default LeaderboardPage
