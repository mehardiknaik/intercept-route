import { createContext, useState, ReactNode, useEffect, useContext } from 'react';
import { useLocation } from 'react-router';

interface InterceptionContextType {
  backgroundLocation: any; // react-router Location type with generic state
  isIntercepting: boolean;
  setIsIntercepting: (intercepting: boolean) => void;
  setBackgroundLocation: (location: any) => void;
}

export const InterceptionContext = createContext<InterceptionContextType | null>(null);

export const InterceptionProvider = ({ children }: { children: ReactNode }) => {
  const [backgroundLocation, setBackgroundLocation] = useState<any>(null);
  const [isIntercepting, setIsIntercepting] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (isIntercepting && backgroundLocation?.pathname == location.pathname) {
      setIsIntercepting(false);
      setBackgroundLocation(null);
    }
  }, [location]);
  return (
    <InterceptionContext.Provider
      value={{ backgroundLocation, isIntercepting, setBackgroundLocation, setIsIntercepting }}>
      {children}
    </InterceptionContext.Provider>
  );
};

export const useInterceptionContext = () => {
  const context = useContext(InterceptionContext);
  if (!context) {
    throw new Error('useInterceptionContext must be used within InterceptionProvider');
  }
  return context;
};
