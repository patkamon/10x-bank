import { ethers } from "ethers";
import Account from "../abis/Account.json";
import Bank from "../abis/Bank.json";
import ERC20 from "../abis/ERC20.json";
import { useState, useContext } from "react";
import { toast } from "react-hot-toast";
import { Context } from "../lib/context";

export default function Option({ info, option, func }) {
  const { bankAddress, fau } = useContext(Context);

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  return (
    <div className="m-0 p-0">
      <Deposit />
      <Withdraw />
      <Transfer />
    </div>
  );

  function Deposit() {
    async function onDeposit(e) {
      e.preventDefault();
      if (typeof window.ethereum !== "undefined") {
        await requestAccount();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        let amount = ethers.utils.parseUnits(e.target[0].value, 18);

        const app = new ethers.Contract(fau, ERC20.abi, signer);
        const app2 = await app.approve(info.address, amount);
        const recieptApp = await app2.wait();
        const contract = new ethers.Contract(bankAddress, Bank.abi, signer);
        const transaction = await contract.deposit(info.name, fau, amount);
        const wait = transaction.wait();
        toast.success("Deposit successfully");
        setTimeout(() => {
          func(info.address);
          e.target[0].value = "";
        }, 10000);
      }
    }

    return (
      <div>
        {option === "deposit" ? (
          <div className="mx-10 my-5">
            <h2 className="font-semibold text-lg text-scb2">Deposit</h2>
            <form onSubmit={onDeposit}>
              <div className="flex flex-row justify-center">
                <label
                  htmlFor="amount"
                  className="pr-0 pl-10 sm:pr-10 font-semibold text-lg"
                >
                  Amount:
                </label>
                <input
                  type="number"
                  min="0"
                  step=".0001"
                  id="amount"
                  className="pl-2 grow border-solid border-2 border-indigo-300"
                ></input>
                <label
                  htmlFor="amount"
                  className="pl-0 pr-10 sm:pl-10  font-semibold text-lg"
                >
                  FAU
                </label>
              </div>
              <div className="flex flex-row justify-end">
                <button className="mt-5 mb-0 bg-scb1 hover:bg-scb2 order-last py-2 px-4 rounded text-white">
                  Submit
                </button>
              </div>
            </form>
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  }

  function Withdraw() {
    async function onWithdraw(e) {
      e.preventDefault();
      if (typeof window.ethereum !== "undefined") {
        await requestAccount();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        let check = new ethers.Contract(info.address, Account.abi, signer);
        let amount = ethers.utils.parseUnits(e.target[0].value, 18);
        check = await check.getTokenAmount(fau);
        if (check >= amount) {
          const contract = new ethers.Contract(bankAddress, Bank.abi, signer);
          const transaction = await contract.withdraw(info.name, fau, amount);
          const wait = transaction.wait();
          toast.success("Withdraw successfully");
          setTimeout(() => {
            func(info.address);
            e.target[0].value = "";
          }, 10000);
        } else {
          toast.error("Exceed your balance!");
        }
      }
    }

    return (
      <div>
        {option === "withdraw" ? (
          <div className="mx-10 my-5">
            <h2 className="font-semibold text-lg text-scb2">Withdraw</h2>
            <form onSubmit={onWithdraw}>
              <div className="flex flex-row justify-center">
                <label
                  htmlFor="amount"
                  className="pr-0 pl-10 sm:pr-10 font-semibold text-lg"
                >
                  Amount:
                </label>
                <input
                  id="amount"
                  type="number"
                  min="0"
                  step=".0001"
                  className="pl-2 grow border-solid border-2 border-indigo-300"
                ></input>
                <label
                  htmlFor="amount"
                  className="pl-0 pr-10 sm:pl-10 font-semibold text-lg"
                >
                  FAU
                </label>
              </div>
              <div className="flex flex-row justify-end">
                <button className="mt-5 mb-0 bg-scb1 hover:bg-scb2 order-last py-2 px-4 rounded text-white">
                  Submit
                </button>
              </div>
            </form>
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  }

  function Transfer() {
    const [isMulti, setMulti] = useState(false);

    const CSVToArray = (data, delimiter = ",") =>
      data
        .slice(0)
        .split("\n")
        .map((v) => v.split(delimiter));

    async function onMultiTransfer(e) {
      e.preventDefault();
      const bigArray = CSVToArray(e.target[0].value);
      const to = bigArray.map((a) => a[0]);
      const amount = bigArray.map((a) => a[1]);
      const token = amount.map((a) => fau);
      if (typeof window.ethereum !== "undefined") {
        await requestAccount();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        let amountParse = await amount.map((a) => ethers.utils.parseEther(a));
        const contract = new ethers.Contract(bankAddress, Bank.abi, signer);
        const transaction = await contract.multipleTransfer(
          info.name,
          token,
          to,
          amountParse
        );
        const wait = await transaction.wait();
        toast.success("Transfer successfully");
      }
    }
    async function onTransfer(e) {
      e.preventDefault();
      if (typeof window.ethereum !== "undefined") {
        await requestAccount();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        let amount = ethers.utils.parseUnits(e.target[1].value, 18);
        const contract = new ethers.Contract(bankAddress, Bank.abi, signer);
        const check = await contract.getAccounts(e.target[0].value);
        if (check != "0x0000000000000000000000000000000000000000") {
          const transaction = await contract.transfer(
            info.name,
            fau,
            e.target[0].value,
            amount
          );
          const wait = await transaction.wait();
          toast.success("Transfer successfully");
          setTimeout(() => {
            func(info.address);
            e.target[0].value = "";
            e.target[1].value = "";
          }, 10000);
        } else {
          toast.error(`Not Found Account`);
        }
      }
    }

    return (
      <div>
        {option === "transfer" ? (
          !isMulti ? (
            <div className="mx-1 sm:mx-10 my-5">
              <h2 className="font-semibold text-lg text-scb2">Transfer</h2>
              <div className="my-2">
                <label
                  htmlFor="yellow-toggle"
                  className="inline-flex relative items-center mr-5 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value=""
                    onChange={() => {
                      setMulti(!isMulti);
                    }}
                    id="yellow-toggle"
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 dark:peer-focus:ring-yellow-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-scb3"></div>
                  <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Multiple
                  </span>
                </label>
              </div>

              <form
                onSubmit={onTransfer}
                className="grid gap-y-1 grid-cols-transfer"
              >
                <label
                  htmlFor="name"
                  className="pr-10 pl-2 sm:pl-10 font-semibold text-lg"
                >
                  Account Name:
                </label>
                <input
                  id="name"
                  className="pl-2 grow border-solid border-2 border-indigo-300"
                ></input>
                <div></div>
                <label
                  htmlFor="amount"
                  className="pr-10 pl-10 font-semibold text-lg"
                >
                  Amount:
                </label>
                <input
                  id="amount"
                  type="number"
                  min="0"
                  step=".0001"
                  className="pl-2 grow border-solid border-2 border-indigo-300"
                ></input>
                <label
                  htmlFor="amount"
                  className="pl-10 pr-10 font-semibold text-lg"
                >
                  FAU
                </label>

                <div></div>
                <div></div>
                <div className="flex flex-row justify-end">
                  <button className="mt-5 mb-0 bg-scb1 hover:bg-scb2 order-last py-2 px-4 rounded text-white">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="mx-10 my-5">
              <h2 className="font-semibold text-lg text-scb2">Transfer</h2>
              <div className="my-2">
                <label
                  htmlFor="yellow-toggle"
                  className="inline-flex relative items-center mr-5 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value=""
                    onChange={() => {
                      setMulti(!isMulti);
                    }}
                    id="yellow-toggle"
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 dark:peer-focus:ring-yellow-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-scb3"></div>
                  <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Multiple
                  </span>
                </label>
              </div>

              <form onSubmit={onMultiTransfer}>
                <label
                  htmlFor="csv"
                  className="block mb-2pl-10 pr-10 font-semibold text-lg"
                >
                  CSV:{" "}
                </label>
                <textarea
                  id="csv"
                  rows="3"
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Account Name, amount"
                ></textarea>

                <div className="flex flex-row justify-between">
                  <button
                    type="button"
                    onClick={() => toast("Patlom,1.2\nBounk,0.2\nJohnDoe,4")}
                    className="mt-5 mr-3 mb-0 bg-scb1 hover:bg-scb2 order-last py-2 px-4 rounded text-white"
                  >
                    Example
                  </button>
                  <input
                    type="submit"
                    className="mt-5 t-5 mb-0 bg-scb1 hover:bg-scb2 order-last py-2 px-4 rounded text-white"
                    value="Submit"
                  />
                </div>
              </form>
            </div>
          )
        ) : (
          <></>
        )}
      </div>
    );
  }
}
