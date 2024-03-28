import { NftCard } from "../ui/nft-card"

const NftCardDemo = () => {
  return (
    <NftCard
      mintAddress="9jLqE8fp4UyQyzgXyb5KiPD3Mr7PuoCQ1seNXL7TNtY7"
      size={"xl"}
      imgRatio={"square"}
      nftName={"default"}
      collectionName={"default"}
      variant={"dark"}
    />
  )
}

export default NftCardDemo
