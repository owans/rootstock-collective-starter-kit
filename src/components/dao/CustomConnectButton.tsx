/**
 * Connect button that opens our CustomAccountModal so small tRBTC balances
 * display correctly (RainbowKit's modal rounds them to "0").
 */

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import CustomAccountModal from "./CustomAccountModal";

const BTN_BG = "bg-[#333] hover:bg-[#FF9100] hover:bg-opacity-20";
const BORDER = "border border-[#FF9100]/50 hover:border-[#FF9100]";
const TEXT = "text-[#FAF9F5]";

function formatAddress(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export default function CustomConnectButton(): JSX.Element {
  const [accountModalOpen, setAccountModalOpen] = useState(false);

  return (
    <>
      <ConnectButton.Custom>
        {({ account, chain, openConnectModal, mounted }) => {
          if (!mounted) return null;

          if (account && chain) {
            return (
              <>
                <button
                  type="button"
                  onClick={() => setAccountModalOpen(true)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${BTN_BG} ${BORDER} ${TEXT}`}
                >
                  {chain.hasIcon && chain.iconUrl && (
                    <img
                      alt={chain.name ?? "Chain"}
                      src={chain.iconUrl}
                      className="h-5 w-5 rounded-full"
                    />
                  )}
                  <span>{formatAddress(account.address)}</span>
                </button>
                {accountModalOpen && (
                  <CustomAccountModal
                    address={account.address}
                    onClose={() => setAccountModalOpen(false)}
                  />
                )}
              </>
            );
          }

          if (account && !chain) {
            return (
              <button
                type="button"
                onClick={() => setAccountModalOpen(true)}
                className={`rounded-full px-4 py-2 text-sm font-medium ${BTN_BG} ${BORDER} ${TEXT}`}
              >
                {formatAddress(account.address)}
              </button>
            );
          }

          return (
            <button
              type="button"
              onClick={openConnectModal}
              className={`rounded-full px-4 py-2 text-sm font-medium ${BTN_BG} ${BORDER} ${TEXT}`}
            >
              Connect Wallet
            </button>
          );
        }}
      </ConnectButton.Custom>
    </>
  );
}
