import { useEffect, useState } from 'react';
import { ethers} from 'ethers'

import Acc from '../artifacts/contracts/Account.sol/Account.json'
import ERC20 from '../artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json'
import Option from './Option';

export default function Account({account}) { 

    const [option, setOption] = useState("")
    const [name, setName] = useState("")
    const [balance, setBalance] = useState()

    useEffect(()=>{
        getName(account)
        getBalance(account)
    
    },[name])


    async function getName(_addr){
        if (typeof window.ethereum !== 'undefined') {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const contract = new ethers.Contract(_addr, Acc.abi, provider)
          try {
            setName(await contract.name())
          } catch (err) {
            console.log("Error: ", err)
          }
        }}


        async function getBalance(_addr){
            if (typeof window.ethereum !== 'undefined') {
              const provider = new ethers.providers.Web3Provider(window.ethereum);
              const contract = new ethers.Contract("0xba62bcfcaafc6622853cca2be6ac7d845bc0f2dc", ERC20.abi, provider)
              try {
                let b = await contract.balanceOf(_addr)
                b = parseInt(b._hex,16)
                b = parseFloat(b)/10**18
                setBalance(b)
                // return await contract.balanceOf(a)
              } catch (err) {
                console.log("Error: ", err)
              }
            }}





    return(<div className='mt-3 mb-7 border-solid border-2 border-indigo-600 '>

      <div className='m-10 grid grid-cols-3'>

            <h2 className='font-semibold text-lg'>
              Account Name:  
            </h2>
            <h2 className='ml-10 font-medium text-lg'>
              {name}
            </h2>
            <div></div>


      
        <h2 className='font-semibold text-lg'>
       Balance: 
       </h2>
       <h2 className='ml-10 font-medium text-lg'>
       {balance} 
            </h2>
            <h2 className='ml-10 font-semibold text-lg'>FAU</h2>

      </div>
        

        <Option info={{name:name, address:account}}  option={option}/>



        
        <div className='bottom-0 w-full flex flex-row justify-around'>
        <button className=" font-semibold text-lg border-solid py-3 grow border-t-2 border-r-2 border-indigo-600" onClick={()=>{option === 'deposit' ? setOption() : setOption("deposit")}}>Deposit </button>
        <button className="font-semibold text-lg border-solid py-3 grow border-t-2 border-r-2 border-indigo-600"  onClick={()=>{option === 'withdraw' ? setOption() : setOption("withdraw")}}>Withdraw </button>
        <button  className="font-semibold text-lg border-solid py-3 grow border-t-2 border-indigo-600" onClick={()=>{option === 'transfer' ? setOption() : setOption("transfer")}}>Transfer </button>
        </div>
        </div>)




}