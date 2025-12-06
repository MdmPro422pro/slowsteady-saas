import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
}

const themes: Record<string, Theme> = {
  default: {
    name: 'Dark Crypto',
    colors: {
      primary: '#1f0318', // midnight-violet
      secondary: '#e5f2c9', // frosted-mint
      accent: '#C7AF6A', // gold
      background: '#1e1a1d', // shadow-grey
      surface: '#7f534b', // clay-soil
      text: '#8c705f', // faded-copper
    },
  },
  ocean: {
    name: 'Ocean Blue',
    colors: {
      primary: '#0a1929',
      secondary: '#90caf9',
      accent: '#00b4d8',
      background: '#1a2027',
      surface: '#1e3a5f',
      text: '#b0bec5',
    },
  },
  sunset: {
    name: 'Sunset',
    colors: {
      primary: '#2d1b2e',
      secondary: '#ffb4a2',
      accent: '#ff6b6b',
      background: '#1a1423',
      surface: '#8b4367',
      text: '#e5989b',
    },
  },
  forest: {
    name: 'Forest',
    colors: {
      primary: '#1b2a1f',
      secondary: '#a8dadc',
      accent: '#52b788',
      background: '#0d1b1e',
      surface: '#2d6a4f',
      text: '#95d5b2',
    },
  },
  purple: {
    name: 'Purple Haze',
    colors: {
      primary: '#1a0933',
      secondary: '#d4a5ff',
      accent: '#9d4edd',
      background: '#120527',
      surface: '#5a189a',
      text: '#c77dff',
    },
  },
};

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeName: string) => void;
  availableThemes: string[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeName, setThemeName] = useState<string>('default');

  useEffect(() => {
    const saved = localStorage.getItem('mdmpro-theme');
    if (saved && themes[saved]) {
      setThemeName(saved);
    }
  }, []);

  useEffect(() => {
    const theme = themes[themeName];
    const root = document.documentElement;
    
    // Update CSS custom properties
    root.style.setProperty('--color-midnight-violet', theme.colors.primary);
    root.style.setProperty('--color-frosted-mint', theme.colors.secondary);
    root.style.setProperty('--color-gold', theme.colors.accent);
    root.style.setProperty('--color-shadow-grey', theme.colors.background);
    root.style.setProperty('--color-clay-soil', theme.colors.surface);
    root.style.setProperty('--color-faded-copper', theme.colors.text);
    
    localStorage.setItem('mdmpro-theme', themeName);
  }, [themeName]);

  const setTheme = (name: string) => {
    if (themes[name]) {
      setThemeName(name);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme: themes[themeName],
        setTheme,
        availableThemes: Object.keys(themes),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
