import { ethers, utils} from 'ethers'
import { useEffect, useState } from 'react';
import Deposit from './Deposit';

import Acc from '../artifacts/contracts/Account.sol/Account.json'
import ERC20 from '../artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json'

export default function Account({accounts}) {

    const [option, setOption] = useState("")
    const [name, setName] = useState([])
    const [balance, setBalance]= useState([])

  useEffect(()=>{
    const nl = []
    const bl = []
    accounts.map(async ( element )=> {
      nl.push(getName(element))
      bl.push(getBalance(element))
    })
    Promise.all([...nl]).then((value)=>{
      console.log(value)
      setName(value)
    })
    Promise.all([...bl]).then((value)=>{
      console.log(value)
      setBalance(value)
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

      async function getBalance(a){
        if (typeof window.ethereum !== 'undefined') {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const contract = new ethers.Contract("0xba62bcfcaafc6622853cca2be6ac7d845bc0f2dc", ERC20.abi, provider)
          try {
            let b = await contract.balanceOf(a)
            b = parseInt(b._hex,16)
            return parseFloat(b)/10**18
            // return await contract.balanceOf(a)
          } catch (err) {
            console.log("Error: ", err)
          }
        }}




  return (
    


    <div className="account">
         {accounts.map((account,index)=>{
           const info = {name: name[index], address: account}
           
          return (<div key={account}>
            <h3>account: {name[index]} </h3>
            <h4> address: {account}</h4>
            <h4> balance: {balance[index]} FAU</h4>


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
