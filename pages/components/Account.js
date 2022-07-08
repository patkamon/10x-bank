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





    return(<div>
       Name: {name} 
       Address: {account}
       Balance: {balance} FAU
        

        <Option info={{name:name, address:account}}  option={option}/>
        <span onClick={()=>{option === 'deposit' ? setOption() : setOption("deposit")}}>deposit </span>
        <span onClick={()=>{option === 'withdraw' ? setOption() : setOption("withdraw")}}>withdraw </span>
        <span onClick={()=>{option === 'transfer' ? setOption() : setOption("transfer")}}>transfer </span>
        </div>)




}