import React from "react";
import CreateToken from "./CreateToken";
import BuyToken from "./BuyToken";
import SellToken from "./SellToken";
import { useAccount, useDisconnect } from "wagmi";
import { ConnectKitButton } from "connectkit";

function App() {
  const { disconnect } = useDisconnect();
  const { isConnected, address } = useAccount();
  return (
    <div className="container">
      <h1>Token Dapp</h1>
      {!isConnected ? (
        <div className="section-container">
          <section className="section">
            <ConnectKitButton />
          </section>
        </div>
      ) : (
        <div className="section-container">
          <section className="section">
            <p>{address}</p>
            <button className="button" onClick={() => disconnect()}>
              Disconnect
            </button>
          </section>
        </div>
      )}

      {isConnected && (
        <>
          <div className="section-container">
            <section className="section">
              <CreateToken />
            </section>
            <section className="section">
              <BuyToken />
            </section>
            <section className="section">
              <SellToken />
            </section>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
