import { ethers } from 'ethers'
import Bank from '../artifacts/contracts/Bank.sol/Bank.json'
import ERC20 from '../artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json'

export default function Deposit({info,option}){

    const bankAddress = "0x3060B21CfAe6D0Cd8A52B7777D9a264d8196814e";

    async function requestAccount() {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
    }

    async function onDeposit(e){
        console.log(info)
        e.preventDefault()
        if (typeof window.ethereum !== 'undefined') {
          await requestAccount()
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner()

            let amount = ethers.utils.parseUnits(e.target[1].value, 18)

            const app = new ethers.Contract(e.target[0].value, ERC20.abi, signer)
            const app2 =  await app.approve(info.address,  amount)
            // setTimeout(function () {
            const recieptApp = await app2.wait()
            const contract = new ethers.Contract(bankAddress, Bank.abi, signer)
            const transaction = contract.deposit(info.name, e.target[0].value, amount)
            // },20000)
    
        }
      }



    return <div>deposit
        {option === 'deposit'? 

            <form onSubmit={onDeposit}>
                token:<input></input>   
                amount:<input></input>
                <button>submit</button>
            </form>
        : <></>
    }
    </div>
  }