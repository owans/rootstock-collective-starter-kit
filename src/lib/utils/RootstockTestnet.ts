import { defineChain } from "viem";

const PUBLIC_TESTNET_RPC = "https://public-node.testnet.rsk.co";
const ROOTSTOCK_RPC_TESTNET_BASE = "https://rpc.testnet.rootstock.io";

/** Rootstock Testnet RPC URL: uses Rootstock RPC API when VITE_ROOTSTOCK_RPC_API_KEY is set, otherwise public node. */
export function getRootstockTestnetRpcUrl(): string {
  const apiKey = import.meta.env.VITE_ROOTSTOCK_RPC_API_KEY;
  if (typeof apiKey === "string" && apiKey.trim() !== "") {
    return `${ROOTSTOCK_RPC_TESTNET_BASE}/${apiKey.trim()}`;
  }
  return PUBLIC_TESTNET_RPC;
}

export const rsktestnet = defineChain({
  id: 31,
  name: "Rootstock Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Rootstock Smart Bitcoin",
    symbol: "tRBTC",
  },
  rpcUrls: {
    default: {
      http: [getRootstockTestnetRpcUrl()],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://explorer.testnet.rsk.co" },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 2771150,
    },
  },
});
