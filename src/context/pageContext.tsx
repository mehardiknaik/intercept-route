import { createContext, useContext, PropsWithChildren, FC, useRef } from 'react';

interface PageContextType {
  pageRef: React.RefObject<HTMLDivElement | null>;
}

const PageContext = createContext<PageContextType | null>(null);

export const PageProvider: FC<PropsWithChildren> = ({ children }) => {
  const pageRef = useRef<HTMLDivElement>(null);
  return <PageContext.Provider value={{ pageRef }}>{children}</PageContext.Provider>;
};

export const usePageContext = () => {
  const context = useContext(PageContext);
  if (!context) {
    // throw new Error('usePageContext must be used within PageProvider');
    return {} as PageContextType;
  }
  return context;
};
