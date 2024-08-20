import React, { useState } from "react";
import { ethers } from "ethers";
import { useAccount, useDisconnect } from "wagmi";
import { abi } from "./abi.json"; // Add the ABI here
import { useEthersSigner } from "./ethers";
import { useToken } from "./TokenContext";
import BeatLoader from "react-spinners/BeatLoader";
import CONFIG from "./config";

const CreateToken = () => {
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { tokenAddress, setTokenAddress } = useToken();

  const signer = useEthersSigner();
  const contract = new ethers.Contract(CONFIG.CONTRACT_ADDRESS, abi, signer);

  return (
    <div>
      <h3>Create Token</h3>
      <input
        type="text"
        placeholder="Token Name"
        value={tokenName}
        onChange={(e) => setTokenName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Token Symbol"
        value={tokenSymbol}
        onChange={(e) => setTokenSymbol(e.target.value)}
      />
      <button
        onClick={async () => {
          setIsLoading(true);
          const tx = await contract.createToken(tokenName, tokenSymbol);
          // setDepositHash(tx.hash);
          const receipt = await tx.wait();
          //setTokenAddress
          const tokenCreatedEvents = receipt.events.filter((event) => {
            return event.event === "TokenCreated";
          });
          if (tokenCreatedEvents.length > 0) {
            setTokenAddress(tokenCreatedEvents[0].args[0]);
          }
          setIsLoading(false);
        }}
        disabled={isLoading}
      >
        {isLoading ? <BeatLoader size={10} color={"#fff"} /> : "Create"}
      </button>
      {tokenAddress && <p>Token Address: {tokenAddress}</p>}
    </div>
  );
};

export default CreateToken;
