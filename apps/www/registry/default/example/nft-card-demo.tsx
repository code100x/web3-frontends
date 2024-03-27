import { NftCard } from "../ui/nft-card"

const NftCardDemo = () => {
  return (
    <NftCard
      size={"lg"}
      imgRatio={"square"}
      collectionName={"default"}
      nftName={"default"}
      mintAddress="9jLqE8fp4UyQyzgXyb5KiPD3Mr7PuoCQ1seNXL7TNtY7"
    />
  )
}

export default NftCardDemo
