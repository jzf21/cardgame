import React from 'react'
import axios from 'axios'

type Props = {}

const Leaderboard = (props: Props) => {
    const [leaderboard, setLeaderboard] = React.useState([])
    const getLeaderboard = async () => {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`)
        console.log(response.data)
        setLeaderboard(response.data)
    }
    React.useEffect(() => {
        getLeaderboard()
    }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-2xl font-bold mb-5">Leaderboard</h1>
        <table className="min-w-full divide-y divide-gray-200 shadow-md">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {leaderboard.map((user: any, index: number) => (
                    <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{user.Member}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{user.Score}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}

export default Leaderboard