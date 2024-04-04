import { Registry } from "@/registry/schema";





const ui: Registry = [
  {
    name: "nft-card",
    type: "components:ui",
    dependencies: [],
    files: ["ui/nft-card.tsx"],
  },
  {
    name: "collection",
    type: "components:ui",
    dependencies: ["pagination", "loading"],
    files: ["ui/collection.tsx"],
  },
  {
    name: "loading",
    type: "components:ui",
    dependencies: [],
    files: ["ui/loading.tsx"],
  },
  {
    name: "button",
    type: "components:ui",
    dependencies: ["@radix-ui/react-slot"],
    files: ["ui/button.tsx"],
  },
  {
    name: "pagination",
    type: "components:ui",
    registryDependencies: ["button"],
    files: ["ui/pagination.tsx"],
  },
  {
    name: "card",
    type: "components:ui",
    registryDependencies: [""],
    files: ["ui/card.tsx"],
  },
  {
    name: "collection-stats",
    type: "components:ui",
    registryDependencies: ["card", "loading"],
    files: ["ui/collection-stats.tsx"],
  },
  {
    name: "nfts-by-account",
    type: "components:ui",
    dependencies: ["pagination", "loading"],
    files: ["ui/nfts-by-account.tsx"],
  },
  {
    name: "trade-ranking",
    type: "components:ui",
    dependencies: ["loading"],
    files: ["ui/trade-ranking.tsx"],
  },
]

const example: Registry = [
  {
    name: "nft-card-demo",
    type: "components:example",
    registryDependencies: [""],
    files: ["example/nft-card-demo.tsx"],
  },
  {
    name: "collection-demo",
    type: "components:example",
    registryDependencies: [""],
    files: ["example/collection-demo.tsx"],
  },
  {
    name: "collection-stats-demo",
    type: "components:example",
    registryDependencies: [""],
    files: ["example/collection-stats-demo.tsx"],
  },
  {
    name: "nfts-by-account-demo",
    type: "components:example",
    registryDependencies: [""],
    files: ["example/nfts-by-account-demo.tsx"],
  },
  {
    name: "nfts-by-account-collection-demo",
    type: "components:example",
    registryDependencies: [""],
    files: ["example/nfts-by-account-collection-demo.tsx"],
  },
  {
    name: "trade-ranking-demo",
    type: "components:example",
    registryDependencies: [""],
    files: ["example/trade-ranking-demo.tsx"],
  },
]

export const registry: Registry = [...ui, ...example]