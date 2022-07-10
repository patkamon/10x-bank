import React, { useState, useEffect } from "react";

export default function Navbar() {
  let [status, setStatus] = useState("Connect MetaMask");

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.networkVersion === "5"
        ? getAddress()
        : setStatus("Connect MetaMask");
    }
  });

  async function getAddress() {
    const account = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    let acc = [...account];
    setStatus(acc[0].slice(0, 5) + "..." + acc[0].slice(36, 41));
  }

  async function callMetaMask() {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum
        .request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x5" }], // chainId must be in hexadecimal numbers
        })
        .then(() => window.location.reload());
    }
  }

  return (
    <nav className="m-0 p-5 font-bold  flex flex-row justify-between ">
      <h1 className="text-3xl text-scb1 font-bold">🚀 10XBank</h1>
      <button
        onClick={() => callMetaMask()}
        className=" bg-scb1 hover:bg-scb2 text-white font-bold py-2 px-4 rounded"
      >
        {status}
      </button>
    </nav>
  );
}
