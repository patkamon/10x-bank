import { ethers } from 'ethers'
import { useEffect, useState } from 'react';
import Deposit from './Deposit';

import Acc from '../artifacts/contracts/Account.sol/Account.json'

export default function Account({accounts}) {

    const [option, setOption] = useState("")
    const [name, setName] = useState([])

  useEffect(()=>{
    const nl = []
    accounts.map(async ( element )=> {
      nl.push(getName(element))
    })
    Promise.all([...nl]).then((value)=>{
      console.log(value)
      setName(value)
    })

  },[accounts])
     

    async function getName(a){
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(a, Acc.abi, provider)
        try {
          return await contract.name()
        } catch (err) {
          console.log("Error: ", err)
        }
      }}

      async function getAllTokens(a){
        if (typeof window.ethereum !== 'undefined') {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const contract = new ethers.Contract(a, Acc.abi, provider)
          try {
            console.log(await contract.tokens(0))
          } catch (err) {
            console.log("Error: ", err)
          }
        }}



  return (
    


    <div className="account">
         {accounts.map((account,index)=>{
           const info = {name: name[index], address: account}
           getAllTokens(account)
          return (<div key={account}>
            <h3>account: {name[index]} {account}</h3>
            <div>
                <span onClick={()=>{setOption("deposit")}}> <Deposit info={info}  option={option} /></span>
                <span onClick={()=>{setOption("withdraw")}}> <Withdraw /></span>
                <span onClick={()=>{setOption("transfer")}}> <Transfer/></span>
            </div>
          </div>)
        })}
    </div>
  )

  function Withdraw(){
    return <div>withdraw
        {option === 'withdraw'? 

            <form>
                token:<input></input>   
                amount:<input></input>
            </form>
        : <></>
    }
    </div>
  }

  function Transfer(){
    return <div>transfer
        {option === 'transfer'? 
            <form>
                token:<input></input>
                to:<input></input>
                amount:<input></input>
            </form>
        : <></>
    }
    </div>
  }


}
