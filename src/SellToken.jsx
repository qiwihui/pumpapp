import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { abi } from "./abi.json";
import { useToken } from "./TokenContext";
import { useEthersSigner } from "./ethers";
import BeatLoader from "react-spinners/BeatLoader";
import CONFIG from "./config";

const SellToken = () => {
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [hash, setHash] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { tokenAddress } = useToken();
  const signer = useEthersSigner();

  useEffect(() => {
    if (tokenAddress) {
      setAddress(tokenAddress);
    }
  }, [tokenAddress]);
  return (
    <div>
      <h3>Sell Token</h3>
      <input
        type="text"
        placeholder="Token Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <input
        type="text"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button
        onClick={async () => {
          setIsLoading(true);
          const contract = new ethers.Contract(
            CONFIG.CONTRACT_ADDRESS,
            abi,
            signer
          );
          const tx = await contract.sell(address, amount);
          setHash(tx.hash);
          const receipt = await tx.wait();
          // console.log(receipt);
          setIsLoading(false);
        }}
        disabled={isLoading}
      >
        {isLoading ? <BeatLoader size={10} color={"#fff"} /> : "Sell"}
      </button>
      {hash && <p>Hash: {hash}</p>}
    </div>
  );
};

export default SellToken;
