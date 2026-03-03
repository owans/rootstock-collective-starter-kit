/**
 * Simulation before write (Phase 5).
 * Run eth_call / simulateContract for stake, withdraw, and vote before sending the real TX.
 * If simulation fails, the UI shows an error and does not send the transaction.
 * All simulateContract calls are wrapped in try/catch to provide meaningful user feedback.
 */

import type { PublicClient, Address } from "viem";
import { stRIFSimulationAbi, governorCastVoteAbi } from "@/lib/collectiveAbis";
import { abi as erc20Abi } from "@/assets/abis/ERC20abi";

export interface CollectiveAddresses {
  RIF: Address;
  stRIF: Address;
  governor: Address;
}

/** User-facing message when simulation fails (e.g. insufficient balance, contract revert). */
function simulationErrorMessage(context: string, cause: unknown): string {
  const msg = cause instanceof Error ? cause.message : String(cause);
  if (/insufficient|balance|allowance/i.test(msg)) {
    return `Simulation failed: insufficient balance or allowance. ${context}`;
  }
  if (/revert|execution reverted/i.test(msg)) {
    return `Simulation failed: transaction would revert. ${context}`;
  }
  return `Simulation failed: ${msg}. ${context}`;
}

/**
 * Simulate ERC20 approve(spender, amount). Used before approveRIF write.
 */
export async function simulateApproveRIF(
  publicClient: PublicClient,
  account: Address,
  addresses: CollectiveAddresses,
  amount: bigint
): Promise<void> {
  try {
    await publicClient.simulateContract({
      address: addresses.RIF,
      abi: erc20Abi,
      functionName: "approve",
      args: [addresses.stRIF, amount],
      account,
    });
  } catch (e) {
    throw new Error(simulationErrorMessage("Check RIF balance and stRIF allowance.", e));
  }
}

/**
 * Simulate stRIF depositAndDelegate(delegatee, amount). Used before stakeRIF write.
 */
export async function simulateStakeRIF(
  publicClient: PublicClient,
  account: Address,
  addresses: CollectiveAddresses,
  amount: bigint,
  delegatee: Address
): Promise<void> {
  try {
    await publicClient.simulateContract({
      address: addresses.stRIF,
      abi: stRIFSimulationAbi,
      functionName: "depositAndDelegate",
      args: [delegatee, amount],
      account,
    });
  } catch (e) {
    throw new Error(simulationErrorMessage("Check RIF balance and allowance.", e));
  }
}

/**
 * Simulate stRIF withdrawTo(recipient, amount). Used before unstakeRIF write.
 */
export async function simulateUnstakeRIF(
  publicClient: PublicClient,
  account: Address,
  addresses: CollectiveAddresses,
  amount: bigint,
  recipient: Address
): Promise<void> {
  try {
    await publicClient.simulateContract({
      address: addresses.stRIF,
      abi: stRIFSimulationAbi,
      functionName: "withdrawTo",
      args: [recipient, amount],
      account,
    });
  } catch (e) {
    throw new Error(simulationErrorMessage("Check stRIF balance.", e));
  }
}

/** Valid uint256 string (digits only, max 78 digits). */
function parseUint256(id: string | bigint): bigint {
  if (typeof id === "bigint") {
    if (id < 0n) throw new Error("Invalid proposalId: negative");
    return id;
  }
  const s = String(id).trim();
  if (!/^\d+$/.test(s) || s.length > 78) throw new Error("Invalid proposalId");
  return BigInt(s);
}

/**
 * Simulate governor castVote(proposalId, support). Used before castVote write.
 */
export async function simulateCastVote(
  publicClient: PublicClient,
  account: Address,
  addresses: CollectiveAddresses,
  proposalId: string | bigint,
  support: number
): Promise<void> {
  const id = parseUint256(proposalId);
  try {
    await publicClient.simulateContract({
      address: addresses.governor,
      abi: governorCastVoteAbi,
      functionName: "castVote",
      args: [id, support],
      account,
    });
  } catch (e) {
    throw new Error(simulationErrorMessage("Check voting power and proposal state.", e));
  }
}
