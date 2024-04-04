import { useEffect, useState } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

import { Card, CardContent, CardHeader } from "./card"
import Loading from "./loading"

const tradeRankingVariants = cva(
  "inline-flex flex-col rounded-lg border p-4 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-gray-200 bg-white text-black hover:bg-gray-50",
        dark: "border-gray-700 bg-gray-800 text-white hover:bg-gray-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface TradeRankingProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tradeRankingVariants> {
  time?: "1d" | "15m" | "30m" | "1h" | "6h" | "12h"
  sortBy?: "volume" | "sales"
  sort_order?: "asc" | "desc"
}

const TradeRanking = ({
  className,
  variant,
  time = "1d",
  sortBy = "volume",
  sort_order = "desc",
  ...props
}: TradeRankingProps) => {
  const [tradeRanking, setTradeRanking] = useState<any>(null)

  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    const cacheKeyPrefix = `tradingRanking`
    const cachedKey = `${cacheKeyPrefix}-${time}-${sortBy}-${sort_order}`
    const fetchCollectionData = async () => {
      const cachedData = sessionStorage.getItem(cachedKey)
      if (cachedData) {
        setTradeRanking(JSON.parse(cachedData))
      } else {
        let url = `https://solanaapi.nftscan.com/api/sol/statistics/ranking/trade?time=${time}&sort_field=${sortBy}&sort_direction=${sort_order}`

        try {
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "*/*",
              "X-API-KEY": process.env.NEXT_PUBLIC_NFTSCAN_KEY!,
            },
          })
          const jsonData = await response.json()
          if (jsonData.code === 200) {
            try {
              sessionStorage.setItem(cachedKey, JSON.stringify(jsonData.data))
            } catch (e) {
              clearCache(cacheKeyPrefix)
              sessionStorage.setItem(cachedKey, JSON.stringify(jsonData.data))
            }
            setTradeRanking(jsonData.data)
          } else {
            console.error("Failed to fetch collection data:", jsonData.message)
          }
        } catch (error) {
          console.error("Error fetching collection data:", error)
        }
      }
      setLoading(false)
    }

    fetchCollectionData()
  }, [sortBy, sort_order, time])

  const clearCache = (prefix: string) => {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      if (key && key.startsWith(prefix)) {
        sessionStorage.removeItem(key)
      }
    }
  }

  return loading || !tradeRanking ? (
    <Loading />
  ) : (
    <div className="overflow-auto border sm:rounded-lg">
      <table className="min-w-full">
        <thead>
          <tr className="border-b text-sm font-medium text-gray-500 dark:text-gray-400">
            <th className="px-4 py-3">Collection</th>
            <th className="px-4 py-3">Lowest Price</th>
            <th className="px-4 py-3">Average Price</th>
            <th className="px-4 py-3">Highest Price</th>
            <th className="px-4 py-3">Volume</th>
            <th className="px-4 py-3">Sales</th>
            <th className="px-4 py-3">Mint Price Total</th>
            <th className="px-4 py-3">Mint Gas Fee</th>
            <th className="px-4 py-3">Items Total</th>
            <th className="px-4 py-3">Owners Total</th>
            <th className="px-4 py-3">Volume Change</th>
            <th className="px-4 py-3">Average Price Change</th>
            <th className="px-4 py-3">Market Cap</th>
            <th className="px-4 py-3">Market Trend</th>
            <th className="px-4 py-3">Mint Average Price</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
          {tradeRanking.map((collection: any) => (
            <tr className="text-gray-500 dark:text-gray-400">
              <td className="flex items-center gap-4 px-4 py-3">
                {collection.logo_url && (
                  <img
                    alt={collection.collection}
                    className="rounded-full"
                    height="40"
                    src={`https://images.hsingh.site/?url=${collection.logo_url}&output=webp&width=40&q=80w=40&h=40`}
                    style={{
                      aspectRatio: "40/40",
                      objectFit: "cover",
                    }}
                    width="40"
                  />
                )}
                {collection.collection}
              </td>
              <td className="px-4 py-3">{collection.lowest_price}</td>
              <td className="px-4 py-3">{collection.average_price}</td>
              <td className="px-4 py-3">{collection.highest_price}</td>
              <td className="px-4 py-3">{collection.volume}</td>
              <td className="px-4 py-3">{collection.sales}</td>

              <td className="px-4 py-3">{collection.mint_price_total}</td>
              <td className="px-4 py-3">{collection.mint_gas_fee}</td>
              <td className="px-4 py-3">{collection.items_total}</td>
              <td className="px-4 py-3">{collection.owners_total}</td>
              <td className="px-4 py-3">{collection.volume_change}</td>
              <td className="px-4 py-3">{collection.average_price_change}</td>
              <td className="px-4 py-3">{collection.market_cap}</td>
              <td className="px-4 py-3">{collection.market_trend}</td>
              <td className="px-4 py-3">{collection.mint_average_price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
TradeRanking.displayName = "TradeRanking"
export { TradeRanking, tradeRankingVariants }
