import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { abi } from "./abi.json";
import { abi as erc20abi } from "./abi_erc20.json";
import { useToken } from "./TokenContext";
import { useEthersSigner } from "./ethers";
import BeatLoader from "react-spinners/BeatLoader";
import CONFIG from "./config";

const BuyToken = () => {
  const [totalSupply, setTotalSupply] = useState(0);
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [hash, setHash] = useState("");
  const [balance, setBalance] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { tokenAddress } = useToken();
  const signer = useEthersSigner();

  useEffect(() => {
    if (tokenAddress) {
      setAddress(tokenAddress);
    }
  }, [tokenAddress]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchBalance(address);
    };
    fetchData();
  }, [address]);

  const fetchBalance = async (_address) => {
    if (_address && ethers.utils.isAddress(_address)) {
      const tokenContract = new ethers.Contract(_address, erc20abi, signer);
      const balanceOf = await tokenContract.balanceOf(signer._address);
      setBalance((balanceOf / 10 ** 18).toString());
    }
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (address && ethers.utils.isAddress(address)) {
        await fetchTokenSupply(address);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [address]);

  const fetchTokenSupply = async (_address) => {
    if (_address && ethers.utils.isAddress(_address)) {
      const tokenContract = new ethers.Contract(_address, erc20abi, signer);
      const ts = await tokenContract.totalSupply();
      setTotalSupply(Math.round(ts / 10 ** 18).toString());
    }
  };

  return (
    <div>
      <h3>Buy Token</h3>
      <div>
        <progress
          className="progress-bar"
          value={totalSupply}
          max={1000000000}
        ></progress>
        <div className="progress-text">
          {Math.round(parseInt(totalSupply, 10) / 10000000)}%
        </div>
      </div>
      <input
        type="text"
        placeholder="Token Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <input
        type="text"
        placeholder="ETH amount, e.g. 0.1"
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
          const tx = await contract.buy(address, {
            value: ethers.utils.parseUnits(amount, "ether"),
          });
          setHash(tx.hash);
          const receipt = await tx.wait();
          await fetchBalance(address);
          // console.log(receipt);
          setIsLoading(false);
        }}
        disabled={isLoading}
      >
        {isLoading ? <BeatLoader size={10} color={"#fff"} /> : "Buy"}
      </button>
      {hash && <p>Hash: {hash}</p>}
      {balance && <p>Your Balance: {balance}</p>}
    </div>
  );
};

export default BuyToken;
