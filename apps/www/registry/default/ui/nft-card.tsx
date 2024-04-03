import { useEffect, useState } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

//  variants for the NFT card
const nftCardVariants = cva(
  "inline-flex flex-col border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-gray-200 bg-white text-black",
        dark: "border-gray-700 bg-gray-900 text-grey-100",
      },
      size: {
        default: "w-full",
        xs: "w-24 rounded-lg",
        sm: "w-40 rounded-lg",
        lg: "w-60 rounded-xl",
        xl: "w-80 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const imgCardVariants = cva("rounded-t-lg select-none", {
  variants: {
    imgRatio: {
      default: "aspect-auto",
      square: "aspect-square w-full h-full object-cover",
      video: "aspect-video w-full h-full object-cover",
    },
  },
  defaultVariants: {
    imgRatio: "default",
  },
})

const hideTextVariants = cva("truncate block", {
  variants: {
    nftName: {
      default: "px-4",
      hidden: "hidden",
    },
    collectionName: {
      default: "px-4",
      hidden: "hidden",
    },
  },
  defaultVariants: {
    nftName: "default",
    collectionName: "default",
  },
})

interface NftCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof imgCardVariants>,
    VariantProps<typeof hideTextVariants>,
    VariantProps<typeof nftCardVariants> {
  mintAddress: string
}

const NftCard = ({
  className,
  variant,
  size,
  imgRatio,
  nftName,
  collectionName,
  mintAddress,
  ...props
}: NftCardProps) => {
  const [nftData, setNftData] = useState<any>(null)

  useEffect(() => {
    const fetchNftData = async () => {
      const cacheKey = `nftData-${mintAddress}`
      const cachedData = sessionStorage.getItem(cacheKey)

      if (cachedData) {
        setNftData(JSON.parse(cachedData))
      } else {
        const response = await fetch(
          `https://solanaapi.nftscan.com/api/sol/assets/${mintAddress}?show_attribute=true`,
          {
            method: "GET",
            headers: {
              Accept: "*/*",
              "X-API-KEY": process.env.NEXT_PUBLIC_NFTSCAN_KEY!,
            },
          }
        )
        const jsonData = await response.json()
        if (jsonData.code === 200) {
          const parsedData = JSON.parse(jsonData.data.metadata_json)
          sessionStorage.setItem(cacheKey, JSON.stringify(parsedData))
          setNftData(parsedData)
        }
      }
    }

    fetchNftData()
  }, [mintAddress])

  return (
    <div
      className={cn(nftCardVariants({ variant, size }), className)}
      {...props}
    >
      {nftData ? (
        <>
          <img
            src={`https://images.hsingh.site/?url=${nftData.image}&output=webp&width=400&q=80w=418&h=418`}
            alt={nftData.name}
            className={cn(imgCardVariants({ imgRatio }), "")}
          />
          <div className="border-gray-200 bg-white   dark:border-gray-700 dark:bg-gray-900">
            <p
              className={cn(
                hideTextVariants({ collectionName }),
                "text-sm mt-2 mb-1"
              )}
            >
              {nftData.properties.collection.name}
            </p>
            <h3
              className={cn(
                hideTextVariants({ nftName }),
                "text-lg font-bold mt-1 mb-2"
              )}
            >
              {nftData.name}
            </h3>
          </div>
        </>
      ) : (
        <div
          className={cn(nftCardVariants({ variant, size }), "animate-pulse")}
        >
          <div
            className={cn(
              imgCardVariants({ imgRatio }),
              "w-full bg-gray-300 rounded-t-lg"
            )}
          />
          <div className="">
            <div
              className={cn(
                hideTextVariants({ collectionName }),
                "mx-4 h-3 bg-gray-300 rounded mt-2 mb-2"
              )}
            />
            <div
              className={cn(
                hideTextVariants({ nftName }),
                "mx-4 w-3/4 h-4 bg-gray-300 rounded mt-2 mb-2"
              )}
            />
          </div>
        </div>
      )}
    </div>
  )
}
NftCard.displayName = "NftCard"
export { NftCard, nftCardVariants, imgCardVariants, hideTextVariants }
