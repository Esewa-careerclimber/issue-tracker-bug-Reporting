import React, {createContext,useContext,useEffect,useState} from 'react';
import '../theme/tokens.css';

const ThemeCtx = createContext({theme:'light',toggle:()=>{}});
export const useTheme = () => useContext(ThemeCtx);

export function ThemeProvider({children}) {
  const [theme,setTheme] = useState(()=>localStorage.getItem('theme')||'light');
  useEffect(()=>{document.documentElement.dataset.theme = theme;localStorage.setItem('theme',theme);},[theme]);
  const toggle = () => setTheme(t=> t==='light' ? 'dark':'light');
  return <ThemeCtx.Provider value={{theme,toggle}}>{children}</ThemeCtx.Provider>;
}
