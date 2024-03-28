import { Registry } from "@/registry/schema"

const ui: Registry = [
  {
    name: "nft-card",
    type: "components:ui",
    dependencies: [
      "@metaplex-foundation/mpl-token-metadata",
      "@metaplex-foundation/umi-bundle-defaults",
      "@metaplex-foundation/umi-public-keys",
    ],
    files: ["ui/nft-card.tsx"],
  },
  {
    name: "collection",
    type: "components:ui",
    dependencies: [],
    files: ["ui/collection.tsx"],
  },
]

const example: Registry = [
  {
    name: "collection-demo",
    type: "components:example",
    registryDependencies: [""],
    files: ["example/collection-demo.tsx"],
  },
]

export const registry: Registry = [...ui, ...example]
