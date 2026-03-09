// Collective DAO Starter Kit: Rootstock Mainnet (30) and Testnet (31). No hardcoded network.
// VITE_WC_PROJECT_ID is required for wallet connection.
import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { createConfig, http } from "wagmi";
import {
  rootstockMainnet,
  rootstockTestnet,
  getRootstockRpcUrl,
  ROOTSTOCK_MAINNET_CHAIN_ID,
  ROOTSTOCK_TESTNET_CHAIN_ID,
} from "@/lib/utils/RootstockChains";

const rawProjectId = import.meta.env.VITE_WC_PROJECT_ID;
const projectId =
  typeof rawProjectId === "string" && rawProjectId.trim() !== ""
    ? rawProjectId.trim()
    : "";

if (projectId === "" && typeof window !== "undefined") {
  console.warn("[RainbowKit] VITE_WC_PROJECT_ID missing. Add to .env (see README).");
}

const { connectors } = getDefaultWallets({
  appName: "Rootstock Collective DAO",
  projectId,
});

export const rainbowkitConfig = createConfig({
  chains: [rootstockMainnet, rootstockTestnet],
  connectors,
  transports: {
    [ROOTSTOCK_MAINNET_CHAIN_ID]: http(getRootstockRpcUrl(ROOTSTOCK_MAINNET_CHAIN_ID)),
    [ROOTSTOCK_TESTNET_CHAIN_ID]: http(getRootstockRpcUrl(ROOTSTOCK_TESTNET_CHAIN_ID)),
  },
});
