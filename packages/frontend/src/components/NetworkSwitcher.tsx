import { useSwitchChain, useChainId } from 'wagmi';
import { mainnet, polygon, bsc, arbitrum, optimism, base } from 'wagmi/chains';

const SUPPORTED_CHAINS = [
  { ...mainnet, icon: '⟠' },
  { ...polygon, icon: '⬡' },
  { ...bsc, icon: '🔶' },
  { ...arbitrum, icon: '🔷' },
  { ...optimism, icon: '🔴' },
  { ...base, icon: '🔵' },
];

export function NetworkSwitcher() {
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  const currentChain = SUPPORTED_CHAINS.find(c => c.id === chainId);

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-4 py-2 bg-shadow-grey border-2 border-clay-soil rounded-lg text-frosted-mint hover:border-gold transition">
        <span className="text-lg">{currentChain?.icon || '⛓️'}</span>
        <span className="text-sm font-bold">{currentChain?.name || 'Network'}</span>
        <span className="text-xs">▼</span>
      </button>

      {/* Dropdown */}
      <div className="absolute top-full mt-2 right-0 w-48 bg-midnight-violet border-2 border-clay-soil rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        <div className="p-2">
          <p className="text-xs text-faded-copper mb-2 px-2">Switch Network</p>
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
              <span>{chain.name}</span>
              {chainId === chain.id && <span className="ml-auto">✓</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
