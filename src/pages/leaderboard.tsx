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
    <div className="min-h-full">
      <Navbar />
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900"></h1>
          </div>
        </header>
        <main>
          <div className="mt-4 w-2/3 items-center justify-center mx-auto">
            <table className="table-auto w-full p-4">
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
          </div>
        </main>
      </div>
    </div>
  )
}

export default LeaderboardPage
