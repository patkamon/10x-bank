import styles from '../styles/Home.module.css'
import Navbar from './components/Navbar'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react';

import Bank from './artifacts/contracts/Bank.sol/Bank.json'
import Account from './components/Account';

export default function Home() {

  const bankAddress = "0x3060B21CfAe6D0Cd8A52B7777D9a264d8196814e";
  const [accounts, setAccounts] = useState([])

  useEffect(() => {
    fetchAccount()
  },[])

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function fetchAccount(){
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(bankAddress, Bank.abi, provider)
      try {
        const signer = provider.getSigner()
        const data = await contract.getAllAccounts(signer.getAddress())
        console.log(data)
        setAccounts(data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }  
  }

  async function createAccount(e){
    e.preventDefault()
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner()
    
        const contract = new ethers.Contract(bankAddress, Bank.abi, signer)
        const transaction = contract.createAccount(e.target[0].value)

    }
  }


  return (
    <div className={styles.container}>
    
    <Navbar></Navbar>

    My Accounts:
      {/* <Account/>
      <CreateAccount/> */}

        <form onSubmit={createAccount}>
          <input></input>
          <button > create </button>
        </form>

       <Account accounts={accounts}/>

        

    </div>
  )


  // function 

}
