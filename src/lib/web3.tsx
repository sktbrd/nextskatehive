import { Alchemy, Network } from "alchemy-sdk"

console.log("alchemy", process.env.NEXT_PUBLIC_ALCHEMY_API_KEY)

const config = {
  apiKey: `${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
  network: Network.BASE_MAINNET,
}
export const alchemy = new Alchemy(config)
