/**
 * ConnectWallet: wallet connection for the Collective DAO using Wagmi + RainbowKit.
 * Uses custom account modal so small tRBTC balances display correctly.
 */

import CustomConnectButton from "./CustomConnectButton";

export default function ConnectWallet(): JSX.Element {
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-[#FAF9F5] text-sm">
        Connect your wallet on Rootstock Testnet to stake RIF and vote.
      </p>
      <CustomConnectButton />
    </div>
  );
}
