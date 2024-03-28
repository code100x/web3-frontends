import { useEffect, useState } from "react"
import {
  fetchDigitalAsset,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { publicKey } from "@metaplex-foundation/umi-public-keys"
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

  const umi = createUmi(process.env.NEXT_PUBLIC_RPCNODE!).use(
    mplTokenMetadata()
  )

  useEffect(() => {
    const fetchNftData = async () => {
      const nftData = await fetchDigitalAsset(umi, publicKey(mintAddress))
      const uriData = await fetch(nftData.metadata.uri, {
        method: "GET",
        headers: {
          Accept: "*/*",
        },
      })
      const jsonUriData = await uriData.json()
      setNftData({
        nft: nftData,
        uriData: jsonUriData,
      })
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
            src={nftData.uriData.image}
            alt={nftData.uriData.name}
            className={cn(imgCardVariants({ imgRatio }), "")}
          />
          <div className="">
            <p
              className={cn(
                hideTextVariants({ collectionName }),
                "text-sm mt-2 mb-1"
              )}
            >
              {nftData.uriData.properties.collection.name}
            </p>
            <h3
              className={cn(
                hideTextVariants({ nftName }),
                "text-lg font-bold mt-1 mb-2"
              )}
            >
              {nftData.uriData.name}
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
