// Collective DAO Starter Kit: hardcoded to Rootstock Testnet (Chain ID: 31) only.
// VITE_WC_PROJECT_ID is required for wallet connection; empty string allows build but connection will fail.
// All wagmi RPC (including RainbowKit account modal balance) uses the transport below.
import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import {
  rsktestnet,
  getRootstockTestnetRpcUrl,
} from "@/lib/utils/RootstockTestnet";
import { createConfig, http } from "wagmi";

const projectId = import.meta.env.VITE_WC_PROJECT_ID ?? "";
const rpcUrl = getRootstockTestnetRpcUrl();

const { connectors } = getDefaultWallets({
  appName: "Rootstock Collective DAO",
  projectId: typeof projectId === "string" ? projectId : "",
});

export const rainbowkitConfig = createConfig({
  chains: [rsktestnet],
  connectors,
  transports: {
    [rsktestnet.id]: http(rpcUrl),
  },
});
