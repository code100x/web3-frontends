// File: umiSingleton.ts

import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"

class UmiSingleton {
  private static instance: ReturnType<typeof createUmi>

  private constructor() {}

  public static getInstance(): ReturnType<typeof createUmi> {
    if (!this.instance) {
      console.log(process.env.QUICKNODE)
      this.instance = createUmi(process.env.QUICKNODE || "").use(
        mplTokenMetadata()
      )
    }
    return this.instance
  }
}

export default UmiSingleton
