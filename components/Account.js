import { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";

import Acc from "../abis/Account.json";
import ERC20 from "../abis/ERC20.json";
import Option from "./Option";
import { Context } from "../lib/context";

export default function Account({ account, option }) {
  const [name, setName] = useState("");
  const [balance, setBalance] = useState();
  const { fau } = useContext(Context);

  useEffect(() => {
    getName(account);
    getBalance(account);
  }, [name]);

  async function getName(_addr) {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(_addr, Acc.abi, provider);
      try {
        setName(await contract.name());
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  async function getBalance(_addr) {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(fau, ERC20.abi, provider);
      try {
        let b = await contract.balanceOf(_addr);
        b = parseInt(b._hex, 16);
        b = parseFloat(b) / 10 ** 18;
        setBalance(b);
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  return (
    <div>
      <div className="m-10 grid grid-cols-3">
        <h2 className="font-semibold text-lg">Account Name:</h2>
        <h2 className="ml-10 font-medium text-lg">{name}</h2>
        <div></div>

        <h2 className="font-semibold text-lg">Balance:</h2>
        <h2 className="ml-10 font-medium text-lg">{balance}</h2>
        <h2 className="ml-10 font-semibold text-lg">FAU</h2>
      </div>

      <Option info={{ name: name, address: account }} option={option} />
    </div>
  );
}
