import { useQuery } from "@blitzjs/rpc"
import { useState } from "react"
import getTopWalletsQuery from "src/users/queries/getTopWallets"
import Image from "next/image"
type LeaderboardEntry = {
  pubkey: string
  totalBurned: number
  twitter?: string | null
}

const Leaderboard = () => {
  const [topWallets] = useQuery(getTopWalletsQuery, null)
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    topWallets.map((wallet) => ({
      pubkey: wallet.pubkey,
      totalBurned: wallet.burnedTokens,
      twitter: wallet.twitter,
    }))
  )

  return (
    <>
      <Image
        className="inline-block"
        src="/torch.gif"
        alt="Burning Torch Gif"
        width={50}
        height={50}
      />
      <h1 className="text-4xl font-bold text-center inline-block">Top Burners</h1>
      <Image
        className="inline-block"
        src="/torch.gif"
        alt="Burning Torch Gif"
        width={50}
        height={50}
      />
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
                <td className="border px-4 py-2 text-center">
                  {entry.twitter != null ? (
                    <a
                      href={"https://twitter.com/" + entry.twitter}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {entry.twitter}
                      <Image
                        className="inline-block pl-2"
                        src="/twitter.svg"
                        alt="Twitter"
                        width={25}
                        height={25}
                      />
                    </a>
                  ) : (
                    <>{entry.pubkey}</>
                  )}
                </td>

                <td className="border px-4 py-2 text-center">{entry.totalBurned}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Leaderboard
