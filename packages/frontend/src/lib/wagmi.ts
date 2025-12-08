import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { 
  mainnet, 
  polygon, 
  polygonAmoy,
  bsc,
  arbitrum,
  optimism,
  base,
  sepolia,
  avalanche,
  fantom
} from 'wagmi/chains';

// Support multiple chains for wallet flexibility
export const config = getDefaultConfig({
  appName: 'Slowsteady Crypto Platform',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo-project-id',
  chains: [
    mainnet,        // Ethereum
    polygon,        // Polygon (MATIC)
    polygonAmoy,    // Polygon Testnet
    bsc,            // Binance Smart Chain
    arbitrum,       // Arbitrum
    optimism,       // Optimism
    base,           // Base
    avalanche,      // Avalanche
    fantom,         // Fantom
    sepolia,        // Ethereum Testnet
  ],
  ssr: false,
});
