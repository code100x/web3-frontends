import { NftsByAccount } from "../ui/nfts-by-account";


const NftsByAccountCollectionDemo = () => {
  return (
    <NftsByAccount
      accountAddress="G9cDjsCJYNtacVF6ty4GSUBGa5vsNWn8ZSKawA4TXpa6"
      collectionName="🎁2024 Jupiter AirDrop"
      limit={10}
    />
  )
}

export default NftsByAccountCollectionDemo