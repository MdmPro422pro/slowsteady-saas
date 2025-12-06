import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export const ThemeSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentTheme, setTheme, availableThemes } = useTheme();

  const themeNames: Record<string, string> = {
    default: 'Dark Crypto',
    ocean: 'Ocean Blue',
    sunset: 'Sunset',
    forest: 'Forest',
    purple: 'Purple Haze',
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-shadow-grey border border-faded-copper hover:bg-clay-soil transition-colors"
        title="Change Theme"
      >
        <span className="text-xl">🎨</span>
        <span className="hidden md:inline text-frosted-mint text-sm">
          {currentTheme.name}
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
                SELECT THEME
              </div>
              {availableThemes.map((theme) => (
                <button
                  key={theme}
                  onClick={() => {
                    setTheme(theme);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded transition-colors ${
                    currentTheme.name === themeNames[theme]
                      ? 'bg-clay-soil text-gold'
                      : 'text-frosted-mint hover:bg-midnight-violet'
                  }`}
                >
                  {themeNames[theme]}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
