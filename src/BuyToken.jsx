import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { abi } from "./abi.json";
import { abi as erc20abi } from "./abi_erc20.json";
import { useToken } from "./TokenContext";
import { useEthersSigner } from "./ethers";
import BeatLoader from "react-spinners/BeatLoader";

const CONTRACT_ADDRESS = "0x2271bFd83468efD38C60b9e4Ef335B920Faa9400";

const BuyToken = () => {
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
    console.log(signer)
    if (_address && ethers.utils.isAddress(_address)) {
      const tokenContract = new ethers.Contract(_address, erc20abi, signer);
      const balanceOf = await tokenContract.balanceOf(signer._address);
      setBalance((balanceOf/10**18).toString());
    }
  };

  return (
    <div>
      <h3>Buy Token</h3>
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
          const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
          const tx = await contract.buy(address, {
            value: ethers.utils.parseUnits(amount, "ether"),
          });
          setHash(tx.hash);
          const receipt = await tx.wait();
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
