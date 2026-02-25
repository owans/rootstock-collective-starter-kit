/**
 * Type declaration for optional dependency @rsksmart/collective-sdk (GitHub Packages).
 * When the package is not installed, this allows the build to succeed; useCollective falls back to the stub.
 */
declare module "@rsksmart/collective-sdk" {
  export class CollectiveSDK {
    constructor(config: {
      chainId: 30 | 31;
      rpcUrl?: string;
      contractAddresses?: Record<string, `0x${string}`>;
    });
  }
}
