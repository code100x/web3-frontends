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
    registryDependencies: ["card"],
    files: ["ui/collection-stats.tsx"],
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
]

export const registry: Registry = [...ui, ...example]