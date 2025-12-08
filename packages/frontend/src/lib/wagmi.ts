import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { 
  mainnet, 
  polygon, 
  polygonAmoy,
  polygonZkEvm,
  bsc,
  bscTestnet,
  arbitrum,
  arbitrumNova,
  arbitrumSepolia,
  optimism,
  optimismSepolia,
  base,
  baseSepolia,
  sepolia,
  avalanche,
  avalancheFuji,
  fantom,
  fantomTestnet,
  zkSync,
  zkSyncSepoliaTestnet,
  zora,
  zoraSepolia,
  scroll,
  scrollSepolia,
  linea,
  lineaSepolia,
  mantle,
  mantleTestnet,
  gnosis,
  gnosisChiado,
  celo,
  celoAlfajores,
  moonbeam,
  moonriver,
  moonbaseAlpha,
  aurora,
  auroraTestnet,
  cronos,
  cronosTestnet,
  evmos,
  evmosTestnet,
  klaytn,
  kava,
  canto,
  ronin,
  taiko,
  taikoHekla,
  metis,
  filecoin,
  opBNB,
} from 'wagmi/chains';

// Support maximum chains for wallet flexibility - 50+ chains!
export const config = getDefaultConfig({
  appName: 'Slowsteady Crypto Platform',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo-project-id',
  chains: [
    // Major Mainnets
    mainnet,           // Ethereum
    polygon,           // Polygon (MATIC)
    bsc,               // Binance Smart Chain
    arbitrum,          // Arbitrum
    optimism,          // Optimism
    base,              // Base (Coinbase)
    avalanche,         // Avalanche
    fantom,            // Fantom
    
    // Layer 2s & Scaling Solutions
    zkSync,            // zkSync Era
    polygonZkEvm,      // Polygon zkEVM
    scroll,            // Scroll
    linea,             // Linea (ConsenSys)
    zora,              // Zora Network
    arbitrumNova,      // Arbitrum Nova
    opBNB,             // opBNB (Binance)
    taiko,             // Taiko
    metis,             // Metis Andromeda
    mantle,            // Mantle Network
    
    // Alternative L1s
    gnosis,            // Gnosis Chain
    celo,              // Celo
    moonbeam,          // Moonbeam (Polkadot)
    moonriver,         // Moonriver (Kusama)
    aurora,            // Aurora (NEAR)
    cronos,            // Cronos (Crypto.com)
    evmos,             // Evmos
    klaytn,            // Klaytn (Kakao)
    kava,              // Kava
    canto,             // Canto
    filecoin,          // Filecoin
    
    // Gaming & NFT Chains
    ronin,             // Ronin (Axie Infinity)
    
    // Testnets (for development)
    sepolia,           // Ethereum Testnet
    polygonAmoy,       // Polygon Testnet
    bscTestnet,        // BSC Testnet
    arbitrumSepolia,   // Arbitrum Testnet
    optimismSepolia,   // Optimism Testnet
    baseSepolia,       // Base Testnet
    avalancheFuji,     // Avalanche Testnet
    fantomTestnet,     // Fantom Testnet
    zkSyncSepoliaTestnet, // zkSync Testnet
    zoraSepolia,       // Zora Testnet
    scrollSepolia,     // Scroll Testnet
    lineaSepolia,      // Linea Testnet
    mantleTestnet,     // Mantle Testnet
    gnosisChiado,      // Gnosis Testnet
    celoAlfajores,     // Celo Testnet
    moonbaseAlpha,     // Moonbeam Testnet
    auroraTestnet,     // Aurora Testnet
    cronosTestnet,     // Cronos Testnet
    evmosTestnet,      // Evmos Testnet
    taikoHekla,        // Taiko Testnet
  ],
  ssr: false,
});
