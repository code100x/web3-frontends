import { useEffect, useState } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

import Loading from "./loading"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "./pagination"

const collectionVariants = cva(
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

interface CollectionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof collectionVariants> {
  collectionName: string
  limit?: number
}

const Collection = ({
  className,
  variant,
  collectionName,
  limit = 2,
  ...props
}: CollectionProps) => {
  const [collection, setCollection] = useState<any>(null)
  const [currentPageKey, setCurrentPageKey] = useState<string>("")
  const [pageKeys, setPageKeys] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    const cacheKeyPrefix = `collectionData-${collectionName}-${limit}`
    const cacheKey = `${cacheKeyPrefix}-${currentPageKey}`
    const fetchCollectionData = async () => {
      const cachedData = sessionStorage.getItem(cacheKey)
      if (cachedData) {
        setCollection(JSON.parse(cachedData))
      } else {
        let url = `https://solanaapi.nftscan.com/api/sol/assets/collection/${collectionName}?show_attribute=false&limit=${Math.min(
          limit,
          100
        )}&cursor=${currentPageKey}`
        if (currentPageKey) url += `&page=${currentPageKey}`
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
              sessionStorage.setItem(cacheKey, JSON.stringify(jsonData.data))
            } catch (e) {
              clearCollectionCache(cacheKeyPrefix)
              sessionStorage.setItem(cacheKey, JSON.stringify(jsonData.data))
            }
            setCollection(jsonData.data)
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
  }, [collectionName, currentPageKey])

  const clearCollectionCache = (prefix: string) => {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      if (key && key.startsWith(prefix)) {
        sessionStorage.removeItem(key)
      }
    }
  }

  const handlePreviousPage = () => {
    if (pageKeys.length === 0) return
    const newPageKeys = [...pageKeys]
    newPageKeys.pop()
    const previousPageKey = newPageKeys[newPageKeys.length - 1] || ""

    setCurrentPageKey(previousPageKey)
    setPageKeys(newPageKeys)
  }

  const handleNextPage = () => {
    if (collection?.next) {
      const newPageKeys = [...pageKeys, collection.next]
      setPageKeys(newPageKeys)
      setCurrentPageKey(collection.next)
    }
  }

  const CollectionNftCard = (nft: any) => {
    return (
      <div className="border border-gray-200 dark:border-gray-800 rounded-lg">
        <div className="aspect-[4/3] w-full overflow-hidden rounded-t-lg">
          <img
            alt={nft.name}
            className="object-cover"
            height={300}
            src={`https://images.hsingh.site/?url=${nft.image_uri}&output=webp&width=400&q=80w=400&h=400`}
            style={{
              aspectRatio: "400/300",
              objectFit: "cover",
            }}
            width={400}
          />
        </div>
        <div className="p-4 grid gap-2">
          <h2 className="text-lg font-semibold leading-none">{nft.name}</h2>
          <p className="text-sm font-medium leading-none text-gray-500 dark:text-gray-400">
            by {nft.collection}
          </p>
        </div>
      </div>
    )
  }
  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {collection?.content?.map((nft: any) => (
            <CollectionNftCard {...nft} key={nft.token_address} />
          ))}
        </div>
      )}
      <div className="flex justify-center items-center gap-4 text-sm mt-5">
        <Pagination>
          <PaginationContent className="m-0">
            {pageKeys.length > 0 && (
              <PaginationItem>
                <button onClick={handlePreviousPage}>
                  <PaginationPrevious href="#" />
                </button>
              </PaginationItem>
            )}

            <PaginationItem>
              <button onClick={handleNextPage}>
                <PaginationNext href="#" />
              </button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
Collection.displayName = "Collection"
export { Collection, collectionVariants }
