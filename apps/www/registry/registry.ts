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
]

const example: Registry = [
  {
    name: "nft-card-demo",
    type: "components:example",
    registryDependencies: [""],
    files: ["example/nft-card-demo.tsx"],
  },
]

export const registry: Registry = [...ui, ...example]
