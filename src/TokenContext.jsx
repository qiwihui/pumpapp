import React, { createContext, useState, useContext } from 'react';

// Create a Context for the token address
const TokenContext = createContext();

// Create a provider component
export const TokenProvider = ({ children }) => {
  const [tokenAddress, setTokenAddress] = useState('');

  return (
    <TokenContext.Provider value={{ tokenAddress, setTokenAddress }}>
      {children}
    </TokenContext.Provider>
  );
};

// Create a custom hook to use the TokenContext
export const useToken = () => {
  return useContext(TokenContext);
};
