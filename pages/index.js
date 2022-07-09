import styles from '../styles/Home.module.css'
import Navbar from './components/Navbar'
import { ethers } from 'ethers'
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import Bank from './artifacts/contracts/Bank.sol/Bank.json'
import Account from './components/Account';
import { Context } from './lib/context';

export default function Home() {

  const {bankAddress} = useContext(Context)
  const [accounts, setAccounts] = useState([])
  const [isCreate, setCreate] = useState(false)
  const [option, setOption] = useState([])

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
        setAccounts(data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }  
  }

  async function createAccount(e){
    e.preventDefault()
    if (!(!/[^a-zA-Z0-9]/.test(e.target[0].value))){
        toast.error("Name can be only a-z A-Z 0-9")
    }
    else{
      if (typeof window.ethereum !== 'undefined') {
        await requestAccount()
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner()
      
          const contract = new ethers.Contract(bankAddress, Bank.abi, signer)

          const check  = await contract.getAccounts(e.target[0].value)
          if (check == "0x0000000000000000000000000000000000000000"){
          const transaction = await contract.createAccount(e.target[0].value)
          const wait = await transaction.wait()
          toast.success(`Created successfully`)
          fetchAccount()
          e.target[0].value = ""
          }else{
            toast.error(`Name already used!`)
          }
      }
    }
  }

  function changeOption(index, string){
    const arr = []
    for(let i = 0; i < index; i++){ 
      arr.push("")
    }
    arr.push(string)
    setOption(arr)
  }


  function findOption(index){
    try{
      return option[index]
    }
    catch{
      return ""
    }
  }


  return (
    <div className={styles.container}>
    
    <Navbar/>
      <div className="lg:mx-44  sm:mx-10 mt-5">
      <h1 className="pl-1 font-semibold text-lg">My Accounts:</h1>

       {accounts.map((account,index)=>{
         return ( <div className='mt-3 mb-7 border-solid border-2 border-indigo-600'  key={account}>
           <Account  account={account} option={findOption(index) }/>

           <div className='bottom-0 w-full flex flex-row justify-around'>
        <button className={`hover:bg-scb1 hover:text-white font-semibold text-lg border-solid py-3 grow border-r-2 border-indigo-600 ${findOption(index) === 'deposit'? "text-white bg-scb1" : "border-t-2 text-black bg-white"}`}  onClick={()=>{findOption(index) === 'deposit' ? changeOption(index,"") : changeOption(index,"deposit")}}>Deposit </button>
        <button className={`hover:bg-scb1 hover:text-white font-semibold text-lg border-solid py-3 grow border-r-2 border-indigo-600 ${findOption(index) === 'withdraw'? "text-white bg-scb1" : "border-t-2 text-black bg-white"}`}  onClick={()=>{findOption(index) === 'withdraw' ? changeOption(index,"") : changeOption(index,"withdraw")}}>Withdraw </button>
        <button  className={`hover:bg-scb1 hover:text-white font-semibold text-lg border-solid py-3 grow border-indigo-600 ${findOption(index) === 'transfer'? "text-white bg-scb1" : "border-t-2 text-black bg-white"}`}  onClick={()=>{findOption(index) === 'transfer' ? changeOption(index,"") : changeOption(index,"transfer")}}>Transfer </button>
        </div>
         </div>
         )
       
       })}

        <div className="items-center h-44 border-dashed border-2 border-indigo-600 ">


        {isCreate ?

        <form className='flex flex-col justify-center my-10 mx-5 ' onSubmit={createAccount}>
        <div className='flex flex-row'>
        <label htmlFor='account-name' className='text-lg  font-normal'>Account name:</label>
     
          <input id='account-name'  className=" pl-2 mx-3 grow border-solid border-2 border-indigo-300"></input>
          </div>

          <div className='flex flex-row '>
            <div className='grow'></div>
          <button className='m-2  bg-scb1 hover:bg-scb2 order-last py-2 px-4 rounded text-white'> create </button>
          </div>
        </form>
        :
        <span className='h-full  flex justify-around items-center' onClick={()=>setCreate(!isCreate)}>
          <h2 className='font-semibold text-lg'>+ Create Bank Account</h2>
          </span>
        }
        </div>
        
        </div>
    </div>
  )


  // function 

}
