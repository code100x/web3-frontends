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
  "inline-flex flex-col rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-gray-200 bg-white text-black",
        dark: "border-gray-700 bg-gray-800 text-white",
      },
      size: {
        default: "w-40",
        xs: "w-20",
        sm: "w-28",
        lg: "w-60",
        xl: "w-80",
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

const hideTextVariants = cva("truncate", {
  variants: {
    nftName: {
      default: "block px-4",
      hidden: "hidden",
    },
    collectionName: {
      default: "block px-4",
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

  const umi = createUmi(process.env.NEXT_PUBLIC_QUICKNODE!).use(
    mplTokenMetadata()
  )

  useEffect(() => {
    const fetchNftData = async () => {
      const nftData = await fetchDigitalAsset(umi, publicKey(mintAddress))
      const uriData = await fetch(
        "https://madlads.s3.us-west-2.amazonaws.com/json/1976.json",
        {
          method: "GET",
          headers: {
            Accept: "*/*",
          },
        }
      )
      const jsonUriData = await uriData.json()
      setNftData({
        nft: nftData,
        uriData: jsonUriData,
      })
    }
    fetchNftData()
  }, [])

  console.log(nftData)
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
            className={cn(imgCardVariants({ imgRatio }))}
          />
          <div className="">
            <p className={cn(hideTextVariants({ collectionName }), "text-sm")}>
              {nftData.uriData.properties.collection.name}
            </p>
            <h3
              className={cn(hideTextVariants({ nftName }), "text-lg font-bold")}
            >
              {nftData.uriData.name}
            </h3>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}
NftCard.displayName = "NftCard"
export { NftCard, nftCardVariants, imgCardVariants, hideTextVariants }
