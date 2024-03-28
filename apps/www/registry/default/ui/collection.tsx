import { useEffect, useState } from "react";
import { fetchDigitalAsset, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { publicKey } from "@metaplex-foundation/umi-public-keys";
import { cva, type VariantProps } from "class-variance-authority";



import { cn } from "@/lib/utils";





//  variants for the NFT card
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
}

interface NftData {
  image: string
  name: string
  description: string
}

const Collection = ({
  className,
  variant,
  collectionName,
  ...props
}: CollectionProps) => {
  const [collection, setCollection] = useState<any>(null)

  useEffect(() => {
    const fetchNftData = async () => {
      const collectionData = await fetch(
        `https://cors-anywhere.herokuapp.com/https://moonrank.app/mints/${collectionName.replaceAll(
          " ",
          "_"
        )}`,
        {
          method: "GET",
          headers: {
            Accept: "*/*",
            contentType: "application/json",
            "User-Agent": "Thunder Client (https://www.thunderclient.com)",
          },
        }
      )
      const jsonCollectionData = await collectionData.json()
      setCollection(jsonCollectionData)
    }
    fetchNftData()
  }, [])

  console.log(collection)
  return (
    <div className={cn(collectionVariants({ variant }), className)} {...props}>
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
Collection.displayName = "Collection"
export { Collection, collectionVariants }