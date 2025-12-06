import { useState, useEffect } from 'react';

export const palettes = {
  palette1: {
    name: 'Deep Space',
    'midnight-violet': '#002642',
    'frosted-mint': '#e5dada',
    'clay-soil': '#840032',
    'faded-copper': '#e59500',
    'shadow-grey': '#02040f',
    'gold': '#e59500',
  },
  palette2: {
    name: 'Sunset',
    'midnight-violet': '#020122',
    'frosted-mint': '#f2f3ae',
    'clay-soil': '#fc9e4f',
    'faded-copper': '#edd382',
    'shadow-grey': '#020122',
    'gold': '#fc9e4f',
  },
  palette3: {
    name: 'Modern',
    'midnight-violet': '#2b2d42',
    'frosted-mint': '#ffffff',
    'clay-soil': '#8d99ae',
    'faded-copper': '#8d99ae',
    'shadow-grey': '#000000',
    'gold': '#f8f32b',
  },
};

export const usePalette = () => {
  const [currentPalette, setCurrentPalette] = useState<keyof typeof palettes>('palette1');

  useEffect(() => {
    const saved = localStorage.getItem('mdmpro-palette') as keyof typeof palettes;
    if (saved && palettes[saved]) {
      const palette = palettes[saved];
      // Apply palette on load
      document.documentElement.style.setProperty('--midnight-violet', palette['midnight-violet']);
      document.documentElement.style.setProperty('--frosted-mint', palette['frosted-mint']);
      document.documentElement.style.setProperty('--clay-soil', palette['clay-soil']);
      document.documentElement.style.setProperty('--faded-copper', palette['faded-copper']);
      document.documentElement.style.setProperty('--shadow-grey', palette['shadow-grey']);
      document.documentElement.style.setProperty('--gold', palette['gold']);
      setCurrentPalette(saved);
    }
  }, []);

  const changePalette = (paletteKey: keyof typeof palettes) => {
    localStorage.setItem('mdmpro-palette', paletteKey);
    window.location.reload();
  };

  return { currentPalette, changePalette, palettes };
};

export const PaletteSwitcher = () => {
  const { currentPalette, changePalette, palettes: allPalettes } = usePalette();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-shadow-grey border-2 border-faded-copper text-frosted-mint hover:opacity-80 transition-opacity"
        title="Change Palette"
      >
        <span className="text-xl">🎨</span>
        <span className="hidden md:inline text-sm">
          {allPalettes[currentPalette].name}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 rounded-lg bg-shadow-grey border-2 border-faded-copper shadow-xl z-50">
            <div className="p-2">
              <div className="text-gold text-xs font-bold mb-2 px-2">
                SELECT PALETTE
              </div>
              {(Object.keys(allPalettes) as Array<keyof typeof palettes>).map((paletteKey) => (
                <button
                  key={paletteKey}
                  onClick={() => changePalette(paletteKey)}
                  className={`w-full text-left px-3 py-2 rounded transition-opacity hover:opacity-80 ${
                    currentPalette === paletteKey 
                      ? 'bg-clay-soil text-gold' 
                      : 'text-frosted-mint'
                  }`}
                >
                  {allPalettes[paletteKey].name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
