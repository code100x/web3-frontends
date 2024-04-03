import { useEffect, useState } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

import { Card, CardContent, CardHeader } from "./card"
import Loading from "./loading"

const collectionStatsVariants = cva(
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

interface CollectionStatsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof collectionStatsVariants> {
  collectionName: string
  limit?: number
}

const Stat = ({ title, value }: { title: string; value: string }) => {
  return (
    <div>
      <p className="font-semibold text-black dark:text-white">{value}</p>
      <p className="text-gray-600 dark:text-gray-300">{title}</p>
    </div>
  )
}

const CollectionStats = ({
  className,
  variant,
  collectionName,
  ...props
}: CollectionStatsProps) => {
  const [collectionStats, setCollectionStats] = useState<any>(null)

  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    const cacheKeyPrefix = `collectionData-stats`
    const cachedKey = `${cacheKeyPrefix}-${collectionName}`
    const fetchCollectionData = async () => {
      const cachedData = sessionStorage.getItem(cachedKey)
      if (cachedData) {
        setCollectionStats(JSON.parse(cachedData))
      } else {
        let url = `https://solanaapi.nftscan.com/api/sol/statistics/collection/${collectionName}`

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
              clearCollectionCache(cacheKeyPrefix)
              sessionStorage.setItem(cachedKey, JSON.stringify(jsonData.data))
            }
            setCollectionStats(jsonData.data)
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
  }, [collectionName])

  const clearCollectionCache = (prefix: string) => {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      if (key && key.startsWith(prefix)) {
        sessionStorage.removeItem(key)
      }
    }
  }

  return (
    <div>
      {loading || !collectionStats ? (
        <Loading />
      ) : (
        <Card key="1" className="max-w-sm  text-white rounded-xl shadow-md  ">
          <CardHeader
            className="flex items-center justify-between p-4 border-b border-gray-600 bg-contain h-[100px]"
            style={{ backgroundImage: `url(${collectionStats.logo_url})` }}
          />
          <CardContent className="p-4">
            <h2 className="text-lg font-bold">{collectionStats.collection}</h2>
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <Stat
                title="Lowest Price (24h)"
                value={collectionStats.lowest_price_24h}
              />
              <Stat
                title="Average Price (24h)"
                value={collectionStats.average_price_24h.toFixed(2)}
              />
              <Stat title="Sales (24h)" value={collectionStats.sales_24h} />
              <Stat
                title="Highest Price"
                value={collectionStats.highest_price}
              />
              <Stat
                title="Volume (24h)"
                value={collectionStats.volume_24h.toFixed(3)}
              />
              <Stat
                title="Total Volume"
                value={collectionStats.total_volume.toLocaleString()}
              />
              <Stat title="Owners" value={collectionStats.owners_total} />
              <Stat title="Items" value={collectionStats.items_total} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
CollectionStats.displayName = "CollectionStats"
export { CollectionStats, collectionStatsVariants }
