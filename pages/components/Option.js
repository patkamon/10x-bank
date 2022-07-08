import { ethers } from 'ethers'
import Bank from '../artifacts/contracts/Bank.sol/Bank.json'
import ERC20 from '../artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json'

export default function Option({info,option}) {


    const bankAddress = "0xa4673E70d351B6Ad072d7855e89CBB33400Ca541";
    const fau = "0xba62bcfcaafc6622853cca2be6ac7d845bc0f2dc";

    async function requestAccount() {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
    }


   

    return (  <div>
        <Deposit  />
        <Withdraw />
        <Transfer/>
        </div>

    )


function Deposit(){
    async function onDeposit(e){
        console.log(info)
        e.preventDefault()
        if (typeof window.ethereum !== 'undefined') {
          await requestAccount()
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner()

            let amount = ethers.utils.parseUnits(e.target[0].value, 18)

            const app = new ethers.Contract(fau, ERC20.abi, signer)
            const app2 =  await app.approve(info.address,  amount)
            // setTimeout(function () {
            const recieptApp = await app2.wait()
            const contract = new ethers.Contract(bankAddress, Bank.abi, signer)
            const transaction = contract.deposit(info.name, fau, amount)
            // },20000)
    
        }
      }

    return <div>
        {option === 'deposit'? 
            <form onSubmit={onDeposit}> 
                deposit
                amount:<input></input>
                <button>submit</button>
            </form>
        : <></>
    }
    </div>
}




function Withdraw(){

    async function onWithdraw(e){
        console.log(info)
        e.preventDefault()
        if (typeof window.ethereum !== 'undefined') {
          await requestAccount()
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner()

            let amount = ethers.utils.parseUnits(e.target[0].value, 18)
            const contract = new ethers.Contract(bankAddress, Bank.abi, signer)
            const transaction = contract.withdraw(info.name, fau, amount)

        }
      }



    return <div>
        {option === 'withdraw'? 
           
           <form onSubmit={onWithdraw}> 
                withdraw
                amount:<input></input>
                <button>submit</button>
            </form>
        : <></>
    }
    </div>
  }

  function Transfer(){
    return <div>
        {option === 'transfer'? 
            <form>
                transfer
                to:<input></input>
                amount:<input></input>
            </form>
        : <></>
    }
    </div>
  }



}