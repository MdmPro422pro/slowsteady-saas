import { useSwitchChain, useChainId } from 'wagmi';
import { 
  mainnet, polygon, bsc, arbitrum, optimism, base, 
  avalanche, fantom, zkSync, gnosis, celo, moonbeam,
  aurora, cronos, klaytn, canto, ronin, scroll, linea,
  zora, mantle, polygonZkEvm, opBNB, taiko, metis
} from 'wagmi/chains';

const SUPPORTED_CHAINS = [
  { ...mainnet, icon: '⟠', label: 'Ethereum' },
  { ...polygon, icon: '⬡', label: 'Polygon' },
  { ...bsc, icon: '🔶', label: 'BNB Chain' },
  { ...arbitrum, icon: '🔷', label: 'Arbitrum' },
  { ...optimism, icon: '🔴', label: 'Optimism' },
  { ...base, icon: '🔵', label: 'Base' },
  { ...avalanche, icon: '🔺', label: 'Avalanche' },
  { ...fantom, icon: '👻', label: 'Fantom' },
  { ...zkSync, icon: '⚡', label: 'zkSync' },
  { ...polygonZkEvm, icon: '⬢', label: 'Polygon zkEVM' },
  { ...scroll, icon: '📜', label: 'Scroll' },
  { ...linea, icon: '🔗', label: 'Linea' },
  { ...zora, icon: '🎨', label: 'Zora' },
  { ...mantle, icon: '🌊', label: 'Mantle' },
  { ...opBNB, icon: '⚙️', label: 'opBNB' },
  { ...taiko, icon: '🥁', label: 'Taiko' },
  { ...metis, icon: '💫', label: 'Metis' },
  { ...gnosis, icon: '🦉', label: 'Gnosis' },
  { ...celo, icon: '💚', label: 'Celo' },
  { ...moonbeam, icon: '🌙', label: 'Moonbeam' },
  { ...aurora, icon: '🌌', label: 'Aurora' },
  { ...cronos, icon: '💎', label: 'Cronos' },
  { ...klaytn, icon: '🟠', label: 'Klaytn' },
  { ...canto, icon: '🎵', label: 'Canto' },
  { ...ronin, icon: '⚔️', label: 'Ronin' },
];

export function NetworkSwitcher() {
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  const currentChain = SUPPORTED_CHAINS.find(c => c.id === chainId);

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-4 py-2 bg-shadow-grey border-2 border-clay-soil rounded-lg text-frosted-mint hover:border-gold transition">
        <span className="text-lg">{currentChain?.icon || '⛓️'}</span>
        <span className="text-sm font-bold">{currentChain?.label || currentChain?.name || 'Network'}</span>
        <span className="text-xs">▼</span>
      </button>

      {/* Dropdown - scrollable for many chains */}
      <div className="absolute top-full mt-2 right-0 w-56 max-h-96 overflow-y-auto bg-midnight-violet border-2 border-clay-soil rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        <div className="p-2">
          <p className="text-xs text-faded-copper mb-2 px-2 sticky top-0 bg-midnight-violet">Switch Network ({SUPPORTED_CHAINS.length} chains)</p>
          {SUPPORTED_CHAINS.map((chain) => (
            <button
              key={chain.id}
              onClick={() => switchChain({ chainId: chain.id })}
              disabled={isPending || chainId === chain.id}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition ${
                chainId === chain.id
                  ? 'bg-gold text-midnight-violet font-bold'
                  : 'text-frosted-mint hover:bg-clay-soil'
              } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="text-lg">{chain.icon}</span>
              <span className="flex-1 text-left">{chain.label}</span>
              {chainId === chain.id && <span className="ml-auto">✓</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
