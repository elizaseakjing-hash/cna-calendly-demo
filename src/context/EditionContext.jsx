import { createContext, useContext, useState } from 'react';

const EditionContext = createContext({
  edition: 'World',
  setEdition: () => {},
});

export function useEdition() {
  return useContext(EditionContext);
}

export function EditionProvider({ children }) {
  const [edition, setEdition] = useState('World');
  return (
    <EditionContext.Provider value={{ edition, setEdition }}>
      {children}
    </EditionContext.Provider>
  );
}
