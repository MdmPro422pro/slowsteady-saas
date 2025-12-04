# Web3 Integration Guide

This platform now includes full Web3 wallet integration using RainbowKit, Wagmi, and Viem.

## Features

- 🦊 **MetaMask Support**: Connect with the most popular crypto wallet
- 🌈 **RainbowKit UI**: Beautiful, accessible wallet connection interface
- 🔗 **Multi-Chain**: Configured for Polygon (mainnet) and Polygon Amoy (testnet)
- 🔐 **Secure**: Wallet connections are client-side only, no private keys stored
- ⚡ **Fast**: Modern Web3 libraries for optimal performance

## Setup

### 1. Get WalletConnect Project ID

RainbowKit uses WalletConnect for wallet connection. Get your free project ID:

1. Visit https://cloud.walletconnect.com
2. Sign up / Login
3. Create a new project
4. Copy your Project ID

### 2. Configure Environment

Update `packages/frontend/.env.local`:

```bash
VITE_WALLETCONNECT_PROJECT_ID=your_actual_project_id_here
```

**Note**: The app will work with a demo ID for testing, but you should use your own for production.

## Usage

### Wallet Button

The `WalletButton` component is already integrated into:

- **Landing Page**: Top right navigation bar
- **Dashboard**: Next to the logout button

Users can:
1. Click "Connect Wallet" to see available wallets
2. Select their preferred wallet (MetaMask, WalletConnect, Coinbase Wallet, etc.)
3. Approve the connection in their wallet
4. See their connected address and balance
5. Switch networks between Polygon and Polygon Amoy
6. Disconnect wallet

### Using Web3 in Your Components

```tsx
import { useAccount, useConnect, useDisconnect } from 'wagmi';

function YourComponent() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div>
        <p>Connected: {address}</p>
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    );
  }

  return (
    <button onClick={() => connect({ connector: connectors[0] })}>
      Connect Wallet
    </button>
  );
}
```

### Reading Blockchain Data

```tsx
import { useBalance } from 'wagmi';

function Balance() {
  const { address } = useAccount();
  const { data, isLoading } = useBalance({
    address: address,
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      Balance: {data?.formatted} {data?.symbol}
    </div>
  );
}
```

### Interacting with Smart Contracts

```tsx
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';

function MintToken() {
  const { data: hash, writeContract } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleMint = async () => {
    writeContract({
      address: '0xYourContractAddress',
      abi: yourContractABI,
      functionName: 'mint',
      args: [recipientAddress, amount],
    });
  };

  return (
    <div>
      <button onClick={handleMint} disabled={isLoading}>
        {isLoading ? 'Minting...' : 'Mint Token'}
      </button>
      {isSuccess && <p>Token minted successfully!</p>}
    </div>
  );
}
```

## Network Configuration

Currently configured networks:

- **Polygon Mainnet** (Chain ID: 137)
- **Polygon Amoy Testnet** (Chain ID: 80002)

To add more networks, edit `packages/frontend/src/lib/wagmi.ts`:

```typescript
import { mainnet, sepolia, arbitrum } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Slowsteady Crypto Platform',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  chains: [polygon, polygonAmoy, mainnet, sepolia, arbitrum],
  ssr: false,
});
```

## Smart Contract Integration

### TokenERC20 Contract

Your Solidity contract supports:

- Platform fee collection
- Signature-based minting
- Role-based access control
- ERC20 standard with voting capabilities

To integrate:

1. **Deploy your contract** to Polygon network
2. **Create ABI file**: `packages/frontend/src/contracts/TokenERC20.ts`
3. **Add contract hooks**:

```typescript
// packages/frontend/src/hooks/useTokenContract.ts
import { useWriteContract, useReadContract } from 'wagmi';
import { TokenERC20ABI } from '../contracts/TokenERC20';

export function useTokenContract(contractAddress: string) {
  const { writeContract } = useWriteContract();

  const mint = async (to: string, quantity: number) => {
    return writeContract({
      address: contractAddress,
      abi: TokenERC20ABI,
      functionName: 'mintTo',
      args: [to, quantity],
    });
  };

  return { mint };
}
```

## Testing

### Test with MetaMask

1. Install [MetaMask browser extension](https://metamask.io/)
2. Add Polygon Amoy testnet to MetaMask:
   - Network Name: Polygon Amoy
   - RPC URL: https://rpc-amoy.polygon.technology/
   - Chain ID: 80002
   - Symbol: MATIC
   - Explorer: https://amoy.polygonscan.com/
3. Get test MATIC from [faucet](https://faucet.polygon.technology/)
4. Connect wallet on your app

## Architecture

```
┌─────────────────────────────────────────────┐
│          React Application                  │
│  ┌─────────────────────────────────────┐   │
│  │      WagmiProvider                   │   │
│  │  ┌───────────────────────────────┐  │   │
│  │  │   QueryClientProvider         │  │   │
│  │  │  ┌─────────────────────────┐  │  │   │
│  │  │  │  RainbowKitProvider     │  │  │   │
│  │  │  │                         │  │  │   │
│  │  │  │  Your Components        │  │  │   │
│  │  │  │  - WalletButton        │  │  │   │
│  │  │  │  - useAccount()        │  │  │   │
│  │  │  │  - useContract()       │  │  │   │
│  │  │  └─────────────────────────┘  │  │   │
│  │  └───────────────────────────────┘  │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
              ↓
        Wallet Provider
   (MetaMask, WalletConnect, etc.)
              ↓
        Blockchain Network
      (Polygon, Ethereum, etc.)
```

## Security Best Practices

1. **Never store private keys**: Wallets handle signing, never request or store private keys
2. **Verify contract addresses**: Always display and verify contract addresses before transactions
3. **Show transaction details**: Display what users are signing before they sign
4. **Use testnet first**: Test all contract interactions on testnet before mainnet
5. **Handle errors gracefully**: Users may reject transactions or disconnect unexpectedly

## Next Steps

1. **Deploy Smart Contract**: Deploy your TokenERC20 contract to Polygon Amoy
2. **Create Token Minting UI**: Build forms for token creation
3. **Add Transaction History**: Track user's blockchain transactions
4. **Implement Signature Verification**: Use EIP-712 for secure off-chain signatures
5. **Add Token Management**: Create UI for managing created tokens

## Resources

- [Wagmi Documentation](https://wagmi.sh/)
- [RainbowKit Documentation](https://www.rainbowkit.com/)
- [Viem Documentation](https://viem.sh/)
- [Polygon Documentation](https://docs.polygon.technology/)
- [MetaMask Documentation](https://docs.metamask.io/)

## Troubleshooting

### Wallet doesn't connect
- Make sure you have a wallet extension installed (MetaMask, Coinbase Wallet)
- Check browser console for errors
- Ensure you're on a supported network

### Transaction fails
- Check you have enough gas (MATIC on Polygon)
- Verify contract address and ABI are correct
- Ensure wallet is on the correct network

### Network mismatch
- Use the network switcher in the wallet button
- RainbowKit will prompt users to switch networks automatically
