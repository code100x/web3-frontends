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

interface NftCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof nftCardVariants> {
  mintAddress: string
}

interface NftData {
  image: string
  name: string
  description: string
}

const NftCard = async ({
  className,
  variant,
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
    <div className={cn(nftCardVariants({ variant }), className)} {...props}>
      {/* {nftData ? (
        <>
          <img
            src={nftData.image}
            alt={nftData.name}
            className="rounded-t-lg"
          />
          <div className="p-4">
            <h3 className="text-lg font-bold">{nftData.name}</h3>
            <p>{nftData.description}</p>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )} */}
    </div>
  )
}
NftCard.displayName = "NftCard"
export { NftCard, nftCardVariants }
