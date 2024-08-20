import { http, createConfig } from "wagmi";
import { sepolia } from "wagmi/chains";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { TokenProvider } from "./TokenContext";
import "./App.css";

import PumpUI from "./PumpUI";

const projectId = "4265189f60ad0e1a606df6152e4e2ca0";

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [sepolia],
    transports: {
      // RPC URL for each chain
      [sepolia.id]: http("https://ethereum-sepolia-rpc.publicnode.com"),
    },

    // Required API Keys
    walletConnectProjectId: projectId,

    // Required App Info
    appName: "Token App Demo",

    // Optional App Info
    appDescription: "Token App Demo",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);

const queryClient = new QueryClient();

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <TokenProvider>
            <PumpUI />
          </TokenProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
