/**
 * Initializes Collective SDK for the connected Rootstock chain (Mainnet 30 or Testnet 31).
 * Uses chain from wallet; no hardcoded network.
 */

import { useMemo, useState, useEffect } from "react";
import { useAccount, useWalletClient } from "wagmi";
import type { WalletClient } from "viem";
import { createCollectiveStub } from "@/lib/collectiveStub";
import type { CollectiveSDK } from "@/lib/collectiveStub";
import { COLLECTIVE_CONTRACT_ADDRESSES } from "@/constants/contracts";
import {
  getRootstockRpcUrl,
  isRootstockChain,
  ROOTSTOCK_CHAIN_IDS,
  type RootstockChainId,
} from "@/lib/utils/RootstockChains";

/** Supported Collective chains (Mainnet and Testnet). */
export const COLLECTIVE_CHAIN_IDS = ROOTSTOCK_CHAIN_IDS;

/** Result when SDK is not ready (wrong chain or no wallet). */
export interface UseCollectiveNotReady {
  isReady: false;
  sdk: null;
  walletClient: null;
  address: undefined;
  error: string | null;
}

/** Result when SDK is ready (real SDK or stub). */
export interface UseCollectiveReady {
  isReady: true;
  sdk: CollectiveSDK;
  walletClient: WalletClient | null;
  address: `0x${string}`;
  error: null;
  isRealSdk: boolean;
  chainId: RootstockChainId;
}

export type UseCollectiveResult = UseCollectiveNotReady | UseCollectiveReady;

type RealSDKConstructor = new (config: {
  chainId: 30 | 31;
  rpcUrl?: string;
  contractAddresses?: Record<string, `0x${string}`>;
}) => CollectiveSDK;

/** Returns Collective SDK (real or stub), wallet client, and address. */
export function useCollective(): UseCollectiveResult {
  const { address, chain } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [RealSDK, setRealSDK] = useState<RealSDKConstructor | null>(null);

  useEffect(() => {
    import("@rsksmart/collective-sdk")
      .then((m) => {
        const Ctor = m.CollectiveSDK;
        setRealSDK(Ctor ? (() => Ctor as unknown as RealSDKConstructor) : null);
      })
      .catch(() => setRealSDK(null));
  }, []);

  return useMemo((): UseCollectiveResult => {
    const chainId = chain?.id;
    const supported = chainId !== undefined && isRootstockChain(chainId);
    if (!address || !supported) {
      const errorMsg = !address
        ? "Connect your wallet."
        : "Switch to Rootstock (Mainnet or Testnet) to use the DAO.";
      return {
        isReady: false,
        sdk: null,
        walletClient: null,
        address: undefined,
        error: errorMsg,
      };
    }

    const rpcUrl = getRootstockRpcUrl(chainId);
    const contractAddresses = COLLECTIVE_CONTRACT_ADDRESSES[chainId];

    const sdk: CollectiveSDK = RealSDK
      ? (new RealSDK({
          chainId,
          rpcUrl,
          contractAddresses,
        }) as CollectiveSDK)
      : createCollectiveStub();

    return {
      isReady: true,
      sdk,
      walletClient: (walletClient as WalletClient | undefined) ?? null,
      address,
      error: null,
      isRealSdk: !!RealSDK,
      chainId,
    };
  }, [address, chain?.id, walletClient, RealSDK]);
}
